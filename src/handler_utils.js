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

const saveToDoList = function(res, users, fs) {
  const usersJSON = JSON.stringify(users.getAllUsers());
  fs.writeFile(USERS_DATA_PATH, usersJSON, err => {
    if (err) {
      res.send(500, 'Internal Server Error');
      return;
    }
    res.redirect('/dashboard.html');
  });
};

const saveSessions = function(sessionsJSON, res, fs) {
  fs.writeFile('./data/sessions.json', sessionsJSON, err => {
    if (err) {
      res.send(500, 'Internal Server Error');
      return;
    }
    res.redirect('./dashboard.html');
  });
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
  saveToDoList,
  readParameters,
  getParametersFromUrl,
  createSessionAdder,
  saveSessions,
  resolveMIMEType
};
