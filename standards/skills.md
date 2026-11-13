# 按阶段用技能（跨产品）

拿到清楚的 PRD 之后，从需求到上线验证，每个阶段要交什么、先拿哪几个技能。技能给能力，交付好不好由每个阶段的产出和检查判，不由用了哪个技能判。

## 阶段和技能

pstack 的技能在 [skills/pstack/](../skills/README.md)；Matt Pocock 的技能和 `tmc-*`、`velicoach-*` 在各产品仓库。

| 阶段 | 要交出的结果 | 先拿 | 产品自己的 |
|---|---|---|---|
| 需求 | 每条需求有编号，验收标准能判对错，边界和禁止项都有结论 | grill-with-docs、`spec-probes`；状态多的流程加 `statechart` | Veli `tmc-product-rules`；主站 `velicoach-content` |
| 规格和拆票 | 规格；票带依赖，每张引 PRD 编号 | to-spec、to-tickets | |
| 技术方案 | ADR；类型和边界先定 | domain-modeling、`principle-type-system-discipline`、`principle-boundary-discipline` | Veli `tmc-arch-review` |
| 编码 | 测试先行，每一步都能验证 | implement、tdd、`typescript-best-practices`、`principle-subtract-before-you-add`、`principle-sequence-verifiable-units`；调试用 `principle-fix-root-causes` | Veli `tmc-frontend`；主站 design-ui |
| 测试 | 测试断言用户看得到的行为；判定命令在该失败时真的失败 | `principle-test-behavior-not-implementation`、`verify-commands` | Veli `tmc-unit-test`、`tmc-ui-test` |
| E2E 验收 | 案例覆盖 PRD，在集成环境和线上跑过，有覆盖率报告（[verify/](../verify/README.md)） | `create-verification-skill`、`maintain-verification-skill`、`spec-probes` | Veli `tmc-e2e`、`tmc-ux-walkthrough`；design-bar |
| 评审和完成 | 逐条需求对上证据，缺的写明 | `principle-prove-it-works`、code-review、design-bar | Veli `tmc-cold-review` |
| 纠正 | 同一类错误第二次出现时，让它犯不了 | `correct`、`principle-encode-lessons-in-structure` | |
| 文档和文字 | 读者一遍看懂，没有 AI 腔 | `technical-writing`、`unslop` | 主站 `velicoach-content` |

## 怎么用好

- **spec-probes 用在写代码之前：** 它对每条需求问边界（空、一、多、超长、并发、中断）和禁止项，每个问题都要落成需求里的一句话或明确不管；推出来的边界就是 E2E 案例的来源。
- **create-verification-skill 每个产品做一次：** 生成 `verify-<产品>` 技能和功能地图，按 [verify/](../verify/README.md) 的模块拆；之后用 maintain-verification-skill 定期核对，地图过时比没有地图更糟。
- **verify-commands 审每一条判定命令：** 包括 CI 门槛、E2E 的通过条件和覆盖率门槛；先确认它在功能坏掉时会失败，再信它的通过。
- **correct 接在每次纠正之后：** 产品负责人或评审第二次指出同一类问题，用它按设计、类型、检查、测试、文字的顺序处理，报错写清去改哪里。
- **statechart 只在状态真多的时候用：** 要装 TLA+ 工具；两三个状态的流程画图就够。

## 规则

1. **技能是工具，不是流程：** 用哪几个、什么顺序、怎么想，由干活的 Agent 定；验收只看上表的结果和产品的检查。〔评审：结果够不够好要对照 PRD 和证据〕
2. **从哪读到：** Claude Code、Grok 的会话读同级克隆的 `../velicoach-mono/skills/pstack/<名字>/SKILL.md`，也可以原样复制进产品的技能目录；Codex 云端读不到本仓库，任务卡写明这次要交的结果，不抄技能全文。〔检查：check-mono-link 发现产品里同名技能和这里不一致时提示〕
3. **加一个外部技能：** 先在 [skills/README.md](../skills/README.md) 写判定和理由，引用要闭合，再原样收进来；不改副本。〔检查：check-mono-link 核对登记和目录一致〕
