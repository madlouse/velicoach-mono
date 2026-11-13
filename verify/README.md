# E2E 验证

用模拟真实用户操作的端到端测试证明产品照 PRD 工作：合并后在集成环境做场景验收，上线后在线上做冒烟。本区是跨产品的约定；各产品的环境、驱动和案例在产品仓库。

## 要守住的结果

这里只定结果和不变量；用什么工具、怎么组织步骤由各产品和干活的 Agent 定，模型和工具变强时直接换上更好的做法。

1. **案例覆盖 PRD：** 每条用户能感知的需求至少有一条 E2E 案例；做不成 E2E 的写明理由豁免。〔检查：check-e2e-trace，产品接入后生效〕
2. **像用户一样操作：** 从用户碰得到的入口进（页面、App、公开接口），看用户看得到的结果和该有的副作用（写进库的行、发出的邮件）；不调内部函数，不走测试专用接口。〔评审：要看案例怎么驱动〕
3. **两个环境都跑：** 合并进集成分支后，在集成环境跑全部场景；上线后在线上跑只读或自己清理的冒烟。〔验证：运行报告附在 PR 或发布记录里〕
4. **跑完看覆盖率：** 集成环境跑的是插桩构建，跑完出运行时覆盖率，和上次比。〔验证：报告随运行产物保存，见 [coverage.md](coverage.md)〕
5. **E2E 只发现问题：** 跑 E2E 的 Agent 不改源码、案例和能力模块；一个 PR 不同时改其中两类，修复由写代码的 Agent 做。〔检查：check-role-paths，产品接入后生效；见 [roles.md](roles.md)〕
6. **先补案例：** 每个产品先给现有 PRD 补齐 E2E 案例；之后新需求的案例和需求一起定，早于实现。〔检查：check-e2e-trace 的门槛 minCoverage 只升不降〕

## 模块和案例分开

能力模块管「怎么跑」，案例管「验什么」。能力模块换工具、换环境，案例不用改；案例跟着 PRD 变，能力模块不用改。

| 部分 | 管什么 | 读 |
|---|---|---|
| 环境准备 | 环境、账号、测试数据、就绪检查、清理 | [env.md](env.md) |
| Web 验收 | 浏览器里的界面验收和功能验收 | [web.md](web.md) |
| App 验收 | 安装到手机的 PWA、原生 App、真机 | [app.md](app.md) |
| 运行时覆盖率 | 插桩、报告、门槛 | [coverage.md](coverage.md) |
| 案例 | 案例写什么、怎么追溯到 PRD、怎么从 PRD 推出来 | [cases.md](cases.md) |
| 探索 | 找案例之外的问题 | [explore.md](explore.md) |
| 角色 | 谁写案例、谁跑、谁修 | [roles.md](roles.md) |

产品仓库按路径分三类：源码、E2E 能力模块、E2E 案例。目录各产品自己定，写进 `.velicoach-checks.json` 的 `roles`；PRD 编号和案例的对应写进 `e2eTrace`。两份检查脚本 `check-role-paths.mjs`、`check-e2e-trace.mjs` 原样复制进产品仓库，check-mono-link 核对副本。

## 各产品现状（2026-11-13）

| 产品 | PRD 编号 | 已有 | 缺 |
|---|---|---|---|
| Veli | 场景 S01–S40（[e2e-scenarios.md](https://github.com/madlouse/thin-muscle-coach/blob/feature/b1/docs/product/requirements/foundation/e2e-scenarios.md)） | `tests/e2e` 打部署好的接口，不开浏览器；UI 层有 Playwright 截图和 axe；单元和集成测试有覆盖率门槛 | 浏览器里的场景案例；E2E 覆盖率；案例和 S 编号的机读对应 |
| 主站 | 关键路径 P1–P6（[PRD](https://github.com/madlouse/velicoach/blob/feature/v1/docs/prd/velicoach.md)） | browser-smoke 冒烟、design-bar 页面检查 | E2E 案例（票 #60 未做）、PR 上跑测试的 CI、覆盖率 |
| 种星词 | REQ 编号 148 条（[trace.json](https://github.com/madlouse/zhongkao-word-atlas/blob/main/docs/requirements/trace.json)，check-trace 双向核对） | pgTAP 权限矩阵、Playwright 截图评审、按 REQ 的 verify-ux 脚本、隐藏的测试学校 | 统一的案例目录和运行报告、覆盖率、合并前的门槛 |
