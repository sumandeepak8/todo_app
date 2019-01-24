const Sheeghra = require('./sheeghra');
const { logRequest, serveFile } = require('./handlers');
const app = new Sheeghra();

app.use(logRequest);
app.use(serveFile);

module.exports = app.handleRequest.bind(app);
