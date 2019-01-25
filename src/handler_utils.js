const { TODO_LISTS_PATH } = require('./constants');

const splitKeyValue = pair => pair.split('=');

const assignKeyValue = (parameters, [key, value]) => {
  parameters[key] = value;
  return parameters;
};

const readParameters = requestBody => {
  return requestBody
    .split('&')
    .map(splitKeyValue)
    .reduce(assignKeyValue, {});
};

const saveToDoList = function(res, todoListsJSON, fs) {
  fs.writeFile(TODO_LISTS_PATH, todoListsJSON, err => {
    if (err) {
      res.send(500, 'Internal Server Error', 'text/plain');
      return;
    }
    res.redirect('/');
  });
};

module.exports = {
  saveToDoList,
  readParameters
};
