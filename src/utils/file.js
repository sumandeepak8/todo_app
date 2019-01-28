const ENCODING_UTF8 = 'utf-8';

const readDirectory = function(directoryPath, fs, files = {}) {
  const filesAndDirs = fs.readdirSync(directoryPath, { withFileTypes: true });
  filesAndDirs.forEach(fileOrDir => {
    let currentPath = `${directoryPath}/${fileOrDir.name}`;
    if (fileOrDir.isDirectory()) {
      return readDirectory(currentPath, fs, files);
    }
    files[currentPath] = fs.readFileSync(currentPath, ENCODING_UTF8);
  });
  return files;
};

module.exports = { readDirectory };
