import fs from "node:fs";
import path from "node:path";

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  if (ext === ".svg") return "image/svg+xml";
  return "application/octet-stream";
}

function dataUrlToBuffer(dataUrl) {
  const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!match) {
    throw new Error("Invalid data URL");
  }

  const mimeType = match[1];
  const base64Data = match[2];
  const extensionMap = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/webp": ".webp",
    "image/gif": ".gif",
  };

  const extension = extensionMap[mimeType];
  if (!extension) {
    throw new Error(`Unsupported image type: ${mimeType}`);
  }

  return {
    buffer: Buffer.from(base64Data, "base64"),
    extension,
  };
}

function sanitizeName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "file";
}

function listImageAssets(dirPath, urlPrefix) {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => {
      const filePath = path.join(dirPath, entry.name);
      return {
        name: entry.name,
        url: `${urlPrefix}/${entry.name}`,
        createdAt: fs.statSync(filePath).mtimeMs,
      };
    })
    .filter((asset) => /\.(png|jpe?g|webp|gif|svg)$/i.test(asset.name))
    .sort((a, b) => b.createdAt - a.createdAt);
}

function ensureStore(root, config) {
  const dataFile = path.resolve(root, config.dataFile);
  const dir = path.dirname(dataFile);
  const emptyStore = {
    products: [],
    blogs: [],
  };

  ensureDir(dir);

  if (!fs.existsSync(dataFile)) {
    writeJson(dataFile, emptyStore);
  }

  const current = readJson(dataFile);
  const isEmpty =
    !current ||
    !Array.isArray(current.products) ||
    !Array.isArray(current.blogs);

  if (isEmpty) {
    writeJson(dataFile, emptyStore);
  }

  return dataFile;
}

function loadConfig(root) {
  const configPath = path.resolve(root, "backend/config.json");
  return readJson(configPath);
}

function sendJson(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
    });
    req.on("end", () => {
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function createHandlers(root) {
  const config = loadConfig(root);
  const dataFile = ensureStore(root, config);
  const apiPrefix = config.apiPrefix.replace(/\/$/, "");
  const uploadsDir = path.resolve(root, config.uploadsDir);
  const uploadsUrlPrefix = config.uploadsUrlPrefix.replace(/\/$/, "");
  const productUploadsDir = path.join(uploadsDir, "products");
  const blogUploadsDir = path.join(uploadsDir, "blogs");

  ensureDir(uploadsDir);
  ensureDir(productUploadsDir);
  ensureDir(blogUploadsDir);

  const readStore = () => readJson(dataFile);
  const writeStore = (store) => writeJson(dataFile, store);

  return async function contentApiMiddleware(req, res, next) {
    const url = new URL(req.url, "http://localhost");
    const pathname = url.pathname;

    if (pathname.startsWith(`${uploadsUrlPrefix}/`)) {
      const relativePath = pathname.slice(uploadsUrlPrefix.length + 1);
      const filePath = path.resolve(uploadsDir, relativePath);

      if (!filePath.startsWith(uploadsDir)) {
        sendJson(res, 403, { message: "Forbidden" });
        return;
      }

      if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
        sendJson(res, 404, { message: "File not found" });
        return;
      }

      res.statusCode = 200;
      res.setHeader("Content-Type", getMimeType(filePath));
      fs.createReadStream(filePath).pipe(res);
      return;
    }

    if (!pathname.startsWith(apiPrefix)) {
      next();
      return;
    }

    try {
      if (pathname === `${apiPrefix}/health` && req.method === "GET") {
        sendJson(res, 200, { ok: true });
        return;
      }

      if (pathname === `${apiPrefix}/bootstrap` && req.method === "GET") {
        const store = readStore();
        sendJson(res, 200, store);
        return;
      }

      if (pathname === `${apiPrefix}/assets` && req.method === "GET") {
        const target = url.searchParams.get("target") === "blogs" ? "blogs" : "products";
        const targetDir = target === "blogs" ? blogUploadsDir : productUploadsDir;
        const targetUrlPrefix = `${uploadsUrlPrefix}/${target}`;
        sendJson(res, 200, listImageAssets(targetDir, targetUrlPrefix));
        return;
      }

      if (pathname === `${apiPrefix}/upload` && req.method === "POST") {
        const payload = await parseBody(req);
        const target = payload?.target === "blogs" ? "blogs" : "products";
        const targetDir = target === "blogs" ? blogUploadsDir : productUploadsDir;
        const filenameBase = sanitizeName(payload?.filename || `${target}-${Date.now()}`);
        const { buffer, extension } = dataUrlToBuffer(payload?.dataUrl || "");
        const finalName = `${Date.now()}-${filenameBase}${extension}`;
        const finalPath = path.join(targetDir, finalName);

        fs.writeFileSync(finalPath, buffer);

        sendJson(res, 201, {
          url: `${uploadsUrlPrefix}/${target}/${finalName}`,
        });
        return;
      }

      for (const resource of ["products", "blogs"]) {
        const resourcePath = `${apiPrefix}/${resource}`;
        if (pathname === resourcePath && req.method === "GET") {
          const store = readStore();
          sendJson(res, 200, store[resource]);
          return;
        }

        if (pathname === resourcePath && req.method === "POST") {
          const payload = await parseBody(req);
          const store = readStore();
          store[resource].push(payload);
          writeStore(store);
          sendJson(res, 201, payload);
          return;
        }

        if (pathname.startsWith(`${resourcePath}/`) && req.method === "PUT") {
          const id = decodeURIComponent(pathname.slice(resourcePath.length + 1));
          const payload = await parseBody(req);
          const store = readStore();
          const index = store[resource].findIndex((item) => item.id === id);
          if (index === -1) {
            sendJson(res, 404, { message: `${resource.slice(0, -1)} not found` });
            return;
          }
          store[resource][index] = payload;
          writeStore(store);
          sendJson(res, 200, payload);
          return;
        }

        if (pathname.startsWith(`${resourcePath}/`) && req.method === "DELETE") {
          const id = decodeURIComponent(pathname.slice(resourcePath.length + 1));
          const store = readStore();
          const nextItems = store[resource].filter((item) => item.id !== id);
          if (nextItems.length === store[resource].length) {
            sendJson(res, 404, { message: `${resource.slice(0, -1)} not found` });
            return;
          }
          store[resource] = nextItems;
          writeStore(store);
          sendJson(res, 200, { ok: true });
          return;
        }
      }

      sendJson(res, 404, { message: "Not found" });
    } catch (error) {
      sendJson(res, 500, {
        message: "Backend error",
        detail: error instanceof Error ? error.message : String(error),
      });
    }
  };
}

export default function contentApiPlugin() {
  return {
    name: "content-api-plugin",
    configureServer(server) {
      server.middlewares.use(createHandlers(server.config.root));
    },
    configurePreviewServer(server) {
      server.middlewares.use(createHandlers(server.config.root));
    },
  };
}
