<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import Toolbar from "./components/Toolbar.vue";
import EditorActions from "./components/EditorActions.vue";
import JsonEditor from "./components/JsonEditor.vue";
import TreeView from "./components/TreeView.vue";
import HistorySidebar, { type HistoryItem } from "./components/HistorySidebar.vue";
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

// 历史记录状态
const showHistory = ref(false);
const historyItems = ref<HistoryItem[]>([]);
const MAX_HISTORY = 30;

// 加载历史记录
const loadHistory = () => {
  const saved = localStorage.getItem("json_tool_history");
  if (saved) {
    try {
      historyItems.value = JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load history", e);
    }
  }
};

// 保存历史记录到本地
const saveHistoryToLocal = () => {
  localStorage.setItem("json_tool_history", JSON.stringify(historyItems.value));
};

// 添加历史记录
const addToHistory = (content: string) => {
  if (!content.trim()) return;
  
  // 检查是否与最近一条相同
  if (historyItems.value.length > 0 && historyItems.value[0].content === content) {
    return;
  }

  const newItem: HistoryItem = {
    id: Date.now().toString(),
    content: content,
    timestamp: Date.now(),
    size: new Blob([content]).size,
  };

  historyItems.value.unshift(newItem);
  
  // 限制数量
  if (historyItems.value.length > MAX_HISTORY) {
    historyItems.value = historyItems.value.slice(0, MAX_HISTORY);
  }

  saveHistoryToLocal();
};

const deleteHistoryItem = (id: string) => {
  historyItems.value = historyItems.value.filter(item => item.id !== id);
  saveHistoryToLocal();
};

const clearHistory = () => {
  historyItems.value = [];
  saveHistoryToLocal();
  showMessage("success", "历史记录已清空");
};

const selectHistoryItem = (content: string) => {
  jsonText.value = content;
};

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
  loadHistory();
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

  // 检查内容是否为空
  if (!jsonText.value.trim() && action !== "clear") {
    if (["format", "minify", "verify", "sort", "toYaml", "toXml", "escape", "unescape", "unicodeToChinese", "chineseToUnicode"].includes(action)) {
      showMessage("error", "请输入内容");
      return;
    }
    if (action === "copy") {
      showMessage("error", "内容为空，无法复制");
      return;
    }
    if (action === "download") {
      showMessage("error", "内容为空，无法下载");
      return;
    }
  }

  switch (action) {
    case "format":
      // 先校验，有错误提示，尽可能格式化
      const formatResult = validateJson(jsonText.value);
      if (formatResult.valid) {
        jsonText.value = formatJson(jsonText.value);
        showMessage("success", "JSON 格式化成功");
        addToHistory(jsonText.value);
      } else {
        // 尝试尽可能格式化，但提示错误
        try {
          const formatted = formatJson(jsonText.value);
          if (formatted === jsonText.value && !formatResult.valid) {
             showMessage("error", `JSON 格式错误，无法格式化: ${formatResult.error}`);
          } else {
            jsonText.value = formatted;
            showMessage(
              "error",
              `JSON 存在错误: ${formatResult.error}${
                formatResult.line
                  ? ` (行: ${formatResult.line}, 列: ${formatResult.column})`
                  : ""
              }`
            );
          }
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
      const minifyResult = validateJson(jsonText.value);
      if (minifyResult.valid) {
        try {
          jsonText.value = minifyJson(jsonText.value);
          showMessage("success", "JSON 压缩成功");
          addToHistory(jsonText.value);
        } catch (e: any) {
          showMessage("error", `JSON 压缩失败: ${e.message || "未知错误"}`);
        }
      } else {
        showMessage("error", `JSON 格式错误，无法压缩: ${minifyResult.error}`);
      }
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
      const sortResult = validateJson(jsonText.value);
      if (sortResult.valid) {
        try {
          jsonText.value = sortJsonKeys(jsonText.value);
          showMessage("success", "JSON 键名排序成功");
        } catch (e: any) {
          showMessage("error", `排序失败: ${e.message || "未知错误"}`);
        }
      } else {
        showMessage("error", `JSON 格式错误，无法排序: ${sortResult.error}`);
      }
      break;
    case "toYaml":
      const yamlResult = validateJson(jsonText.value);
      if (yamlResult.valid) {
        try {
          jsonText.value = jsonToYaml(jsonText.value);
          showMessage("success", "已成功转为 YAML");
          addToHistory(jsonText.value);
        } catch (e: any) {
          showMessage("error", `转为 YAML 失败: ${e.message || "未知错误"}`);
        }
      } else {
        showMessage("error", `JSON 格式错误，无法转换: ${yamlResult.error}`);
      }
      break;
    case "toXml":
      const xmlResult = validateJson(jsonText.value);
      if (xmlResult.valid) {
        try {
          jsonText.value = jsonToXml(jsonText.value);
          showMessage("success", "已成功转为 XML");
          addToHistory(jsonText.value);
        } catch (e: any) {
          showMessage("error", `转为 XML 失败: ${e.message || "未知错误"}`);
        }
      } else {
        showMessage("error", `JSON 格式错误，无法转换: ${xmlResult.error}`);
      }
      break;
    case "escape":
      jsonText.value = escapeJson(jsonText.value);
      showMessage("success", "转义成功");
      break;
    case "unescape":
      jsonText.value = unescapeJson(jsonText.value);
      showMessage("success", "去转义成功");
      break;
    case "unicodeToChinese":
      jsonText.value = unicodeToChinese(jsonText.value);
      showMessage("success", "Unicode 转中文成功");
      break;
    case "chineseToUnicode":
      jsonText.value = chineseToUnicode(jsonText.value);
      showMessage("success", "中文 转 Unicode 成功");
      break;
    case "clear":
      jsonText.value = "";
      showMessage("success", "已清空内容");
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
    <!-- Top-level TabBar -->
    <Toolbar :showHistory="showHistory" @toggleHistory="showHistory = !showHistory" />

    <!-- Main Content: Sidebar + Split Pane -->
    <div class="flex-1 flex overflow-hidden p-3">
      <!-- History Sidebar -->
      <transition name="sidebar">
        <HistorySidebar 
          v-if="showHistory" 
          class="sidebar-component"
          :items="historyItems"
          @select="selectHistoryItem"
          @delete="deleteHistoryItem"
          @clear="clearHistory"
          @refresh="loadHistory"
          @close="showHistory = false"
        />
      </transition>

      <!-- Split Pane -->
      <main class="flex-1 flex overflow-hidden gap-0" ref="containerRef">
        <!-- Left Pane: Editor -->
        <div
          class="flex flex-col min-w-0 bg-[var(--color-bg-card)] rounded-l-xl shadow-sm border border-[var(--color-border)] border-r-0 overflow-hidden"
          :style="{ width: `${leftPaneWidth}%` }"
        >
          <div
            class="flex items-center justify-between px-3 py-1.5 border-b border-[var(--color-border)] bg-[var(--color-bg-base)]"
          >
            <div class="flex items-center gap-2">
              <!-- Sidebar Toggle (Always occupies space for visual stability) -->
              <button 
                @click="showHistory = true"
                :class="[
                  'p-1.5 hover:bg-[var(--color-btn-bg)] rounded transition-all duration-200',
                  showHistory ? 'opacity-0 pointer-events-none' : 'text-[var(--color-text-muted)] hover:text-[var(--color-primary)]'
                ]"
                title="打开历史记录"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 20 20">
                  <g>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M2.167 6.667A2.833 2.833 0 0 1 5 3.833h2.708v12.334H5a2.833 2.833 0 0 1-2.833-2.834V6.667ZM9.042 17.5H5a4.167 4.167 0 0 1-4.167-4.167V6.667A4.167 4.167 0 0 1 5 2.5h10a4.167 4.167 0 0 1 4.167 4.167v6.666A4.167 4.167 0 0 1 15 17.5H9.042Zm0-13.667H15a2.833 2.833 0 0 1 2.833 2.834v6.666A2.833 2.833 0 0 1 15 16.167H9.042V3.833ZM3.583 6.5c0-.368.336-.667.75-.667H5.75c.414 0 .75.299.75.667 0 .368-.336.667-.75.667H4.333c-.414 0-.75-.299-.75-.667Zm.75 1.833c-.414 0-.75.299-.75.667 0 .368.336.667.75.667H5.75c.414 0 .75-.299.75-.667 0-.368-.336-.667-.75-.667H4.333Z" fill="currentColor"></path>
                  </g>
                </svg>
              </button>
              <span class="text-sm font-bold text-[var(--color-text-primary)]"
                >编辑器</span
              >
              <!-- Integrated Action Group -->
              <EditorActions
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
            </div>
            <span class="text-[10px] font-mono text-[var(--color-text-muted)]">
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
            class="flex items-center px-4 py-1.5 border-b border-[var(--color-border)] bg-[var(--color-bg-base)] h-[37px]"
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
    </div>
  </div>

  <!-- Toast Messages -->
    <div class="fixed top-20 left-0 right-0 flex justify-center z-50 pointer-events-none">
      <transition name="toast">
        <div
          v-if="message"
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg pointer-events-auto',
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
      </transition>
    </div>
</template>

<style>
/* Sidebar Transition */
.sidebar-enter-active,
.sidebar-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  white-space: nowrap;
  flex-shrink: 0;
}

.sidebar-enter-from,
.sidebar-leave-to {
  width: 0 !important;
  margin-right: 0 !important;
  opacity: 0;
  transform: translateX(-100%);
}

.sidebar-component {
  margin-right: 12px; /* 相当于之前的 gap-3 */
}

/* Toast Transition */
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.toast-enter-to,
.toast-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
