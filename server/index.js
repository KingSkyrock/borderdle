const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, '../dist');
const HTML_FILE = path.join(DIST_DIR, 'index.html');
const mockResponse = {
  far: 'boo',
  boo: 'far'
};
app.use(express.static(DIST_DIR));
app.get('/api', (req, res) => {
  res.send(mockResponse);
});
app.get('*', (req, res) => {
 res.sendFile(HTML_FILE);
});
app.listen(port, function () {
 console.log('App listening on port: ' + port);
});
