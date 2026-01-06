<script setup lang="ts">
import { LayoutGrid } from "lucide-vue-next";
</script>

<template>
  <div
    class="flex items-center gap-4 px-4 py-2 bg-[var(--color-bg-card)] border-b border-[var(--color-border)]"
  >
    <!-- Tabs Container -->
    <div class="flex items-center gap-1 overflow-x-auto no-scrollbar">
      <div
        class="flex items-center gap-2 px-3 py-1 rounded-md cursor-default transition-all"
      >
        <span class="text-sm font-bold whitespace-nowrap">JSON Tool</span>
      </div>

      <!-- Placeholder for future tabs -->
      <div
        class="px-3 py-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] rounded-md cursor-pointer transition-colors"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
