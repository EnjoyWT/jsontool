<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import Toolbar from "./components/Toolbar.vue";
import JsonEditor from "./components/JsonEditor.vue";
import TreeView from "./components/TreeView.vue";
import { CheckCircle2, AlertCircle, X } from "lucide-vue-next";
import {
  formatJson,
  minifyJson,
  validateJson,
  escapeJson,
  unescapeJson,
  unicodeToChinese,
  chineseToUnicode,
  sortJsonKeys,
  jsonToYaml,
  jsonToXml,
} from "./utils/jsonUtils";

const jsonText = ref(
  '{\n  "name": "JSON Tool",\n  "version": "2.0.0",\n  "description": "现代简约风格的 JSON 工具",\n  "features": [\n    "格式化与压缩",\n    "实时预览",\n    "格式转换",\n    "语法校验"\n  ],\n  "author": "Alma"\n}'
);

const message = ref<{ type: "success" | "error"; text: string } | null>(null);

// 错误信息状态（用于编辑器标记）
const errorLine = ref<number | undefined>(undefined);
const errorColumn = ref<number | undefined>(undefined);
const errorMessage = ref<string | undefined>(undefined);

// 实时校验 JSON
const validateAndMark = () => {
  if (!jsonText.value.trim()) {
    errorLine.value = undefined;
    errorColumn.value = undefined;
    errorMessage.value = undefined;
    return;
  }

  const result = validateJson(jsonText.value);
  if (result.valid) {
    errorLine.value = undefined;
    errorColumn.value = undefined;
    errorMessage.value = undefined;
  } else {
    errorLine.value = result.line;
    errorColumn.value = result.column;
    errorMessage.value = result.error;
  }
};

// 监听 jsonText 变化，实时校验
watch(jsonText, () => {
  validateAndMark();
}, { immediate: true });

// Split pane state
const leftPaneWidth = ref(70); // percentage (8:2 比例)
const isDragging = ref(false);
const containerRef = ref<HTMLElement | null>(null);

const startDragging = () => {
  isDragging.value = true;
  document.body.style.cursor = "col-resize";
  document.body.style.userSelect = "none";
};

const stopDragging = () => {
  isDragging.value = false;
  document.body.style.cursor = "";
  document.body.style.userSelect = "";
};

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value || !containerRef.value) return;

  const containerRect = containerRef.value.getBoundingClientRect();
  const newWidth =
    ((e.clientX - containerRect.left) / containerRect.width) * 100;

  // Clamp between 20% and 80%
  leftPaneWidth.value = Math.min(80, Math.max(20, newWidth));
};

onMounted(() => {
  document.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", stopDragging);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mouseup", stopDragging);
});

const showMessage = (type: "success" | "error", text: string) => {
  message.value = { type, text };
  setTimeout(() => (message.value = null), 3000);
};

const handleAction = (action: string) => {
  message.value = null;
  switch (action) {
    case "format":
      // 先校验，有错误提示，尽可能格式化
      const formatResult = validateJson(jsonText.value);
      if (formatResult.valid) {
        jsonText.value = formatJson(jsonText.value);
        showMessage("success", "JSON 格式化成功");
      } else {
        // 尝试尽可能格式化，但提示错误
        try {
          jsonText.value = formatJson(jsonText.value);
          showMessage(
            "error",
            `JSON 存在错误: ${formatResult.error}${
              formatResult.line
                ? ` (行: ${formatResult.line}, 列: ${formatResult.column})`
                : ""
            }`
          );
        } catch {
          showMessage(
            "error",
            `JSON 格式错误，无法格式化: ${formatResult.error}${
              formatResult.line
                ? ` (行: ${formatResult.line}, 列: ${formatResult.column})`
                : ""
            }`
          );
        }
      }
      break;
    case "minify":
      jsonText.value = minifyJson(jsonText.value);
      break;
    case "verify":
      const result = validateJson(jsonText.value);
      if (result.valid) {
        showMessage("success", "JSON 格式验证通过");
      } else {
        showMessage(
          "error",
          `JSON 格式错误: ${result.error}${
            result.line ? ` (行: ${result.line}, 列: ${result.column})` : ""
          }`
        );
      }
      break;
    case "sort":
      jsonText.value = sortJsonKeys(jsonText.value);
      break;
    case "toYaml":
      jsonText.value = jsonToYaml(jsonText.value);
      break;
    case "toXml":
      jsonText.value = jsonToXml(jsonText.value);
      break;
    case "escape":
      jsonText.value = escapeJson(jsonText.value);
      break;
    case "unescape":
      jsonText.value = unescapeJson(jsonText.value);
      break;
    case "unicodeToChinese":
      jsonText.value = unicodeToChinese(jsonText.value);
      break;
    case "chineseToUnicode":
      jsonText.value = chineseToUnicode(jsonText.value);
      break;
    case "clear":
      jsonText.value = "";
      break;
    case "copy":
      navigator.clipboard.writeText(jsonText.value);
      showMessage("success", "已复制到剪贴板");
      break;
    case "download":
      const blob = new Blob([jsonText.value], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "data.json";
      link.click();
      URL.revokeObjectURL(url);
      showMessage("success", "下载已启动");
      break;
  }
};
</script>

<template>
  <div class="flex flex-col h-screen overflow-hidden bg-[var(--color-bg-base)]">
    <!-- Toolbar -->
    <Toolbar
      @format="handleAction('format')"
      @minify="handleAction('minify')"
      @verify="handleAction('verify')"
      @sort="handleAction('sort')"
      @toYaml="handleAction('toYaml')"
      @toXml="handleAction('toXml')"
      @escape="handleAction('escape')"
      @unescape="handleAction('unescape')"
      @unicodeToChinese="handleAction('unicodeToChinese')"
      @chineseToUnicode="handleAction('chineseToUnicode')"
      @clear="handleAction('clear')"
      @copy="handleAction('copy')"
      @download="handleAction('download')"
    />

    <!-- Main Content: Split Pane -->
    <main class="flex-1 flex overflow-hidden p-4 gap-0" ref="containerRef">
      <!-- Left Pane: Editor -->
      <div
        class="flex flex-col min-w-0 bg-[var(--color-bg-card)] rounded-l-xl shadow-sm border border-[var(--color-border)] border-r-0 overflow-hidden"
        :style="{ width: `${leftPaneWidth}%` }"
      >
        <div
          class="flex items-center justify-between px-4 py-2 border-b border-[var(--color-border)] bg-[var(--color-bg-base)]"
        >
          <span class="text-sm font-medium text-[var(--color-text-secondary)]"
            >编辑器</span
          >
          <span class="text-xs font-mono text-[var(--color-text-muted)]">
            {{ jsonText.split("\n").length }} 行 ·
            {{ (jsonText.length / 1024).toFixed(2) }} KB
          </span>
        </div>
        <div class="flex-1 overflow-hidden">
          <JsonEditor
            v-model="jsonText"
            :errorLine="errorLine"
            :errorColumn="errorColumn"
            :errorMessage="errorMessage"
          />
        </div>
      </div>

      <!-- Resize Handle -->
      <div
        class="resize-handle"
        :class="{ dragging: isDragging }"
        @mousedown.prevent="startDragging"
      ></div>

      <!-- Right Pane: Tree View -->
      <div
        class="flex flex-col min-w-0 bg-[var(--color-bg-card)] rounded-r-xl shadow-sm border border-[var(--color-border)] border-l-0 overflow-hidden"
        :style="{ width: `${100 - leftPaneWidth}%` }"
      >
        <div
          class="flex items-center px-4 py-2 border-b border-[var(--color-border)] bg-[var(--color-bg-base)]"
        >
          <span class="text-sm font-medium text-[var(--color-text-secondary)]"
            >预览</span
          >
        </div>
        <div class="flex-1 overflow-hidden">
          <TreeView :jsonText="jsonText" />
        </div>
      </div>
    </main>

    <!-- Toast Messages -->
    <transition name="toast">
      <div v-if="message" class="fixed top-20 left-1/2 -translate-x-1/2 z-50">
        <div
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg',
            message.type === 'success'
              ? 'bg-[var(--color-success-bg)] text-[var(--color-success)]'
              : 'bg-[var(--color-error-bg)] text-[var(--color-error)]',
          ]"
        >
          <CheckCircle2
            v-if="message.type === 'success'"
            class="w-5 h-5 flex-shrink-0"
          />
          <AlertCircle v-else class="w-5 h-5 flex-shrink-0" />
          <span class="text-sm font-medium">{{ message.text }}</span>
          <button
            @click="message = null"
            class="ml-2 opacity-60 hover:opacity-100 transition-opacity"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>
