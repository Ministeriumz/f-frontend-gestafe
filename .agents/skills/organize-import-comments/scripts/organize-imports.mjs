import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";

const extensions = new Set([".ts", ".tsx", ".js", ".jsx"]);
const headings = ["Libraries", "Components", "Hooks", "Services", "Constants", "Utilities", "Types", "Styles"];
const importPattern = /^import(?:[\s\S]*?\sfrom\s*)?["'][^"']+["'];?[ \t]*$/gm;

function sourceOf(statement) { return statement.match(/(?:from\s+|import\s*)["']([^"']+)["']/)?.[1] ?? ""; }
function categoryOf(statement) {
  const source = sourceOf(statement);
  if (/^import\s+type\b/.test(statement) || /\/(types?|schemas?)(\/|$)/i.test(source)) return "Types";
  if (/\.(css|scss|sass|less)$/.test(source)) return "Styles";
  if (/\/(components?|_components)(\/|$)/i.test(source) || /^@\/components/.test(source)) return "Components";
  if (/\/(hooks?)(\/|$)/i.test(source) || /^@\/hooks/.test(source)) return "Hooks";
  if (/\/(services?)(\/|$)/i.test(source) || /^@\/services/.test(source)) return "Services";
  if (/\/(constants?)(\/|$)/i.test(source) || /^@\/constants/.test(source)) return "Constants";
  if (/^@\/(lib|utils?)/.test(source) || /\/(lib|utils?)(\/|$)/i.test(source)) return "Utilities";
  if (!source.startsWith(".") && !source.startsWith("@/")) return "Libraries";
  if (/^[A-Z]/.test(source.split("/").pop() ?? "")) return "Components";
  return "Utilities";
}

function organize(content) {
  const imports = [...content.matchAll(importPattern)];
  if (!imports.length) return content;
  const first = imports[0].index; const lastMatch = imports.at(-1); const last = lastMatch.index + lastMatch[0].length;
  const region = content.slice(first, last).replace(/^\s*\/\/\*\s*(?:Libraries|Components|Hooks|Services|Constants|Utilities|Types|Styles) imports\s*\r?\n/gm, "");
  const statements = [...region.matchAll(importPattern)].map((match) => match[0].trim());
  const groups = new Map(headings.map((heading) => [heading, []]));
  statements.forEach((statement) => groups.get(categoryOf(statement)).push(statement));
  const block = headings.filter((heading) => groups.get(heading).length).map((heading) => `//* ${heading} imports\n${groups.get(heading).join("\n")}`).join("\n\n");
  return `${content.slice(0, first).replace(/\s*$/, "\n\n")}${block}\n\n${content.slice(last).replace(/^\s*/, "")}`;
}

async function filesAt(path) {
  if ((await stat(path)).isFile()) return extensions.has(extname(path)) ? [path] : [];
  const entries = await readdir(path, { withFileTypes: true });
  return (await Promise.all(entries.filter((entry) => !["node_modules", ".next", ".git"].includes(entry.name)).map((entry) => filesAt(join(path, entry.name))))).flat();
}

const files = await filesAt(process.argv[2] ?? "src"); let changed = 0;
for (const file of files) { const before = await readFile(file, "utf8"); const after = organize(before); if (after !== before) { await writeFile(file, after, "utf8"); changed += 1; } }
process.stdout.write(`Organized imports in ${changed} of ${files.length} files.\n`);
