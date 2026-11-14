# 仓库地图

先看这张表找到要去的仓库，再读它的产品卡：卡里有产品是什么、阶段、文档去哪读、入口文件、完成的定义和托管。共享契约每一项都写明负责的仓库，改它的人要通知其他频道。

| 仓库 | 产品与一站 | 产品卡 | 入口文件 | 集成分支 | 频道 |
|---|---|---|---|---|---|
| madlouse/thin-muscle-coach | Veli，站稳 | [veli.md](../products/veli.md) | AGENTS.md | feature/b1 | thin-muscle-coach |
| madlouse/velicoach | 主站，三站入口、看清的文章、动手 | [site.md](../products/site.md) | AGENTS.project.md | feature/v1 | velicoach |
| madlouse/zhongkao-word-atlas | 种星词，看清里的儿童学习 | [words.md](../products/words.md) | AGENTS.md | main | words |
| madlouse/velicoach-mono | 本手册 | 无 | AGENTS.md | main | Velicoach 主频道 |
| madlouse/context-infrastructure | 用户的思考和决策原则，对所有项目生效 | 无 | README.md | main | 主频道 |

## 本地布局

各仓库克隆在同一个父目录下，目录名就是仓库名：产品仓库里的 Agent 用 `../velicoach-mono/` 读本手册，本手册用 `../<产品仓库>/` 核对产品卡里的链接。云端会话按这个布局克隆；本机和 Mac mini 也照这样放。

## 共享契约

| 契约 | 负责仓库 | 规则 |
|---|---|---|
| 账号与登录 | thin-muscle-coach | 主站和 Veli 共用 Supabase 账号；种星词暂不共享（[ADR-0001](../adr/0001-one-identity-and-family.md)） |
| 路由与域名 | thin-muscle-coach（路由表 ADR-0032） | velicoach.com 按路径分给两个 Vercel 项目；子域名改动先在本表登记 |
| 设计语言与 token | 各自维护，规则见 [standards/design.md](../standards/design.md) | 改共享外壳、登录、设计系统时通知其他频道 |
| Agent 内核 | thin-muscle-coach（ADR-0036） | `AgentKernel` 接口和 Pi 适配器、网关配置结构、花费账本结构抽成一个小包，Veli 和种星词钉同一版本、跑同一组一致性测试；运行时、数据库、工具和护栏各自独立。改动通知 words 频道 |
| 主站进 Veli 的来源参数 | thin-muscle-coach（Veli 待实现：[thin-muscle-coach#289](https://github.com/madlouse/thin-muscle-coach/issues/289)） | 主站链到 Veli 的 `/body`、`/app`、`/auth/*` 一律带 `utm_source=velicoach`，`/app` 转登录时保留；二维码直达 `/body?utm_source=velicoach_qr`，Veli 自己的二维码也用这个值，手机扫码落在 Veli，不经过主站首页，以本契约为准，取代主站 PRD F10 和步数表的原写法（主站改 PRD 的票：待主站频道开）。邀请码优先于 `utm_source`；Veli 记进 `landing_view` 和 `signup_completed.channel`〔检查：主站测试核对链到 `/body`、`/app`、`/auth/*` 的每个 href 都带 `utm_source`〕〔验证：普通点击新建的账号 `channel` 为 `velicoach`，扫码为 `velicoach_qr`〕 |
| 主站去 Veli 的登录跳转 | thin-muscle-coach（路由表 ADR-0032；Veli 待实现：[thin-muscle-coach#289](https://github.com/madlouse/thin-muscle-coach/issues/289)） | 主站自己没有登录；它的 Google 登录选项链到 Veli 的 `/auth/google?utm_source=velicoach`，Apple 等 Veli 做到 B2 再加。Veli 的 `/auth/*` 在登录跳转中保留 `utm_source`，直到记进 `signup_completed.channel`〔检查：主站测试核对这个 href 是 `/auth/google?utm_source=velicoach`〕〔验证：从这里新建的账号 `channel` 为 `velicoach`〕 |
| 智能体工具（MCP） | thin-muscle-coach | 工具名、入参、能返回什么字段见 [ADR-0003](../adr/0003-agent-access-boundary.md) |
| 反馈库 | 运营频道开之前由各产品自管 | 每条反馈都有结果并告诉用户 |
| 任务交接 | 本仓库 | [contracts/task.md](../contracts/task.md) |

## 能碰不能碰

- 分支、PR 和跨仓库改动怎么拆，见 [工程规范](../standards/engineering.md)「分支和合并」。
- 生产数据、DNS、计费设置只由主频道在产品负责人确认后改。
