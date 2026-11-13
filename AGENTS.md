# AGENTS.md · Velicoach 生态手册

本仓库不放产品代码，是 Velicoach 生态的入口和手册：一起造什么、共享什么、谁能碰什么、任务怎么交接。做法参照 Manus 的 Mono（[Rebuilding Manus with Manus](https://manus.im/blog/rebuilding-manus-with-manus)）：统一入口加一份写给智能体的手册，不合并各产品仓库。

## 版图

Velicoach 是每个人在通往 AGI 路上的陪练：先站稳，再看清，然后动手。三个产品各有仓库，详见 [map/repos.md](map/repos.md)。

| 一站 | 产品 | 仓库 |
|---|---|---|
| 站稳 · Body | Veli（威利，健康总管） | madlouse/thin-muscle-coach |
| 看清 · Mind（含教育） | 主站与文章；种星词（儿童背单词） | madlouse/velicoach；madlouse/zhongkao-word-atlas |
| 动手 · Build | 主站的动手一站，以后的新产品 | madlouse/velicoach |

## 红线（跨产品，每次都要遵守）

1. 密钥只在服务端环境变量，不进代码、文档、提交信息。
2. 主站不读健康数据；健康明细不跨进学习线（[ADR-0002](adr/0002-profile-and-memory-zones.md)）。
3. 未成年人数据先过合规：种星词在家长同意和数据托管方案定下之前，只从主站链过去，不共享账号，不进周报（[ADR-0001](adr/0001-one-identity-and-family.md)）。
4. 给孩子的 AI 不做开放对话，只给生成后可审的内容。
5. 智能体对外只给工具和数据，敏感数据不出边界（[ADR-0003](adr/0003-agent-access-boundary.md)）。
6. 执行者只交 PR，不合并；合并前由 Claude 做效果评审（[contracts/task.md](contracts/task.md)）。

## 什么场景读哪份

| 场景 | 读 |
|---|---|
| 判断一个想法值不值得做 | [vision.md](vision.md) 的五问 |
| 定价、广告、免费与付费 | [business.md](business.md) |
| 排期、先做哪个产品 | [roadmap.md](roadmap.md) |
| 跨产品的词 | [glossary.md](glossary.md) |
| 改账号、路由、token、MCP 工具、反馈库 | [map/repos.md](map/repos.md) 的共享契约，再读 adr/ |
| 把任务派给 Codex、Antigravity 等执行者 | [contracts/task.md](contracts/task.md) |
| 设计语言 | [design/language.md](design/language.md) |

## 规则放在哪一层

每件事只写在一层：用户怎么想、怎么决策在账号记忆和 madlouse/context-infrastructure；一类活怎么干在 madlouse/skills；跨产品的愿景、契约和协作在本仓库；产品自己的 PRD、代码和规范在产品仓库。只管一个产品的规则留在那个产品仓库。冲突时，跨产品的事以本仓库为准，产品内的事以产品仓库为准。

本仓库保持精简：本文件不超过 4 KB，顶层文件不超过 15 个；它是手册和契约，不加评审关口。`node scripts/check-mono-link.mjs` 检查本文件大小，以及同级目录里的产品仓库是否都接入了本手册。
