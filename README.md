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
- 提供中文 Web 仪表盘和 4 阶、5 阶快速筛选
- 使用 Cloudflare KV 保存状态，避免重复通知

## 数据映射

| API 字段 | 含义 |
| --- | --- |
| `rotw=false` | 毁灭之王 |
| `rotw=true` | 术士君临 |
| `ladder=false/true` | 非天梯/天梯 |
| `hardcore=false/true` | SC/HC |
| `Asia/Americas/Europe` | 亚区/美区/欧区 |

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

测试并部署：

```bash
npm test
npm run deploy
```

部署完成后访问 Wrangler 输出的 Worker 地址，即可打开状态仪表盘。

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
- `POST /run`：立即拉取接口、比较状态并发送通知，需要 Bearer Token

只有 `progress`、`lastWalk` 或服务器组合发生变化时才通知。
单独的 `lastUpdate` 变化不会触发通知。

接口时间为 Unix 秒级时间戳，页面和飞书消息默认转换为
`Asia/Shanghai` 时区。Cloudflare Cron 表达式 `*/5 * * * *`
表示每 5 分钟执行一次。

## 本地开发

```bash
npm test
npm run dev
```

`wrangler.toml` 包含部署环境配置，已被 Git 忽略；仓库只提交
`wrangler.toml.example`。
