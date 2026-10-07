// One-time migration: uploads the student photos in public/ to Cloudinary.
//
//   npm run photos:plan     dry run: shows exactly what would be uploaded (default)
//   npm run photos:upload   really uploads (needs CLOUDINARY_* in .env)
//
// Each photo is rotated upright, shrunk to at most 2400px on the long side and
// recompressed. This also removes hidden metadata such as GPS location. Photos
// are named by the convention the site reads from the "profiles" folder:
//   <slug>      main photo   (the slug is the end of the profile URL)
//   <slug>_2    gallery photo 2, then _3, _4 ...
// Re-running is safe: uploads overwrite the same names.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";

const APPLY = process.argv.includes("--apply");
const FOLDER = "profiles";
const MAX_SIDE = 2400;

try {
  process.loadEnvFile(".env");
} catch {
  // No .env file: fine for a dry run.
}

const slugify = (name) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// ---- read which local files belong to which student -------------------------
const source = fs.readFileSync("data/studentsData.ts", "utf8").replace(/\r\n/g, "\n");
const parts = source.split(/\n  "([^"]+)": \{\n/).slice(1);
const jobs = [];
for (let i = 0; i < parts.length; i += 2) {
  const name = parts[i];
  const body = parts[i + 1];
  const profile = body.match(/profilePic: "(\/[^"]+)"/)?.[1];
  const orbit = [...(body.match(/orbitImages: \[([^\]]*)\]/)?.[1] ?? "").matchAll(/["'](\/[^"']+)["']/g)].map((m) => m[1]);
  const slug = slugify(name);
  const files = [];
  if (profile) files.push(profile);
  for (const file of orbit) if (!files.includes(file)) files.push(file); // the profile photo is often repeated in the gallery
  files.forEach((file, index) => {
    const local = path.join("public", file.slice(1));
    if (!fs.existsSync(local)) {
      console.warn(`skipping missing file ${file} (${name})`);
      return;
    }
    jobs.push({ name, slug, local, target: index === 0 && profile ? slug : `${slug}_${index + (profile ? 1 : 2)}` });
  });
}

// ---- resize / recompress ----------------------------------------------------
async function prepare(local) {
  const base = sharp(local, { failOn: "none" }).rotate(); // apply the EXIF rotation, then drop the flag
  const stats = await sharp(local, { failOn: "none" }).stats();
  const meta = await sharp(local, { failOn: "none" }).metadata();
  const resized = base.resize({ width: MAX_SIDE, height: MAX_SIDE, fit: "inside", withoutEnlargement: true });
  const transparent = meta.hasAlpha && !stats.isOpaque;
  const { data, info } = transparent
    ? await resized.webp({ quality: 88 }).toBuffer({ resolveWithObject: true })
    : await resized.flatten({ background: "#ffffff" }).jpeg({ quality: 85, mozjpeg: true }).toBuffer({ resolveWithObject: true });
  return { data, info, ext: transparent ? "webp" : "jpg", before: fs.statSync(local).size };
}

const mb = (n) => (n / 1048576).toFixed(2) + " MB";

// ---- upload -----------------------------------------------------------------
async function upload({ data, ext, target }) {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  const params = {
    asset_folder: FOLDER,
    display_name: target,
    overwrite: "true",
    public_id: `profile_${target}`,
    timestamp: String(Math.floor(Date.now() / 1000)),
  };
  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  const signature = crypto.createHash("sha1").update(toSign + secret).digest("hex");

  const form = new FormData();
  form.set("file", new Blob([data], { type: ext === "webp" ? "image/webp" : "image/jpeg" }), `${target}.${ext}`);
  for (const [k, v] of Object.entries(params)) form.set(k, v);
  form.set("api_key", key);
  form.set("signature", signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, { method: "POST", body: form });
  const json = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(json?.error?.message ?? `HTTP ${response.status}`);
  return json;
}

// ---- run --------------------------------------------------------------------
if (APPLY && !(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)) {
  console.error("CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET must be set in .env to upload.");
  process.exit(1);
}

console.log(APPLY ? `UPLOADING to Cloudinary folder "${FOLDER}"\n` : `DRY RUN: nothing is uploaded. Add --apply (npm run photos:upload) to upload.\n`);
let before = 0;
let after = 0;
let failed = 0;
for (const job of jobs) {
  const prepared = await prepare(job.local);
  before += prepared.before;
  after += prepared.data.length;
  const line = `${path.basename(job.local).padEnd(22)} -> ${FOLDER}/${job.target}.${prepared.ext}`.padEnd(66) +
    `${prepared.info.width}x${prepared.info.height}  ${mb(prepared.before)} -> ${mb(prepared.data.length)}`;
  if (!APPLY) {
    console.log(line);
    continue;
  }
  try {
    const result = await upload({ ...prepared, target: job.target });
    console.log(`ok   ${line}  (${result.public_id})`);
  } catch (error) {
    failed++;
    console.log(`FAIL ${line}\n     ${error.message}`);
  }
}

const students = new Set(jobs.map((j) => j.slug)).size;
console.log(`\n${jobs.length} photos for ${students} students: ${mb(before)} -> ${mb(after)} after resizing.`);
if (APPLY) console.log(failed ? `${failed} failed: fix and re-run (safe to repeat).` : "Done. Check a few profiles on the site, then we can remove the local copies.");
