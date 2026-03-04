import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const svgDir = path.join(root, 'assets', 'brand', 'svg');
const pngDir = path.join(root, 'assets', 'brand', 'png');
const faviconDir = path.join(root, 'assets', 'brand', 'favicon');

const colors = {
  bgDark: '#0B1220',
  bgLight: '#F4F6FA',
  markDark: '#0E172A',
  markLight: '#F8FAFF',
};

const files = {
  full: path.join(svgDir, 'miles-full.svg'),
  mark: path.join(svgDir, 'miles-mark.svg'),
  favicon: path.join(svgDir, 'miles-favicon.svg'),
};

const readSvgWithColor = async (filePath, color) => {
  const raw = await readFile(filePath, 'utf8');
  return Buffer.from(raw.replace(/currentColor/g, color), 'utf8');
};

const renderCenteredPng = async ({
  svgInput,
  outputPath,
  width,
  height,
  paddingRatio,
  background,
}) => {
  const innerWidth = Math.max(1, Math.round(width * (1 - paddingRatio * 2)));
  const innerHeight = Math.max(1, Math.round(height * (1 - paddingRatio * 2)));

  const logo = await sharp(svgInput)
    .resize(innerWidth, innerHeight, { fit: 'contain' })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: background ?? { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      {
        input: logo,
        left: Math.round((width - innerWidth) / 2),
        top: Math.round((height - innerHeight) / 2),
      },
    ])
    .png()
    .toFile(outputPath);
};

const writeManifest = async () => {
  const manifest = {
    name: 'Miles',
    short_name: 'Miles',
    start_url: '/',
    display: 'standalone',
    background_color: colors.bgDark,
    theme_color: colors.bgDark,
    icons: [
      { src: '/assets/brand/favicon/android-chrome-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/assets/brand/favicon/android-chrome-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/assets/brand/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };

  await writeFile(path.join(faviconDir, 'site.webmanifest'), JSON.stringify(manifest, null, 2));
};

const generate = async () => {
  await mkdir(pngDir, { recursive: true });
  await mkdir(faviconDir, { recursive: true });

  const fullDark = await readSvgWithColor(files.full, colors.markDark);
  const fullLight = await readSvgWithColor(files.full, colors.markLight);
  const markDark = await readSvgWithColor(files.mark, colors.markDark);
  const markLight = await readSvgWithColor(files.mark, colors.markLight);
  const faviconDark = await readSvgWithColor(files.favicon, colors.markDark);
  const faviconLight = await readSvgWithColor(files.favicon, colors.markLight);

  await renderCenteredPng({
    svgInput: markLight,
    outputPath: path.join(pngDir, 'app-icon-1024.png'),
    width: 1024,
    height: 1024,
    paddingRatio: 0.24,
    background: colors.bgDark,
  });

  await renderCenteredPng({
    svgInput: markLight,
    outputPath: path.join(pngDir, 'adaptive-foreground-432.png'),
    width: 432,
    height: 432,
    paddingRatio: 0.18,
    background: null,
  });

  await renderCenteredPng({
    svgInput: fullLight,
    outputPath: path.join(pngDir, 'splash-2732.png'),
    width: 2732,
    height: 2732,
    paddingRatio: 0.3,
    background: null,
  });

  await renderCenteredPng({
    svgInput: faviconLight,
    outputPath: path.join(faviconDir, 'android-chrome-512.png'),
    width: 512,
    height: 512,
    paddingRatio: 0.24,
    background: colors.bgDark,
  });

  await renderCenteredPng({
    svgInput: faviconLight,
    outputPath: path.join(faviconDir, 'android-chrome-192.png'),
    width: 192,
    height: 192,
    paddingRatio: 0.24,
    background: colors.bgDark,
  });

  await renderCenteredPng({
    svgInput: faviconDark,
    outputPath: path.join(faviconDir, 'apple-touch-icon.png'),
    width: 180,
    height: 180,
    paddingRatio: 0.24,
    background: colors.bgLight,
  });

  await renderCenteredPng({
    svgInput: faviconDark,
    outputPath: path.join(faviconDir, 'favicon-32.png'),
    width: 32,
    height: 32,
    paddingRatio: 0.28,
    background: colors.bgLight,
  });

  await renderCenteredPng({
    svgInput: faviconDark,
    outputPath: path.join(faviconDir, 'favicon-16.png'),
    width: 16,
    height: 16,
    paddingRatio: 0.28,
    background: colors.bgLight,
  });

  await writeManifest();
};

generate().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
