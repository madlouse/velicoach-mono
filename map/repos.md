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
| 主站进 Veli 的来源参数 | thin-muscle-coach（Veli 待实现：[thin-muscle-coach#289](https://github.com/madlouse/thin-muscle-coach/issues/289)） | 主站和邮件里链到 Veli 的 `/body`、`/en/body`、`/app`、`/auth/*` 一律带 `utm_source`，`/app` 转登录时保留。主站首页的地址写死：去处带 `utm_source=velicoach`，二维码直达 `/body?utm_source=velicoach_qr`，英文页的二维码直达 `/en/body?utm_source=velicoach_qr`。站稳页（`/body`、`/en/body`）上的去处和二维码沿用当前页面的 `utm_source`，没有时去处用 `velicoach`、二维码用 `velicoach_qr`，免得冲掉 Reddit 等原始来源。邮件里的链接再加 `utm_medium=email`，主站周报用 `utm_source=velicoach&utm_medium=email`。手机扫码落在 Veli，不经过主站首页，以本契约为准，取代主站 PRD F10 和步数表的原写法（主站改 PRD 的票：[velicoach#164](https://github.com/madlouse/velicoach/issues/164)）。邀请码优先于 `utm_source`；Veli 记进 `landing_view` 和 `signup_completed.channel`〔检查：主站测试核对链到 `/body`、`/en/body`、`/app`、`/auth/*` 的每个 href 都带 `utm_source`，主站画板由 `check_veli_links.py` 扫〕〔验证：普通点击新建的账号 `channel` 为 `velicoach`；扫主站的码，或在没有 `utm_source` 的站稳页扫码，为 `velicoach_qr`；在带 `utm_source=reddit` 的站稳页扫码，仍为 `reddit`；从周报点进来的落地记到 `utm_medium=email`〕 |
| 主站去 Veli 的登录跳转 | thin-muscle-coach（路由表 ADR-0032；Veli 待实现：[thin-muscle-coach#289](https://github.com/madlouse/thin-muscle-coach/issues/289)） | 主站自己没有登录；Google 入口链到 Veli 的 `/auth/google?utm_source=velicoach`，邮箱入口链到 `/app?utm_source=velicoach`，由 Veli 走邮箱登录；Apple 等 Veli 做到 B2 再加。Veli 的 `/auth/*` 在登录跳转中保留 `utm_source`，直到记进 `signup_completed.channel`〔检查：主站测试核对两个 href 分别是 `/auth/google?utm_source=velicoach` 和 `/app?utm_source=velicoach`〕〔验证：从这两个入口新建的账号 `channel` 都为 `velicoach`〕 |
| 智能体工具（MCP） | thin-muscle-coach | 工具名、入参、能返回什么字段见 [ADR-0003](../adr/0003-agent-access-boundary.md) |
| 反馈库 | 运营频道开之前由各产品自管 | 每条反馈都有结果并告诉用户 |
| 任务交接 | 本仓库 | [contracts/task.md](../contracts/task.md) |

### 主站「开始训练」的埋点取值

主站的 `start_training` 事件按 `option` 区分入口，Veli 和数据分析按这张表对口径。负责仓库：velicoach（主站 PRD 第 6 节，[velicoach#166](https://github.com/madlouse/velicoach/pull/166)）。Apple 上线时再加 `apple`。

| `option` | 入口 |
|---|---|
| `app` | 宽屏的主按钮 |
| `google` | 窄屏的主按钮「用 Google 开始训练」，以及展开层里的「用 Google 继续」 |
| `email` | 「用邮箱开始」 |
| `qr` | 展开层打开、二维码显示出来，每展开一次记一次；实际扫了多少由 Veli 按 `utm_source=velicoach_qr` 统计 |

事件另带 `lang` 和这次去处带的 `utm_source`。〔评审：取值和入口的对应要对照主站 PRD 判断；主站埋点测试落地后改成检查〕

## 能碰不能碰

- 分支、PR 和跨仓库改动怎么拆，见 [工程规范](../standards/engineering.md)「分支和合并」。
- 生产数据、DNS、计费设置只由主频道在产品负责人确认后改。
