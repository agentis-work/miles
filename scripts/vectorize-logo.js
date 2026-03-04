/**
 * Better vectorization pipeline:
 * 1) Preprocess PNG with sharp (remove bg, increase contrast, reduce colors)
 * 2) Trace with imagetracerjs using fewer colors and stronger noise filtering
 * 3) Write SVG output
 *
 * Run: npm run brand:vectorize
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const ImageTracer = require("imagetracerjs");

const INPUT = path.resolve("assets/brand/miles-logo.png");
const TMP = path.resolve("assets/brand/_miles-logo-prep.png");
const OUT = path.resolve("assets/brand/miles-logo.svg");

// tweak: background is slightly off-white in your file
const BG = { r: 248, g: 244, b: 245 }; // approximate

async function preprocess() {
  if (!fs.existsSync(INPUT)) {
    throw new Error(`Missing input: ${INPUT}`);
  }

  // Strategy:
  // - Make bg transparent (best-effort via "flatten" + thresholding idea)
  // - Increase contrast a bit
  // - Slight sharpen to help edges
  // - Posterize (reduce colors) to avoid thousands of tiny paths
  //
  // Note: sharp doesn't have true "posterize", but we can quantize via png palette.
  await sharp(INPUT)
    .ensureAlpha()
    // Remove near-background: push background toward transparency by making an alpha mask.
    // We do this by extracting to raw and computing alpha by distance from BG.
    .raw()
    .toBuffer({ resolveWithObject: true })
    .then(async ({ data, info }) => {
      const out = Buffer.alloc(data.length);
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // distance from bg color
        const dr = r - BG.r;
        const dg = g - BG.g;
        const db = b - BG.b;
        const dist = Math.sqrt(dr * dr + dg * dg + db * db);

        // If close to bg, make transparent. Threshold tuning: 18–35 is typical.
        const alpha = dist < 26 ? 0 : 255;

        out[i] = r;
        out[i + 1] = g;
        out[i + 2] = b;
        out[i + 3] = alpha;
      }

      await sharp(out, { raw: info })
        .sharpen(1.2)
        .linear(1.05, -2) // mild contrast
        // quantize palette (reduces colors massively)
        .png({ palette: true, colors: 16 })
        .toFile(TMP);
    });
}

async function trace() {
  const options = {
    // Stronger smoothing/noise reduction than before
    numberofcolors: 12,     // try 8, 12, 16
    colorsampling: 2,
    colorquantcycles: 3,

    // These control path smoothness; higher = smoother but less detail
    ltres: 2,               // try 1–5
    qtres: 2,               // try 1–5

    // Most important: remove tiny junk paths
    pathomit: 30,           // try 20–80
    rightangleenhance: false,

    // reduce weird speckles
    mincolorratio: 0.03,

    scale: 1,
  };

  const { data, info } = await sharp(TMP)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const imgd = {
    width: info.width,
    height: info.height,
    data,
  };

  const svgStr = ImageTracer.imagedataToSVG(imgd, options);
  fs.writeFileSync(OUT, svgStr, "utf8");
}

(async () => {
  try {
    await preprocess();
    await trace();
    console.log(`✅ SVG created: ${OUT}`);
    console.log(`ℹ Preprocessed temp: ${TMP}`);
    console.log(`Next: run SVGO to optimize`);
  } catch (e) {
    console.error("❌ Vectorize failed:", e);
    process.exit(1);
  }
})();
