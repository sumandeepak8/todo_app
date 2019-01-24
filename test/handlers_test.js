const expect = require('chai').expect;
const { serveFile } = require('../src/handlers');

describe('serveFile', function() {
  it('should serve home page when request for "/" comes', function() {
    const send = function(res, statusCode, content, contentType) {
      expect(statusCode).to.equal(200);
      expect(contentType).to.equal('text/html');
    };

    const res = {};
    const req = { method: 'GET', url: '/' };
    const next = () => {};
    serveFile(req, res, next, send);
  });

  it('should serve home page when request for "/index.html" comes', function() {
    const send = function(res, statusCode, content, contentType) {
      expect(statusCode).to.equal(200);
      expect(contentType).to.equal('text/html');
    };

    const res = {};
    const req = { method: 'GET', url: '/index.html' };
    const next = () => {};
    serveFile(req, res, next, send);
  });

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
