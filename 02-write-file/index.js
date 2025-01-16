const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'input.txt');
const stdIn = process.stdin;
const stdOut = process.stdout;

fs.writeFile(filePath, '', (err) => {
  if (err) throw err;
});
stdOut.write('Hello! Please enter the text and I will save it for you.\n');

stdIn.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    stdIn.unref();
  } else {
    fs.appendFile(filePath, data, (err) => {
      if (err) throw err;
    });
  }
});
process.on('SIGINT', () => {
  process.exit(0);
});
process.on('exit', () => {
  stdOut.write('It is my farewell phrase: Goodbye!');
});
