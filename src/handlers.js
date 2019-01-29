const TODOLists = require('./entities/todo_lists');
const getToDoListsHTML = require('./html_generators');
const {
  saveToDoList,
  readParameters,
  getParametersFromUrl
} = require('./handler_utils');

const { readDirectory } = require('./utils/file');

const {
  HOME_PAGE_PATH,
  TODO_LISTS_PLACEHOLDER,
  TODO_LISTS_PATH,
  LIST_ID_PLACEHOLDER,
  ADD_ITEMS_PAGE_PATH,
  ERROR_404,
  EDIT_ITEM_PAGE_PATH,
  ITEM_CONTENT_PLACEHOLDER,
  ITEM_ID_PLACEHOLDER,
  EDIT_LIST_PAGE_PATH,
  LIST_DESCRIPTION_PLACEHOLDER,
  LIST_TITLE_PLACEHOLDER,
  DATA_DIRECTORY,
  PUBLIC_DIRECTORY,
  DEFAULT_TODO_LISTS_JSON
} = require('./constants');

const loadToDoLists = function(FILES_CACHE) {
  const todoListsData = JSON.parse(FILES_CACHE[TODO_LISTS_PATH]);
  return TODOLists.parse(todoListsData);
};

const initializeDataDirectory = function(fs) {
  if (!fs.existsSync(DATA_DIRECTORY)) {
    fs.mkdirSync(DATA_DIRECTORY);
    fs.writeFileSync(TODO_LISTS_PATH, DEFAULT_TODO_LISTS_JSON);
  }
};

const initializeServerCache = function(fs) {
  const FILES_CACHE = {};
  initializeDataDirectory(fs);
  const data_files = readDirectory(DATA_DIRECTORY, fs);
  const public_files = readDirectory(PUBLIC_DIRECTORY, fs);
  Object.assign(FILES_CACHE, public_files);
  Object.assign(FILES_CACHE, data_files);

  return FILES_CACHE;
};

const logRequest = function(req, res, next) {
  console.log('request url : ', req.url);
  console.log('request method : ', req.method);
  next();
};

const createFileServer = FILES_CACHE =>
  function(req, res, next) {
    const filePath = PUBLIC_DIRECTORY + req.url;
    const content = FILES_CACHE[filePath];
    if (content == undefined) {
      res.send(404, ERROR_404, 'text/plain');
      return;
    }
    res.send(200, content, 'text/html');
  };

const createDashboardServer = (FILES_CACHE, todoLists) =>
  function(req, res, next) {
    const todoListsHTML = getToDoListsHTML(todoLists);
    const dashboardHMTL = FILES_CACHE[HOME_PAGE_PATH].replace(
      TODO_LISTS_PLACEHOLDER,
      todoListsHTML
    );

    res.send(200, dashboardHMTL, 'text/html');
  };

const createAddListHandler = (todoLists, fs) =>
  function(req, res, next) {
    let { title, description } = readParameters(req.body);
    todoLists.addTODOList(title, description, []);
    saveToDoList(res, todoLists, fs);
  };

const readPostBody = function(req, res, next) {
  let body = '';
  req.on('data', chunk => (body += chunk));
  req.on('end', () => {
    req.body = body;
    next();
  });
};

const insertListId = function(content, listId) {
  return content.replace(LIST_ID_PLACEHOLDER, listId);
};

const createAddItemsFormServer = FILES_CACHE =>
  function(req, res, next) {
    const parameters = getParametersFromUrl(req.url);
    const { listid } = readParameters(parameters);
    const content = insertListId(FILES_CACHE[ADD_ITEMS_PAGE_PATH], listid);
    res.send(200, content, 'text/html');
  };

const separateListIdAndItems = function(itemsAndListId) {
  const listID = +itemsAndListId.listid;
  delete itemsAndListId.listid;
  const itemContents = Object.values(itemsAndListId);
  return { listID, itemContents };
};

const createAddItemsHandler = (todoLists, fs) =>
  function(req, res, next) {
    const itemsAndListId = readParameters(req.body);
    const { listID, itemContents } = separateListIdAndItems(itemsAndListId);
    const targetList = todoLists.getListByID(listID);
    itemContents.forEach(content => targetList.addItem(content, false));
    saveToDoList(res, todoLists, fs);
  };

const createDeleteListHandler = (todoLists, fs) =>
  function(req, res, next) {
    const listid = +readParameters(req.body).listid;
    todoLists.deleteListByID(listid);
    saveToDoList(res, todoLists, fs);
  };

const createDeleteItemHandler = (todoLists, fs) =>
  function(req, res, next) {
    const { listid, itemid } = readParameters(req.body);
    todoLists.getListByID(+listid).deleteItem(+itemid);
    saveToDoList(res, todoLists, fs);
  };

const createEditItemFormServer = (FILES_CACHE, todoLists) =>
  function(req, res, next) {
    const { listid, itemid } = readParameters(req.body);
    const itemContent = todoLists
      .getListByID(+listid)
      .getItemById(+itemid)
      .getContent();

    const content = insertListId(FILES_CACHE[EDIT_ITEM_PAGE_PATH], listid)
      .replace(ITEM_ID_PLACEHOLDER, itemid)
      .replace(ITEM_CONTENT_PLACEHOLDER, itemContent);

    res.send(200, content, 'text/html');
  };

const createSaveItemHandler = (todoLists, fs) =>
  function(req, res, next) {
    const { itemid, listid, itemcontent } = readParameters(req.body);
    todoLists
      .getListByID(+listid)
      .getItemById(+itemid)
      .setContent(itemcontent);

    saveToDoList(res, todoLists, fs);
  };

const createEditListHandler = (FILES_CACHE, todoLists) =>
  function(req, res, next) {
    const { listid } = readParameters(req.body);
    const targetList = todoLists.getListByID(+listid);
    const listTitle = targetList.getTitle();
    const listDescription = targetList.getDescription();

    const content = insertListId(FILES_CACHE[EDIT_LIST_PAGE_PATH], listid)
      .replace(LIST_TITLE_PLACEHOLDER, listTitle)
      .replace(LIST_DESCRIPTION_PLACEHOLDER, listDescription);

    res.send(200, content, 'text/html');
  };

const createSaveListHandler = (todoLists, fs) =>
  function(req, res, next) {
    const { listid, listtitle, listdescription } = readParameters(req.body);
    const targetList = todoLists.getListByID(+listid);
    targetList.setTitle(listtitle);
    targetList.setDescription(listdescription);
    saveToDoList(res, todoLists, fs);
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
  createAddItemsHandler,
  createDeleteListHandler,
  createDeleteItemHandler,
  createEditItemFormServer,
  createSaveItemHandler,
  createEditListHandler,
  createSaveListHandler
};
