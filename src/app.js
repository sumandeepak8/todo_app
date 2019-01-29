const Sheeghra = require('./sheeghra');
const fs = require('fs');
const {
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
  createSaveListHandler,
  createStatusToggler,
  createMarkAsUndoneHandler
} = require('./handlers');
const app = new Sheeghra();

const FILES_CACHE = initializeServerCache(fs);
const todoLists = loadToDoLists(FILES_CACHE);
const serveFile = createFileServer(FILES_CACHE);
const serveDashboard = createDashboardServer(FILES_CACHE, todoLists);
const addList = createAddListHandler(todoLists, fs);
const serveAddItemsForm = createAddItemsFormServer(FILES_CACHE);
const saveItems = createAddItemsHandler(todoLists, fs);
const deleteList = createDeleteListHandler(todoLists, fs);
const deleteItem = createDeleteItemHandler(todoLists, fs);
const serveEditItemForm = createEditItemFormServer(FILES_CACHE, todoLists);
const saveEditedItem = createSaveItemHandler(todoLists, fs);
const editlist = createEditListHandler(FILES_CACHE, todoLists);
const saveList = createSaveListHandler(todoLists, fs);
const toggleStatus = createStatusToggler(todoLists, fs);

app.use(logRequest);
app.use(readPostBody);
app.get('/', serveDashboard);
app.get('/index.html', serveDashboard);
app.post('/addlist', addList);
app.get(/^\/additems/, serveAddItemsForm);
app.post('/additems', saveItems);
app.post('/deletelist', deleteList);
app.post('/deleteitem', deleteItem);
app.post('/edititem', serveEditItemForm);
app.post('/saveitem', saveEditedItem);
app.post('/editlist', editlist);
app.post('/savelist', saveList);
app.post('/togglestatus', toggleStatus);
app.use(serveFile);

module.exports = app.handleRequest.bind(app);
