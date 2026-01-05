# JSON Tool

一个功能强大、界面现代的 JSON 在线工具，基于 Vue 3 + TypeScript + Vite 构建。

## ✨ 功能特性

### 核心功能
- **格式化与压缩** - 一键美化 JSON 或压缩为单行
- **实时校验** - 自动检测 JSON 语法错误，并高亮显示错误位置
- **实时预览** - 右侧树形视图实时展示 JSON 结构
- **语法高亮** - 基于 Monaco Editor 的专业代码编辑器

### 转换功能
- **格式转换** - JSON ↔ YAML、JSON → XML
- **转义处理** - JSON 字符串转义/去转义
- **Unicode 转换** - Unicode 编码与中文互转

### 实用工具
- **键名排序** - 自动按字母顺序排序 JSON 键名
- **复制下载** - 一键复制到剪贴板或下载为文件
- **可调节布局** - 支持拖拽调整编辑器和预览区域大小

### 用户体验
- **暗色主题** - 自动跟随系统主题，支持深色/浅色模式
- **响应式设计** - 适配各种屏幕尺寸
- **现代化 UI** - 简洁美观的界面设计

## 🚀 快速开始

### 安装依赖

```bash
npm install
# 或
pnpm install
```

### 开发模式

```bash
npm run dev
# 或
pnpm dev
```

访问 `http://localhost:5173` 查看应用。

### 构建生产版本

```bash
npm run build
# 或
pnpm build
```

### 预览生产构建

```bash
npm run preview
# 或
pnpm preview
```

## 📖 使用说明

### 基本操作

1. **格式化 JSON** - 点击工具栏的"格式化"按钮，将 JSON 美化显示
2. **压缩 JSON** - 点击"压缩"按钮，将 JSON 压缩为单行
3. **校验 JSON** - 点击"校验"按钮，检查 JSON 格式是否正确
4. **复制内容** - 点击"复制"按钮，将当前内容复制到剪贴板

### 高级功能

在工具栏的"更多"菜单中可以找到：

- **排序键名** - 按字母顺序排序所有 JSON 对象的键名
- **转为 YAML** - 将 JSON 格式转换为 YAML 格式
- **转为 XML** - 将 JSON 格式转换为 XML 格式
- **转义/去转义** - 处理 JSON 字符串中的转义字符
- **Unicode ↔ 中文** - Unicode 编码与中文字符互转
- **下载** - 将当前内容下载为 JSON 文件
- **清空** - 清空编辑器内容

### 界面操作

- **调整布局** - 拖拽编辑器和预览区域之间的分隔线，调整左右面板大小
- **实时预览** - 在左侧编辑器中输入内容，右侧会实时显示树形预览
- **错误提示** - 当 JSON 格式错误时，编辑器会高亮显示错误位置

## 🛠️ 技术栈

- **框架**: Vue 3 (Composition API)
- **语言**: TypeScript
- **构建工具**: Vite
- **代码编辑器**: Monaco Editor
- **样式**: Tailwind CSS
- **图标**: Lucide Vue Next
- **核心库**:
  - `jsonlint-mod` - JSON 语法校验
  - `js-yaml` - YAML 转换
  - `xml-js` - XML 转换
  - `vue-json-pretty` - JSON 树形预览

## 📁 项目结构

```
jsontool/
├── src/
│   ├── components/          # Vue 组件
│   │   ├── JsonEditor.vue   # Monaco 编辑器组件
│   │   ├── Toolbar.vue      # 工具栏组件
│   │   └── TreeView.vue     # 树形预览组件
│   ├── utils/
│   │   └── jsonUtils.ts     # JSON 工具函数
│   ├── App.vue              # 主应用组件
│   └── main.ts              # 应用入口
├── dist/                    # 构建输出目录
└── public/                  # 静态资源
```

## 🎨 特性亮点

- **实时校验** - 输入时自动检测 JSON 语法错误
- **错误定位** - 精确显示错误所在的行号和列号
- **智能格式化** - 即使存在部分错误，也会尽可能格式化
- **主题适配** - 自动跟随系统深色/浅色主题
- **性能优化** - 使用 Vite 构建，开发体验流畅

## 📝 开发说明

### 代码规范

- 使用 TypeScript 进行类型检查
- 遵循 Vue 3 Composition API 最佳实践
- 使用 Tailwind CSS 进行样式设计

### 添加新功能

1. 在 `src/utils/jsonUtils.ts` 中添加工具函数
2. 在 `src/components/Toolbar.vue` 中添加按钮
3. 在 `src/App.vue` 中处理对应的操作逻辑

## 📄 许可证

查看 [LICENSE](LICENSE) 文件了解详情。
