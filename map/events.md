# 主站去 Veli 的来源参数和埋点取值

仓库地图「共享契约」里两行的细则。主站一侧在 velicoach，Veli 一侧待实现在 [thin-muscle-coach#289](https://github.com/madlouse/thin-muscle-coach/issues/289)。

## 1. 来源参数 `utm_source`

**总规则：** 主站和邮件里链到 Veli 的 `/body`、`/en/body`、`/app`、`/auth/*` 一律带 `utm_source`，`/app` 和 `/auth/*` 转登录时保留，直到记进 `signup_completed.channel`。邀请码优先于 `utm_source`；Veli 记进 `landing_view` 和 `signup_completed.channel`。

**取值：** 只认小写字母、数字、`_`、`-`，1 到 32 个字符；空值和不合格的按没带处理，大写不转小写，投放链接一律用小写。主站透传前、Veli 存会话前各校验一次。

**主站（首页在内）：** 只读本页地址里的 `utm_source`，有就原样带到去 Veli 的链接和二维码，没有时链接用 `velicoach`、二维码用 `velicoach_qr`；二维码直达 `/body`，英文页的直达 `/en/body`。主站不写 Cookie 和本地存储，隐私承诺不变。所以访客在主站内换页后，本页地址不再带来源，去 Veli 时回落到缺省值：这是不存储的取舍，不是遗漏。

**Veli：** 进站时把本次访问第一个合格的 `utm_source` 存进 sessionStorage 的 `vc-utm-source`，会话内不覆盖，之后各页读这份，不读地址栏；任一 Veli 页面上的二维码沿用它，没有时用 `velicoach_qr`，免得冲掉 Reddit 等原始来源。`/body` 和 `/en/body` 之间切换语言是 Veli 页内跳转，链接不带 `utm_source`，来源以会话里存的为准。站稳页 `/body`、`/en/body` 由 Veli 渲染，路由归属见 [thin-muscle-coach#185](https://github.com/madlouse/thin-muscle-coach/issues/185) 第 6 节。

**主站的订阅邮件：** 链接带 `utm_source=velicoach&utm_medium=email`；Veli 要不要把 `utm_medium` 记进 `landing_view`，在 #289 定。

手机扫码落在 Veli，不经过主站首页，以本契约为准，取代主站 PRD F10 和步数表的原写法（[velicoach#164](https://github.com/madlouse/velicoach/issues/164)、[velicoach#166](https://github.com/madlouse/velicoach/pull/166)）。

〔检查：主站画板由 `check_veli_links.py` 扫每个去 Veli 的 href 都带 `utm_source`（随 [velicoach#165](https://github.com/madlouse/velicoach/pull/165) 加入，`rebuild.sh` 调用，还没进 CI），站稳页语言切换链接除外；取值校验在主站和 Veli 各有单测，站点代码的测试随主站实现补。透传和会话存储还没有检查，靠下面的验证〕

〔验证：本页地址没带来源时普通点击，新建的账号 `channel` 为 `velicoach`；从 `/?utm_source=reddit` 进主站首页再去 Veli 注册，为 `reddit`；本页地址没带来源时扫主站的码，或本次访问没带来源时在 Veli 页面扫码，为 `velicoach_qr`；本次访问带 `reddit` 进 Veli，之后在任一 Veli 页面扫码或切换语言后注册，仍为 `reddit`；`utm_source` 带空格或超长时按没带处理；从订阅邮件点进来新建的账号为 `velicoach`〕

## 2. 主站「开始训练」的埋点取值

主站的 `start_training` 事件按 `option` 区分入口，Veli 和数据分析按这张表对口径。负责仓库：velicoach（主站 PRD 第 6 节）；`qr` 的实际扫码数在 Veli 统计。Apple 上线时再加 `apple`。

| `option` | 入口 |
|---|---|
| `app` | 宽度 ≥ 1180px 且能悬停时的主按钮 |
| `google` | 更窄或不能悬停时的主按钮「用 Google 开始训练」，以及展开层里的「用 Google 继续」 |
| `email` | 「用邮箱开始」 |
| `qr` | 展开层打开、二维码显示出来，每展开一次记一次；实际扫了多少由 Veli 按 `utm_source` 统计：本页地址没带来源时扫主站的码，和本次访问没带来源时在 Veli 页面上的扫码，都记为 `velicoach_qr`，带了来源时记原始来源 |

事件另带 `lang` 和这次去处带的 `utm_source`。〔评审：取值和入口的对应要对照主站 PRD 判断；主站埋点测试落地后改成检查〕
