const TODOLists = require('./entities/todo_lists');
const getToDoListsHTML = require('./html_generators');
const {
  saveToDoList,
  readParameters,
  getParametersFromUrl
} = require('./handler_utils');

const {
  HOME_PAGE_PATH,
  ENCODING_UTF8,
  TODO_LISTS_PLACEHOLDER,
  TODO_LISTS_PATH,
  LIST_ID_PLACEHOLDER,
  ADD_ITEMS_PAGE,
  ERROR_404
} = require('./constants');

const loadToDoLists = function(FILES_CACHE) {
  const todoListsData = JSON.parse(FILES_CACHE.todoListsJSON);
  return TODOLists.parse(todoListsData);
};

const initializeServerCache = function(fs) {
  const FILES_CACHE = {};
  FILES_CACHE.dashboard = fs.readFileSync(HOME_PAGE_PATH, ENCODING_UTF8);
  FILES_CACHE.todoListsJSON = fs.readFileSync(TODO_LISTS_PATH, ENCODING_UTF8);

  FILES_CACHE['/add_todo_list.html'] = fs.readFileSync(
    './public/add_todo_list.html',
    ENCODING_UTF8
  );

  FILES_CACHE['/add_items.html'] = fs.readFileSync(
    './public/add_items.html',
    ENCODING_UTF8
  );

  FILES_CACHE['/add_items.js'] = fs.readFileSync(
    './public/add_items.js',
    ENCODING_UTF8
  );

  return FILES_CACHE;
};

const logRequest = function(req, res, next) {
  console.log('request url : ', req.url);
  console.log('request method : ', req.method);
  next();
};

const createFileServer = FILES_CACHE =>
  function(req, res, next) {
    const content = FILES_CACHE[req.url];
    if (!content) {
      res.send(404, ERROR_404, 'text/plain');
      return;
    }
    res.send(200, content, 'text/html');
  };

const createDashboardServer = (FILES_CACHE, toDoLists) =>
  function(req, res, next) {
    const todoListsHTML = getToDoListsHTML(toDoLists);
    const dashboardHMTL = FILES_CACHE.dashboard.replace(
      TODO_LISTS_PLACEHOLDER,
      todoListsHTML
    );

    res.send(200, dashboardHMTL, 'text/html');
  };

const createAddListHandler = (todoLists, fs) =>
  function(req, res, next) {
    let { title, description } = readParameters(req.body);
    todoLists.addTODOList(title, description, []);
    const todoListsJSON = JSON.stringify(todoLists);
    saveToDoList(res, todoListsJSON, fs);
  };

const readPostBody = function(req, res, next) {
  let body = '';
  req.on('data', chunk => (body += chunk));
  req.on('end', () => {
    req.body = body;
    next();
  });
};

const createAddItemsFormServer = FILES_CACHE =>
  function(req, res, next) {
    const parameters = getParametersFromUrl(req.url);
    const { listid } = readParameters(parameters);
    const content = FILES_CACHE[ADD_ITEMS_PAGE].replace(
      LIST_ID_PLACEHOLDER,
      listid
    );
    res.send(200, content, 'text/html');
  };

const separateListIdAndItems = function(itemsAndListId) {
  const listID = +itemsAndListId.listid;
  delete itemsAndListId.listid;
  const itemContents = Object.values(itemsAndListId);
  return { listID, itemContents };
};

const createAddItemsHandler = (toDoLists, fs) =>
  function(req, res, next) {
    const itemsAndListId = readParameters(req.body);
    const { listID, itemContents } = separateListIdAndItems(itemsAndListId);
    const targetList = toDoLists.getListByID(listID);
    itemContents.forEach(content => targetList.addItem(content, false));
    const todoListsJSON = JSON.stringify(toDoLists);
    saveToDoList(res, todoListsJSON, fs);
  };

module.exports = {
  logRequest,
  createFileServer,
  createDashboardServer,
  initializeServerCache,
  loadToDoLists,
  createAddListHandler,
  readPostBody,
  createAddItemsFormServer,
  createAddItemsHandler
};
