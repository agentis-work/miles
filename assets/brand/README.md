# Miles Brand Assets (PNG Only)

This app now uses PNG assets for all Miles branding in-app. No SVG runtime/logo pipeline is required.

## Source Inputs

- `miles-logo-transparent.png` (required full logo source)
- `miles-mark-transparent.png` (required mark source)
- `miles-logo-background.png` (required background lockup source for splash generation)
- `source/miles-logo-dark.png` (optional manual dark variant)
- `source/miles-mark-dark.png` (optional manual dark variant)

## Generated In-App PNGs

- `png/miles-logo.png`
- `png/miles-logo@2x.png`
- `png/miles-logo@3x.png`
- `png/miles-mark.png`
- `png/miles-mark@2x.png`
- `png/miles-mark@3x.png`
- `png/miles-logo-dark.png`
- `png/miles-logo-dark@2x.png`
- `png/miles-logo-dark@3x.png`
- `png/miles-mark-dark.png`
- `png/miles-mark-dark@2x.png`
- `png/miles-mark-dark@3x.png`

If dark source files are not provided and automatic recolor is not safe (multi-color logo), fallback dark files are copied from light variants and a note is written to `PNG_NOTES.md`.

## Generated Web Icons

- `favicon/android-chrome-512.png`
- `favicon/android-chrome-192.png`
- `favicon/apple-touch-icon.png`
- `favicon/favicon-32.png`
- `favicon/favicon-16.png`

## Existing App Config PNGs (unchanged)

- `png/app-icon-1024.png`
- `png/splash-2732.png`
- `png/adaptive-foreground-432.png`

## How To Run

1. `npm install`
2. `npm run brand:png`
3. `expo start -c`
