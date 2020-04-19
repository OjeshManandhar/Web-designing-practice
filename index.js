const fs = require('fs');
const url = require('url');
const http = require('http');
const path = require('path');

const homeDirPath = __dirname + '/home/';
const projectDirPath = __dirname + '/projects/';

const projectFolder = {
  clubSite: 'Club Site',
  colorGame: 'Color Game',
  amazingAlaska: 'Amazing Alaska'
};

const fileFolder = {
  html: 'html/',
  css: 'css/',
  js: 'js/',
  png: 'images/',
  jpg: 'images/',
  jpeg: 'images/',
  ico: 'images/',
  webp: 'images/'
};

const mime = {
  txt: 'text/plain',
  html: 'text/html',
  css: 'text/css',
  js: 'text/javascript',
  gif: 'image/gif',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  svg: 'image/svg+xml',
  ico: 'image/x-icon',
  webp: 'image/webp'
};

const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url);

  const basename = path.basename(reqUrl.pathname);
  const extname = path.extname(reqUrl.pathname);
  const fileType = extname.slice(1);

  console.log('pathname:', reqUrl.pathname);
  console.log('dirname:', path.dirname(reqUrl.pathname));
  console.log('basename:', basename);
  console.log('extname:', extname);
  console.log('fileType:', fileType);

  if (req.url === '/') {
    fs.readFile(
      path.normalize(homeDirPath + fileFolder.html + 'index.html'),
      (err, data) => {
        res.writeHead(200, { 'Content-Type': mime.html });
        res.write(data);
        res.end();
      }
    );
  } else {
    fs.readFile(
      path.normalize(homeDirPath + fileFolder[fileType] + basename),
      (err, data) => {
        res.writeHead(200, { 'Content-Type': mime[fileType] });
        res.write(data);
        res.end();
      }
    );
  }

  console.log('-----------------------------------');
});

server.listen(8000);
