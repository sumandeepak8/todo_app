const TODOLists = require('./entities/todo_lists');
const getToDoListsHTML = require('./html_generators');
const {
  HOME_PAGE_PATH,
  ENCODING_UTF8,
  TODO_LISTS_PLACEHOLDER
} = require('./constants');

//Cache for all files
const FILES_CACHE = {};
let toDoLists;

const loadToDoLists = function(FILES_CACHE) {
  const toDoListsData = JSON.parse(FILES_CACHE.todoListsJSON).lists;
  return TODOLists.parse(toDoListsData);
};

const initializeServerCache = function(fs) {
  FILES_CACHE.dashboard = fs.readFileSync(HOME_PAGE_PATH, ENCODING_UTF8);
  FILES_CACHE.todoListsJSON = fs.readFileSync(
    'data/todo_lists.json',
    ENCODING_UTF8
  );

  toDoLists = loadToDoLists(FILES_CACHE);
};

const logRequest = function(req, res, next, send) {
  console.log('request url : ', req.url);
  console.log('request method : ', req.method);
  next();
};

const serveFile = function(req, res, next, send) {
  const content = FILES_CACHE[req.url];
  if (!content) {
    send(res, 404, 'Resource Not Found', 'text/plain');
    return;
  }
  send(res, 200, content, 'text/html');
};

const serveDashboard = function(req, res, next, send) {
  const todoListsHTML = getToDoListsHTML(toDoLists);
  const dashboardHMTL = FILES_CACHE.dashboard.replace(
    TODO_LISTS_PLACEHOLDER,
    todoListsHTML
  );

  send(res, 200, dashboardHMTL, 'text/html');
};

module.exports = {
  logRequest,
  serveFile,
  serveDashboard,
  initializeServerCache
};
