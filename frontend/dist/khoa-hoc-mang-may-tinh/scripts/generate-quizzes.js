const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const jsonPath = path.join(rootDir, 'data', 'quizzes.json');
const jsPath = path.join(rootDir, 'data', 'quizzes.js');

const raw = fs.readFileSync(jsonPath, 'utf8');
const data = JSON.parse(raw);
const output = `window.QUIZZES = ${JSON.stringify(data, null, 2)};\n`;

fs.writeFileSync(jsPath, output);
console.log('Generated data/quizzes.js from data/quizzes.json');
