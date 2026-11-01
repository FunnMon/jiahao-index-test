import { mkdir, copyFile, rm } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const output = new URL('dist/', root);
const publicFiles = ['index.html', 'styles.css', 'tokens.css', 'base.css', 'quiz-data.js', 'app.js'];
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const file of publicFiles) await copyFile(new URL(file, root), new URL(file, output));
console.log(`Built dist/ with ${publicFiles.length} explicit public files.`);
