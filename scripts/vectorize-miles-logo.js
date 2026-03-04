/**
 * scripts/vectorize-miles-logo.js
 *
 * Deterministic Miles logo vectorization pipeline:
 * 1) Preprocess PNG with sharp (background masking, sharpen, contrast, quantize)
 * 2) Trace with imagetracerjs (color + mono fallback)
 * 3) Export:
 *    - assets/brand/miles-logo.svg
 *    - assets/brand/miles-mark.svg (best-effort crop/simplify)
 *    - assets/brand/miles-logo-mono.svg (clean mono fallback)
 *
 * Tuning notes:
 * - Transparency mask: `BG_THRESHOLD` controls how aggressively near-bg pixels become transparent.
 * - Tracing noise/shape quality:
 *   - `pathomit`: higher removes tiny junk paths.
 *   - `ltres` / `qtres`: higher = smoother curves, less detail.
 *   - `numberofcolors`: fewer colors reduces noisy micro paths.
 */

const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const ImageTracer = require('imagetracerjs');

const ROOT = process.cwd();
const BRAND_DIR = path.join(ROOT, 'assets', 'brand');
const INPUT_PNG = path.join(BRAND_DIR, 'miles-logo.png');

const PREP_FULL_PNG = path.join(BRAND_DIR, '_miles-logo-prep.png');
const PREP_MARK_PNG = path.join(BRAND_DIR, '_miles-mark-prep.png');
const PREP_MONO_PNG = path.join(BRAND_DIR, '_miles-logo-mono-prep.png');

const OUT_FULL_SVG = path.join(BRAND_DIR, 'miles-logo.svg');
const OUT_MARK_SVG = path.join(BRAND_DIR, 'miles-mark.svg');
const OUT_MONO_SVG = path.join(BRAND_DIR, 'miles-logo-mono.svg');
const PREVIEW_HTML = path.join(BRAND_DIR, '_preview.html');

// Approximate light background from source artwork.
const BG = { r: 248, g: 244, b: 245 };
const BG_THRESHOLD = 28; // Raise to remove more background; lower to preserve light details.

const COLOR_TRACE_OPTIONS = {
  ltres: 2.2,
  qtres: 2.2,
  pathomit: 55,
  rightangleenhance: false,
  colorsampling: 2,
  numberofcolors: 8,
  mincolorratio: 0.035,
  colorquantcycles: 3,
  scale: 1,
  linefilter: true,
};

const MARK_TRACE_OPTIONS = {
  ...COLOR_TRACE_OPTIONS,
  numberofcolors: 4,
  pathomit: 75,
  ltres: 2.8,
  qtres: 2.8,
};

const MONO_TRACE_OPTIONS = {
  ltres: 2,
  qtres: 2,
  pathomit: 40,
  rightangleenhance: true,
  colorsampling: 0,
  numberofcolors: 2,
  mincolorratio: 0.04,
  colorquantcycles: 1,
  scale: 1,
  linefilter: true,
};

const ensureInput = () => {
  if (!fs.existsSync(INPUT_PNG)) {
    throw new Error(`Missing input PNG: ${INPUT_PNG}`);
  }
};

const removeNearBackground = async (inputPath) => {
  const { data, info } = await sharp(inputPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(data.length);

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    const dr = r - BG.r;
    const dg = g - BG.g;
    const db = b - BG.b;
    const dist = Math.sqrt(dr * dr + dg * dg + db * db);
    const alpha = dist < BG_THRESHOLD ? 0 : a;

    out[i] = r;
    out[i + 1] = g;
    out[i + 2] = b;
    out[i + 3] = alpha;
  }

  return { data: out, info };
};

const preprocessFull = async () => {
  const { data, info } = await removeNearBackground(INPUT_PNG);

  await sharp(data, { raw: info })
    .sharpen(1.1)
    .linear(1.05, -3)
    .png({ palette: true, colors: 16, quality: 100 })
    .toFile(PREP_FULL_PNG);
};

const preprocessMark = async () => {
  const base = sharp(INPUT_PNG);
  const metadata = await base.metadata();
  const width = metadata.width ?? 0;
  const height = metadata.height ?? 0;
  if (!width || !height) {
    throw new Error('Unable to read PNG dimensions for mark crop');
  }

  // Best-effort: left-side crop where stylized "M" typically sits.
  const cropWidth = Math.round(width * 0.45);
  const crop = await sharp(INPUT_PNG)
    .extract({ left: 0, top: 0, width: cropWidth, height })
    .toBuffer();

  const { data, info } = await removeNearBackground(crop);

  await sharp(data, { raw: info })
    .sharpen(1.2)
    .linear(1.06, -3)
    .png({ palette: true, colors: 8, quality: 100 })
    .toFile(PREP_MARK_PNG);
};

const preprocessMono = async () => {
  const { data, info } = await removeNearBackground(INPUT_PNG);

  await sharp(data, { raw: info })
    .grayscale()
    .normalise()
    .threshold(180)
    .png({ palette: true, colors: 2, quality: 100 })
    .toFile(PREP_MONO_PNG);
};

const tracePngToSvg = async (pngPath, svgPath, options) => {
  const { data, info } = await sharp(pngPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const imgd = { width: info.width, height: info.height, data };
  const svg = ImageTracer.imagedataToSVG(imgd, options);
  fs.writeFileSync(svgPath, svg, 'utf8');
};

const writePreview = () => {
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Miles Vector Preview</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 24px; background: #0b1220; color: #e5e7eb; }
    h1 { margin-bottom: 16px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 16px; }
    .card { background: #111827; border: 1px solid #253043; border-radius: 12px; padding: 12px; }
    .label { font-size: 13px; margin-bottom: 10px; color: #93a4bd; }
    .frame { background: #f8f9fb; border-radius: 10px; padding: 16px; min-height: 180px; display: flex; align-items: center; justify-content: center; }
    .frame img { max-width: 100%; height: auto; }
  </style>
</head>
<body>
  <h1>Miles Logo Preview</h1>
  <div class="grid">
    <div class="card"><div class="label">PNG source</div><div class="frame"><img src="./miles-logo.png" alt="PNG source" /></div></div>
    <div class="card"><div class="label">SVG full (color)</div><div class="frame"><img src="./miles-logo.svg" alt="SVG full" /></div></div>
    <div class="card"><div class="label">SVG full (mono fallback)</div><div class="frame"><img src="./miles-logo-mono.svg" alt="SVG mono" /></div></div>
    <div class="card"><div class="label">SVG mark</div><div class="frame"><img src="./miles-mark.svg" alt="SVG mark" /></div></div>
  </div>
</body>
</html>`;
  fs.writeFileSync(PREVIEW_HTML, html, 'utf8');
};

const runVectorize = async () => {
  ensureInput();
  await preprocessFull();
  await preprocessMark();
  await preprocessMono();
  await tracePngToSvg(PREP_FULL_PNG, OUT_FULL_SVG, COLOR_TRACE_OPTIONS);
  await tracePngToSvg(PREP_MARK_PNG, OUT_MARK_SVG, MARK_TRACE_OPTIONS);
  await tracePngToSvg(PREP_MONO_PNG, OUT_MONO_SVG, MONO_TRACE_OPTIONS);
  console.log(`Wrote: ${OUT_FULL_SVG}`);
  console.log(`Wrote: ${OUT_MARK_SVG}`);
  console.log(`Wrote: ${OUT_MONO_SVG}`);
};

const runPreview = async () => {
  writePreview();
  console.log(`Wrote preview: ${PREVIEW_HTML}`);
};

const main = async () => {
  const mode = process.argv[2];
  if (mode === '--preview') {
    await runPreview();
    return;
  }
  await runVectorize();
};

main().catch((error) => {
  console.error('Vectorize failed:', error);
  process.exit(1);
});
