const fs = require('fs');
const path = require('path');
const readStream = fs.createReadStream(path.join(__dirname, 'template.html'));

const distFolder = path.join(__dirname, 'project-dist');

const assetsSourcePath = path.join(__dirname, 'assets');
const assetsTargetPath = path.join(distFolder, 'assets');

fs.mkdir(distFolder, { recursive: true }, (err) => {
  if (err) throw err;
  composeHtml();
  mergeStyles();
  copyAssets(assetsSourcePath, assetsTargetPath);
});

const mergeStyles = () => {
  const cssTargetFile = path.join(distFolder, 'style.css');
  const cssChunkDir = path.join(__dirname, 'styles');
  fs.writeFile(cssTargetFile, '', (err) => {
    if (err) throw err;
  });
  fs.readdir(cssChunkDir, { withFileTypes: true }, (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      const cssReadStream = fs.createReadStream(getFilePath(file));
      const cssChunkContent = [];
      cssReadStream.on('data', (data) => {
        cssChunkContent.push(data.toString());
      });
      cssReadStream.on('end', () => {
        fs.appendFile(cssTargetFile, cssChunkContent.join(''), (err) => {
          if (err) throw err;
        });
      });
    });
  });
};

const copyAssets = (sourcePath, targetPath) => {
  fs.mkdir(targetPath, { recursive: true }, (err) => {
    if (err) throw err;
    fs.readdir(targetPath, { withFileTypes: true }, (err, files) => {
      if (err) throw err;
      files.forEach((file) => {
        const fileToCheck = path.join(sourcePath, file.name);
        const fileToRemove = path.join(targetPath, file.name);
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
        if (file.isFile()) {
          fs.copyFile(
            getFilePath(file),
            path.join(targetPath, file.name),
            (err) => {
              if (err) throw err;
            },
          );
        } else {
          copyAssets(
            path.join(sourcePath, file.name),
            path.join(targetPath, file.name),
          );
        }
      });
    });
  });
};

const composeHtml = () => {
  const htmlTargetFile = path.join(distFolder, 'index.html');
  const htmlComponentsPath = path.join(__dirname, 'components');
  fs.writeFile(htmlTargetFile, '', (err) => {
    if (err) throw err;
  });
  fs.readdir(htmlComponentsPath, { withFileTypes: true }, (err, files) => {
    if (err) throw err;
    const componentsObject = {};
    Promise.all(
      files.map((file) => {
        return readComponentFile(file, componentsObject);
      }),
    ).then(() => {
      let htmlContent = '';
      readStream.on('data', (data) => {
        htmlContent += data.toString();
      });
      readStream.on('end', () => {
        const regExp = /\{\{\w*}}/g;
        htmlContent.match(regExp).forEach((match) => {
          htmlContent = htmlContent.replace(match, componentsObject[match]);
        });
        fs.appendFile(htmlTargetFile, htmlContent, (err) => {
          if (err) throw err;
        });
      });
    });
  });
};

const readComponentFile = (file, object) => {
  return new Promise((resolve) => {
    const stream = fs.createReadStream(getFilePath(file));
    let content = '';
    stream.on('data', (data) => {
      content += data.toString();
    });
    stream.on('end', () => {
      const fileName = file.name;
      object[`{{${fileName.replace(path.extname(fileName), '')}}}`] = content;
      resolve();
    });
  });
};

const getFilePath = (file) => path.join(file.parentPath, file.name);
