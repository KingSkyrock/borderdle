const express = require('express');
const path = require('path');

const countries = require('../data/borders.json');

const app = express();
const compression = require('compression')
const port = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, '../dist');
const HTML_FILE = path.join(DIST_DIR, 'index.html');
const bodyParser = require('body-parser');
const schedule = require('node-schedule');
var fs = require('file-system');

var country = null;
newCountry();

app.use(compression())
app.use(express.static(DIST_DIR));

app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(bodyParser.json())

const rule = new schedule.RecurrenceRule();
rule.hour = 0;
rule.minute = 0;
rule.tz = 'Etc/UTC';

/*
const job = schedule.scheduleJob('1 * * * * *', function () { // every minute for testing
  newCountry();
});
*/
const daily = schedule.scheduleJob(rule, function () {
  newCountry();
});

app.get('*.js', function (req, res, next) {
  req.url = req.url + '.gz';
  res.set('Content-Encoding', 'gzip');
  next();
});

app.get('/amogus', (req, res) => {
  res.send("AMOGUS");
});

app.post('/getAnswer', (req, res) => {
  res.send(JSON.stringify({
    country: country
  }));
  res.end();
});

app.get('*', (req, res) => {
 res.sendFile(HTML_FILE);
});

function randomCountry() {
  var randomCountry = countries[Math.floor(Math.random()*(countries.length-1))].name;
  console.log(randomCountry)
  while (randomCountry == "Micronesia" || randomCountry == "Tuvalu" || randomCountry == "Palestine" || randomCountry == "Marshall Islands") {
    randomCountry = countries[Math.floor(Math.random() * (countries.length - 1))].name;
  }
  return randomCountry;
}

function newCountry() {
  if (country != null) {
    lastCountry = country;
    while (country == lastCountry) {
      country = randomCountry();
    }
  } else {
    country = randomCountry();
  }

  fs.readFile('./data/data.json', (err, data) => {
    if (err) throw err;
    data = JSON.parse(data);
    data.num += 1;
    console.log("Borderdle #" + (data.num));
    fs.writeFile('./data/data.json', JSON.stringify(data));
  });

  
  
  
}

app.listen(port, function () {
 console.log('App listening on port: ' + port);
});