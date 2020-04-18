const http = require('http');

const server = http.createServer((req, res) => {
  console.log('url:', req.url);
});

server.listen(3000);
