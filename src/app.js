const Sheeghra = require('./sheeghra');
const fs = require('fs');
const {
  logRequest,
  serveFile,
  serveDashboard,
  initializeServerCache
} = require('./handlers');
const app = new Sheeghra();

initializeServerCache(fs);

app.use(logRequest);
app.get('/', serveDashboard);
app.get('/index.html', serveDashboard);
app.use(serveFile);

module.exports = app.handleRequest.bind(app);
