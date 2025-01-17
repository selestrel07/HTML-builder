const fs = require('fs');
const path = require('path');

fs.readdir(
  path.join(__dirname, 'secret-folder'),
  { withFileTypes: true },
  (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      fs.stat(path.join(file.parentPath, file.name), (err, stats) => {
        if (err) throw err;
        if (stats.isFile()) {
          const extension = path.extname(file.name);
          const fileName = path.basename(file.name, extension);
          console.log(
            `${fileName}-${extension.replace('.', '')}-${stats.size / 1000}Kb`,
          );
        }
      });
    });
  },
);
