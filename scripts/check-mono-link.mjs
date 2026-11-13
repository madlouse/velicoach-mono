#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const mono = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const rootArg = process.argv.indexOf("--root");
const root = rootArg > -1 ? resolve(process.argv[rootArg + 1]) : dirname(mono);

const MARKER = "<!-- velicoach-mono -->";
const LINKS = ["../velicoach-mono/AGENTS.md", "github.com/madlouse/velicoach-mono"];
const PRODUCTS = [
  { repo: "thin-muscle-coach", file: "AGENTS.md", branch: "feature/b1" },
  { repo: "velicoach", file: "AGENTS.project.md", branch: "feature/v1" },
  { repo: "zhongkao-word-atlas", file: "AGENTS.md", branch: "main" },
];

const CARD_ROWS = ["需求（PRD）", "技术方案", "运行和环境"];
const SHARED_SCRIPTS = ["check-doc-first.mjs", "check-comments.mjs"];
const OPTIONAL_SCRIPTS = ["check-role-paths.mjs", "check-e2e-trace.mjs"];
const VENDORED = "skills/pstack";
const CONFIG = ".velicoach-checks.json";
const CONFIG_KEYS = { docFirst: ["code", "docs", "refs"], comments: ["paths"] };
const OPTIONAL_KEYS = { roles: ["source", "e2eCore", "e2eCases"], e2eTrace: ["prd", "cases"] };
const DOC_LIMIT = 6144;
const ONE_HOP_DIRS = ["standards", "contracts", "adr"];
const problems = [];
const notes = new Set();

function markdownFiles(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (name.startsWith(".") || name === "node_modules") continue;
    const p = join(dir, name);
    if (p === join(mono, VENDORED)) continue;
    if (statSync(p).isDirectory()) out.push(...markdownFiles(p));
    else if (name.endsWith(".md")) out.push(p);
  }
  return out;
}

const agentsSize = statSync(join(mono, "AGENTS.md")).size;
if (agentsSize > 4096) problems.push(`AGENTS.md is ${agentsSize} bytes, over 4096`);
const entries = readdirSync(mono).filter((n) => !n.startsWith("."));
if (entries.length > 15) problems.push(`repo root has ${entries.length} entries, over 15`);

const agentsText = readFileSync(join(mono, "AGENTS.md"), "utf8");
const linkedFromAgents = new Set([...agentsText.matchAll(/\]\(([^)#\s]+)/g)].map((m) => m[1]));
for (const file of markdownFiles(mono)) {
  const where = relative(mono, file);
  if (["AGENTS.md", "CLAUDE.md", "README.md"].includes(where)) continue;
  const size = statSync(file).size;
  if (size > DOC_LIMIT) problems.push(`${where} is ${size} bytes, over ${DOC_LIMIT}: split it by topic`);
  const lead = readFileSync(file, "utf8").split("\n").slice(1).find((l) => l.trim());
  if (!lead || /^[#|>-]/.test(lead.trim())) problems.push(`${where}: open with one sentence on what it covers, right under the title`);
  const top = where.split("/")[0];
  const oneHop = !where.includes("/") || ONE_HOP_DIRS.includes(top);
  if (oneHop && !linkedFromAgents.has(where) && !where.startsWith("contracts/spec-log")) problems.push(`${where}: not linked from AGENTS.md, so agents cannot reach it within two hops`);
}

const ENFORCED = /〔(?:设计|检查|验证|评审)[：:][^〕]+〕/;
const ruleFiles = [["AGENTS.md", "## 红线"], ...readdirSync(join(mono, "standards")).map((n) => [`standards/${n}`, null])];
for (const [where, section] of ruleFiles) {
  let text = readFileSync(join(mono, where), "utf8");
  if (section) text = text.slice(text.indexOf(section)).split(/\n## /)[0];
  for (const line of text.split("\n")) {
    if (/^\d+\. /.test(line) && !ENFORCED.test(line)) problems.push(`${where}: rule without 〔设计/检查/验证/评审：…〕, say how it is enforced: ${line.slice(0, 40)}`);
  }
}

const vendored = readdirSync(join(mono, VENDORED)).filter((n) => statSync(join(mono, VENDORED, n)).isDirectory());
const verdicts = new Map([...readFileSync(join(mono, "skills", "README.md"), "utf8").matchAll(/^\| `([\w-]+)` \| ([^|]+?) \|/gm)].map((m) => [m[1], m[2]]));
for (const name of vendored) if (verdicts.get(name) !== "收录") problems.push(`${VENDORED}/${name}: skills/README.md has no「收录」row for it; record why it was adopted, or remove it`);
for (const [name, verdict] of verdicts) if (verdict === "收录" && !vendored.includes(name)) problems.push(`skills/README.md marks ${name} 收录, but ${VENDORED}/${name} is missing`);

const PRODUCT_LINK = /^https:\/\/github\.com\/madlouse\/([\w.-]+)\/(?:blob|tree)\/([^#?]+)/;
for (const file of markdownFiles(mono)) {
  const where = relative(mono, file);
  const text = readFileSync(file, "utf8").replace(/^```[\s\S]*?^```/gm, "");
  for (const m of text.matchAll(/\]\(([^)\s]+)\)/g)) {
    const target = m[1];
    const product = PRODUCT_LINK.exec(target);
    if (product) {
      const [, repo, rest] = product;
      if (repo === "velicoach-mono") continue;
      const known = PRODUCTS.find((p) => p.repo === repo);
      if (!known) continue;
      if (!rest.startsWith(`${known.branch}/`)) {
        problems.push(`${where}: link to ${repo} should use its integration branch ${known.branch}: ${target}`);
        continue;
      }
      const path = rest.slice(known.branch.length + 1);
      const dir = join(root, repo);
      if (!existsSync(dir)) {
        notes.add(`${repo}: not checked out next to velicoach-mono, its links were not checked`);
        continue;
      }
      if (!existsSync(join(dir, decodeURIComponent(path)))) problems.push(`${where}: ${repo}/${path} does not exist`);
      continue;
    }
    if (/^[a-z]+:/i.test(target) || target.startsWith("#")) continue;
    const local = resolve(dirname(file), decodeURIComponent(target.split("#")[0]));
    if (!existsSync(local)) problems.push(`${where}: link ${target} does not resolve`);
  }
}

for (const name of readdirSync(join(mono, "products"))) {
  const text = readFileSync(join(mono, "products", name), "utf8");
  for (const row of CARD_ROWS) if (!text.includes(`| ${row} |`)) problems.push(`products/${name}: no「${row}」row in 去哪读`);
}

const shared = Object.fromEntries(SHARED_SCRIPTS.map((n) => [n, readFileSync(join(mono, "scripts", n), "utf8")]));
const MONO_REF = /velicoach-mono\/(?:blob\/[\w.-]+\/)?((?:[\w.-]+\/)*[\w.-]+\.md)/g;
for (const { repo, file } of PRODUCTS) {
  const dir = join(root, repo);
  if (!existsSync(dir)) {
    notes.add(`${repo}: not checked out next to velicoach-mono, skipped`);
    continue;
  }
  const entry = join(dir, file);
  if (!existsSync(entry)) {
    problems.push(`${repo}: ${file} is missing`);
    continue;
  }
  const text = readFileSync(entry, "utf8");
  if (!text.includes(MARKER)) problems.push(`${repo}: ${file} has no entry block (${MARKER})`);
  else if (!LINKS.some((l) => text.includes(l))) problems.push(`${repo}: ${file} entry block does not point to ${LINKS[0]}`);

  for (const script of SHARED_SCRIPTS) {
    const copy = join(dir, "scripts", script);
    if (!existsSync(copy)) problems.push(`${repo}: scripts/${script} is missing`);
    else if (readFileSync(copy, "utf8") !== shared[script]) problems.push(`${repo}: scripts/${script} differs from velicoach-mono/scripts/${script}; change it here first (contracts/spec-change.md)`);
  }
  for (const script of OPTIONAL_SCRIPTS) {
    const copy = join(dir, "scripts", script);
    if (existsSync(copy) && readFileSync(copy, "utf8") !== readFileSync(join(mono, "scripts", script), "utf8")) problems.push(`${repo}: scripts/${script} differs from velicoach-mono/scripts/${script}; change it here first (contracts/spec-change.md)`);
  }
  const configPath = join(dir, CONFIG);
  if (!existsSync(configPath)) problems.push(`${repo}: ${CONFIG} is missing`);
  else {
    try {
      const config = JSON.parse(readFileSync(configPath, "utf8"));
      for (const [section, keys] of Object.entries(CONFIG_KEYS)) {
        for (const key of keys) {
          const list = config[section]?.[key];
          if (!Array.isArray(list) || list.length === 0) problems.push(`${repo}: ${CONFIG} needs a non-empty ${section}.${key} list`);
        }
        for (const list of Object.values(config[section] ?? {})) for (const re of list) new RegExp(re);
      }
      for (const [section, keys] of Object.entries(OPTIONAL_KEYS)) {
        if (!config[section]) continue;
        for (const key of keys) {
          const list = config[section][key];
          if (!Array.isArray(list) || list.length === 0) problems.push(`${repo}: ${CONFIG} ${section} needs a non-empty ${key} list`);
          else for (const re of list) new RegExp(re);
        }
        if (section === "e2eTrace") {
          const id = config.e2eTrace.id;
          if (typeof id !== "string" || !id.trim()) problems.push(`${repo}: ${CONFIG} e2eTrace needs an id pattern for PRD numbers`);
          else new RegExp(id);
        }
      }
    } catch (e) {
      problems.push(`${repo}: ${CONFIG} does not parse: ${e.message}`);
    }
  }

  const skillsDir = join(dir, ".claude", "skills");
  const scanned = [entry];
  if (existsSync(skillsDir)) {
    for (const name of readdirSync(skillsDir)) {
      const skill = join(skillsDir, name, "SKILL.md");
      if (!existsSync(skill)) continue;
      scanned.push(skill);
      const ours = join(mono, VENDORED, name, "SKILL.md");
      if (existsSync(ours) && readFileSync(ours, "utf8") !== readFileSync(skill, "utf8")) notes.add(`${repo}: skill ${name} differs from velicoach-mono/${VENDORED}/${name} (a fork or a different skill with the same name; see skills/README.md)`);
    }
  }
  for (const f of scanned) {
    for (const m of readFileSync(f, "utf8").matchAll(MONO_REF)) {
      if (!existsSync(join(mono, m[1]))) problems.push(`${repo}/${relative(dir, f)}: names velicoach-mono/${m[1]}, which does not exist`);
    }
  }
}

for (const n of notes) console.log(`note: ${n}`);
if (problems.length) {
  for (const p of problems) console.error(`problem: ${p}`);
  process.exit(1);
}
console.log(`ok: AGENTS.md ${agentsSize} bytes, ${entries.length} root entries, links resolve, every doc within two hops, product repos wired`);
