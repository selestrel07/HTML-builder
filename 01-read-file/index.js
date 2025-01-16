const fs = require('fs');
const path = require('path');
const stdOut = process.stdout;
const filePath = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(filePath);

readStream.on('data', (chunk) => {
  stdOut.write(chunk);
});
readStream.on('error', (error) => {
  stdOut.write(`Error: ${error.message}`);
});
