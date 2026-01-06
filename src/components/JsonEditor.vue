<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from "vue";
import * as monaco from "monaco-editor";

const props = defineProps<{
  modelValue: string;
  errorLine?: number;
  errorColumn?: number;
  errorMessage?: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const editorContainer = ref<HTMLElement | null>(null);
let editor: monaco.editor.IStandaloneCodeEditor | null = null;
let decorationIds: string[] = [];

const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

// 更新错误标记
const updateErrorMarkers = () => {
  if (!editor) return;
  const model = editor.getModel();
  if (!model) return;

  // 1. 更新编辑器标记（波浪线和侧边栏提示）
  if (props.errorLine && props.errorMessage) {
    const markers: monaco.editor.IMarkerData[] = [
      {
        severity: monaco.MarkerSeverity.Error,
        message: props.errorMessage,
        startLineNumber: props.errorLine,
        startColumn: props.errorColumn || 1,
        endLineNumber: props.errorLine,
        endColumn: model.getLineMaxColumn(props.errorLine),
      },
    ];
    monaco.editor.setModelMarkers(model, "json", markers);

    // 2. 更新行高亮（背景色）
    decorationIds = editor.deltaDecorations(decorationIds, [
      {
        range: new monaco.Range(props.errorLine, 1, props.errorLine, 1),
        options: {
          isWholeLine: true,
          className: "error-line-decoration",
          marginClassName: "error-line-margin-decoration",
        },
      },
    ]);
  } else {
    monaco.editor.setModelMarkers(model, "json", []);
    // 清除行高亮
    decorationIds = editor.deltaDecorations(decorationIds, []);
  }
};

onMounted(() => {
  if (editorContainer.value) {
    editor = monaco.editor.create(editorContainer.value, {
      value: props.modelValue,
      language: "json",
      theme: isDark ? "vs-dark" : "vs",
      automaticLayout: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 14,
      fontFamily:
        "ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace",
      lineHeight: 1.6,
      tabSize: 2,
      padding: { top: 16 },
      // roundedSelection: true,
      cursorSmoothCaretAnimation: "on",
      cursorBlinking: "smooth",
      renderLineHighlight: "all",
      wordWrap: "on", // 在视口宽度处换行
      folding: true, // 启用折叠
      foldingStrategy: "indentation", // 使用缩进作为折叠策略
      showFoldingControls: "always", // 始终显示折叠控件
      foldingHighlight: true, // 高亮折叠区域
      wordWrapColumn: 10000, // 设置很大的值，确保以视口宽度为准
      scrollbar: {
        vertical: "visible",
        horizontal: "hidden", // 隐藏水平滚动条
        useShadows: false,
        verticalHasArrows: false,
        horizontalHasArrows: false,
        verticalScrollbarSize: 10,
        horizontalScrollbarSize: 10,
      },
    });

    editor.onDidChangeModelContent(() => {
      const value = editor?.getValue() || "";
      if (value !== props.modelValue) {
        emit("update:modelValue", value);
      }
    });

    // Listen for system theme changes
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        monaco.editor.setTheme(e.matches ? "vs-dark" : "vs");
      });

    // 初始化错误标记
    updateErrorMarkers();
  }
});

// 监听错误信息变化
watch(
  () => [props.errorLine, props.errorColumn, props.errorMessage],
  () => {
    updateErrorMarkers();
  }
);

watch(
  () => props.modelValue,
  (newValue) => {
    if (editor && newValue !== editor.getValue()) {
      const position = editor.getPosition();
      editor.setValue(newValue);
      if (position) editor.setPosition(position);
      // 强制重新布局，确保换行计算正确
      setTimeout(() => {
        editor?.layout();
      }, 0);
    }
  }
);

onBeforeUnmount(() => {
  if (editor) {
    editor.dispose();
  }
});
</script>

<template>
  <div
    ref="editorContainer"
    class="monaco-editor-container overflow-hidden"
  ></div>
</template>

<style scoped>
.monaco-editor-container {
  height: 100%;
}

:global(.error-line-decoration) {
  background-color: rgba(239, 68, 68, 0.15); /* Tailwind red-500 with opacity */
  display: block;
}

:global(.error-line-margin-decoration) {
  background-color: rgba(239, 68, 68, 0.3);
  width: 5px !important;
  margin-left: 3px;
}

:global(.vs-dark .error-line-decoration) {
  background-color: rgba(239, 68, 68, 0.25);
}

/* 自定义折叠图标 */
:global(.monaco-editor .codicon-folding-expanded),
:global(.monaco-editor .codicon-folding-collapsed) {
  font-family: none !important;
  opacity: 0.7 !important;
  cursor: pointer !important;
}

:global(.monaco-editor .codicon-folding-expanded::before),
:global(.monaco-editor .codicon-folding-collapsed::before) {
  content: "" !important;
  display: block !important;
  width: 14px !important;
  height: 14px !important;
  background-color: #000; /* 设置为纯黑色 */
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  -webkit-mask-size: contain;
  mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
}

:global(.vs-dark .monaco-editor .codicon-folding-expanded::before),
:global(.vs-dark .monaco-editor .codicon-folding-collapsed::before) {
  background-color: #bbb;
}

/* 展开状态 (更饱满的三角形) */
:global(.monaco-editor .codicon-folding-expanded::before) {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M4 8l8 8l8-8z' fill='black'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M4 8l8 8l8-8z' fill='black'/%3E%3C/svg%3E");
}

/* 折叠状态 (更饱满的三角形) */
:global(.monaco-editor .codicon-folding-collapsed::before) {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M8 4l8 8l-8 8z' fill='black'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M8 4l8 8l-8 8z' fill='black'/%3E%3C/svg%3E");
}

/* 悬停效果 */
:global(.monaco-editor .codicon-folding-expanded:hover),
:global(.monaco-editor .codicon-folding-collapsed:hover) {
  opacity: 1 !important;
}

:global(.monaco-editor .codicon-folding-expanded:hover::before),
:global(.monaco-editor .codicon-folding-collapsed:hover::before) {
  background-color: var(--color-primary) !important;
}
</style>
