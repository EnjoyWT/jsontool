<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { Trash2, RotateCw, Clock } from "lucide-vue-next";

export interface HistoryItem {
  id: string;
  content: string;
  timestamp: number;
  size: number;
}

const props = defineProps<{
  items: HistoryItem[];
}>();

const emit = defineEmits(["select", "delete", "clear", "close", "refresh"]);

const formatSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  const Y = date.getFullYear();
  const M = date.getMonth() + 1;
  const D = date.getDate();
  const h = date.getHours().toString().padStart(2, "0");
  const m = date.getMinutes().toString().padStart(2, "0");
  const s = date.getSeconds().toString().padStart(2, "0");
  return `${Y}/${M}/${D} ${h}:${m}:${s}`;
};

const getRelativeTime = (timestamp: number) => {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} 天前`;
  if (hours > 0) return `${hours} 小时前`;
  if (minutes > 0) return `${minutes} 分钟前`;
  return "刚刚";
};

// 强制刷新相对时间
const lastUpdate = ref(Date.now());
let timer: any = null;

onMounted(() => {
  timer = setInterval(() => {
    lastUpdate.value = Date.now();
  }, 30000);
});

onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});
</script>

<template>
  <div class="flex flex-col h-full bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl w-64 shrink-0 transition-all duration-300 overflow-hidden shadow-sm">
    <!-- Header: Match body background -->
    <div class="flex flex-col p-4">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <div class="px-3 py-1 bg-[var(--color-primary)] text-white text-xs font-medium rounded-full">
            历史
          </div>
        </div>
        <!-- Sidebar Toggle Icon (Close behavior) -->
        <button 
          @click="$emit('close')"
          class="p-1.5 hover:bg-[var(--color-btn-bg)] rounded transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
          title="关闭历史记录"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 20 20">
            <g>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M2.167 6.667A2.833 2.833 0 0 1 5 3.833h2.708v12.334H5a2.833 2.833 0 0 1-2.833-2.834V6.667ZM9.042 17.5H5a4.167 4.167 0 0 1-4.167-4.167V6.667A4.167 4.167 0 0 1 5 2.5h10a4.167 4.167 0 0 1 4.167 4.167v6.666A4.167 4.167 0 0 1 15 17.5H9.042Zm0-13.667H15a2.833 2.833 0 0 1 2.833 2.834v6.666A2.833 2.833 0 0 1 15 16.167H9.042V3.833ZM3.583 6.5c0-.368.336-.667.75-.667H5.75c.414 0 .75.299.75.667 0 .368-.336.667-.75.667H4.333c-.414 0-.75-.299-.75-.667Zm.75 1.833c-.414 0-.75.299-.75.667 0 .368.336.667.75.667H5.75c.414 0 .75-.299.75-.667 0-.368-.336-.667-.75-.667H4.333Z" fill="currentColor"></path>
            </g>
          </svg>
        </button>
      </div>

      <div class="flex items-center gap-2">
        <button 
          @click="$emit('refresh')"
          title="刷新历史"
          class="p-1.5 hover:bg-[var(--color-btn-bg)] rounded transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
        >
          <RotateCw class="w-4 h-4" />
        </button>
        <button 
          @click="$emit('clear')"
          title="清空历史"
          class="p-1.5 hover:bg-[var(--color-btn-bg)] rounded transition-colors text-[var(--color-text-muted)] hover:text-red-500"
        >
          <Trash2 class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Separator Line: Width matches items (mx-3) -->
    <div class="mx-3 border-b border-[var(--color-border)]"></div>

    <!-- List -->
    <div class="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
      <div v-if="items.length === 0" class="flex flex-col items-center justify-center h-full text-[var(--color-text-muted)] opacity-50">
        <Clock class="w-12 h-12 mb-2" />
        <p class="text-xs">暂无历史记录</p>
      </div>
      
      <div 
        v-for="item in items" 
        :key="item.id"
        @click="$emit('select', item.content)"
        class="group relative p-3 bg-transparent border border-[var(--color-border)] rounded-lg hover:border-[var(--color-primary)] hover:bg-[var(--color-btn-bg)] cursor-pointer transition-all duration-200"
      >
        <div class="flex flex-col gap-1.5 pr-6">
          <div class="text-xs font-medium text-[var(--color-text-primary)]">
            {{ getRelativeTime(item.timestamp) }}
          </div>
          <div class="text-[10px] text-[var(--color-text-muted)] font-mono leading-none">
            {{ formatTime(item.timestamp) }} · {{ formatSize(item.size) }}
          </div>
        </div>
        
        <button 
          @click.stop="$emit('delete', item.id)"
          class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-all duration-200"
        >
          <Trash2 class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 2px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-muted);
}
</style>
