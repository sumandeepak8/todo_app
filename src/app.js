const Sheeghra = require('./sheeghra');
const { logRequest, serveFile, serveDashboard } = require('./handlers');
const app = new Sheeghra();

app.use(logRequest);
app.get('/', serveDashboard);
app.get('/index.html', serveDashboard);
app.use(serveFile);

module.exports = app.handleRequest.bind(app);
