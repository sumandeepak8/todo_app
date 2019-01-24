const isMatching = (req, route) => {
  if (route.method && req.method != route.method) return false;
  if (route.url && req.url != route.url) return false;
  return true;
};

const send = function(res, statusCode, content, contentType) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', contentType);
  res.write(content);
  res.end();
};

class Sheeghra {
  constructor() {
    this.routes = [];
  }

  use(handler) {
    this.routes.push({ handler });
  }

  get(url, handler) {
    this.routes.push({ method: 'GET', url, handler });
  }

  post(url, handler) {
    this.routes.push({ method: 'POST', url, handler });
  }

  handleRequest(req, res) {
    let matchingRoutes = this.routes.filter(r => isMatching(req, r));
    let remaining = [...matchingRoutes];
    let next = () => {
      let current = remaining[0];
      if (!current) return;
      remaining = remaining.slice(1);
      current.handler(req, res, next, send);
    };
    next();
  }
}

module.exports = Sheeghra;
