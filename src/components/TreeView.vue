<script setup lang="ts">
import { computed } from 'vue';
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import { FileWarning } from 'lucide-vue-next';

const props = defineProps<{
  jsonText: string;
}>();

const jsonData = computed(() => {
  try {
    return JSON.parse(props.jsonText);
  } catch (e) {
    return null;
  }
});
</script>

<template>
  <div class="h-full overflow-auto p-4 bg-[var(--color-bg-card)] tree-view-wrapper">
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
