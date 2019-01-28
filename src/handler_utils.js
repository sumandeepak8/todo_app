const { TODO_LISTS_PATH } = require('./constants');

const splitKeyValue = pair => pair.split('=');

const assignKeyValue = (parameters, [key, value]) => {
  parameters[key] = unescape(value).replace(/\+/g, ' ');
  return parameters;
};

const readParameters = requestBody => {
  return requestBody
    .split('&')
    .map(splitKeyValue)
    .reduce(assignKeyValue, {});
};

const saveToDoList = function(res, todoLists, fs) {
  const todoListsJSON = JSON.stringify(todoLists);
  fs.writeFile(TODO_LISTS_PATH, todoListsJSON, err => {
    if (err) {
      res.send(500, 'Internal Server Error', 'text/plain');
      return;
    }
    res.redirect('/');
  });
};

const getParametersFromUrl = function(url) {
  return url.split('?')[1];
};

module.exports = {
  saveToDoList,
  readParameters,
  getParametersFromUrl
};
