import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../dist/", import.meta.url));
const port = Number(process.env.PORT || 4173);
const types = { ".html":"text/html; charset=utf-8", ".css":"text/css; charset=utf-8", ".js":"text/javascript; charset=utf-8", ".svg":"image/svg+xml", ".pdf":"application/pdf", ".png":"image/png", ".jpg":"image/jpeg", ".jpeg":"image/jpeg", ".mp3":"audio/mpeg", ".wav":"audio/wav", ".ogg":"audio/ogg", ".webp":"image/webp", ".ico":"image/x-icon" };
createServer(async (request, response) => {
  try {
    let pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    // This alias exercises the repository subpath used by GitHub Pages.
    if (pathname.startsWith("/project-preview/")) pathname = pathname.slice("/project-preview".length);
    const filename = resolve(root, "." + pathname + (pathname.endsWith("/") ? "index.html" : ""));
    if (!filename.startsWith(resolve(root) + sep)) {
      response.writeHead(403); response.end("Forbidden"); return;
    }
    if (!(await stat(filename)).isFile()) throw new Error("Not a file");
    const data = await readFile(filename);
    response.writeHead(200, { "Content-Type":types[extname(filename)] || "application/octet-stream", "Cache-Control":"no-cache" });
    response.end(request.method === "HEAD" ? undefined : data);
  } catch {
    response.writeHead(404, { "Content-Type":"text/plain" }); response.end("Not found");
  }
}).listen(port, "127.0.0.1", () => console.log(`Project website: http://127.0.0.1:${port}/project-preview/`));
