const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');

function ensureFile(filename, defaultData = '[]') {
  const filepath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, defaultData);
  }
  return filepath;
}

function readJSON(filename) {
  const filepath = ensureFile(filename);
  const data = fs.readFileSync(filepath, 'utf-8');
  return JSON.parse(data);
}

function writeJSON(filename, data) {
  const filepath = ensureFile(filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
}

module.exports = { readJSON, writeJSON };
