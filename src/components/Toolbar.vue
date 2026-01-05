<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import {
  Type,
  Minimize2,
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
  Wrench,
} from "lucide-vue-next";

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

const showDropdown = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    showDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div
    class="flex items-center gap-4 px-4 py-3 bg-[var(--color-bg-card)] border-b border-[var(--color-border)]"
  >
    <!-- Logo & Title -->
    <div class="flex items-center gap-3">
      <span class="text-lg font-semibold text-[var(--color-text-primary)]"
        >JSON Tool</span
      >
    </div>

    <!-- Action Buttons (左对齐) -->
    <div class="flex items-center gap-2">
      <!-- Primary Button: Format -->
      <button
        @click="$emit('format')"
        class="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[var(--color-text-primary)] bg-[var(--color-btn-bg)] rounded-lg hover:bg-[var(--color-btn-hover)] hover:-translate-y-0.5 transition-all duration-200"
      >
        <Type class="w-4 h-4" />
        格式化
      </button>

      <!-- Secondary Buttons -->
      <button
        @click="$emit('minify')"
        class="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[var(--color-text-primary)] bg-[var(--color-btn-bg)] rounded-lg hover:bg-[var(--color-btn-hover)] hover:-translate-y-0.5 transition-all duration-200"
      >
        <Minimize2 class="w-4 h-4" />
        压缩
      </button>

      <button
        @click="$emit('verify')"
        class="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[var(--color-text-primary)] bg-[var(--color-btn-bg)] rounded-lg hover:bg-[var(--color-btn-hover)] hover:-translate-y-0.5 transition-all duration-200"
      >
        <CheckCircle class="w-4 h-4" />
        校验
      </button>

      <button
        @click="$emit('copy')"
        class="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[var(--color-text-primary)] bg-[var(--color-btn-bg)] rounded-lg hover:bg-[var(--color-btn-hover)] hover:-translate-y-0.5 transition-all duration-200"
      >
        <Copy class="w-4 h-4" />
        复制
      </button>

      <!-- More Dropdown -->
      <div class="relative" ref="dropdownRef">
        <button
          @click.stop="showDropdown = !showDropdown"
          class="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[var(--color-text-primary)] bg-[var(--color-btn-bg)] rounded-lg hover:bg-[var(--color-btn-hover)] transition-all duration-200"
        >
          更多
          <ChevronDown
            class="w-4 h-4"
            :class="{ 'rotate-180': showDropdown }"
          />
        </button>

        <transition name="dropdown">
          <div
            v-if="showDropdown"
            class="absolute right-0 top-full mt-2 w-48 bg-[var(--color-bg-card)] rounded-lg shadow-lg border border-[var(--color-border)] py-1 z-50"
          >
            <!-- File Actions -->
            <button
              @click="
                $emit('download');
                showDropdown = false;
              "
              class="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-btn-bg)] transition-colors"
            >
              <FileDown class="w-4 h-4 text-[var(--color-text-secondary)]" />
              下载
            </button>
            <button
              @click="
                $emit('clear');
                showDropdown = false;
              "
              class="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-btn-bg)] transition-colors"
            >
              <Trash2 class="w-4 h-4 text-[var(--color-text-secondary)]" />
              清空
            </button>

            <div class="my-1 border-t border-[var(--color-border)]"></div>

            <!-- Sort -->
            <button
              @click="
                $emit('sort');
                showDropdown = false;
              "
              class="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-btn-bg)] transition-colors"
            >
              <ArrowDownAz class="w-4 h-4 text-[var(--color-text-secondary)]" />
              排序键名
            </button>

            <div class="my-1 border-t border-[var(--color-border)]"></div>

            <!-- Convert -->
            <button
              @click="
                $emit('toYaml');
                showDropdown = false;
              "
              class="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-btn-bg)] transition-colors"
            >
              <Code2 class="w-4 h-4 text-[var(--color-text-secondary)]" />
              转为 YAML
            </button>
            <button
              @click="
                $emit('toXml');
                showDropdown = false;
              "
              class="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-btn-bg)] transition-colors"
            >
              <Binary class="w-4 h-4 text-[var(--color-text-secondary)]" />
              转为 XML
            </button>

            <div class="my-1 border-t border-[var(--color-border)]"></div>

            <!-- Escape -->
            <button
              @click="
                $emit('escape');
                showDropdown = false;
              "
              class="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-btn-bg)] transition-colors"
            >
              <FileCode class="w-4 h-4 text-[var(--color-text-secondary)]" />
              转义
            </button>
            <button
              @click="
                $emit('unescape');
                showDropdown = false;
              "
              class="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-btn-bg)] transition-colors"
            >
              <FileText class="w-4 h-4 text-[var(--color-text-secondary)]" />
              去转义
            </button>

            <div class="my-1 border-t border-[var(--color-border)]"></div>

            <!-- Unicode -->
            <button
              @click="
                $emit('unicodeToChinese');
                showDropdown = false;
              "
              class="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-btn-bg)] transition-colors"
            >
              <Globe class="w-4 h-4 text-[var(--color-text-secondary)]" />
              Unicode → 中文
            </button>
            <button
              @click="
                $emit('chineseToUnicode');
                showDropdown = false;
              "
              class="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-btn-bg)] transition-colors"
            >
              <Languages class="w-4 h-4 text-[var(--color-text-secondary)]" />
              中文 → Unicode
            </button>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>
