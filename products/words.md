# 种星词 SeedStar Words · 看清里的儿童学习

**一句话：** 给深圳 1–9 年级学生的背单词 Web App，沪教牛津版教材，FSRS 间隔复习；今天学的词是种下的种子，隔天还能答对才长成星图上的一颗亮星。

**给谁：** 学生先自学，再在邀请码组成的同班小队里互相出题、验证；按学校开通，由学校管理员和老师管班级和词表。初三是第一批发布和测试人群。

**核心体验：** 好玩、能和同学一起学；诚实点亮，不靠积分和连胜。不做自由聊天、私信、公开主页、广告、支付和第三方统计。

**阶段（2026-11-13）：** M1 试玩版已在 words.velicoach.com；下一步是试点账号（M1.5）。公益、0 元运行。

## 去哪读

都在 madlouse/zhongkao-word-atlas。

| 要做的事 | 读 |
|---|---|
| 需求（PRD） | [输入台账](https://github.com/madlouse/zhongkao-word-atlas/blob/main/docs/00-input-ledger.md)（只追加）→ [PRD](https://github.com/madlouse/zhongkao-word-atlas/blob/main/docs/PRD.md) |
| 需求、设计、代码、测试的追溯 | [requirements/README.md](https://github.com/madlouse/zhongkao-word-atlas/blob/main/docs/requirements/README.md) |
| 设计系统 | [21-design-system.md](https://github.com/madlouse/zhongkao-word-atlas/blob/main/docs/21-design-system.md)、[界面检查表](https://github.com/madlouse/zhongkao-word-atlas/blob/main/docs/ui-review-checklist.md) |
| 合规 | [08-compliance.md](https://github.com/madlouse/zhongkao-word-atlas/blob/main/docs/08-compliance.md) |
| 技术方案 | [22-technical-design.md](https://github.com/madlouse/zhongkao-word-atlas/blob/main/docs/22-technical-design.md)、[06-data-model.md](https://github.com/madlouse/zhongkao-word-atlas/blob/main/docs/06-data-model.md) |
| 运行和环境 | [app-u/.env.example](https://github.com/madlouse/zhongkao-word-atlas/blob/main/app-u/.env.example)、[34-deploy.md](https://github.com/madlouse/zhongkao-word-atlas/blob/main/docs/34-deploy.md)、[44-db-ops.md](https://github.com/madlouse/zhongkao-word-atlas/blob/main/docs/44-db-ops.md) |

## 怎么交付

- **入口：** [AGENTS.md](https://github.com/madlouse/zhongkao-word-atlas/blob/main/AGENTS.md)。
- **完成：** `bash scripts/lint-app-u.sh` 和 app-u 的 `npm test` 通过；`node scripts/check-trace.mjs` 通过；改了需求的同步更新 PRD 和追溯表；界面改动附截图；合并前跑文档先行和注释两项共享检查（这个仓库还没有 CI，见[工程规范](../standards/engineering.md)「文档先行」第 4 条）。
- **执行位置：** 构建、测试、截图只在 box 或 Mac mini 上跑，不在 MacBook Pro 上。
- **托管：** Cloudflare Pages；独立的 Supabase。频道 words。

## 和别的产品的接口

家长同意和数据托管方案定下之前，只从主站链过去，不共享账号，不进周报（[ADR-0001](../adr/0001-one-identity-and-family.md)）。给孩子的 AI 只给生成后可审的内容。
