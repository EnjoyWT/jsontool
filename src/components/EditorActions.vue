<script setup lang="ts">
import {
  CheckCircle,
  Copy,
  ChevronDown,
  FileDown,
  Trash2,
  ArrowDownAz,
  Code2,
  Binary,
  FileCode,
  FileText,
  Globe,
  Languages,
} from "lucide-vue-next";
import FormatIcon from "./icons/FormatIcon.vue";
import MinifyIcon from "./icons/MinifyIcon.vue";

defineEmits([
  "format",
  "minify",
  "verify",
  "escape",
  "unescape",
  "unicodeToChinese",
  "chineseToUnicode",
  "clear",
  "copy",
  "sort",
  "toYaml",
  "toXml",
  "download",
]);
</script>

<template>
  <div class="flex items-center gap-1">
    <!-- Action Buttons -->
    <div class="flex items-center gap-1.5">
      <!-- Primary Button: Format -->
      <button
        @click="$emit('format')"
        title="格式化"
        class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[var(--color-text-primary)] bg-[var(--color-btn-bg)] rounded hover:bg-[var(--color-btn-hover)] hover:text-[var(--color-primary)] transition-all duration-200 whitespace-nowrap"
      >
        <FormatIcon />
        <span>格式化</span>
      </button>

      <button
        @click="$emit('minify')"
        title="压缩"
        class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[var(--color-text-primary)] bg-[var(--color-btn-bg)] rounded hover:bg-[var(--color-btn-hover)] transition-all duration-200 whitespace-nowrap"
      >
        <MinifyIcon />
        <span>压缩</span>
      </button>

      <button
        @click="$emit('verify')"
        title="校验"
        class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[var(--color-text-primary)] bg-[var(--color-btn-bg)] rounded hover:bg-[var(--color-btn-hover)] transition-all duration-200 whitespace-nowrap"
      >
        <CheckCircle class="w-3.5 h-3.5" />
        <span>校验</span>
      </button>

      <button
        @click="$emit('copy')"
        title="复制"
        class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[var(--color-text-primary)] bg-[var(--color-btn-bg)] rounded hover:bg-[var(--color-btn-hover)] transition-all duration-200 whitespace-nowrap"
      >
        <Copy class="w-3.5 h-3.5" />
        <span>复制</span>
      </button>

      <!-- Unicode Dropdown (Hover) -->
      <div class="relative group">
        <button class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[var(--color-text-primary)] bg-[var(--color-btn-bg)] rounded hover:bg-[var(--color-btn-hover)] group-hover:text-[var(--color-primary)] transition-all duration-200 whitespace-nowrap">
          <span>Unicode</span>
          <ChevronDown class="w-3 h-3 opacity-50 group-hover:rotate-180 transition-transform" />
        </button>

        <div class="absolute left-0 top-full pt-1 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50 min-w-[140px] bg-[var(--color-bg-card)] rounded-lg shadow-xl border border-[var(--color-border)] py-1">
          <!-- Bridge to prevent dropdown from closing -->
          <div class="absolute inset-0 -top-2 h-2"></div>
          
          <button @click="$emit('unicodeToChinese')" class="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[var(--color-text-primary)] hover:bg-[var(--color-btn-bg)] transition-colors text-left">
            <Globe class="w-3.5 h-3.5" />
            Unicode → 中文
          </button>
          <button @click="$emit('chineseToUnicode')" class="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[var(--color-text-primary)] hover:bg-[var(--color-btn-bg)] transition-colors text-left">
            <Languages class="w-3.5 h-3.5" />
            中文 → Unicode
          </button>
        </div>
      </div>

      <!-- More Dropdown (Hover) -->
      <div class="relative group">
        <button class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[var(--color-text-primary)] bg-[var(--color-btn-bg)] rounded hover:bg-[var(--color-btn-hover)] group-hover:text-[var(--color-primary)] transition-all duration-200 whitespace-nowrap">
          <span>更多</span>
          <ChevronDown class="w-3 h-3 opacity-50 group-hover:rotate-180 transition-transform" />
        </button>

        <div class="absolute right-0 top-full pt-1 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50 min-w-[140px] bg-[var(--color-bg-card)] rounded-lg shadow-xl border border-[var(--color-border)] py-1">
          <!-- Bridge to prevent dropdown from closing -->
          <div class="absolute inset-0 -top-2 h-2"></div>

          <button @click="$emit('download')" class="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[var(--color-text-primary)] hover:bg-[var(--color-btn-bg)] transition-colors text-left">
            <FileDown class="w-3.5 h-3.5" />
            下载
          </button>
          <button @click="$emit('clear')" class="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-500 hover:bg-[var(--color-btn-bg)] transition-colors text-left">
            <Trash2 class="w-3.5 h-3.5" />
            清空
          </button>
          <div class="my-1 border-t border-[var(--color-border)]"></div>
          <button @click="$emit('sort')" class="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[var(--color-text-primary)] hover:bg-[var(--color-btn-bg)] transition-colors text-left">
            <ArrowDownAz class="w-3.5 h-3.5" />
            排序键名
          </button>
          <div class="my-1 border-t border-[var(--color-border)]"></div>
          <button @click="$emit('toYaml')" class="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[var(--color-text-primary)] hover:bg-[var(--color-btn-bg)] transition-colors text-left">
            <Code2 class="w-3.5 h-3.5" />
            转为 YAML
          </button>
          <button @click="$emit('toXml')" class="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[var(--color-text-primary)] hover:bg-[var(--color-btn-bg)] transition-colors text-left">
            <Binary class="w-3.5 h-3.5" />
            转为 XML
          </button>
          <div class="my-1 border-t border-[var(--color-border)]"></div>
          <button @click="$emit('escape')" class="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[var(--color-text-primary)] hover:bg-[var(--color-btn-bg)] transition-colors text-left">
            <FileCode class="w-3.5 h-3.5" />
            转义
          </button>
          <button @click="$emit('unescape')" class="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[var(--color-text-primary)] hover:bg-[var(--color-btn-bg)] transition-colors text-left">
            <FileText class="w-3.5 h-3.5" />
            去转义
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
