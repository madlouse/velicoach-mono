import { test } from "node:test";
import assert from "node:assert/strict";
import { fieldOf, judge } from "./check-doc-first.mjs";

const config = {
  code: ["^src/(?!content/)", "^supabase/"],
  docs: ["^docs/prd/", "^docs/architecture/"],
  refs: ["docs/prd/", "\\bF\\d+\\b"],
};

test("没改产品代码就通过", () => {
  assert.equal(judge({ config, changed: ["docs/README.md", "src/content/a.ts"], body: "" }).ok, true);
});

test("同一个 PR 改了需求文档就通过", () => {
  assert.equal(judge({ config, changed: ["src/app/x.ts", "docs/prd/v.md"], body: "" }).ok, true);
});

test("正文引用了需求就通过，引用对不上不算", () => {
  assert.equal(judge({ config, changed: ["src/app/x.ts"], body: "## 做了什么\n需求：F46 承接卡" }).ok, true);
  assert.equal(judge({ config, changed: ["src/app/x.ts"], body: "- **需求**: docs/prd/v.md §4" }).ok, true);
  assert.equal(judge({ config, changed: ["src/app/x.ts"], body: "需求：见聊天记录" }).ok, false);
});

test("免文档只认列出的类别，而且要写理由", () => {
  assert.equal(judge({ config, changed: ["supabase/m.sql"], body: "免文档：依赖，升级 vite 补丁版本" }).ok, true);
  assert.equal(judge({ config, changed: ["supabase/m.sql"], body: "免文档：依赖" }).ok, false);
  assert.equal(judge({ config, changed: ["supabase/m.sql"], body: "免文档：小改动，顺手" }).ok, false);
});

test("什么都没有就不通过，并说明三种补法", () => {
  const r = judge({ config, changed: ["src/app/x.ts"], body: "" });
  assert.equal(r.ok, false);
  assert.match(r.why, /先改 PRD，再改技术方案，再改代码/);
});

test("字段名要在行首，正文中间提到不算", () => {
  assert.equal(fieldOf("这次没有需求：只是试试", "需求"), null);
  assert.equal(fieldOf("需求：F12", "需求"), "F12");
});
