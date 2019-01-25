const Sheeghra = require('./sheeghra');
const fs = require('fs');
const {
  logRequest,
  createFileServer,
  createDashboardServer,
  initializeServerCache,
  loadToDoLists
} = require('./handlers');
const app = new Sheeghra();

const FILES_CACHE = initializeServerCache(fs);
const todoLists = loadToDoLists(FILES_CACHE);
const serveFile = createFileServer(FILES_CACHE);
const serveDashboard = createDashboardServer(FILES_CACHE, todoLists);

app.use(logRequest);
app.get('/', serveDashboard);
app.get('/index.html', serveDashboard);
app.use(serveFile);

module.exports = app.handleRequest.bind(app);
