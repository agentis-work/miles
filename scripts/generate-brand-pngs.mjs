import { existsSync } from 'node:fs';
import { copyFile, mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const sourceDir = path.join(root, 'assets', 'brand', 'source');
const outputDir = path.join(root, 'assets', 'brand', 'png');
const sourceLogo = path.join(sourceDir, 'miles-logo.png');
const sourceMark = path.join(sourceDir, 'miles-mark.png');
const sourceLogoDark = path.join(sourceDir, 'miles-logo-dark.png');
const sourceMarkDark = path.join(sourceDir, 'miles-mark-dark.png');
const notesPath = path.join(root, 'assets', 'brand', 'PNG_NOTES.md');

const FULL_WIDTHS = [360, 720, 1080];
const MARK_WIDTHS = [96, 192, 288];
const FULL_TARGET_ASPECT = 3.8;
const MARK_TARGET_ASPECT = 1;
const LIGHT_NEUTRAL = { r: 245, g: 247, b: 250 };

const ensureSourceLogo = () => {
  if (!existsSync(sourceLogo)) {
    throw new Error(`Missing required source logo: ${sourceLogo}\nAdd assets/brand/source/miles-logo.png.`);
  }
};

const dist = (r1, g1, b1, r2, g2, b2) => {
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  return Math.sqrt(dr * dr + dg * dg + db * db);
};

const cropToAspect = async (inputBuffer, targetAspect) => {
  const meta = await sharp(inputBuffer).metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;
  if (!width || !height) {
    throw new Error('Cannot crop image with invalid metadata');
  }

  const currentAspect = width / height;
  if (Math.abs(currentAspect - targetAspect) < 0.02) {
    return inputBuffer;
  }

  if (currentAspect < targetAspect) {
    const cropHeight = Math.max(1, Math.round(width / targetAspect));
    const top = Math.max(0, Math.round((height - cropHeight) / 2));
    return sharp(inputBuffer).extract({ left: 0, top, width, height: cropHeight }).png().toBuffer();
  }

  const cropWidth = Math.max(1, Math.round(height * targetAspect));
  const left = Math.max(0, Math.round((width - cropWidth) / 2));
  return sharp(inputBuffer).extract({ left, top: 0, width: cropWidth, height }).png().toBuffer();
};

const normalizeTransparent = async (inputPath) => {
  const { data, info } = await sharp(inputPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.from(data);

  const sample = (x, y) => {
    const i = (y * info.width + x) * 4;
    return { r: out[i], g: out[i + 1], b: out[i + 2] };
  };

  const c1 = sample(0, 0);
  const c2 = sample(info.width - 1, 0);
  const c3 = sample(0, info.height - 1);
  const c4 = sample(info.width - 1, info.height - 1);
  const bg = {
    r: Math.round((c1.r + c2.r + c3.r + c4.r) / 4),
    g: Math.round((c1.g + c2.g + c3.g + c4.g) / 4),
    b: Math.round((c1.b + c2.b + c3.b + c4.b) / 4),
  };

  for (let i = 0; i < out.length; i += 4) {
    const r = out[i];
    const g = out[i + 1];
    const b = out[i + 2];
    const a = out[i + 3];
    if (a === 0) continue;

    const nearCornerBg = dist(r, g, b, bg.r, bg.g, bg.b) < 26;
    const nearWhite = r > 244 && g > 244 && b > 244;
    if (nearCornerBg || nearWhite) {
      out[i + 3] = 0;
    }
  }

  return sharp(out, { raw: info }).trim({ threshold: 8 }).png().toBuffer();
};

const buildMarkFromLogo = async () => {
  const metadata = await sharp(sourceLogo).metadata();
  const width = metadata.width ?? 0;
  const height = metadata.height ?? 0;
  if (!width || !height) {
    throw new Error(`Unable to read dimensions from ${sourceLogo}`);
  }

  const cropSize = Math.min(height, width);
  const logoLeftSquare = await sharp(sourceLogo)
    .extract({ left: 0, top: 0, width: cropSize, height: cropSize })
    .trim()
    .png()
    .toBuffer();

  await sharp(logoLeftSquare)
    .resize(cropSize, cropSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(sourceMark);
};

const variantName = (baseName, scale) => (scale === 1 ? `${baseName}.png` : `${baseName}@${scale}x.png`);

const renderVariants = async ({ sourcePath, baseName, widths }) => {
  const metadata = await sharp(sourcePath).metadata();
  const aspectRatio = (metadata.width ?? 1) / (metadata.height ?? 1);

  for (let i = 0; i < widths.length; i += 1) {
    const scale = i + 1;
    const targetWidth = widths[i];
    const targetPath = path.join(outputDir, variantName(baseName, scale));
    await sharp(sourcePath).ensureAlpha().resize({ width: targetWidth, fit: 'inside' }).png().toFile(targetPath);
  }

  return { aspectRatio, width: metadata.width ?? 0, height: metadata.height ?? 0 };
};

const isSingleColor = async (sourcePath) => {
  const { data } = await sharp(sourcePath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const colors = new Set();
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a < 5) continue;
    const r = Math.round(data[i] / 8) * 8;
    const g = Math.round(data[i + 1] / 8) * 8;
    const b = Math.round(data[i + 2] / 8) * 8;
    colors.add(`${r},${g},${b}`);
    if (colors.size > 1) return false;
  }
  return colors.size === 1;
};

const recolorToLightNeutral = async (sourcePath, outputPath) => {
  const { data, info } = await sharp(sourcePath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.from(data);
  for (let i = 0; i < out.length; i += 4) {
    const a = out[i + 3];
    if (a < 1) continue;
    out[i] = LIGHT_NEUTRAL.r;
    out[i + 1] = LIGHT_NEUTRAL.g;
    out[i + 2] = LIGHT_NEUTRAL.b;
  }
  await sharp(out, { raw: info }).png().toFile(outputPath);
};

const maybeGenerateDarkSet = async ({ sourcePath, darkSourcePath, baseName, widths }) => {
  if (existsSync(darkSourcePath)) {
    return renderVariants({ sourcePath: darkSourcePath, baseName: `${baseName}-dark`, widths }).then(() => 'used-source');
  }

  const mono = await isSingleColor(sourcePath);
  if (!mono) {
    for (let i = 0; i < widths.length; i += 1) {
      const scale = i + 1;
      const lightName = variantName(baseName, scale);
      const darkName = variantName(`${baseName}-dark`, scale);
      await copyFile(path.join(outputDir, lightName), path.join(outputDir, darkName));
    }
    return 'manual-required (fallback copied from light)';
  }

  const tempPath = path.join(outputDir, `_${baseName}-dark-temp.png`);
  await recolorToLightNeutral(sourcePath, tempPath);
  await renderVariants({ sourcePath: tempPath, baseName: `${baseName}-dark`, widths });
  await rm(tempPath, { force: true });
  return 'generated';
};

const writeNotes = async ({ fullDarkStatus, markDarkStatus, fullAspect, markAspect }) => {
  const note = `# Brand PNG Notes

- Full logo source: \`assets/brand/source/miles-logo.png\`
- Mark source: \`assets/brand/source/miles-mark.png\`
- Full logo aspect ratio: \`${fullAspect.toFixed(6)}\`
- Mark aspect ratio: \`${markAspect.toFixed(6)}\`

## Dark Assets

- Full logo dark: \`${fullDarkStatus}\`
- Mark dark: \`${markDarkStatus}\`

If a status is \`manual-required\`, provide manual dark PNGs at:
- \`assets/brand/source/miles-logo-dark.png\`
- \`assets/brand/source/miles-mark-dark.png\`
`;
  await writeFile(notesPath, note, 'utf8');
};

const main = async () => {
  ensureSourceLogo();
  await mkdir(outputDir, { recursive: true });

  if (!existsSync(sourceMark)) {
    await buildMarkFromLogo();
  }

  const logoPrepared = await normalizeTransparent(sourceLogo);
  const logoCropped = await cropToAspect(logoPrepared, FULL_TARGET_ASPECT);
  await writeFile(sourceLogo, logoCropped);

  const markPrepared = await normalizeTransparent(sourceMark);
  const markCropped = await cropToAspect(markPrepared, MARK_TARGET_ASPECT);
  await writeFile(sourceMark, markCropped);

  const fullMeta = await renderVariants({ sourcePath: sourceLogo, baseName: 'miles-logo', widths: FULL_WIDTHS });
  const markMeta = await renderVariants({ sourcePath: sourceMark, baseName: 'miles-mark', widths: MARK_WIDTHS });

  const fullDarkStatus = await maybeGenerateDarkSet({
    sourcePath: sourceLogo,
    darkSourcePath: sourceLogoDark,
    baseName: 'miles-logo',
    widths: FULL_WIDTHS,
  });
  const markDarkStatus = await maybeGenerateDarkSet({
    sourcePath: sourceMark,
    darkSourcePath: sourceMarkDark,
    baseName: 'miles-mark',
    widths: MARK_WIDTHS,
  });

  await writeNotes({
    fullDarkStatus,
    markDarkStatus,
    fullAspect: fullMeta.aspectRatio,
    markAspect: markMeta.aspectRatio,
  });

  console.log(`Full logo aspect ratio: ${fullMeta.aspectRatio}`);
  console.log(`Mark aspect ratio: ${markMeta.aspectRatio}`);
  console.log(`Dark full status: ${fullDarkStatus}`);
  console.log(`Dark mark status: ${markDarkStatus}`);
};

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
