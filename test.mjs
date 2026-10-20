import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

console.log('🧪 Running Web-Bench repository sanity test suite...');

// Check core documentation and meta files
const requiredFiles = [
  'README.md',
  'README.zh_CN.md',
  'LICENSE.md',
  'MAINTAINERS.md',
  'CITATION.cff',
  'package.json',
  'rush.json'
];

for (const file of requiredFiles) {
  assert(fs.existsSync(file), `Expected ${file} to exist`);
  const content = fs.readFileSync(file, 'utf8');
  assert(content.length > 0, `Expected ${file} to not be empty`);
}

// Verify rush.json parsed properly (rush.json is JSONC with comments)
const rawRush = fs.readFileSync('rush.json', 'utf8')
  .replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '$1');
const rushConfig = JSON.parse(rawRush);
assert(Array.isArray(rushConfig.projects), 'Expected rush.json to contain projects array');
console.log(`✓ rush.json parsed with ${rushConfig.projects.length} registered projects`);

// Check projects directory
assert(fs.existsSync('projects'), 'Expected projects/ directory to exist');
const projectDirs = fs.readdirSync('projects').filter(f => {
  return fs.statSync(path.join('projects', f)).isDirectory();
});
console.log(`✓ Detected ${projectDirs.length} benchmark projects in projects/`);
assert(projectDirs.length >= 50, `Expected at least 50 benchmark projects, got ${projectDirs.length}`);

// Verify MAINTAINERS policy
const maintainers = fs.readFileSync('MAINTAINERS.md', 'utf8');
assert(maintainers.includes('Abdullah Formuli'), 'Expected MAINTAINERS.md to specify Abdullah Formuli');

// Verify CITATION
const citation = fs.readFileSync('CITATION.cff', 'utf8');
assert(citation.includes('Abdullah Formuli'), 'Expected CITATION.cff to specify Abdullah Formuli');

console.log('\n✅ All Web-Bench sanity tests passed successfully!');
