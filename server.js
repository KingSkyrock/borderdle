import path from "path";
import countries from "./data/borders.json" assert { type: "json" };
import compression from "compression";
import bodyParser from "body-parser";
import schedule from "node-schedule";
import fs from "node:fs/promises";
import express from "express";

let country = null;
newCountry();

const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 5173;
const base = process.env.BASE || "/";
const currentModuleURL = new URL(import.meta.url);
const DIST_DIR = path.join(path.dirname(currentModuleURL.pathname), "../dist");
const HTML_FILE = path.join(DIST_DIR, "index.html");

const templateHtml = isProduction
  ? await fs.readFile("./dist/client/index.html", "utf-8")
  : "";

const ssrManifest = isProduction
  ? await fs.readFile("./dist/client/.vite/ssr-manifest.json", "utf-8")
  : undefined;

const app = express();

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
  const compression = (await import("compression")).default;
  app.use(compression());
}

app.use(compression());
app.use(express.static(DIST_DIR));

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
    const url = req.originalUrl.replace(base, "");

    let template;
    let render;
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile("./index.html", "utf-8");
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule("/src/entry-server.jsx")).render;
    } else {
      template = templateHtml;
      render = (await import("./dist/server/entry-server.js")).render;
    }

    const rendered = await render(url, ssrManifest);

    const html = template
      .replace(`<!--app-head-->`, rendered.head ?? "")
      .replace(`<!--app-html-->`, rendered.html ?? "");

    res.status(200).set({ "Content-Type": "text/html" }).end(html);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
});

function randomCountry() {
  let randomCountry =
    countries[Math.floor(Math.random() * (countries.length - 1))].name;
  console.log(randomCountry);
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

  fs.readFile("./data/data.json", (err, data) => {
    if (err) throw err;
    data = JSON.parse(data);
    data.num += 1;
    console.log("Bordle #" + data.num);
    fs.writeFile("./data/data.json", JSON.stringify(data));
  });
}

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
