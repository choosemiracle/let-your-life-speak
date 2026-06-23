const fs = require('fs');
const path = require('path');

const catalogPath = path.resolve('src/movieCatalog.js');
const cachePath = path.resolve('src/doubanMovieInfo.js');
const source = fs.readFileSync(catalogPath, 'utf8');
const movieCatalog = JSON.parse(
  source.match(/export const movieCatalog = (\[[\s\S]*\]);?\s*$/)[1],
);

const existingSource = fs.existsSync(cachePath)
  ? fs.readFileSync(cachePath, 'utf8')
  : 'export const doubanMovieInfo = [];';
const existing = JSON.parse(
  existingSource.match(/export const doubanMovieInfo = (\[[\s\S]*\]);?\s*$/)[1],
);
const cache = new Map(existing.map((movie) => [movie.id, movie]));

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const normalize = (text) =>
  String(text || '')
    .toLowerCase()
    .replace(/^(the|a|an)\s+/, '')
    .replace(/,\s*(the|a|an)$/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const normalizeCatalogTitle = (title) =>
  title
    .replace(/^(.+),\s*(The|A|An)$/i, '$2 $1')
    .replace(/\s*\([^)]*\)\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const scoreItem = (item, movieTitle) => {
  const expected = normalize(normalizeCatalogTitle(movieTitle));
  const candidate = normalize(`${item.sub_title || ''} ${item.title || ''}`);
  let score = 0;
  if (item.type === 'movie') score += 10;
  if (candidate.includes(expected)) score += 25;
  if (item.sub_title && normalize(item.sub_title) === expected) score += 20;
  if (item.year) score += 2;
  return score;
};

async function fetchSuggestion(movie) {
  const query = normalizeCatalogTitle(movie.title);
  const url = `https://movie.douban.com/j/subject_suggest?q=${encodeURIComponent(query)}`;
  const response = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126 Safari/537.36',
      Referer: 'https://movie.douban.com/',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const items = await response.json();
  const best = items
    .map((item) => ({ item, score: scoreItem(item, movie.title) }))
    .sort((a, b) => b.score - a.score)[0];

  if (!best || best.score < 18) {
    return null;
  }

  return {
    id: movie.id,
    titleCn: best.item.title,
    doubanTitle: best.item.sub_title
      ? `${best.item.title} ${best.item.sub_title} (${best.item.year || ''})`.trim()
      : `${best.item.title} (${best.item.year || ''})`.trim(),
    doubanUrl: String(best.item.url || '').replace(/\?suggest=.*$/, '/'),
    doubanYear: best.item.year || '',
    doubanCover: best.item.img || '',
  };
}

(async () => {
  const startIndex = Number(process.env.START || 0);
  const limit = Number(process.env.LIMIT || movieCatalog.length);
  const delay = Number(process.env.DELAY_MS || 900);
  const slice = movieCatalog.slice(startIndex, startIndex + limit);

  for (let index = 0; index < slice.length; index += 1) {
    const movie = slice[index];
    const label = `${startIndex + index + 1}/${movieCatalog.length}`;
    if (cache.has(movie.id)) {
      console.log(`${label} cached ${movie.title}`);
      continue;
    }

    try {
      const info = await fetchSuggestion(movie);
      if (info) {
        cache.set(movie.id, info);
        console.log(`${label} ok ${movie.title} -> ${info.titleCn}`);
      } else {
        console.log(`${label} miss ${movie.title}`);
      }
    } catch (error) {
      console.log(`${label} error ${movie.title}: ${error.message}`);
      if (/HTTP 403|HTTP 429/.test(error.message)) {
        break;
      }
    }

    await sleep(delay);
  }

  const records = [...cache.values()].sort((a, b) => Number(a.id) - Number(b.id));
  fs.writeFileSync(
    cachePath,
    `export const doubanMovieInfo = ${JSON.stringify(records, null, 2)};\n`,
  );
  console.log(`wrote ${records.length} cached records`);
})();
