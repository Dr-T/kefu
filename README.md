# 客服数据分析系统 — 产品功能介绍

本系统面向客服团队与数据分析人员，提供从数据导入、可视化探索到智能报告生成的一体化解决方案，帮助快速洞察客服运营指标并产出专业报告。

## 核心功能
- 数据上传与高亮展示
  - 支持 `CSV / XLSX` 文件导入，自动识别表头与字段。
  - 行列高亮与关键词搜索，便于快速定位关键信息。
  - 基础数据清洗与列选择，保障图表与报告的数据质量。

- 可视化自助分析图表
  - 内置折线图、柱状图、饼图、排行榜等常用图表。
  - 支持按字段维度切换与筛选，快速查看趋势与分布。
  - 基于 ECharts 渲染，高性能、交互友好。

- 智能报告生成（大模型驱动）
  - 在页面内配置并保存大模型参数（API URL、API Key、模型名称）。
  - 本地缓存配置（浏览器 localStorage），下次使用自动读取。
  - Markdown 流式渲染，边生成边预览，支持一键导出报告内容。
  - 完整的错误提示与状态反馈，保障生成过程可控。

- 安全与隐私
  - 项目不包含任何硬编码密钥；密钥仅保存在本地浏览器，不随代码上传。
  - 建议在团队内统一管理 API Key 权限与轮换策略。

## 使用指南
- 本地启动
  - 安装依赖：`npm install`
  - 开发模式：`npm start`（默认端口 `http://localhost:3000`）
  - 生产构建：`npm run build`（输出目录 `build/`）

- 数据格式建议
  - 第一行为表头，常见字段：`时间/日期、渠道、坐席、用户、问题类型、满意度、处理时长、是否首次解决` 等。
  - 文本编码建议使用 `UTF-8`。

- 智能报告参数配置
  - 进入“智能报告生成”页，点击“配置大模型参数”。
  - 填写：`API URL`、`API Key`、`模型名称`，保存后将自动缓存于浏览器。
  - 生成时可实时查看 Markdown 输出进度，生成完成后可复制/导出。

## 部署说明
- 上传到 GitHub
  - 初始化：`git init && git add . && git commit -m "chore: init"`
  - 关联远程：`git remote add origin <your-repo-url>`
  - 推送：`git push -u origin main`

- 部署到 Vercel
  - 在 Vercel 导入 GitHub 仓库，框架选择自动检测（Create React App）。
  - 构建命令：`npm run build`；输出目录：`build`。
  - 首次部署完成后即可获得预览 URL，用于团队评审与验收。

## 技术栈
- 前端：React、Ant Design、ECharts、react-markdown
- 构建：Create React App（`react-scripts`）

## 目录结构
```
/Users/admin/Trae/kefu
├── public/                # 静态资源
├── src/                   # 源码
│   ├── components/        # 功能组件
│   │   ├── DataUpload.js
│   │   ├── DataVisualization.js
│   │   └── ReportGenerator.js
│   ├── App.js / App.css   # 页面框架与样式
│   ├── index.js / index.css
└── package.json
```

## 常见问题（FAQ）
- API Key 安全性？
  - 密钥仅保存在浏览器 localStorage，不会写入仓库或打包文件。
- 构建或运行出现 Node 版本警告？
  - 建议本地开发使用 Node `>= 18`，以获得更好的兼容性与安全支持。
- 大模型生成失败？
  - 请检查 API URL、Key、模型名称是否正确，以及网络连通性与调用额度。

## 研发路线（Roadmap）
- 报告模板中心与多主题风格
- 历史报告存档与在线预览/分享
- 导出 PDF/Docx 与自定义封面
- 多模型选择与自动降级策略
- 多语言支持与国际化

如需二次开发或企业级定制，欢迎在仓库提交 Issue 进行讨论。
