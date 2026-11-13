# ADR-0004 规范怎么组织，Agent 才读得准、读得省

状态：已接受（2026-11-13）。产品负责人提出要单独论证，Claude 比较三种做法并用冷读测试验证。

## 问题

Agent 在产品仓库里接到任务，要用最少的上下文读到对应的那一份规范。读不到就按习惯做；读太多，常驻上下文每一轮都在付钱，指令越长越容易被忽略。要同时做到准（读到权威的那份）、省（常驻的只有每次都要守的）、稳（文件挪了，指向它的地方会被查出来）。

## 已知的事实

- Codex、Cursor、Gemini CLI 等读仓库里的 AGENTS.md，离被改文件最近的那份优先；Claude Code 读 CLAUDE.md，三个产品仓库都用 `@AGENTS.md` 把它接上（[agents.md](https://agents.md/)、[Claude Code 记忆](https://code.claude.com/docs/en/memory)）。
- Claude Code 启动时把 `@` 引入的文件整份读进来，引入不省上下文；子目录的说明文件读到那个目录才加载；建议每份 200 行以内，多步骤流程放进技能（同上）。
- Agent Skills 三级渐进：启动时只放名字和描述，相关才读全文，再按需读附带文件（[Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)，2025-10-16）。
- Manus 把文件系统当上下文：内容可以拿掉，只要路径还在就能找回来（[Context Engineering for AI Agents](https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus)，2025-07-18）。
- llms.txt 是给网站的约定：一个标题、一段摘要、几组「链接：一句说明」，次要的放 Optional 一节（[llmstxt.org](https://llmstxt.org/)，Jeremy Howard，2024-09-03）。

## 三种做法

| | 薄入口，按任务渐进加载 | 一份总索引 | llms.txt 式 |
|---|---|---|---|
| 怎么做 | 入口块指到本手册的任务表，一行一个任务指到一份规范 | 一份文件列出所有文档，入口指到它或整份引入 | 一份 llms.txt 按主题列链接，另可拼全文 |
| 常驻成本 | 入口块几行 | 整份引入时随文档数增长 | 读全文时最高 |
| 读到对的那份 | Agent 带着任务来，一步对上 | 要自己把任务翻成主题 | 同中间 |
| 维护 | 新文档在任务表加一行 | 每份都进索引 | 每份都进索引，全文要重新生成 |

## 决定

用第一种：薄入口，按任务渐进加载。索引借 llms.txt 的写法：本手册的 AGENTS.md 就是索引，按任务分行。不整份引入，也不拼全文，两者都会把少数任务才用的内容塞进每一轮。

具体规则，能查的都交给 `node scripts/check-mono-link.mjs`：

1. **两跳：** 从任何一个产品仓库的入口文件出发，最多再打开两份文件就读到对的规范：入口块 → 本手册的任务表 → 规范；常用的几类任务在入口块里直接写本手册的路径，一跳到。检查：standards/、contracts/、adr/ 和根目录的文档都从 AGENTS.md 直接链到。
2. **一份一个主题，开头一句话：** 每份文档标题下第一句话说清它管什么，Agent 读一句就能决定要不要往下读；每份不超过 6 KB，长了就按主题拆。检查：开头和大小。
3. **常驻的只放每次都要守的：** 本手册 AGENTS.md 不超过 4 KB，只放红线、任务表和放在哪一层；产品仓库的入口块不超过一段加一张小表，Veli 受它自己的场景字节上限约束，只放一行。
4. **路径写本地的：** 入口块和技能里写 `../velicoach-mono/AGENTS.md`、`velicoach-mono/<路径>.md` 这样的本地路径，Agent 不用从网址推断克隆位置。检查：写到的路径都存在。
5. **跨产品的 ADR 写全路径：** 在产品仓库里写 `velicoach-mono/adr/<文件名>`，不只写编号，免得和产品自己的 ADR 混淆。
6. **指到对的那一节：** 入口块写到该看的节（如设计规范的「底线和儿童档」），并带上产品自己的实现位置（如主站的 overview.md「账号」）。
7. **Codex 云端靠任务卡：** 读不到本手册的执行者，由写卡的 Claude 把要守的条目原文抄进卡里（[任务交接协议](../contracts/task.md)）。

## 冷读测试

2026-11-13，三个全新的 Agent 各在一个产品仓库，从自动加载的入口文件出发，只顺着读到的链接和路径走，不许搜索和列目录。

| 仓库 | 任务 | 读到的地方 | 跳数 |
|---|---|---|---|
| Veli | 改界面要守哪些跨产品底线 | standards/design.md「底线」 | 2 |
| Veli | src/core 里能不能写注释 | engineering.md「结构和代码」第 6 条 | 1–2 |
| Veli | 想改文档先行规则，去哪提、谁批 | contracts/spec-change.md | 2 |
| 主站 | 加登录入口、和 Veli 共用账号 | repos.md 共享契约、主站 overview.md「账号」 | 1–2 |
| 主站 | 派一个修 bug 的任务给 Codex | contracts/task.md | 1 |
| 主站 | 只改 src/ 的 PR 正文写什么、能不能写注释 | pipeline.md §7、engineering.md | 1–2 |
| 种星词 | 能不能做 AI 现场生成例句 | 红线 1、PRD「明确不做」 | 0–1 |
| 种星词 | 改单词卡配色和按钮大小 | standards/design.md | 1 |
| 种星词 | 想放宽共享的注释检查 | contracts/spec-change.md | 1–2 |

九个任务都在两跳内找到。测试也找出六处读偏或读窄的地方，都已改掉：入口块写网址要自己推本地路径（规则 4）；两边都有 ADR-0001（规则 5）；种星词的设计指针漏了底线、主站的账号指针没带主站自己的决定（规则 6）；入口块的注释规则漏了中文写法和工具指令（已补）；任务卡没带主站的分支前缀和「类别：」行，Codex 的 PR 会被合并脚本拒掉（任务卡加「交付格式」）。

## 以后怎么守

加、挪文档或改入口块就跑 `node scripts/check-mono-link.mjs`；结构有大的变化时重跑冷读测试，结果追加在上面，按[规范变更协议](../contracts/spec-change.md)记一行。
