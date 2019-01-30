const Sheeghra = require('./sheeghra');
const fs = require('fs');
const {
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
  createLoginHandler
} = require('./handlers');
const app = new Sheeghra();

const FILES_CACHE = initializeServerCache(fs);
const users = loadUsers(FILES_CACHE);
const sessions = loadSessions(FILES_CACHE);
const serveFile = createFileServer(FILES_CACHE);
const serveHomepage = createHomepageServer(FILES_CACHE);
const addList = createAddListHandler(users, sessions, fs);
const addItem = createAddItemHandler(users, sessions, fs);
const deleteList = createDeleteListHandler(users, sessions, fs);
const deleteItem = createDeleteItemHandler(users, sessions, fs);
const serveEditItemForm = createEditItemFormServer(FILES_CACHE, sessions, users);
const saveEditedItem = createSaveItemHandler(users, sessions, fs);
const editlist = createEditListHandler(FILES_CACHE, sessions, users);
const saveList = createSaveListHandler(users, sessions, fs);
const toggleStatus = createStatusToggler(users, sessions, fs);
const serveToDoListsJSON = createToDoListsJSONServer(users, sessions);
const validateSession = createSessionValidator(sessions);
const handleLogin = createLoginHandler(sessions, users, fs);

app.use(logRequest);
app.use(readPostBody);
app.use(readCookies);
app.use(validateSession);
app.get('/', serveHomepage);
app.get('/todolists', serveToDoListsJSON);
app.post('/login', handleLogin);
app.post('/addlist', addList);
app.post('/additem', addItem);
app.post('/deletelist', deleteList);
app.post('/deleteitem', deleteItem);
app.post('/edititem', serveEditItemForm);
app.post('/saveediteditem', saveEditedItem);
app.post('/editlist', editlist);
app.post('/saveeditedlist', saveList);
app.post('/togglestatus', toggleStatus);
app.use(serveFile);

module.exports = app.handleRequest.bind(app);
