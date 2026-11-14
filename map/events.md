# 主站「开始训练」的埋点取值

主站的 `start_training` 事件按 `option` 区分入口，Veli 和数据分析按这张表对口径。负责仓库：velicoach（主站 PRD 第 6 节，[velicoach#166](https://github.com/madlouse/velicoach/pull/166)）；`qr` 的实际扫码数在 Veli 统计（[thin-muscle-coach#289](https://github.com/madlouse/thin-muscle-coach/issues/289)）。Apple 上线时再加 `apple`。

| `option` | 入口 |
|---|---|
| `app` | 宽度 ≥ 1180px 且能悬停时的主按钮 |
| `google` | 更窄或不能悬停时的主按钮「用 Google 开始训练」，以及展开层里的「用 Google 继续」 |
| `email` | 「用邮箱开始」 |
| `qr` | 展开层打开、二维码显示出来，每展开一次记一次；实际扫了多少由 Veli 按 `utm_source=velicoach_qr` 统计，其中也含本次访问没带来源时在 Veli 页面上的扫码 |

事件另带 `lang` 和这次去处带的 `utm_source`。〔评审：取值和入口的对应要对照主站 PRD 判断；主站埋点测试落地后改成检查〕
