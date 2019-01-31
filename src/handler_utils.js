const { USERS_DATA_PATH, MIME_TEXT_PLAIN, MIME_TYPES } = require('./constants');

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
    res.send(500, 'Internal Server Error');
    return;
  }
  res.redirect(location);
};

const saveUsers = function(res, users, fs) {
  const usersJSON = JSON.stringify(users.getAllUsers());
  const redirectToDashboard = redirectIfNoError(res, '/dashboard.html');
  fs.writeFile(USERS_DATA_PATH, usersJSON, redirectToDashboard);
};

const saveSessions = function(sessionsJSON, res, fs) {
  const redirectToDashboard = redirectIfNoError(res, '/dashboard.html');
  fs.writeFile('./data/sessions.json', sessionsJSON, redirectToDashboard);
};

const createSessionAdder = (sessions, fs, res) =>
  function(sessionId, username) {
    sessions[sessionId] = username;
    const sessionsJSON = JSON.stringify(sessions);
    saveSessions(sessionsJSON, res, fs);
  };

const getParametersFromUrl = function(url) {
  return url.split('?')[1];
};

const resolveMIMEType = function(fileExtension) {
  return MIME_TYPES[fileExtension] || MIME_TEXT_PLAIN;
};

module.exports = {
  saveUsers,
  readParameters,
  getParametersFromUrl,
  createSessionAdder,
  saveSessions,
  resolveMIMEType
};
