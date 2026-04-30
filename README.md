# ChatBI Mobile

AI 驱动的销售数据分析移动应用，基于自然语言对话生成图表与数据报表。

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React Native 0.83 + Expo 55 |
| 语言 | TypeScript |
| 导航 | React Navigation (Native Stack) |
| 图表 | ECharts (通过 WebView 渲染) |
| 样式 | 自定义 Aurora Dark Theme |
| 动画 | React Native Animated API |
| 实时通信 | Server-Sent Events (SSE) |

## 项目结构

```
src/
├── components/          # UI 组件
│   ├── ChartCard.tsx        # 图表/数据表切换卡片
│   ├── ChartWebView.tsx    # ECharts WebView 封装
│   ├── ChatInput.tsx       # 消息输入框
│   ├── DataTable.tsx       # 数据表格
│   ├── EmptyState.tsx       # 空状态引导
│   ├── LoadingIndicator.tsx # AI 处理阶段指示器
│   ├── MarkdownText.tsx     # Markdown 轻量渲染
│   └── MessageItem.tsx      # 消息气泡
├── screens/             # 页面
│   ├── ChatScreen.tsx       # 对话主界面
│   ├── SessionListScreen.tsx # 历史会话列表
│   └── ChartDetailScreen.tsx # 图表全屏查看
├── navigation/          # 导航配置
├── context/             # 全局状态
├── services/            # API 与 SSE 服务
├── hooks/               # 自定义 Hooks
├── theme/               # 主题系统
│   ├── colors.ts            # Aurora 极光色板
│   └── animations.ts        # 动画常量
├── types/               # TypeScript 类型定义
└── constants/           # 常量配置
```

## 功能特性

- **自然语言查询** — 输入业务问题，AI 自动理解并生成 SQL 查询
- **实时流式响应** — SSE 推送分阶段状态（生成SQL → 执行 → 分析 → 渲染图表）
- **图表 + 数据表双视图** — 图表模式直观可视化，数据表模式支持分页浏览
- **历史会话** — 自动保存会话上下文，支持回溯历史对话
- **全屏图表** — 任意图表支持全屏放大查看

## 开发

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm start         # 启动 Expo
npm run android    # 启动 Android
npm run ios        # 启动 iOS
```

### 技术要点

**Aurora Dark Theme** — 沉浸式深色主题，冰蓝主色 + 玻璃拟态导航栏 + 渐变气泡。

**WebView 图表渲染** — 后端返回 ECharts HTML 片段，前端通过 WebView 渲染。`ChartWebView` 组件负责将百分比高度替换为固定像素值，解决布局高度塌陷问题。

**SSE 流式消息** — `services/sse.ts` 基于 `react-native-sse`，将 AI 分阶段处理结果（phase + content + chartHtml + records）实时推送至前端。

## API 配置

在 `constants/api.ts` 中配置后端地址：

```typescript
export const API_BASE = 'http://your-backend-url.com';
```

## License

MIT
