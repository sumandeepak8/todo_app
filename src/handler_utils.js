const { USERS_DATA_PATH } = require('./constants');

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
      res.send(500, 'Internal Server Error', 'text/plain');
      return;
    }
    res.redirect('/dashboard.html');
  });
};

const createSessionWriter = (sessions, fs, res) =>
  function(sessionId, username) {
    sessions[sessionId] = username;
    const sessionsJSON = JSON.stringify(sessions);

    fs.writeFile('./data/sessions.json', sessionsJSON, err => {
      if (err) res.send(500, 'Internal Server Error', 'text/plain');
      res.setHeader('Set-Cookie', `sessionId=${sessionId}`);
      res.redirect('./dashboard.html');
    });
  };

const getParametersFromUrl = function(url) {
  return url.split('?')[1];
};

module.exports = {
  saveToDoList,
  readParameters,
  getParametersFromUrl,
  createSessionWriter
};
