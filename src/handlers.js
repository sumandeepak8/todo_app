const fs = require('fs');
const { HOME_PAGE_PATH, ENCODING_UTF8 } = require('./constants');

//Cache for all files
const getFileFromCache = function(filepath) {
  const FILES_CACHE = {
    '/': fs.readFileSync(HOME_PAGE_PATH, ENCODING_UTF8),
    '/index.html': fs.readFileSync(HOME_PAGE_PATH, ENCODING_UTF8)
  };
  return FILES_CACHE[filepath];
};

const logRequest = function(req, res, next, send) {
  console.log('request url : ', req.url);
  console.log('request method : ', req.method);
  next();
};

const serveFile = function(req, res, next, send) {
  const content = getFileFromCache(req.url);
  if (!content) {
    send(res, 404, 'Resource Not Found', 'text/plain');
    return;
  }
  send(res, 200, content, 'text/html');
};

module.exports = { logRequest, serveFile };
