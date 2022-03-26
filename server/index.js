const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, '../dist');
const HTML_FILE = path.join(DIST_DIR, 'index.html');
const bodyParser = require('body-parser');

app.use(express.static(DIST_DIR));

app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(bodyParser.json())

app.get('/amogus', (req, res) => {
  res.send("AMOGUS");
});

app.post('/getCountryPath', (req, res) => {
  res.send(JSON.stringify({
    paths: [1,2,3,4,5,6,7,8,9,10] //AN ARRAY OF PATHS WOULD GO HERE
  }));
  res.end();
});

app.post('/checkGuess', (req, res) => {
  console.log(req.body.guess)
  res.send(JSON.stringify({
    result: "VALID" //all guesses going to be valid for now
  }));
  res.end();
});

app.get('*', (req, res) => {
 res.sendFile(HTML_FILE);
});

app.listen(port, function () {
 console.log('App listening on port: ' + port);
});
