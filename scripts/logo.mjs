/* Save an employer's logo: the square picture from the company's LinkedIn
 * page (the rule is in src/data/positions.ts).
 *
 *   npm run logo -- <name> "<image address>"
 *
 * <name> becomes the file name: src/assets/logos/<name>.jpg (or .png).
 * The address is the one "Copy image address" gives on the company
 * page's logo; LinkedIn refuses automated requests for the page itself,
 * so this script does not look the picture up.
 *
 * It refuses anything that is not a square JPEG or PNG of at least
 * 96 px: the tile is 48 px, drawn at twice that on dense screens.
 */
import fs from 'node:fs';
import path from 'node:path';

const [name, url] = process.argv.slice(2);
if (!name || !url || !/^[a-z0-9-]+$/.test(name) || !/^https:\/\//.test(url)) {
  console.error('Usage: npm run logo -- <name> "<https image address>"   (name: lowercase letters, digits, dashes)');
  process.exit(1);
}

const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
if (!res.ok) { console.error(`Could not fetch it: HTTP ${res.status}. The address may have expired; copy it again.`); process.exit(1); }
const bytes = Buffer.from(await res.arrayBuffer());

// width and height, read from the file itself
function size(b) {
  if (b.length > 24 && b.readUInt32BE(0) === 0x89504e47) return { type: 'png', w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
  if (b.length > 4 && b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const marker = b[i + 1], len = b.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc)
        return { type: 'jpg', w: b.readUInt16BE(i + 7), h: b.readUInt16BE(i + 5) };
      i += 2 + len;
    }
  }
  return null;
}
const s = size(bytes);
if (!s) { console.error('That is not a JPEG or PNG image.'); process.exit(1); }
if (s.w !== s.h) { console.error(`Not square: ${s.w}x${s.h}. A logo fills a square tile.`); process.exit(1); }
if (s.w < 96) { console.error(`Too small: ${s.w}x${s.h}. At least 96 px is needed.`); process.exit(1); }

const dir = path.resolve('src/assets/logos');
fs.mkdirSync(dir, { recursive: true });
const file = path.join(dir, `${name}.${s.type}`);
fs.writeFileSync(file, bytes);
console.log(`Saved ${path.relative(process.cwd(), file)} (${s.w}x${s.h}, ${bytes.length} bytes).`);
console.log(`Now import it in src/data/positions.ts and set it as the position's logo.`);
