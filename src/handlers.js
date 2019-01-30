const Users = require('./entities/users');
const {
  saveToDoList,
  readParameters,
  createSessionAdder,
  saveSessions
} = require('./handler_utils');
const { readDirectory } = require('./utils/file');

const {
  HOME_PAGE_PATH,
  USERS_DATA_PATH,
  LIST_ID_PLACEHOLDER,
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

const loadUsers = function(FILES_CACHE) {
  const usersData = JSON.parse(FILES_CACHE[USERS_DATA_PATH]);
  return Users.parse(usersData);
};

const loadSessions = function(FILES_CACHE) {
  return JSON.parse(FILES_CACHE['./data/sessions.json']);
};

const getUsername = function(sessionId, sessions) {
  return sessions[sessionId];
};

const initializeDataDirectory = function(fs) {
  if (!fs.existsSync(DATA_DIRECTORY)) {
    fs.mkdirSync(DATA_DIRECTORY);
    fs.writeFileSync(USERS_DATA_PATH, DEFAULT_TODO_LISTS_JSON);
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

const createHomepageServer = FILES_CACHE =>
  function(req, res, next) {
    res.send(200, FILES_CACHE[HOME_PAGE_PATH], 'text/html');
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

const createAddListHandler = (users, sessions, fs) =>
  function(req, res, next) {
    let { title, description } = readParameters(req.body, '&');
    const username = getUsername(req.cookies.sessionId, sessions);
    users.getTodoLists(username).addTODOList(title, description);
    saveToDoList(res, users, fs);
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

const createAddItemHandler = (users, sessions, fs) =>
  function(req, res, next) {
    const { listid, itemcontent } = readParameters(req.body, '&');
    const username = getUsername(req.cookies.sessionId, sessions);
    const targetList = users.getTodoLists(username).getListByID(listid);
    targetList.addItem(itemcontent);
    saveToDoList(res, users, fs);
  };

const createDeleteListHandler = (users, sessions, fs) =>
  function(req, res, next) {
    const listid = +readParameters(req.body, '&').listid;
    const username = getUsername(req.cookies.sessionId, sessions);
    users.getTodoLists(username).deleteListByID(listid);
    saveToDoList(res, users, fs);
  };

const createDeleteItemHandler = (users, sessions, fs) =>
  function(req, res, next) {
    const { listid, itemid } = readParameters(req.body, '&');
    const username = getUsername(req.cookies.sessionId, sessions);
    users
      .getTodoLists(username)
      .getListByID(listid)
      .deleteItem(itemid);
    saveToDoList(res, users, fs);
  };

const createEditItemFormServer = (FILES_CACHE, sessions, users) =>
  function(req, res, next) {
    const { listid, itemid } = readParameters(req.body, '&');
    const username = getUsername(req.cookies.sessionId, sessions);
    const itemContent = users
      .getTodoLists(username)
      .getListByID(listid)
      .getItemById(itemid)
      .getContent();

    const content = insertListId(FILES_CACHE[EDIT_ITEM_PAGE_PATH], listid)
      .replace(ITEM_ID_PLACEHOLDER, itemid)
      .replace(ITEM_CONTENT_PLACEHOLDER, itemContent);

    res.send(200, content, 'text/html');
  };

const createSaveItemHandler = (users, sessions, fs) =>
  function(req, res, next) {
    const { itemid, listid, itemcontent } = readParameters(req.body, '&');
    const username = getUsername(req.cookies.sessionId, sessions);
    users
      .getTodoLists(username)
      .getListByID(listid)
      .getItemById(itemid)
      .setContent(itemcontent);

    saveToDoList(res, users, fs);
  };

const createEditListHandler = (FILES_CACHE, sessions, users) =>
  function(req, res, next) {
    const { listid } = readParameters(req.body, '&');
    const username = getUsername(req.cookies.sessionId, sessions);
    const targetList = users.getTodoLists(username).getListByID(listid);
    const listTitle = targetList.getTitle();
    const listDescription = targetList.getDescription();

    const content = insertListId(FILES_CACHE[EDIT_LIST_PAGE_PATH], listid)
      .replace(LIST_TITLE_PLACEHOLDER, listTitle)
      .replace(LIST_DESCRIPTION_PLACEHOLDER, listDescription);

    res.send(200, content, 'text/html');
  };

const createSaveListHandler = (users, sessions, fs) =>
  function(req, res, next) {
    const { listid, listtitle, listdescription } = readParameters(
      req.body,
      '&'
    );
    const username = getUsername(req.cookies.sessionId, sessions);
    const targetList = users.getTodoLists(username).getListByID(listid);
    targetList.setTitle(listtitle);
    targetList.setDescription(listdescription);
    saveToDoList(res, users, fs);
  };

const createStatusToggler = (users, sessions, fs) =>
  function(req, res, next) {
    const { listid, itemid } = readParameters(req.body, '&');
    const username = getUsername(req.cookies.sessionId, sessions);
    users
      .getTodoLists(username)
      .getListByID(listid)
      .getItemById(itemid)
      .toggleStatus();

    saveToDoList(res, users, fs);
  };

const createToDoListsJSONServer = (users, sessions) =>
  function(req, res, next) {
    const username = getUsername(req.cookies.sessionId, sessions);
    const todoListsJSON = JSON.stringify(users.getTodoLists(username));
    res.send(200, todoListsJSON, 'application/json');
  };

const readCookies = function(req, res, next) {
  let cookie = req.headers.cookie;
  req.cookies = {};
  if (cookie) req.cookies = readParameters(cookie, ';');
  next();
};

const isUserLoggedIn = function(sessionId, sessions) {
  return Object.keys(sessions).includes(sessionId);
};

const createSessionValidator = sessions =>
  function(req, res, next) {
    const { sessionId } = req.cookies;
    const unrestrictedUrls = ['/', '/login', '/index.html'];
    if (unrestrictedUrls.includes(req.url)) {
      if (isUserLoggedIn(sessionId, sessions)) {
        res.redirect('/dashboard.html');
        return;
      }
      next();
      return;
    }
    if (isUserLoggedIn(sessionId, sessions)) {
      next();
      return;
    }
    res.redirect('/');
  };

const createLoginHandler = (sessions, users, fs) =>
  function(req, res, next) {
    const { username, password } = readParameters(req.body, '&');
    if (!users.isUserValid(username, password)) {
      res.redirect('/');
      return;
    }
    const sessionId = Date.now();
    res.setHeader('Set-Cookie', `sessionId=${sessionId};`);
    const addSession = createSessionAdder(sessions, fs, res);
    addSession(sessionId, username);
  };

const createLogoutHandler = (sessions, fs) =>
  function(req, res, next) {
    const sessionId = req.cookies.sessionId;
    delete sessions[sessionId];
    const sessionsJSON = JSON.stringify(sessions);
    const expiryDate = new Date(Date.now()).toGMTString();
    res.setHeader('Set-Cookie', `sessionId=deleted; expires=${expiryDate}`);
    saveSessions(sessionsJSON, res, fs);
  };

module.exports = {
  logRequest,
  createFileServer,
  createHomepageServer,
  initializeServerCache,
  loadUsers,
  createAddListHandler,
  readPostBody,
  createAddItemHandler,
  createDeleteListHandler,
  createDeleteItemHandler,
  createEditItemFormServer,
  createSaveItemHandler,
  createEditListHandler,
  createSaveListHandler,
  createStatusToggler,
  createToDoListsJSONServer,
  readCookies,
  createSessionValidator,
  loadSessions,
  createLoginHandler,
  createLogoutHandler
};
