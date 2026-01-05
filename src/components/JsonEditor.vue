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

const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

// 更新错误标记
const updateErrorMarkers = () => {
  if (!editor) return;
  const model = editor.getModel();
  if (!model) return;

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
  } else {
    monaco.editor.setModelMarkers(model, "json", []);
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
</style>
