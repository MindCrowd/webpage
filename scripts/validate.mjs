import { readFile, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, sep } from "node:path";
import vm from "node:vm";

const root = fileURLToPath(new URL("../dist/", import.meta.url));
const html = await readFile(resolve(root, "index.html"), "utf8");
const source = await readFile(resolve(root, "site.config.js"), "utf8");
const context = { window: {} };
vm.runInNewContext(source, context);
const config = context.window.PROJECT_CONFIG;
const errors = [];
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
if (new Set(ids).size !== ids.length) errors.push("Duplicate HTML IDs");
if (!config?.project?.name) errors.push("Project name is missing");
if (!config?.team?.length) errors.push("Team list is empty");
if (!/^[a-z\d-]+$/i.test(config.github?.organization || "")) errors.push("GitHub organization is missing or invalid");
if (!/^[\w.-]+$/.test(config.github?.websiteRepository || "")) errors.push("Website repository name is missing or invalid");
const checkUrl = async (url) => {
  if (!url) return;
  if (url.startsWith("#")) { if (!ids.includes(url.slice(1))) errors.push(`Missing anchor: ${url}`); return; }
  if (/^https?:\/\//.test(url)) { try { new URL(url); } catch { errors.push(`Invalid URL: ${url}`); } return; }
  if (url.startsWith("mailto:")) return;
  if (/^[a-z]+:/i.test(url) || url.startsWith("/")) { errors.push(`Use a relative local path or https URL: ${url}`); return; }
  const filename = resolve(root, url.split(/[?#]/)[0]);
  if (!filename.startsWith(resolve(root)+sep)) { errors.push(`Asset escapes dist/: ${url}`); return; }
  try { await access(filename); } catch { errors.push(`Missing file: ${url}`); }
};
for (const match of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) await checkUrl(match[1]);
for (const repository of config.repositories) {
  await checkUrl(repository.url);
  if (repository.repository && !/^[\w.-]+$/.test(repository.repository)) errors.push(`Invalid repository name: ${repository.repository}`);
}
for (const doc of config.documents) {
  await checkUrl(doc.url);
  if (!doc.title || !doc.category) errors.push("Document title/category missing");
  if (doc.url?.endsWith(".pdf")) {
    const bytes = await readFile(resolve(root,doc.url));
    if (!bytes.subarray(0,5).equals(Buffer.from("%PDF-"))) errors.push(`Not a PDF: ${doc.url}`);
  }
}
for (const member of config.team) { await checkUrl(member.github); await checkUrl(member.logbook); await checkUrl(member.photo); }
for (const advisor of config.advisors) await checkUrl(advisor.url);
await checkUrl(config.project.websiteUrl);
await checkUrl(config.project.pronunciationAudio);
await checkUrl(config.demo.url);
for (const script of ["app.js", "simulation-model.js", "simulation.js"]) new vm.Script(await readFile(resolve(root,script),"utf8"));
if (errors.length) { console.error(errors.join("\n")); process.exitCode=1; }
else console.log(`Website checks passed: ${config.team.length} team members, ${config.documents.length} archive entries, all local files and anchors present.`);
