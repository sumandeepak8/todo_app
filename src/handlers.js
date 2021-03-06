const Users = require('./entities/users');
const {
  writeToFile,
  readParameters,
  createSessionAdder,
  resolveMIMEType
} = require('./handler_utils');
const { readDirectory, getFileExtension } = require('./utils/file');

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
  SESSIONS_DATA_PATH
} = require('./constants');

const loadUsers = function(FILES_CACHE) {
  const usersData = JSON.parse(FILES_CACHE[USERS_DATA_PATH]);
  return Users.parse(usersData);
};

const loadSessions = function(FILES_CACHE) {
  return JSON.parse(FILES_CACHE[SESSIONS_DATA_PATH]);
};

const getUsername = function(sessionId, sessions) {
  return sessions[sessionId];
};

const initializeDataDirectory = function(fs) {
  if (!fs.existsSync(DATA_DIRECTORY)) {
    fs.mkdirSync(DATA_DIRECTORY);
    fs.writeFileSync(USERS_DATA_PATH, '{}');
    fs.writeFileSync(SESSIONS_DATA_PATH, '{}');
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
    res.send(200, FILES_CACHE[HOME_PAGE_PATH], resolveMIMEType('html'));
  };

const createFileServer = FILES_CACHE =>
  function(req, res, next) {
    const filePath = PUBLIC_DIRECTORY + req.url;
    const fileExtension = getFileExtension(filePath);
    const content = FILES_CACHE[filePath];
    if (content == undefined) {
      res.send(404, ERROR_404);
      return;
    }
    res.send(200, content, resolveMIMEType(fileExtension));
  };

const createAddListHandler = (users, sessions, fs) =>
  function(req, res, next) {
    let { title, description } = req.body;
    const username = getUsername(req.cookies.sessionId, sessions);
    users.getTodoLists(username).addTodo(title, description);
    writeToFile(res, users.getAllUsers(), USERS_DATA_PATH, fs);
  };

const readPostBody = function(req, res, next) {
  let body = '';
  req.on('data', chunk => (body += chunk));
  req.on('end', () => {
    req.body = readParameters(body, '&');
    next();
  });
};

const insertListId = function(content, listId) {
  return content.replace(LIST_ID_PLACEHOLDER, listId);
};

const createAddItemHandler = (users, sessions, fs) =>
  function(req, res, next) {
    const { listid, itemcontent } = req.body;
    const username = getUsername(req.cookies.sessionId, sessions);
    const targetList = users.getTodoLists(username).getListByID(listid);
    targetList.addItem(itemcontent);
    writeToFile(res, users.getAllUsers(), USERS_DATA_PATH, fs);
  };

const createDeleteListHandler = (users, sessions, fs) =>
  function(req, res, next) {
    const listid = +req.body.listid;
    const username = getUsername(req.cookies.sessionId, sessions);
    users.getTodoLists(username).deleteListByID(listid);
    writeToFile(res, users.getAllUsers(), USERS_DATA_PATH, fs);
  };

const createDeleteItemHandler = (users, sessions, fs) =>
  function(req, res, next) {
    const { listid, itemid } = req.body;
    const username = getUsername(req.cookies.sessionId, sessions);
    users
      .getTodoLists(username)
      .getListByID(listid)
      .deleteItem(itemid);
    writeToFile(res, users.getAllUsers(), USERS_DATA_PATH, fs);
  };

const createEditItemFormServer = (FILES_CACHE, sessions, users) =>
  function(req, res, next) {
    const { listid, itemid } = req.body;
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
    const { itemid, listid, itemcontent } = req.body;
    const username = getUsername(req.cookies.sessionId, sessions);
    users
      .getTodoLists(username)
      .getListByID(listid)
      .getItemById(itemid)
      .setContent(itemcontent);

    writeToFile(res, users.getAllUsers(), USERS_DATA_PATH, fs);
  };

const createEditListHandler = (FILES_CACHE, sessions, users) =>
  function(req, res, next) {
    const { listid } = req.body;
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
    const { listid, listtitle, listdescription } = req.body;
    const username = getUsername(req.cookies.sessionId, sessions);
    const targetList = users.getTodoLists(username).getListByID(listid);
    targetList.setTitle(listtitle);
    targetList.setDescription(listdescription);
    writeToFile(res, users.getAllUsers(), USERS_DATA_PATH, fs);
  };

const createStatusToggler = (users, sessions, fs) =>
  function(req, res, next) {
    const { listid, itemid } = req.body;
    const username = getUsername(req.cookies.sessionId, sessions);
    users
      .getTodoLists(username)
      .getListByID(listid)
      .getItemById(itemid)
      .toggleStatus();

    writeToFile(res, users.getAllUsers(), USERS_DATA_PATH, fs);
  };

const createToDoListsJSONServer = (users, sessions) =>
  function(req, res, next) {
    const username = getUsername(req.cookies.sessionId, sessions);
    const todosJSON = JSON.stringify(users.getTodoLists(username));
    res.send(200, todosJSON, resolveMIMEType('json'));
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

const createSessionValidator = (
  sessions,
  restrictedUrlsIfLoggedIn,
  restrictedUrlsIfNotLoggedIn
) =>
  function(req, res, next) {
    const { sessionId } = req.cookies;
    if (restrictedUrlsIfLoggedIn.includes(req.url)) {
      if (isUserLoggedIn(sessionId, sessions)) {
        res.redirect('/dashboard.html');
        return;
      }
    }
    if (restrictedUrlsIfNotLoggedIn.includes(req.url)) {
      if (!isUserLoggedIn(sessionId, sessions)) {
        res.redirect('/');
        return;
      }
    }
    next();
  };

const createLoginHandler = (sessions, users, fs) =>
  function(req, res, next) {
    const { username, password } = req.body;
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
    const expiryDate = new Date(Date.now()).toGMTString();
    res.setHeader('Set-Cookie', `sessionId=deleted; expires=${expiryDate}`);
    writeToFile(res, sessions, SESSIONS_DATA_PATH, fs);
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
