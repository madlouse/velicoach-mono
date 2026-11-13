import { test } from "node:test";
import assert from "node:assert/strict";
import { judge } from "./check-role-paths.mjs";

const config = { source: ["^src/", "^supabase/"], e2eCore: ["^e2e/core/"], e2eCases: ["^e2e/cases/"] };

test("只改源码、只改案例、只改能力模块都通过", () => {
  assert.equal(judge({ config, changed: ["src/a.ts", "supabase/m.sql", "docs/x.md"] }).ok, true);
  assert.equal(judge({ config, changed: ["e2e/cases/f03.spec.ts"] }).ok, true);
  assert.equal(judge({ config, changed: ["e2e/core/web.ts"] }).ok, true);
  assert.equal(judge({ config, changed: ["README.md"] }).ok, true);
});

test("源码和案例一起改不通过，并说明怎么拆", () => {
  const r = judge({ config, changed: ["src/a.ts", "e2e/cases/f03.spec.ts"] });
  assert.equal(r.ok, false);
  assert.match(r.why, /产品源码和E2E 案例/);
  assert.match(r.why, /拆开提/);
});

test("案例和能力模块一起改也不通过", () => {
  assert.equal(judge({ config, changed: ["e2e/core/web.ts", "e2e/cases/f03.spec.ts"] }).ok, false);
});

test("没配的分组和不认识的键不参与判定", () => {
  assert.equal(judge({ config: { source: ["^src/"], other: ["^e2e/"] }, changed: ["src/a.ts", "e2e/x.ts"] }).ok, true);
  assert.equal(judge({ config: undefined, changed: ["src/a.ts"] }).ok, true);
});
