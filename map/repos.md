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
| 主站进 Veli 的来源参数 | thin-muscle-coach（Veli 待实现：[thin-muscle-coach#289](https://github.com/madlouse/thin-muscle-coach/issues/289)）；主站一侧在 velicoach | **总规则：** 主站和邮件里链到 Veli 的 `/body`、`/en/body`、`/app`、`/auth/*` 一律带 `utm_source`，`/app` 和 `/auth/*` 转登录时保留，直到记进 `signup_completed.channel`。**来源怎么取：** 取本次访问带进来的 `utm_source`，进站时按会话存，之后各页读这份，不读地址栏；主站和 Veli 都这样做。**主站首页写死：** 去处带 `utm_source=velicoach`，二维码直达 `/body?utm_source=velicoach_qr`，英文页的二维码直达 `/en/body?utm_source=velicoach_qr`。**其余页面**（主站首页以外的页面，如导航和文章里的站稳入口；站稳页 `/body`、`/en/body` 由 Veli 渲染，`/en/body` 还没做，ADR-0032 现在把 `/en/*` 划给主站，归属随 #289 补；任一 Veli 页面）：去处和二维码都沿用本次访问的来源；本次访问没带时，去处用 `velicoach`，二维码用 `velicoach_qr`，免得冲掉 Reddit 等原始来源。**主站的订阅邮件：** 链接带 `utm_source=velicoach&utm_medium=email`；Veli 现在只记 `utm_source`，要不要把 `utm_medium` 记进 `landing_view` 由 Veli 在 thin-muscle-coach#289 定。手机扫码落在 Veli，不经过主站首页，以本契约为准，取代主站 PRD F10 和步数表的原写法（主站改 PRD：[velicoach#164](https://github.com/madlouse/velicoach/issues/164)、[velicoach#166](https://github.com/madlouse/velicoach/pull/166)）。邀请码优先于 `utm_source`；Veli 记进 `landing_view` 和 `signup_completed.channel`〔检查：主站画板由 `check_veli_links.py` 扫每个去 Veli 的 href 都带 `utm_source`（随 [velicoach#165](https://github.com/madlouse/velicoach/pull/165) 加入，`rebuild.sh` 调用，还没进 CI）；站点代码的 href 测试随主站实现补。按会话沿用来源还没有检查，靠下面的验证〕〔验证：普通点击新建的账号 `channel` 为 `velicoach`；扫主站首页的码，或本次访问没带 `utm_source` 时在 Veli 页面扫码，为 `velicoach_qr`；本次访问带 `utm_source=reddit` 进来，之后在任一 Veli 页面扫码，仍为 `reddit`；从订阅邮件点进来新建的账号 `channel` 为 `velicoach`〕 |
| 主站去 Veli 的登录跳转 | thin-muscle-coach（路由表 ADR-0032；Veli 待实现：[thin-muscle-coach#289](https://github.com/madlouse/thin-muscle-coach/issues/289)） | 主站自己没有登录；主站页面上的 Google 入口链到 Veli 的 `/auth/google`，邮箱入口链到 `/app`，由 Veli 走邮箱登录；`utm_source` 按上一行取（首页写死 `velicoach`，其余页面沿用本次访问的来源）。Apple 等 Veli 做到 B2 再加。已有会话的人直接到今天的训练，不再走登录〔检查：主站画板由 `check_veli_links.py` 扫两个入口都带 `utm_source`（同上）；站点代码的测试随主站实现补〕〔验证：从主站首页这两个入口新建的账号 `channel` 都为 `velicoach`〕 |
| 智能体工具（MCP） | thin-muscle-coach | 工具名、入参、能返回什么字段见 [ADR-0003](../adr/0003-agent-access-boundary.md) |
| 反馈库 | 运营频道开之前由各产品自管 | 每条反馈都有结果并告诉用户 |
| 主站「开始训练」的埋点取值 | velicoach（主站 PRD 第 6 节） | `start_training` 的 `option` 四个取值各对应哪个入口，见 [events.md](events.md) |
| 任务交接 | 本仓库 | [contracts/task.md](../contracts/task.md) |

## 能碰不能碰

- 分支、PR 和跨仓库改动怎么拆，见 [工程规范](../standards/engineering.md)「分支和合并」。
- 生产数据、DNS、计费设置只由主频道在产品负责人确认后改。
