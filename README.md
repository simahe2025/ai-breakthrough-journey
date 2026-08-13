# 日课 Rike

每天只攻一件难事。

开源习惯操作系统：把晨计划、午复盘、晚收束做成可运行的日协议，而不是又一个打卡清单。

**在用：** `npm run dev` 后打开 `http://localhost:3000`。数据只存在本机浏览器。

```bash
npm install
npm run dev
```

浏览器打开 `http://localhost:3000`。

## 这是什么

`ai-breakthrough-journey` 最初是一份公开的 7 日突破计划。日课把它收成产品：

| 你看到的 | 实际协议 |
| :--- | :--- |
| 今日唯一 | 当天只允许一件难事 |
| 三站点路径 | 晨计划 → 午复盘 → 晚收束 |
| 连续天数 | 只统计「晚上关掉」的日子 |
| 周览 | 近 7 日有没有收束 |

不做游戏化，不做无限习惯。第一用户是维护者自己：用同一套协议推进科研与高难任务。

## 仓库结构

```
app/            今日页 + 周览
components/     日路径
lib/            日期、本地存储、连续天数
PROTOCOL.md     产品边界（读这个再改功能）
```

## 维护

Primary maintainer: [@simahe2025](https://github.com/simahe2025)

安全与依赖审查、PR、发版均由维护者本人处理。个人复盘数据默认只存在本机；不要把 `localStorage` 导出内容提交进仓库。

## License

MIT
