import path from "path";
import countries from "./data/borders.json" assert { type: "json" };
import compression from "compression";
import bodyParser from "body-parser";
import schedule from "node-schedule";
import fs from "node:fs/promises";
import fscb from "fs"
import express from "express";
import { fileURLToPath } from 'url';

const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 5173;
const base = process.env.BASE || "/";
const DIST_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'dist/client');

const app = express();

let country = null;
newCountry();

let vite;
if (!isProduction) {
  const { createServer } = await import("vite");
  vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
    base,
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(DIST_DIR, { index: false }));
}

app.use(compression());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());

const rule = new schedule.RecurrenceRule();
rule.hour = 0;
rule.minute = 0;
rule.tz = "Etc/UTC";

const daily = schedule.scheduleJob(rule, function () {
  newCountry();
});

app.get("*.js", function (req, res, next) {
  req.url = req.url + ".gz";
  res.set("Content-Encoding", "gzip");
  next();
});

app.post("/getAnswer", (req, res) => {
  res.send(
    JSON.stringify({
      country: country,
    })
  );
  res.end();
});

app.use("*", async (req, res) => {
  try {
    if (isProduction) {
      const template = await fs.readFile('./dist/client/index.html', 'utf-8');
      const { render } = await import('./dist/server/entry-server.js');
  
      const html = template.replace(`<!--outlet-->`, render);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } else {
      const url = req.originalUrl;
      const template = await vite.transformIndexHtml(url, await fs.readFile('index.html', 'utf-8'));
      const { render } = await vite.ssrLoadModule('/src/entry-server.jsx');
  
      const html = template.replace(`<!--outlet-->`, render);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    }
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
});

function randomCountry() {
  let randomCountry =
    countries[Math.floor(Math.random() * (countries.length - 1))].name;
  while ( //broken countries
    randomCountry == "Micronesia" ||
    randomCountry == "Tuvalu" ||
    randomCountry == "Palestine" ||
    randomCountry == "Marshall Islands"
  ) {
    randomCountry =
      countries[Math.floor(Math.random() * (countries.length - 1))].name;
  }
  return randomCountry;
}

function newCountry() {
  if (country != null) {
    let lastCountry = country;
    while (country == lastCountry) {
      country = randomCountry();
    }
  } else {
    country = randomCountry();
  }
  if (isProduction) {
    fscb.readFile("./data/data.json", (err, data) => {
      if (err) throw err;
      data = JSON.parse(data);
      data.num += 1;
      fs.writeFile("./data/data.json", JSON.stringify(data));
    });
  }
}

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
