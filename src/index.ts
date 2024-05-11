import fs from "fs";
import path from "path";
import ky from "ky";

import { parse } from "yaml";
import { XMLParser } from "fast-xml-parser";

const MAX_REQUESTS_PER_MINUTE = 50;
const xmlParser = new XMLParser();

const sleep = () => new Promise((r) => setTimeout(r, (60 * 1000) / MAX_REQUESTS_PER_MINUTE));

const getConfigs = async () =>
  new Promise<string[]>((resolve) => {
    const directoryPath = path.join(__dirname, "../config");

    const configs: string[] = [];

    fs.readdir(directoryPath, { withFileTypes: true }, (err, files) => {
      files.forEach((file) => {
        if (file.isFile() && path.extname(file.name) === ".yaml") {
          configs.push(path.join("../config", file.name));
        }
      });

      return resolve(configs);
    });
  });

const chunkArray = <T>(array: T[], chunkSize: number = 1000): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

const getUrlChunksFromSitemap = async (sitemapUrl) => {
  const res = await ky.get(sitemapUrl);
  const xml = await res.text();
  const parsedSitemap = xmlParser.parse(xml);
  const urls = parsedSitemap?.urlset?.url;

  if (Array.isArray(urls)) {
    const urlChunks = chunkArray(
      urls.map(({ loc }) => loc),
      1000,
    );

    return urlChunks;
  }
};

const indexSite = async (config) => {
  config.sitemaps.forEach(async (sitemapUrl) => {
    const urlChunks = await getUrlChunksFromSitemap(sitemapUrl);

    if (Array.isArray(urlChunks)) {
      for (let i = 0; i < urlChunks.length; i++) {
        const chunk = urlChunks[i];

        try {
          const res = await ky.post(`https://api.indexnow.org/indexnow`, {
            json: {
              host: config.host,
              key: config.api_key,
              urlList: chunk,
            },
          });

          if (res.status > 200 && res.status < 300) {
            console.log(chunk.map((url) => `✅ Successfully submitted ${url}`).join("\n"));
          }

          await sleep();
        } catch (e) {
          console.log(e);
        }
      }
    }
  });
};

const run = async () => {
  const configs = await getConfigs();

  configs.forEach(async (configPath) => {
    const config = parse(fs.readFileSync(path.join(__dirname, configPath), "utf8"));

    await indexSite(config);
  });
};

run();
