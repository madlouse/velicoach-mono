# velicoach-mono

Velicoach 生态的手册仓库：愿景、商业化、路线、术语、仓库地图和产品卡、跨产品规范（设计、工程、内容）、共享契约、跨产品 ADR 和多智能体交接协议。不放产品代码。入口是 [AGENTS.md](AGENTS.md)。

检查：`node scripts/check-mono-link.mjs`（在各产品仓库与本仓库同级克隆时运行）；`node --test scripts/*.test.mjs`（共享检查脚本的测试）。

`check-mono-link` 核对这些：AGENTS.md 不超过 4 KB、根目录不超过 15 项；每份文档不超过 6 KB，标题下第一句话说清管什么；standards/、contracts/、adr/ 和根目录的文档都从 AGENTS.md 直接链到，保证从产品仓库两跳内读到（[ADR-0004](adr/0004-how-agents-read-the-handbook.md)）；相对链接都在；链到产品仓库的链接用集成分支，文件在同级克隆里存在；每个产品仓库的入口文件有入口块，入口块和技能里写到的 `velicoach-mono/<路径>.md` 都存在；共享脚本 `check-doc-first.mjs`、`check-comments.mjs` 的副本和这里一字不差，`.velicoach-checks.json` 的 `docFirst` 和 `comments` 配置齐全、正则能编译；产品卡有「需求（PRD）」「技术方案」「运行和环境」三行。没有同级克隆的产品仓库跳过并提示。用法：`node scripts/check-mono-link.mjs [--root <放产品仓库的父目录>]`。
