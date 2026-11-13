import { test } from "node:test";
import assert from "node:assert/strict";
import { addedLines, judge } from "./check-comments.mjs";

const config = { paths: ["^src/", "^supabase/", "^scripts/"], exclude: ["\\.md$"], allow: ["^REQ-[A-Z]+-\\d+"] };
const run = (path, ...texts) => judge({ config, added: [{ path, lines: texts.map((text, i) => ({ line: i + 1, text })) }] });

test("新增的普通注释不通过", () => {
  assert.equal(run("src/a.ts", "const a = 1; // 先算一遍").length, 1);
  assert.equal(run("src/a.ts", "/* 说明 */ const a = 1;").length, 1);
  assert.equal(run("supabase/m.sql", "select 1; -- 先建表").length, 1);
  assert.equal(run("scripts/x.sh", "# 安装依赖").length, 1);
});

test("一行 why 注释通过，多行不通过", () => {
  assert.deepEqual(run("src/a.ts", "// why: Safari 17 的 IndexedDB 在隐私模式下会抛错"), []);
  assert.deepEqual(run("src/a.ts", "// 为什么：Supabase 免费档每分钟限 30 次"), []);
  assert.equal(run("src/a.ts", "// why: 第一行", "// 第二行").length, 2);
  assert.equal(run("src/a.ts", "/* why: 第一行", " * 第二行 */").length, 2);
});

test("工具指令、字符串、网址和配置里允许的写法不算注释", () => {
  assert.deepEqual(run("src/a.ts", "// eslint-disable-next-line no-console -- 只在本地脚本里打印"), []);
  assert.deepEqual(run("src/a.ts", "// @ts-expect-error 上游类型缺字段"), []);
  assert.deepEqual(run("src/a.ts", "/// <reference types=\"vite/client\" />"), []);
  assert.deepEqual(run("src/a.ts", 'const url = "https://velicoach.com/x"; const re = "// not";'), []);
  assert.deepEqual(run("src/a.ts", "// REQ-WORD-12"), []);
  assert.deepEqual(run("scripts/x.mjs", "#!/usr/bin/env node"), []);
});

test("井号行尾注释不通过", () => {
  assert.equal(run("scripts/x.py", "x = 1  # note").length, 1);
  assert.equal(run("scripts/x.py", 'x = "a"# note').length, 1);
  assert.equal(run("scripts/x.sh", "npm ci  # 安装依赖").length, 1);
  assert.equal(run("scripts/x.sh", "echo it's # note").length, 1);
  assert.equal(run("scripts/x.yml", "runs-on: ubuntu-24.04 # 固定版本").length, 1);
  assert.equal(run("scripts/x.toml", 'name = "a"# 名字').length, 1);
  assert.equal(run("scripts/x.py", 'p = """模板', "里面 # 不算", '"""  # 结尾这句算').length, 1);
});

test("井号在字符串、shebang、网址和 shell 语法里不算注释，行尾 why 和工具指令照旧放行", () => {
  assert.deepEqual(run("scripts/x.py", "#!/usr/bin/env python3"), []);
  assert.deepEqual(run("scripts/x.py", 'print("# not", \'#\')'), []);
  assert.deepEqual(run("scripts/x.py", 'url = "https://velicoach.com/a#b"'), []);
  assert.deepEqual(run("scripts/x.py", "import os  # noqa: F401"), []);
  assert.deepEqual(run("scripts/x.py", "x = 1  # why: 上游接口少给一个字段"), []);
  assert.deepEqual(run("scripts/x.sh", "#!/usr/bin/env bash"), []);
  assert.deepEqual(run("scripts/x.sh", 'echo "${#arr[@]}" ${#name} $# ${path##*/}'), []);
  assert.deepEqual(run("scripts/x.sh", "curl https://velicoach.com/a#b"), []);
  assert.deepEqual(run("scripts/x.sh", "echo '# 不是注释' \"#\""), []);
  assert.deepEqual(run("scripts/x.sh", "echo $((16#ff))"), []);
  assert.deepEqual(run("scripts/x.yml", "color: '#fff'"), []);
  assert.deepEqual(run("scripts/x.py", 'payload = """literal # value', "# heading inside", '"""'), []);
  assert.deepEqual(run("scripts/x.py", "doc = '''a # b'''"), []);
  assert.deepEqual(run("scripts/x.py", 'message = """', "C# tutorial", '"""'), []);
  assert.deepEqual(run("scripts/x.toml", 'text = """', "C# tutorial", '"""'), []);
  assert.deepEqual(run("scripts/x.sh", "printf '%s\\n' foo\\ #bar"), []);
});

test("普通字符串里的三引号不会关掉后面的检查", () => {
  assert.equal(run("scripts/x.py", `_ = "'''"`, "x = 1  # note").length, 1);
  assert.equal(run("scripts/x.toml", `a = '"""'`, "# note").length, 1);
});

test("工具指令按完整格式放行，可以连写", () => {
  assert.deepEqual(run("scripts/x.py", "x = 1  # pylint: disable=invalid-name,unused-import"), []);
  assert.deepEqual(run("scripts/x.py", "x = f()  # pyright: ignore[reportGeneralTypeIssues]"), []);
  assert.deepEqual(run("scripts/x.py", "x = 1  # fmt: skip"), []);
  assert.deepEqual(run("scripts/x.py", "import a  # isort: skip"), []);
  assert.deepEqual(run("scripts/x.py", "run(cmd)  # nosec B602, B607"), []);
  assert.deepEqual(run("scripts/x.py", "# mypy: ignore-errors"), []);
  assert.deepEqual(run("scripts/x.py", "xs = []  # type: List[int]"), []);
  assert.deepEqual(run("scripts/x.py", "y = g()  # type: ignore[attr-defined]  # noqa: E501"), []);
  assert.deepEqual(run("scripts/x.py", "x = 1  # why: 上游 issue #123 还没修"), []);
  assert.deepEqual(run("scripts/x.yml", "key: value  # yamllint disable-line rule:line-length"), []);
  assert.deepEqual(run("scripts/x.sh", "echo $a  # shellcheck disable=SC2086"), []);
  assert.deepEqual(run("supabase/m.sql", "select 1;  -- noqa: L010"), []);
});

test("指令或 why 后面夹带普通注释不通过", () => {
  assert.equal(run("scripts/x.py", "import a  # noqa: E402  (导入时顺带刷新)").length, 1);
  assert.equal(run("scripts/x.py", "import a  # noqa 随便写").length, 1);
  assert.equal(run("scripts/x.py", "run(cmd)  # nosec 我确定安全").length, 1);
  assert.equal(run("scripts/x.py", "x = 1  # fmt: skip 因为太长").length, 1);
  assert.equal(run("scripts/x.py", "x = 1  # type: 随便写").length, 1);
  assert.equal(run("scripts/x.py", "x = 1  # why: 上游 bug # 顺便说明").length, 1);
  assert.equal(run("scripts/x.sh", "echo $a  # shellcheck disable=SC2086 顺便说明").length, 1);
  assert.equal(run("src/a.ts", "// prettier-ignore 顺便说明").length, 1);
  assert.equal(run("src/a.ts", "// why: Safari 的 bug // 再说一句").length, 1);
  assert.equal(run("supabase/m.sql", "select 1;  -- noqa 随便").length, 1);
});

test("类型注释、eslint 配置和 deno 规则名只认合法写法", () => {
  assert.deepEqual(run("scripts/x.py", "d = {}  # type: Dict[str, int]"), []);
  assert.deepEqual(run("scripts/x.py", "f = g  # type: (int, str) -> bool"), []);
  assert.deepEqual(run("scripts/x.py", "x = None  # type: Optional[int] | None"), []);
  assert.deepEqual(run("scripts/x.py", "cb = h  # type: Callable[[int], str]"), []);
  assert.deepEqual(run("src/a.ts", '/* eslint quotes: ["error", "double"], max-len: ["error", 120] */'), []);
  assert.deepEqual(run("src/a.ts", "// deno-lint-ignore no-explicit-any eqeqeq"), []);
  assert.equal(run("scripts/x.py", "# type: TODO fix this later").length, 1);
  assert.equal(run("scripts/x.py", "x = f()  # type: ignore this line because upstream is slow").length, 1);
  assert.equal(run("scripts/x.sh", "# type: run this after deploy").length, 1);
  assert.equal(run("scripts/x.yml", "# type: List[int]").length, 1);
  assert.equal(run("scripts/x.py", "# mypy: anything").length, 1);
  assert.equal(run("src/a.ts", "/* eslint no-console: [anything at all here] */").length, 1);
  assert.equal(run("src/a.ts", "// deno-lint-ignore this is a normal english comment").length, 1);
  assert.equal(run("src/a.ts", "// global hack").length, 1);
});

test("配置之外的路径和换行的乘号不管", () => {
  assert.deepEqual(run("docs/a.md", "// 随便写"), []);
  assert.deepEqual(run("src/a.ts", "const x = a", "  * b;"), []);
});

test("从 diff 里只取新增的行和行号", () => {
  const diff = ["+++ b/src/a.ts", "@@ -1,0 +3,2 @@", "+const a = 1;", "+// 新注释", "+++ /dev/null"].join("\n");
  assert.deepEqual(addedLines(diff), [{ path: "src/a.ts", lines: [{ line: 3, text: "const a = 1;" }, { line: 4, text: "// 新注释" }] }]);
});
