# 仓库地图

每个仓库的职责、负责频道、默认分支和能碰的范围。共享契约每一项都写明负责的仓库，改它的人要通知其他频道。

| 仓库 | 产品与一站 | 频道 | 默认 / 集成分支 | 托管 |
|---|---|---|---|---|
| madlouse/thin-muscle-coach | Veli，站稳 | thin-muscle-coach | feature/b1（进 main 由产品负责人确认） | Vercel；Supabase；R2 |
| madlouse/velicoach | 主站，三站入口和看清的文章 | velicoach | feature/v1（上线后进 site） | Vercel；velicoach.com 按路径分给主站和 Veli |
| madlouse/zhongkao-word-atlas | 种星词，看清里的儿童学习 | words | main | Cloudflare Pages（words.velicoach.com）；独立 Supabase |
| madlouse/velicoach-mono | 本手册 | Velicoach 主频道 | main | 不部署 |
| madlouse/context-infrastructure | 用户的思考和决策原则，对所有项目生效 | 主频道 | main | 不部署 |

## 共享契约

| 契约 | 负责仓库 | 规则 |
|---|---|---|
| 账号与登录 | thin-muscle-coach | 主站和 Veli 共用 Supabase 账号；种星词暂不共享（[ADR-0001](../adr/0001-one-identity-and-family.md)） |
| 路由与域名 | thin-muscle-coach（路由表 ADR-0032） | velicoach.com 按路径分给两个 Vercel 项目；子域名改动先在本表登记 |
| 设计语言与 token | 各自维护，规则见 [design/language.md](../design/language.md) | 改共享外壳、登录、设计系统时通知其他频道 |
| 智能体工具（MCP） | thin-muscle-coach | 工具名、入参、能返回什么字段见 [ADR-0003](../adr/0003-agent-access-boundary.md) |
| 反馈库 | 运营频道开之前由各产品自管 | 每条反馈都有结果并告诉用户 |
| 任务交接 | 本仓库 | [contracts/task.md](../contracts/task.md) |

## 能碰不能碰

- 智能体在产品仓库里只开分支、交 PR，不直接推默认分支或 main。
- 改一个产品仓库时，不顺手改另一个产品仓库；跨仓库的改动拆成各自的 PR，在本仓库记一笔。
- 生产数据、DNS、计费设置只由主频道在产品负责人确认后改。
