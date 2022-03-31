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
  var svg = "<svg ref={this.svg} className='pb-1' xmlns='http://www.w3.org/2000/svg' version='1.0' width='208px' height='208px' viewBox='0 0 1024.000000 1024.000000'><g id='border' transform='translate(0.000000,1024.000000) scale(0.100000,-0.100000)' fill='none' stroke='#1e293b' strokeWidth='100px'>";
  var rwanda = "<svg ref={this.svg} className='pb-1' xmlns='http://www.w3.org/2000/svg' version='1.0' width='208px' height='208px' viewBox='0 0 350.000000 308.000000'><g id='border' fill='none' stroke='#1e293b' strokeWidth='3px'>";
  var timor = "<svg ref={this.svg} className='pb-1' xmlns='http://www.w3.org/2000/svg' version='1.0' width='208px' height='208px' viewBox='0 0 1024.000000 1024.000000'><g id='border' fill='none' stroke='#1e293b' strokeWidth='10px'>";
  var austria = "<svg ref={this.svg} className='pb-1' xmlns='http://www.w3.org/2000/svg' version='1.0' width='208px' height='208px' viewBox='0 0 1980.000000 1013.000000'><g id='border' fill='none' stroke='#1e293b' strokeWidth='19px'>"
  var malaysia = "<svg ref={this.svg} class='pb-1' xmlns='http://www.w3.org/2000/svg' version='1.0' width='416px' height='208px' viewBox='0 0 1024.000000 1024.000000' transform='scale(2, 2)'><g id='border' fill='none' stroke='#1e293b' strokeWidth='5px'>"
  var serbia = "<svg ref={this.svg} class='pb-1' xmlns='http://www.w3.org/2000/svg' version='1.0' width='208px' height='208px' viewBox='0 0 1024.000000 1024.000000'><g id='border' fill='none' stroke='#1e293b' strokeWidth='9px'>"
  var indonesia = "<svg ref={this.svg} class='pb-1' xmlns='http://www.w3.org/2000/svg' version='1.0' width='416px' height='208px' viewBox='0 0 1280.000000 1280.000000' transform='scale(2, 2)'><g id='border' fill='none' stroke='#1e293b' strokeWidth='5px'>"
  var cameroon = "<svg ref={this.svg} className='pb-1' xmlns='http://www.w3.org/2000/svg' version='1.0' width='208px' height='208px' viewBox='0 0 1280.000000 1280.000000'><g id='border' fill='none' stroke='#1e293b' strokeWidth='11px'>";
  var bahamas = "<svg ref={this.svg} className='pb-1' xmlns='http://www.w3.org/2000/svg' version='1.0' width='208px' height='208px' viewBox='0 0 1024.000000 1024.000000'><g id='border' fill='none' stroke='#1e293b' strokeWidth='6px'>";

  if (country.toLowerCase() == "rwanda") {
    svg = rwanda;
  } else if (country.toLowerCase() == "timor-leste") {
    svg = timor;
  } else if (country.toLowerCase() == "austria") {
    svg = austria;
  } else if (country.toLowerCase() == "malaysia") {
    svg = malaysia;
  } else if (country.toLowerCase() == "serbia") {
    svg = serbia;
  } else if (country.toLowerCase() == "indonesia") {
    svg = indonesia;
  } else if (country.toLowerCase() == "cameroon") {
    svg = cameroon;
  } else if (country.toLowerCase() == "bahamas") {
    svg = bahamas;
  }

  res.send(JSON.stringify({
    paths: svg+paths[country.toLowerCase()]
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
  console.log(randomCountry)
  return randomCountry;
}

app.listen(port, function () {
 console.log('App listening on port: ' + port);
});
