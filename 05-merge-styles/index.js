const fs = require('fs');
const path = require('path');

const pathToBundle = path.join(__dirname, 'project-dist', 'bundle.css');
const pathToStyles = path.join(__dirname, 'styles');

fs.writeFile(pathToBundle, '', (err) => {
  if (err) throw err;
});
fs.readdir(pathToStyles, { withFileTypes: true }, (err, files) => {
  if (err) throw err;
  files.forEach((file) => {
    if (path.extname(file.name) === '.css') {
      const readStream = fs.createReadStream(
        path.join(file.parentPath, file.name),
      );
      const contentArr = [];
      readStream.on('data', (chunk) => {
        contentArr.push(chunk.toString());
      });
      readStream.on('end', () => {
        fs.appendFile(pathToBundle, contentArr.join('\n'), (err) => {
          if (err) throw err;
        });
      });
    }
  });
});
