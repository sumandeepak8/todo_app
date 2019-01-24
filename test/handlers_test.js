const expect = require('chai').expect;
const {
  serveFile,
  serveDashboard,
  initializeServerCache
} = require('../src/handlers');

const files = {
  './public/index.html': 'this will contain TODO Lists',
  'data/todo_lists.json': `{"lists":[{
    "id": 1,
    "title": "Sports",
    "description": "About sports",
    "items": [
      { "id": 1, "content": "Play game", "done": false },
      { "id": 2, "content": "2", "done": false }
    ]
  }]}`
};

const fs = {
  readFileSync: function(filePath, encoding) {
    return files[filePath];
  }
};

initializeServerCache(fs);

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
    serveFile(req, res, next, send);
  });
});

describe('serveDashBoard', function() {
  it('should respond with list of todo lists', function() {
    const send = function(res, statusCode, content, contentType) {
      expect(statusCode).to.equal(200);
      expect(contentType).to.equal('text/html');
      expect(content).to.contain('TODO Lists');
    };

    const res = {};
    const req = { method: 'GET', url: '/' };
    const next = () => {};
    serveDashboard(req, res, next, send);
  });
});
