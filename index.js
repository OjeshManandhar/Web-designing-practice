const fs = require('fs');
const url = require('url');
const http = require('http');
const path = require('path');

const homeDirPath = __dirname + '/home/';
const projectDirPath = __dirname + '/projects/';

const projectFolder = {
  clubSite: 'Club_Site/',
  colorGame: 'Color_Game/',
  amazingAlaska: 'Amazing_Alaska/'
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

function serveIndexHTML(basePath, res) {
  console.log(
    'serveIndexHTML:',
    path.normalize(basePath + fileFolder.html + 'index.html')
  );

  fs.readFile(
    path.normalize(basePath + fileFolder.html + 'index.html'),
    (err, data) => {
      if (err) {
        console.log('ERROR:', err);
        return res.end();
      }
      res.writeHead(200, { 'Content-Type': mime.html });
      res.write(data);
      res.end();
    }
  );
}

function serveFile(filePath, fileType, res) {
  console.log('serveFile:', path.normalize(filePath));

  fs.readFile(path.normalize(filePath), (err, data) => {
    if (err) {
      console.log('ERROR:', err);
      return res.end();
    }
    res.writeHead(200, { 'Content-Type': mime[fileType] });
    res.write(data);
    res.end();
  });
}

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
    serveIndexHTML(homeDirPath, res);
  } else if (reqUrl.pathname === '/favicon.ico') {
    serveFile(
      path.normalize(homeDirPath + fileFolder[fileType] + basename),
      fileType,
      res
    );
  } else if (reqUrl.pathname.indexOf('/project') === 0) {
    const pathList = reqUrl.pathname.split('/');
    pathList.shift(); // Remove first '' element

    if (pathList.length === 2) {
      //index page requested
      serveIndexHTML(
        path.normalize(projectDirPath + projectFolder[pathList[1]]),
        res
      );
    } else {
      const filePath = [];
      for (let i = 2; i < pathList.length; i++) {
        filePath.push(decodeURIComponent(pathList[i]));
      }

      serveFile(
        path.normalize(
          projectDirPath + projectFolder[pathList[1]] + filePath.join('/')
        ),
        fileType,
        res
      );
    }
  } else {
    const pathList = reqUrl.pathname.split('/');
    pathList.shift(); // Remove first '' element

    const filePath = pathList.map((e) => {
      return decodeURIComponent(e);
    });

    serveFile(path.normalize(homeDirPath + filePath.join('/')), fileType, res);
  }

  console.log('-----------------------------------');
});

server.listen(8000);
