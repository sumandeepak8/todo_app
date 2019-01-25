const expect = require('chai').expect;
const {
  createFileServer,
  createDashboardServer,
  loadToDoLists,
  initializeServerCache
} = require('../src/handlers');

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
}`,
  '/somepage': 'this is some page'
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
    createFileServer(FILES_CACHE)(req, res, next, send);
  });

  it('should respond with 200 status code and contentType text/html', function() {
    const send = function(res, statusCode, content, contentType) {
      expect(statusCode).to.equal(200);
      expect(contentType).to.equal('text/html');
      expect(content).to.equal('this is some page');
    };

    const res = {};
    const req = { method: 'GET', url: '/somepage' };
    const next = () => {};
    createFileServer(FILES_CACHE)(req, res, next, send);
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
    createDashboardServer(FILES_CACHE, todoLists)(req, res, next, send);
  });
});

describe('initializeServerCache', function() {
  const files = {
    './public/index.html': 'This is index.html',
    'data/todo_lists.json': 'this is todo_lists.json file'
  };

  const fs = {
    readFileSync: function(filePath, encoding) {
      return files[filePath];
    }
  };

  it('should return file cache of two files, dashboard file and todoListsJSON', function() {
    const fileCache = initializeServerCache(fs);
    expect(fileCache)
      .to.have.property('dashboard')
      .to.equal('This is index.html');

    expect(fileCache)
      .to.have.property('todoListsJSON')
      .to.equal('this is todo_lists.json file');
  });
});
