# 引进的技能

这里登记从外部引进的技能：收了哪些、为什么收或不收、来源和许可；各阶段怎么用见 [standards/skills.md](../standards/skills.md)。

**来源：** pstack，Lauren Tan（poteto）的技能栈，MIT 许可（[LICENSE](pstack/LICENSE)）。收的是跨 CLI 的移植版 [mdsmithaustin/pstack](https://github.com/mdsmithaustin/pstack) 提交 `4c98b90`，对照了上游 [cursor/plugins](https://github.com/cursor/plugins) 的 `pstack/` 提交 `6e359ce`，2026-11-13 读取。

**原样收录：** `pstack/` 下的文件一字不改，升级时整目录替换并更新上面的提交号；要改它的做法，写成本仓库的规范或产品的技能，不改副本。〔检查：check-mono-link 核对目录和下表的「收录」行一一对应〕

**挑选标准：** 收给 Agent 能力和验证手段的技能，不收规定它怎么想、怎么一步步做的（[规则怎么定](../standards/rules.md)「约束结果，不约束做法」）；收进来的技能之间引用要闭合，不留断链。

## 收录

| 技能 | 判定 | 用在哪 |
|---|---|---|
| `spec-probes` | 收录 | PRD 和验收标准定稿前找边界和禁止项；从 PRD 推 E2E 案例 |
| `statechart` | 收录 | 状态多的流程（训练计划、订阅、班级）画状态图、查死路和到不了的状态；要 TLA+ 工具，按需用 |
| `typescript-best-practices` | 收录 | 写 TS 代码 |
| `principle-type-system-discipline` | 收录 | 设计类型，让非法状态写不出来 |
| `principle-boundary-discipline` | 收录 | 校验集中在边界（接口、配置、外部服务） |
| `principle-subtract-before-you-add` | 收录 | 加功能或重构前先删死代码 |
| `principle-sequence-verifiable-units` | 收录 | 大改动拆成每步都能验证的小单元 |
| `principle-test-behavior-not-implementation` | 收录 | 写测试：断言用户看得到的行为 |
| `principle-fix-root-causes` | 收录 | 调试：修第一个出错的地方，不加掩盖的保护 |
| `verify-commands` | 收录 | 写或审判定完成的命令（测试、CI、验收脚本），防止什么都没测却通过 |
| `create-verification-skill` | 收录 | 给产品生成 `verify-<产品>` 技能和功能地图：启动、驱动、取证、清理 |
| `maintain-verification-skill` | 收录 | 定期核对验证技能和功能地图有没有过时；发现产品缺陷只记录，不在这次修 |
| `principle-prove-it-works` | 收录 | 宣布完成前对真实产物验证，逐条对需求给证据；它引用的 show-me-your-work 没收，证据按产品的 PR 证据要求留 |
| `correct` | 收录 | 同一类错误出现第二次时，按设计、类型、检查、测试、文字的顺序让它犯不了 |
| `principle-encode-lessons-in-structure` | 收录 | 同上，把纠正写成检查而不是文字 |
| `technical-writing` | 收录 | 写技术文档 |
| `unslop` | 收录 | 去掉文字里的 AI 腔；Veli 仓库里同名的 `unslop` 是另一个做界面的技能，不要用这个覆盖 |

## 不收

| 技能 | 判定 | 理由 |
|---|---|---|
| `runtime-probes` | 改写 | 它的八类探测和晋级三条件写进 [verify/explore.md](../verify/explore.md)；原文让同一个 Agent 接着写测试、改代码，违反 E2E 只发现问题，还依赖不收的 poteto-mode |
| `poteto-mode`、`arena`、`swarm`、`interrogate`、`architect`、`setup-pstack`、`pstack-harness`、`how`、`why`、`show-me-your-work`、`figure-it-out`、`sharpen` | 不收 | 编排和多模型层：编排由频道和产品流水线做，模型按[分工](../contracts/task.md)选；poteto-mode 自己合并 PR，和红线 6 冲突；其余规定 Agent 怎么想、怎么分步 |
| `no-comments`、`deslop`、`documentation-impact` | 不收 | 已经有检查或技能：check-comments、产品的 code-review、check-doc-first |
| `poteto-tdd`、`poteto-teach` | 不收 | 产品已用 Matt Pocock 的 tdd；教学没有场景 |
| `blast-radius`、`create-formal-verification-skill`、`maintain-formal-verification-skill`、`benchmark-checklist` | 暂不收 | 评审影响面、形式化验证、性能测量有用，等第一次真需要时再收；blast-radius 还依赖 arena |
| `automate-me`、`bro`、`in-your-own-words`、`ketchup`、`ketchup-video`、`make-bot-ui`、`poteto-help`、`recall`、`reflect`、`pr-recap` | 不收 | 个人工作流、聊天和展示，和开发验证无关 |
| 其余 16 条 `principle-*` | 不收 | 思考方法类；产品负责人的决策原则在账号记忆，只收和代码、测试、验证直接相关的 8 条 |

## 产品仓库里的副本

主站 `.grok/skills/` 在 2026-11-03 收过一批（[主站 AGENTS.project.md](https://github.com/madlouse/velicoach/blob/feature/v1/AGENTS.project.md)）：和这里同名的六个一致；`deslop`、`no-comments`、`pstack-harness` 是旧版，这里不收。check-mono-link 发现产品里同名技能和这里不一致时打印提示，不拦。
