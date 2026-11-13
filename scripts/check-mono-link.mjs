#!/usr/bin/env node
// Checks that this handbook stays small and that every product repo is wired to it.
//   1. AGENTS.md is at most 4 KB; the repo root holds at most 15 entries.
//   2. Each product repo found next to this one has the entry block in its entry file:
//      the marker comment and a link to this handbook.
// Usage: node scripts/check-mono-link.mjs [--root <dir holding the sibling repos>]
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const mono = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const rootArg = process.argv.indexOf("--root");
const root = rootArg > -1 ? resolve(process.argv[rootArg + 1]) : dirname(mono);

const MARKER = "<!-- velicoach-mono -->";
const LINK = "github.com/madlouse/velicoach-mono";
const PRODUCTS = [
  { repo: "thin-muscle-coach", file: "AGENTS.md" },
  { repo: "velicoach", file: "AGENTS.project.md" },
  { repo: "zhongkao-word-atlas", file: "AGENTS.md" },
];

const problems = [];
const notes = [];

const agentsSize = statSync(join(mono, "AGENTS.md")).size;
if (agentsSize > 4096) problems.push(`AGENTS.md is ${agentsSize} bytes, over 4096`);
const entries = readdirSync(mono).filter((n) => !n.startsWith("."));
if (entries.length > 15) problems.push(`repo root has ${entries.length} entries, over 15`);

for (const { repo, file } of PRODUCTS) {
  const dir = join(root, repo);
  if (!existsSync(dir)) {
    notes.push(`${repo}: not checked out next to velicoach-mono, skipped`);
    continue;
  }
  const path = join(dir, file);
  if (!existsSync(path)) {
    problems.push(`${repo}: ${file} is missing`);
    continue;
  }
  const text = readFileSync(path, "utf8");
  if (!text.includes(MARKER)) problems.push(`${repo}: ${file} has no entry block (${MARKER})`);
  else if (!text.includes(LINK)) problems.push(`${repo}: ${file} entry block does not link to ${LINK}`);
}

for (const n of notes) console.log(`note: ${n}`);
if (problems.length) {
  for (const p of problems) console.error(`problem: ${p}`);
  process.exit(1);
}
console.log(`ok: AGENTS.md ${agentsSize} bytes, ${entries.length} root entries, product repos wired`);
