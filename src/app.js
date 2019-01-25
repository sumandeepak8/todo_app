const Sheeghra = require('./sheeghra');
const fs = require('fs');
const {
  logRequest,
  createFileServer,
  createDashboardServer,
  initializeServerCache,
  loadToDoLists,
  createAddListHandler,
  readPostBody
} = require('./handlers');
const app = new Sheeghra();

const FILES_CACHE = initializeServerCache(fs);
const todoLists = loadToDoLists(FILES_CACHE);
const serveFile = createFileServer(FILES_CACHE);
const serveDashboard = createDashboardServer(FILES_CACHE, todoLists);
const addList = createAddListHandler(FILES_CACHE, todoLists, fs);

app.use(logRequest);
app.use(readPostBody);
app.get('/', serveDashboard);
app.get('/index.html', serveDashboard);
app.post('/addlist', addList);
app.use(serveFile);

module.exports = app.handleRequest.bind(app);
