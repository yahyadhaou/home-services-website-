// Prepares everything the site serves from /public:
//  - screenshots from ../pdf/<folder> → optimised WebP with stable names
//  - the six PDFs → public/downloads
//  - PDF cover thumbnails (from the presentation kit previews) → public/covers
//  - the logo files → public/brand
// Run with `npm run assets`; the output is committed so deployment needs no
// access to the source folders.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { zipSync } from 'fflate';

const root = path.resolve(import.meta.dirname, '..');
const src = path.resolve(root, '..', 'pdf');
const kit = path.resolve(root, '..', 'presentation-kit');
const pub = path.join(root, 'public');

const FOLDERS = [
  { dir: 'client', out: 'client' },
  { dir: 'provider manager', out: 'manager' },
  { dir: 'coworker', out: 'coworker' },
  { dir: 'admin', out: 'admin' },
];

const ensure = (p) => fs.mkdirSync(p, { recursive: true });
const pad = (n) => String(n).padStart(2, '0');

const run = async () => {
  // Per-screenshot facts the UI needs (size for layout, light/dark for the
  // appearance filter), measured from the pixels instead of guessed.
  const facts = {};

  // Screenshots. Phone shots are 1170x2532 or 444x960; admin shots are 2880x1800.
  for (const { dir, out } of FOLDERS) {
    const from = path.join(src, dir);
    const to = path.join(pub, 'shots', out);
    fs.rmSync(to, { recursive: true, force: true });
    ensure(to);
    const files = fs.readdirSync(from).filter((f) => /\.(jpe?g|png)$/i.test(f)).sort();
    for (let i = 0; i < files.length; i += 1) {
      const isAdmin = out === 'admin';
      const name = isAdmin ? path.basename(files[i], path.extname(files[i])) : pad(i + 1);
      const img = sharp(path.join(from, files[i]));
      const meta = await img.metadata();
      const resized = isAdmin
        ? img.resize({ width: 1600, withoutEnlargement: true })
        : img.resize({ width: Math.min(meta.width, 720), withoutEnlargement: true });
      const info = await resized.webp({ quality: isAdmin ? 84 : 88 }).toFile(path.join(to, `${name}.webp`));
      // Brightness of the screen's outer margin (page background, not cards).
      const band = await sharp(path.join(from, files[i]))
        .extract({ left: 0, top: Math.round(meta.height * 0.12), width: Math.max(2, Math.round(meta.width * 0.02)), height: Math.round(meta.height * 0.7) })
        .stats();
      const lum = (band.channels[0].mean + band.channels[1].mean + band.channels[2].mean) / 3;
      facts[`${out}/${name}`] = { w: info.width, h: info.height, theme: lum > 128 ? 'light' : 'dark' };
    }
    console.log(`${out}: ${files.length} screens`);
  }
  fs.writeFileSync(path.join(root, 'src', 'data', 'screen-facts.json'), `${JSON.stringify(facts, null, 2)}\n`);

  // PDFs.
  const dl = path.join(pub, 'downloads');
  ensure(dl);
  const pdfs = fs.readdirSync(src).filter((f) => f.endsWith('.pdf'));
  for (const f of pdfs) fs.copyFileSync(path.join(src, f), path.join(dl, f));
  console.log(`pdfs: ${pdfs.length}`);

  // One bundle with every document for "download all".
  const bundle = Object.fromEntries(pdfs.map((f) => [f, new Uint8Array(fs.readFileSync(path.join(src, f)))]));
  fs.writeFileSync(path.join(dl, 'HomeServices-Pitch-Pack.zip'), zipSync(bundle, { level: 0 }));

  // Cover thumbnails (page 1 of each document).
  const covers = path.join(pub, 'covers');
  ensure(covers);
  const previews = path.join(kit, 'build', 'out', 'preview');
  for (const f of pdfs) {
    const base = path.basename(f, '.pdf');
    const png = path.join(previews, `${base}-01.png`);
    if (!fs.existsSync(png)) { console.warn('no preview for', base); continue; }
    const isDeck = base.endsWith('Pitch-Deck');
    await sharp(png).resize({ width: isDeck ? 960 : 640 }).webp({ quality: 86 }).toFile(path.join(covers, `${base}.webp`));
  }

  // Logo.
  const brand = path.join(pub, 'brand');
  ensure(brand);
  const logoDir = path.join(kit, 'build', 'brand');
  for (const f of fs.readdirSync(logoDir)) fs.copyFileSync(path.join(logoDir, f), path.join(brand, f));
  console.log('brand: done');
};

run().catch((e) => { console.error(e); process.exit(1); });
