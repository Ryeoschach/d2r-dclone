# Diablo Clone Tracker

基于 Cloudflare Workers 的 Diablo Clone 状态仪表盘与飞书通知服务。
项目每 5 分钟读取一次 D2RuneWizard 接口，监控毁灭之王和术士君临下的
全部 24 种服务器组合。

## 功能

- 监控亚区、美区、欧区
- 覆盖毁灭之王、术士君临
- 覆盖天梯/非天梯与 SC/HC
- 进度或上次触发时间变化时发送中文飞书通知
- 同一轮的多项变化合并为一张飞书卡片
- 提供中文 Web 仪表盘和 4 阶、5 阶快速筛选，优先展示术士君临
- 移动端按区域使用 2×2 状态卡片，无需左右滑动
- 可在页面设置后台接口拉取间隔，最快 1 分钟
- 页面默认每 1 分钟自动刷新，支持开关、1–5 分钟快捷值和自定义分钟数
- 展示当前/下一阶段恐怖区域、常见怪物免疫、刷图评级和切换倒计时
- 使用 Cloudflare KV 保存状态，避免重复通知
- 轮询无变化时不写 KV，避免每分钟拉取耗尽免费写入额度

## 数据映射

| API 字段 | 含义 |
| --- | --- |
| `rotw=false` | 毁灭之王 |
| `rotw=true` | 术士君临 |
| `ladder=false/true` | 非天梯/天梯 |
| `hardcore=false/true` | SC/HC |
| `Asia/Americas/Europe` | 亚区/美区/欧区 |

恐怖区域数据来自 D2RuneWizard 的玩家上报追踪接口，并非暴雪官方接口。
页面会同时保留英文区域名，未知的新区域也会自动回退显示英文原名。
常见免疫与 S/A/F 刷图评级来自 D2RuneWizard 恐怖区域追踪页的区域资料，
属于静态参考信息，不会增加上游接口请求或 Cloudflare KV 写入次数。

程序会校验 `2 DLC × 2 天梯类型 × 2 SC/HC × 3 区域` 共 24 种组合。
接口缺项、重复或出现未知组合时，不会覆盖 KV 中的正常状态。

## 部署

需要准备：

- Node.js 20 或更高版本
- Cloudflare 账号
- 飞书群自定义机器人 Webhook
- 可选的飞书机器人签名密钥

克隆项目并安装依赖：

```bash
git clone git@github.com:Ryeoschach/d2r-dclone.git
cd d2r-dclone
npm install
npx wrangler login
```

复制配置模板：

```bash
cp wrangler.toml.example wrangler.toml
```

创建 Cloudflare KV：

```bash
npx wrangler kv namespace create DCLONE_STATE
```

将返回的 namespace ID 填入 `wrangler.toml`：

```toml
[[kv_namespaces]]
binding = "DCLONE_STATE"
id = "你的 KV namespace ID"
```

配置飞书 Webhook：

```bash
npx wrangler secret put FEISHU_WEBHOOK
```

机器人启用了签名校验时，再配置：

```bash
npx wrangler secret put FEISHU_SECRET
```

如需使用鉴权的 `POST /run` 手动同步接口：

```bash
npx wrangler secret put MANUAL_TRIGGER_TOKEN
```

该令牌也用于保护网页中的“后台接口拉取”设置。未配置令牌时，访客仍可查看
仪表盘和设置自己的页面自动刷新，但无法修改 Worker 的后台拉取频率。

测试并部署：

```bash
npm test
npm run deploy
```

部署完成后访问 Wrangler 输出的 Worker 地址，即可打开状态仪表盘。

### 升级已有部署

从旧版本升级时，请确认本地 `wrangler.toml` 的 Cron 已改为每分钟：

```toml
[triggers]
crons = ["* * * * *"]
```

同时确保已配置网页管理设置所需的令牌：

```bash
npx wrangler secret put MANUAL_TRIGGER_TOKEN
npm run deploy
```

部署后刷新页面，即可看到“页面自动刷新”和“后台接口拉取”两个设置区。

## 首次同步

首次定时任务执行前，网页会显示“尚无状态数据”。可以等待最多 5 分钟，
也可以配置 `MANUAL_TRIGGER_TOKEN` 后立即执行：

```bash
curl -X POST "https://你的-worker域名/run" \
  -H "Authorization: Bearer 你的令牌"
```

默认 `NOTIFY_ON_FIRST_RUN = "false"`，首次同步只建立状态基线，不会一次发送
24 条通知。需要首次同步也通知时，可在部署前改为 `"true"`。

## 使用

- `/`：Web 状态仪表盘
- `/api/status`：读取 KV 中最近一次同步的数据
- `GET /api/settings`：读取当前后台拉取间隔
- `POST /api/settings`：修改后台拉取间隔，需要 Bearer Token
- `POST /run`：立即拉取接口、比较状态并发送通知，需要 Bearer Token

只有 `progress`、`lastWalk` 或服务器组合发生变化时才通知。
单独的 `lastUpdate` 变化不会触发通知。

恐怖区域和地表暗黑使用独立调度：DC 按页面设置的分钟间隔同步；
恐怖区域每 30 分钟切换。切换边界到达时，页面立即把上一轮的 `next`
提升为当前区域，不必等待上游接口；Worker 同时请求新的下一阶段。如果
上游尚未更新，会在边界后的前 3 分钟内每分钟重试，且无变化时不写 KV。
恐怖区域接口暂时失败时，
地表暗黑任务仍会继续，并保留 KV 中最近一次成功取得的恐怖区域。

页面中的两个间隔相互独立：

- 页面自动刷新只重新读取 KV，不会直接请求 D2RuneWizard；设置保存在浏览器中。
- 后台接口拉取决定 Worker 请求 D2RuneWizard 的频率；设置保存在 Cloudflare KV。

后台可以每分钟请求接口，但只有 DC 进度、上次触发时间或恐怖区域实际变化时
才写入 KV。页面顶部显示的是“状态数据更新”时间，不是每次轮询时间。

Cloudflare Cron 每分钟唤醒一次 Worker，再根据 KV 中的后台间隔判断是否需要
真正拉取。Cloudflare Cron 的最小粒度是 1 分钟，因此后台间隔允许设置为
1 至 1440 的整数分钟。

接口时间为 Unix 秒级时间戳，页面和飞书消息默认转换为
`Asia/Shanghai` 时区。

## 本地开发

```bash
npm test
npm run dev
```
