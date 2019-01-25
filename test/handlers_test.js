const expect = require('chai').expect;
const { serveFile, serveDashboard, loadToDoLists } = require('../src/handlers');

const FILES_CACHE = {
  dashboard: `<body>
  <h1>TODO Lists</h1>
  <div>____TODO_LISTS____</div>
</body>`,
  todoListsJSON: `{"lists":[{
    "id": 1,
    "title": "Sports",
    "description": "About sports",
    "items": [
      { "id": 1, "content": "Play game", "done": false },
      { "id": 2, "content": "2", "done": false }
    ]
  }]
}`
};

describe('serveFile', function() {
  it('should respond with 404 error and `Resource Not Found` message', function() {
    const send = function(res, statusCode, content, contentType) {
      expect(statusCode).to.equal(404);
      expect(contentType).to.equal('text/plain');
      expect(content).to.equal('Resource Not Found');
    };

    const res = {};
    const req = { method: 'GET', url: '/something' };
    const next = () => {};
    serveFile(FILES_CACHE)(req, res, next, send);
  });
});

describe('serveDashBoard', function() {
  it('should respond with list of todo lists', function() {
    const send = function(res, statusCode, content, contentType) {
      expect(statusCode).to.equal(200);
      expect(contentType).to.equal('text/html');
      expect(content).to.contain('TODO Lists');
    };

    const todoLists = loadToDoLists(FILES_CACHE);
    const res = {};
    const req = { method: 'GET', url: '/' };
    const next = () => {};
    serveDashboard(FILES_CACHE, todoLists)(req, res, next, send);
  });
});
