const {
  SESSIONS_DATA_PATH,
  MIME_TEXT_PLAIN,
  MIME_TYPES,
  ERROR_500_MSG
} = require('./constants');

const splitKeyValue = pair => pair.split('=');

const assignKeyValue = (parameters, [key, value]) => {
  parameters[key] = unescape(value).replace(/\+/g, ' ');
  return parameters;
};

const readParameters = (text, separator) => {
  return text
    .split(separator)
    .map(splitKeyValue)
    .reduce(assignKeyValue, {});
};

const redirectIfNoError = (res, location) => err => {
  if (err) {
    res.send(500, ERROR_500_MSG);
    return;
  }
  res.redirect(location);
};

const writeToFile = function(res, data, filePath, fs) {
  const dataJSON = JSON.stringify(data);
  const redirectToDashboard = redirectIfNoError(res, '/dashboard.html');
  fs.writeFile(filePath, dataJSON, redirectToDashboard);
};

const createSessionAdder = (sessions, fs, res) =>
  function(sessionId, username) {
    sessions[sessionId] = username;
    writeToFile(res, sessions, SESSIONS_DATA_PATH, fs);
  };

const getParametersFromUrl = function(url) {
  return url.split('?')[1];
};

const resolveMIMEType = function(fileExtension) {
  return MIME_TYPES[fileExtension] || MIME_TEXT_PLAIN;
};

module.exports = {
  readParameters,
  getParametersFromUrl,
  createSessionAdder,
  resolveMIMEType,
  writeToFile
};
