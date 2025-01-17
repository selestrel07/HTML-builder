const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, 'files');
const destPath = path.join(__dirname, 'files-copy');

fs.mkdir(destPath, { recursive: true }, (err) => {
  if (err) throw err;
  fs.readdir(destPath, { withFileTypes: true }, (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      const fileToCheck = path.join(sourcePath, file.name);
      const fileToRemove = path.join(destPath, file.name);
      fs.access(fileToCheck, fs.constants.F_OK, (err) => {
        if (err) {
          fs.rm(fileToRemove, (err) => {
            if (err) throw err;
          });
        }
      });
    });
  });
  fs.readdir(sourcePath, { withFileTypes: true }, (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      fs.copyFile(
        path.join(file.parentPath, file.name),
        path.join(destPath, file.name),
        (err) => {
          if (err) throw err;
        },
      );
    });
  });
});
