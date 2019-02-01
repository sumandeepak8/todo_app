const expect = require('chai').expect;
const {
  createFileServer,
  createDashboardServer,
  loadUsers,
  initializeServerCache,
  createAddListHandler
} = require('../src/handlers');

const Todos = require('../src/entities/todos');

const FILES_CACHE = {
  dashboard: `<body>
  <h1>TODO Lists</h1>
  <div>____TODO_LISTS____</div>
</body>`,
  todosJSON: `{"lists":[{
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

xdescribe('serveFile', function() {
  it('should respond with 404 error and `Resource Not Found` message', function() {
    const res = {};
    res.send = function(statusCode, content, contentType) {
      expect(statusCode).to.equal(404);
      expect(contentType).to.equal('text/plain');
      expect(content).to.equal('Resource Not Found');
    };
    const req = { method: 'GET', url: '/something' };
    const next = () => {};
    createFileServer(FILES_CACHE)(req, res, next);
  });

  it('should respond with 200 status code and contentType text/html', function() {
    const res = {};
    res.send = function(statusCode, content, contentType) {
      expect(statusCode).to.equal(200);
      expect(contentType).to.equal('text/html');
      expect(content).to.equal('this is some page');
    };
    const req = { method: 'GET', url: '/somepage' };
    const next = () => {};
    createFileServer(FILES_CACHE)(req, res, next);
  });
});

xdescribe('serveDashBoard', function() {
  it('should respond with list of todo lists', function() {
    const todos = loadUsers(FILES_CACHE);
    const res = {};
    res.send = function(statusCode, content, contentType) {
      expect(statusCode).to.equal(200);
      expect(contentType).to.equal('text/html');
      expect(content).to.contain('TODO Lists');
    };
    const req = { method: 'GET', url: '/' };
    const next = () => {};
    createDashboardServer(FILES_CACHE, todos)(req, res, next);
  });
});

xdescribe('initializeServerCache', function() {
  const files = {
    './public/index.html': 'This is index.html',
    './data/todo_lists.json': 'this is todo_lists.json file',
    './public/add_todo_list.html': 'this is add_todo_list.html'
  };

  const fs = {
    readFileSync: function(filePath, encoding) {
      return files[filePath];
    }
  };

  it('should return file cache for specified files', function() {
    const fileCache = initializeServerCache(fs);

    expect(fileCache)
      .to.have.property('dashboard')
      .to.equal('This is index.html');

    expect(fileCache)
      .to.have.property('todosJSON')
      .to.equal('this is todo_lists.json file');

    expect(fileCache)
      .to.have.property('/add_todo_list.html')
      .to.equal('this is add_todo_list.html');
  });
});

xdescribe('createAddListHandler', function() {
  const fs = {
    writeFile: function(filePath, content, callback) {
      let err = null;
      const illegalFileContent = `{"lists":[{"id":1,"title":"illegal_title","description":"illegal_description","items":[],"latestItemID":0}],"latestListID":1}`;

      if (content == illegalFileContent) {
        err = 'some error';
      }
      callback(err);
    }
  };

  it('should add a list in current todos and in file and then should redirect to /', function() {
    const lists = [
      {
        id: 1,
        title: 'll',
        description: 'll',
        items: [],
        latestItemID: 0
      },
      {
        id: 2,
        title: 'oo',
        description: 'oo',
        items: [],
        latestItemID: 0
      }
    ];
    const latestListID = 0;
    const todos = Todos.parse({ lists, latestListID });

    const res = {};
    res.redirect = function(location) {
      expect(location).to.equal('/');
    };

    const req = {
      method: 'POST',
      url: '/addlist',
      body: 'title=new+todo&description=this+is+description'
    };
    const next = () => {};
    createAddListHandler(todos, fs)(req, res, next);
  });

  it('should respond with 500 status code when error occurs in writing todos to file', function() {
    const lists = [];
    const latestListID = 0;
    const todos = Todos.parse({ lists, latestListID });

    const res = {};
    res.send = function(statusCode, content, contentType) {
      expect(statusCode).to.equal(500);
      expect(content).to.equal('Internal Server Error');
    };

    const req = {
      method: 'POST',
      url: '/addlist',
      body: 'title=illegal_title&description=illegal_description'
    };
    const next = () => {};
    createAddListHandler(todos, fs)(req, res, next);
  });
});
