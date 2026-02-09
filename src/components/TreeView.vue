<script setup lang="ts">
import { computed } from "vue";
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
import { FileWarning, FileText } from "lucide-vue-next";

const props = withDefaults(
  defineProps<{
    jsonText: string;
    format?: "json" | "yaml" | "xml" | "text";
  }>(),
  { format: "json" }
);

const isJson = computed(() => props.format === "json");

const jsonData = computed(() => {
  if (!isJson.value) return null;
  try {
    return JSON.parse(props.jsonText);
  } catch (e) {
    return null;
  }
});
</script>

<template>
  <div class="h-full overflow-auto p-4 bg-[var(--color-bg-card)] tree-view-wrapper">
    <div v-if="isJson">
      <div v-if="jsonData">
        <vue-json-pretty
          :data="jsonData"
          :deep="2"
          :showLength="true"
          :showDoubleQuotes="true"
          :showIcon="true"
          :showLine="true"
          :collapsedOnClickBrackets="true"
          theme="light"
        />
      </div>
      <div v-else class="flex flex-col items-center justify-center h-full text-[var(--color-text-muted)]">
        <FileWarning class="w-12 h-12 mb-3 opacity-50" />
        <p class="text-sm">等待有效的 JSON 数据...</p>
      </div>
    </div>
    <div v-else class="h-full">
      <div class="flex items-center gap-2 text-[var(--color-text-secondary)] text-xs mb-2">
        <FileText class="w-3.5 h-3.5" />
        <span>当前内容为 {{ props.format?.toUpperCase() }}，以纯文本预览</span>
      </div>
      <pre class="text-sm leading-6 whitespace-pre-wrap break-all font-mono bg-[var(--color-bg-base)] rounded-lg border border-[var(--color-border)] p-3 text-[var(--color-text-primary)]">
{{ jsonText }}
      </pre>
    </div>
  </div>
</template>

<style>
/* Override vue-json-pretty styles */
.tree-view-wrapper .vjs-tree {
  font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace !important;
  font-size: 13px !important;
  line-height: 1.8 !important;
}

.tree-view-wrapper .vjs-key {
  color: var(--color-primary) !important;
}

.tree-view-wrapper .vjs-value__string {
  color: #059669 !important;
}

.tree-view-wrapper .vjs-value__number {
  color: #d97706 !important;
}

.tree-view-wrapper .vjs-value__boolean {
  color: #dc2626 !important;
}

.tree-view-wrapper .vjs-value__null {
  color: var(--color-text-muted) !important;
}

/* 折叠/展开图标样式 */
.tree-view-wrapper .vjs-tree__icon {
  width: 16px !important;
  height: 16px !important;
  margin-right: 4px !important;
  cursor: pointer !important;
  transition: transform 0.15s ease !important;
}

.tree-view-wrapper .vjs-tree__icon:hover {
  color: var(--color-primary) !important;
}

/* 连接线样式 */
.tree-view-wrapper .vjs-tree__indent--line {
  border-left: 1px solid var(--color-border) !important;
}

/* 括号样式 */
.tree-view-wrapper .vjs-tree__brackets {
  cursor: pointer !important;
}

.tree-view-wrapper .vjs-tree__brackets:hover {
  color: var(--color-primary) !important;
}

/* 折叠时显示的长度提示 */
.tree-view-wrapper .vjs-comment {
  color: var(--color-text-muted) !important;
  font-style: italic !important;
}
</style>
