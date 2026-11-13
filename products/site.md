# 主站 velicoach.com · 三站入口、看清、动手

**一句话：** AGI 路上的陪练：先站稳，再看清，然后动手。主站是三站的入口，放看清一站的文章、里程碑和学习路径，以及动手一站的开发日志。

**给谁：** 对 AI 既兴奋又不安、想把身体练强、学会和智能体一起做事的人。主线只有三条：开始训练（去 Veli）、读一篇、看我们怎么做。

**核心体验：** 一站、一键、一秒；拿得出手参评设计奖项的完成度，苹果设计语言和玻璃材质，中英双语。

**阶段（2026-11-13）：** v1 开发中。PRD v2.0，关口三 b（规格和拆票）11-12 通过；PR 进集成分支 feature/v1，关口四通过后由产品负责人确认一次合并进 site。

## 去哪读

都在 madlouse/velicoach。

| 要做的事 | 读 |
|---|---|
| 文档地图 | [docs/README.md](https://github.com/madlouse/velicoach/blob/feature/v1/docs/README.md) |
| 需求（PRD） | [主站 PRD](https://github.com/madlouse/velicoach/blob/feature/v1/docs/prd/velicoach.md)（在线文档是唯一来源，这是快照）、[需求追溯](https://github.com/madlouse/velicoach/blob/feature/v1/docs/requirements/trace.md) |
| 设计系统 | [design-system.md](https://github.com/madlouse/velicoach/blob/feature/v1/docs/uiue/design-system.md) |
| 质量词的定义 | [quality-terms.md](https://github.com/madlouse/velicoach/blob/feature/v1/docs/standards/quality-terms.md) |
| 技术方案 | [overview.md](https://github.com/madlouse/velicoach/blob/feature/v1/docs/architecture/overview.md)、[ADR](https://github.com/madlouse/velicoach/blob/feature/v1/docs/architecture/adr/) |
| 运行和环境 | [沙箱契约](https://github.com/madlouse/velicoach/blob/feature/v1/AGENTS.md)、[deploy.md](https://github.com/madlouse/velicoach/blob/feature/v1/docs/deploy.md)、[上线手册](https://github.com/madlouse/velicoach/blob/feature/v1/docs/delivery/launch-runbook.md) |
| 流水线、关口、合并 | [pipeline.md](https://github.com/madlouse/velicoach/blob/feature/v1/docs/standards/pipeline.md) |
| 术语 | [GLOSSARY.md](https://github.com/madlouse/velicoach/blob/feature/v1/docs/GLOSSARY.md) |

## 怎么交付

- **入口：** [AGENTS.project.md](https://github.com/madlouse/velicoach/blob/feature/v1/AGENTS.project.md)（`AGENTS.md` 是沙箱契约，不改）；技能在 `.grok/skills/`，写内容用 velicoach-content，改界面用 velicoach-layout，收录文章用 article-pipeline。
- **完成：** `npm test`、`npm run lint`、`npm run check:terms`、`npm run check:vague`、`npm run check:voice` 通过；中英两版齐全；合并脚本另跑文档先行和注释两项共享检查。
- **合并：** 只走合并脚本；分支只用 `feat/`、`fix/`、`content/`、`obs/`、`chore/` 五种前缀；PR 说明第一行写 `类别：…`，类别决定要几份冷评审。
- **托管：** Vercel；velicoach.com 按路径分给主站和 Veli。频道 velicoach。
- **评论：** Agent 写的评论首行带 `<!-- vc-bot role=<角色> -->`。

## 和别的产品的接口

只用账号里的名字和邮箱，不读健康数据；训练相关的入口都链到 Veli。种星词只从主站链过去，不共享账号（[ADR-0001](../adr/0001-one-identity-and-family.md)）。
