const fs = require('fs');
const path = require('path');

const source = path.resolve(__dirname, '../../data/processed/cancer_india.json');
const destination = path.resolve(__dirname, '../assets/data/cancer_india.json');

if (!fs.existsSync(source)) {
  throw new Error(`Processed dashboard data was not found: ${source}`);
}

fs.mkdirSync(path.dirname(destination), { recursive: true });
fs.copyFileSync(source, destination);
console.log('Synced processed India cancer data into the Expo asset bundle.');
