const expect = require('chai').expect;
const { serveFile, serveDashboard } = require('../src/handlers');

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
