const fs = require('fs');
const path = require('path');

const visualsPath = path.resolve('src/movieVisuals.js');
const publicRoot = path.resolve('public/movie-images');

const readExportedArray = (source, exportName) => {
  const match = source.match(new RegExp(`export const ${exportName} = (\\[[\\s\\S]*\\]);?\\s*$`));
  if (!match) throw new Error(`Cannot parse ${exportName}`);
  return Function(`"use strict"; return (${match[1]});`)();
};

const getExtension = (url, contentType) => {
  const pathname = new URL(url).pathname.toLowerCase();
  const ext = path.extname(pathname).replace('.', '');
  if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) return ext === 'jpeg' ? 'jpg' : ext;
  if (contentType.includes('png')) return 'png';
  if (contentType.includes('webp')) return 'webp';
  return 'jpg';
};

const ensureDir = (dir) => fs.mkdirSync(dir, { recursive: true });

const download = async (url, targetBase) => {
  const response = await fetch(url, {
    redirect: 'follow',
    signal: AbortSignal.timeout(30000),
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126 Safari/537.36',
      Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    },
  });

  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.startsWith('image/')) {
    throw new Error(`Unexpected content type ${contentType || 'unknown'}`);
  }

  const ext = getExtension(url, contentType);
  const filePath = `${targetBase}.${ext}`;
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 512) throw new Error('Image response too small');
  fs.writeFileSync(filePath, bytes);
  return path.relative(path.resolve('public'), filePath).replace(/\\/g, '/');
};

async function runPool(items, worker, concurrency) {
  let index = 0;
  async function runWorker() {
    while (index < items.length) {
      const current = index;
      index += 1;
      await worker(items[current], current);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, runWorker));
}

(async () => {
  ensureDir(path.join(publicRoot, 'posters'));
  ensureDir(path.join(publicRoot, 'scenes'));

  const visuals = readExportedArray(fs.readFileSync(visualsPath, 'utf8'), 'movieVisuals');
  const failures = [];

  await runPool(
    visuals,
    async (movie, index) => {
      try {
        if (/^https?:\/\//.test(movie.posterUrl || '')) {
          movie.posterUrl = await download(
            movie.posterUrl,
            path.join(publicRoot, 'posters', `${movie.id}-poster`),
          );
        }

        const sceneImages = [];
        for (let sceneIndex = 0; sceneIndex < (movie.sceneImages || []).length; sceneIndex += 1) {
          const sceneUrl = movie.sceneImages[sceneIndex];
          if (!/^https?:\/\//.test(sceneUrl || '')) {
            sceneImages.push(sceneUrl);
            continue;
          }

          try {
            sceneImages.push(
              await download(
                sceneUrl,
                path.join(publicRoot, 'scenes', `${movie.id}-scene-${sceneIndex + 1}`),
              ),
            );
          } catch (error) {
            failures.push(`${movie.id} scene ${sceneIndex + 1}: ${error.message}`);
          }
        }
        movie.sceneImages = sceneImages;
        console.log(
          `${index + 1}/${visuals.length} ok ${movie.id} poster ${movie.posterUrl ? 'yes' : 'no'} scenes ${movie.sceneImages.length}`,
        );
      } catch (error) {
        failures.push(`${movie.id} poster: ${error.message}`);
        console.log(`${index + 1}/${visuals.length} error ${movie.id}: ${error.message}`);
      }
    },
    Number(process.env.CONCURRENCY || 8),
  );

  fs.writeFileSync(
    visualsPath,
    `export const movieVisuals = ${JSON.stringify(visuals, null, 2)};\n`,
  );

  const posters = visuals.filter((movie) => movie.posterUrl && !movie.posterUrl.startsWith('http')).length;
  const scenes = visuals.reduce(
    (count, movie) => count + (movie.sceneImages || []).filter((url) => !url.startsWith('http')).length,
    0,
  );
  console.log(`localized ${posters} posters and ${scenes} scene images`);
  if (failures.length) {
    console.log(`failures: ${failures.length}`);
    failures.slice(0, 30).forEach((failure) => console.log(failure));
  }
})();
