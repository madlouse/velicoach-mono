# Veli（威利）· 站稳

**一句话：** 每个人的健康总管。除了只能亲身去做的，其余都由威利提前想好、管好；B1 从力量训练切入，让训练每周真的发生。

**给谁：** 屏幕前时间长、想把身体练强却总断的成年人；儿童模式挂在家长账号下（2026-11-13 定，合规前提见 [ADR-0001](../adr/0001-one-identity-and-family.md)）。

**核心体验：** 主界面就是和威利的对话，一轮是背后做好的事、一句话、一张卡、最多两个操作。第一个惊喜是「被安排好的训练日」；断了、忙了、病了都接回来，不清零。

**阶段（2026-11-13）：** B1 开发中，票合并进集成分支 feature/b1；端到端通过后由产品负责人确认一次进 main。公开上线前先过「第一个用户」里程碑。

## 去哪读

都在 madlouse/thin-muscle-coach。

| 要做的事 | 读 |
|---|---|
| 一页看懂产品 | [方案总览](https://github.com/madlouse/thin-muscle-coach/blob/feature/b1/docs/product/overview.md) |
| 需求（PRD） | [PRD](https://github.com/madlouse/thin-muscle-coach/blob/feature/b1/docs/product/requirements/README.md)，按模块分目录 |
| 威利怎么做事 | [工作手册](https://github.com/madlouse/thin-muscle-coach/blob/feature/b1/docs/agent/veli-sop.md) |
| 设计系统 | [design-system.md](https://github.com/madlouse/thin-muscle-coach/blob/feature/b1/docs/design/design-system.md) |
| 技术方案 | [tech-stack.md](https://github.com/madlouse/thin-muscle-coach/blob/feature/b1/docs/architecture/tech-stack.md)、[ADR](https://github.com/madlouse/thin-muscle-coach/blob/feature/b1/docs/architecture/adr/README.md) |
| 运行和环境 | [.env.example](https://github.com/madlouse/thin-muscle-coach/blob/feature/b1/.env.example)、[本地环境](https://github.com/madlouse/thin-muscle-coach/blob/feature/b1/.claude/skills/tmc-dev-setup/SKILL.md)、[部署](https://github.com/madlouse/thin-muscle-coach/blob/feature/b1/.claude/skills/tmc-deploy/SKILL.md) |
| 规范地图（层 × 维度） | [docs/standards/README.md](https://github.com/madlouse/thin-muscle-coach/blob/feature/b1/docs/standards/README.md) |
| 分支和合并 | [agent-gitflow.md](https://github.com/madlouse/thin-muscle-coach/blob/feature/b1/docs/standards/agent-gitflow.md) |
| 术语 | [GLOSSARY.md](https://github.com/madlouse/thin-muscle-coach/blob/feature/b1/docs/GLOSSARY.md) |

## 怎么交付

- **入口：** 仓库根目录 [AGENTS.md](https://github.com/madlouse/thin-muscle-coach/blob/feature/b1/AGENTS.md)，按任务场景先用对应的 tmc- 技能。
- **完成：** `npm run verify` 全绿，合并门槛另跑文档先行和注释两项共享检查；界面按检查表；文档、ADR、设计决定、测试数据同步更新。
- **托管：** Vercel；Supabase；Cloudflare R2。频道 thin-muscle-coach。
- **评论：** Agent 写的评论首行带 `<!-- veli-bot role=<角色> -->`。

## 和别的产品的接口

负责账号与登录、velicoach.com 的路由表、对外的 MCP 工具（[共享契约](../map/repos.md)）。健康明细不出 Veli，主站只用账号里的名字和邮箱（[ADR-0002](../adr/0002-profile-and-memory-zones.md)）。
