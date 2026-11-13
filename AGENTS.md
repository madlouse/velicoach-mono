# AGENTS.md · Velicoach 生态手册

本仓库不放产品代码，是 Velicoach 生态的入口和手册：有哪些产品、去哪读、共享什么规范、怎么交接。参照 Manus 的 Mono（[Rebuilding Manus with Manus](https://manus.im/blog/rebuilding-manus-with-manus)）：产品仓库不合并，同一个智能体从这里能接手任何一个产品的活。

Velicoach 是 AGI 路上的陪练：先站稳（Veli），再看清（主站文章、种星词），然后动手（主站）。仓库和产品卡见 [map/repos.md](map/repos.md)。

## 规则怎么定（按顺序，前一层能解决就不往后走）

1. **从设计上消除：** 用 API、架构和目录结构让错的写法写不出来；目录本身就是上下文，配上边界检查。
2. **确定性检查：** lint、类型、依赖边界、测试；报错要告诉 Agent 去修根因，不教它绕过。
3. **运行时验证：** 让 Agent 自己跑起来看结果。
4. **最后才写文字：** AGENTS.md、技能只放要判断的事。

每条规范末尾标明靠什么守住：〔设计：…〕〔检查：…〕〔验证：…〕，或〔评审：为什么还做不成检查〕。细则见 [standards/rules.md](standards/rules.md)。

## 红线

1. 密钥只在服务端环境变量，不进代码、文档、提交信息。〔检查：.gitignore 挡住 .env*〕
2. 主站不读健康数据；健康明细不跨进学习线（[ADR-0002](adr/0002-profile-and-memory-zones.md)）。〔评审：主站和 Veli 共用账号库，代码层还没隔开〕
3. 种星词在家长同意和数据托管定下之前，只从主站链过去，不共享账号，不进周报（[ADR-0001](adr/0001-one-identity-and-family.md)）。〔设计：种星词用自己的 Supabase 项目〕
4. 给孩子的 AI 不做开放对话，只给生成后可审的内容。〔评审：要判断内容的性质〕
5. 智能体对外只给工具和数据，敏感数据不出边界（[ADR-0003](adr/0003-agent-access-boundary.md)）。〔评审：工具还没写〕
6. 执行者只交 PR，不合并；合并前由 Claude 做效果评审（[contracts/task.md](contracts/task.md)）。〔检查：Veli、主站的合并脚本；种星词还没有，靠评审〕

## 按任务读哪份

| 任务 | 读 |
|---|---|
| 进一个产品仓库做事，或跨仓库找东西 | [map/repos.md](map/repos.md) → 产品卡 → 它的入口文件 |
| 新功能、需求取舍 | [vision.md](vision.md) 的五问，再读产品卡里的 PRD |
| 界面、样式、交互、动效 | [standards/design.md](standards/design.md)，再读产品的设计系统 |
| 写代码、开 PR、合并；文档放哪、文档先行、注释 | [standards/engineering.md](standards/engineering.md) |
| 对外文字、术语 | [standards/content.md](standards/content.md)、[glossary.md](glossary.md) |
| 改账号、路由、token、MCP 工具、反馈库 | [map/repos.md](map/repos.md) 的共享契约，再读 adr/ |
| 派活给 Codex、Antigravity | [contracts/task.md](contracts/task.md) |
| 定价、广告；排期 | [business.md](business.md)；[roadmap.md](roadmap.md) |
| 改跨产品的规范、契约或共享脚本，提建议 | [contracts/spec-change.md](contracts/spec-change.md)，记录在 [spec-log.md](contracts/spec-log.md) |
| 在本手册加文档、调结构 | [ADR-0004](adr/0004-how-agents-read-the-handbook.md) |

## 怎么读到、放在哪一层

本手册克隆在产品仓库的同级目录 `../velicoach-mono/`；Codex 云端读不到，派活时任务卡自带要守的规则。用户的思考和决策原则在账号记忆和 madlouse/context-infrastructure；一类活怎么干在技能；跨产品的规范和协作在本仓库，只在这里改，谁都能提，由 Claude 评审（[规范变更协议](contracts/spec-change.md)）；产品自己的 PRD、代码和细则在产品仓库。冲突时跨产品的事以本仓库为准，产品内的事以产品仓库为准。

本文件不超过 4 KB；`node scripts/check-mono-link.mjs` 查大小、链接、两跳可达、规范标没标怎么守、产品仓库的接入。
