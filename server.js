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
const DIST_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'dist');

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

app.post("/getNum", (req, res) => {
  if (true) {
    fscb.readFile("./data/data.json", (err, data) => {
      if (err) {
        fs.writeFile("./data/data.json", `{"num":1}`);
        res.send(
          JSON.stringify({
            num: 1
          })
        );
        res.end();
      } else {
        data = JSON.parse(data);
        res.send(
          JSON.stringify({
            num: data.num
          })
        );
        res.end();
      }
    });
  } else {
    res.send(
      JSON.stringify({
        num: "DEV"
      })
    );
    res.end();
  }
})

app.use("*", async (req, res) => {
  try {
    if (isProduction) {
      const html = await fs.readFile('./dist/index.html', 'utf-8');  
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } else {
      const html = await vite.transformIndexHtml(req.originalUrl, await fs.readFile('index.html', 'utf-8'));
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
  if (true) {
    fscb.readFile("./data/data.json", (err, data) => {
      if (err) {
        fs.writeFile("./data/data.json", `{"num":1}`);
      } else {
        data = JSON.parse(data);
      data.num += 1;
      fs.writeFile("./data/data.json", JSON.stringify(data));
      }
    });
  }
}

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
