const express = require('express');
const path = require('path');

const countries = require('../data/borders.json');
const paths = require('../data/paths.json');

const app = express();
const port = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, '../dist');
const HTML_FILE = path.join(DIST_DIR, 'index.html');
const bodyParser = require('body-parser');

var country = randomCountry();

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
    paths: paths[country.toLowerCase()]
  }));
  res.end();
});

app.post('/checkGuess', (req, res) => {
  if (req.body.guess.toLowerCase() == country.toLowerCase()) {
    res.send(JSON.stringify({
      result: "CORRECT"
    }));
    res.end();
  } else {
    var valid = false;
    for (var i = 0; i < countries.length; i++) {
      if (countries[i].name.toLowerCase() == req.body.guess.toLowerCase()) {
        var valid = true;
        break;
      }
    }
    if (valid) {
      res.send(JSON.stringify({
        result: "VALID"
      }));
      res.end();
    } else {
      res.send(JSON.stringify({
        result: "INVALID"
      }));
      res.end();
    }
  }

});

app.get('*', (req, res) => {
 res.sendFile(HTML_FILE);
});

function randomCountry() {
  var randomCountry = countries[Math.floor(Math.random()*(countries.length-1))].name;
  console.log(randomCountry);
  return randomCountry;
}

app.listen(port, function () {
 console.log('App listening on port: ' + port);
});
