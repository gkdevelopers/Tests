const path = require('path');
const fs = require('fs');

// hook name
const scriptName = path.basename(process.argv[1]);
const args = process.argv.slice(2);
const resultsPath = path.join('.', 'hook-results');

let stdin = '';

process.stdin.setEncoding('utf8');
process.stdin.on('readable', () => {
  const chunk = process.stdin.read();
  if (chunk === null) {
    return;
  }

  stdin = `${stdin}${chunk}`;
});

process.stdin.on('end', () => {
  let fileContents;
  try {
    fileContents = fs.readFileSync(resultsPath, 'utf8');
  } catch (error) {
    fileContents = '[]';
  }

  const hooksArray = JSON.parse(fileContents);

  hooksArray.push({
    scriptName,
    args,
    stdin: stdin.trim()
  });

  fs.writeFileSync(resultsPath, JSON.stringify(hooksArray), 'utf8');
});
