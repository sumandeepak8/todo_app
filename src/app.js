const Sheeghra = require('./sheeghra');
const fs = require('fs');
const {
  logRequest,
  createFileServer,
  createHomepageServer,
  initializeServerCache,
  loadToDoLists,
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
  createToDoListsJSONServer
} = require('./handlers');
const app = new Sheeghra();

const FILES_CACHE = initializeServerCache(fs);
const todoLists = loadToDoLists(FILES_CACHE);
const serveFile = createFileServer(FILES_CACHE);
const serveHomepage = createHomepageServer(FILES_CACHE);
const addList = createAddListHandler(todoLists, fs);
const addItem = createAddItemHandler(todoLists, fs);
const deleteList = createDeleteListHandler(todoLists, fs);
const deleteItem = createDeleteItemHandler(todoLists, fs);
const serveEditItemForm = createEditItemFormServer(FILES_CACHE, todoLists);
const saveEditedItem = createSaveItemHandler(todoLists, fs);
const editlist = createEditListHandler(FILES_CACHE, todoLists);
const saveList = createSaveListHandler(todoLists, fs);
const toggleStatus = createStatusToggler(todoLists, fs);
const serveToDoListsJSON = createToDoListsJSONServer(todoLists);

app.use(logRequest);
app.use(readPostBody);
app.get('/', serveHomepage);
app.get('/todolists', serveToDoListsJSON);
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
