import { test } from "node:test";
import assert from "node:assert/strict";
import { judge } from "./check-e2e-trace.mjs";

const config = { prd: ["^docs/prd/"], id: "\\b(F\\d{2})\\b", cases: ["^e2e/cases/"] };
const prd = { path: "docs/prd/v.md", text: "F01 订阅\nF02 退订\nF03 登录" };

test("算出覆盖率并列出缺的条目", () => {
  const r = judge({ config, files: [prd, { path: "e2e/cases/a.spec.ts", text: 'test("F01 订阅后收到确认", () => {})' }] });
  assert.equal(r.ok, true);
  assert.deepEqual(r.missing, ["F02", "F03"]);
  assert.match(r.summary, /3 条.*1 条，33%/);
});

test("案例引用了 PRD 里没有的编号就不通过", () => {
  const r = judge({ config, files: [prd, { path: "e2e/cases/a.spec.ts", text: 'test("F09 x", () => {})' }] });
  assert.equal(r.ok, false);
  assert.match(r.problems[0], /F09 在 PRD 里不存在/);
});

test("低于门槛不通过；豁免要写理由，豁免的编号要在 PRD 里", () => {
  const files = [prd, { path: "e2e/cases/a.spec.ts", text: 'test("F01", () => {})' }];
  assert.equal(judge({ config: { ...config, minCoverage: 0.5 }, files }).ok, false);
  assert.equal(judge({ config: { ...config, minCoverage: 0.5, exempt: { F02: "只改后台配置，用户看不到" } }, files }).ok, true);
  assert.equal(judge({ config: { ...config, exempt: { F02: " " } }, files }).ok, false);
  assert.equal(judge({ config: { ...config, exempt: { F07: "旧条目" } }, files }).ok, false);
});

test("PRD 里找不到编号时提示配置有问题", () => {
  const r = judge({ config, files: [{ path: "docs/prd/v.md", text: "没有编号" }] });
  assert.equal(r.ok, false);
  assert.match(r.problems.join(), /一个编号都没找到/);
});

test("不在配置路径里的文件不算", () => {
  const r = judge({ config, files: [prd, { path: "src/x.ts", text: "F01 F02 F03" }] });
  assert.equal(r.missing.length, 3);
});

test("只认测试标题和 prd 字段，注释、跳过的测试和别的字符串不算", () => {
  const text = [
    "// TODO: F01 F02",
    'const note = "F03";',
    'test.skip("F02 退订", () => {});',
    'test.describe("F01 订阅", () => { test("收到确认邮件", () => {}); });',
    "export const meta = { prd: [\"F03\"] };",
  ].join("\n");
  const r = judge({ config, files: [prd, { path: "e2e/cases/a.spec.ts", text }] });
  assert.deepEqual(r.missing, ["F02"]);
});

test("YAML 或 JSON 的 prd 字段也算", () => {
  const r = judge({ config, files: [prd, { path: "e2e/cases/a.yaml", text: "prd: [F01, F02]\nsteps: F03" }] });
  assert.deepEqual(r.missing, ["F03"]);
});

test("没配 id 或 id 能匹配空串时不放行", () => {
  const files = [prd, { path: "e2e/cases/a.spec.ts", text: "" }];
  assert.equal(judge({ config: { ...config, id: undefined, minCoverage: 1 }, files }).ok, false);
  assert.equal(judge({ config: { ...config, id: "x*", minCoverage: 1 }, files: [{ path: "docs/prd/v.md", text: "abc" }] }).ok, false);
});
