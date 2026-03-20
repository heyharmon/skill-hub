<template>
  <div class="file-viewer">
    <div v-if="!filePath" class="placeholder">
      <span class="placeholder-text">Select a file to view its contents</span>
    </div>
    <template v-else>
      <div class="viewer-header">
        <span class="file-name mono">{{ fileName }}</span>
        <span v-if="fileData" class="file-meta">
          <span class="file-lang">{{ fileData.language }}</span>
          <span class="dot">·</span>
          <span>{{ formatSize(fileData.size) }}</span>
        </span>
      </div>
      <div v-if="loading" class="viewer-loading">Loading...</div>
      <div v-else-if="error" class="viewer-error">{{ error }}</div>
      <div v-else-if="highlightedHtml" class="viewer-content" v-html="highlightedHtml"></div>
      <pre v-else-if="fileData" class="viewer-raw mono"><code>{{ fileData.content }}</code></pre>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { codeToHtml } from 'shiki';

const props = defineProps<{
  skillName: string;
  filePath: string | null;
}>();

interface FileData {
  content: string;
  language: string;
  size: number;
}

const fileData = ref<FileData | null>(null);
const highlightedHtml = ref<string | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

const fileName = computed(() => {
  if (!props.filePath) return '';
  return props.filePath.split('/').pop() || props.filePath;
});

watch(
  () => [props.skillName, props.filePath],
  async () => {
    if (!props.filePath) {
      fileData.value = null;
      highlightedHtml.value = null;
      return;
    }

    loading.value = true;
    error.value = null;
    highlightedHtml.value = null;

    try {
      const res = await fetch(
        `/api/skills/${encodeURIComponent(props.skillName)}/files/${props.filePath}`
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to load file');
      }
      const data: FileData = await res.json();
      fileData.value = data;

      // Syntax highlight with shiki
      if (data.content && data.language && data.language !== 'text') {
        try {
          highlightedHtml.value = await codeToHtml(data.content, {
            lang: data.language,
            theme: 'github-dark-default',
          });
        } catch {
          // Fall back to raw display if shiki doesn't support the language
          highlightedHtml.value = null;
        }
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load file';
      fileData.value = null;
    } finally {
      loading.value = false;
    }
  },
  { immediate: true }
);

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}
</script>

<style scoped>
.file-viewer {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-muted);
  font-size: 13px;
}

.viewer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-surface);
  flex-shrink: 0;
}

.file-name {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-primary);
}

.file-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--text-muted);
}

.file-lang {
  color: var(--accent);
}

.dot {
  color: var(--border-light);
}

.viewer-loading,
.viewer-error {
  padding: 16px;
  color: var(--text-muted);
  font-size: 13px;
}

.viewer-error {
  color: var(--red);
}

.viewer-content {
  flex: 1;
  overflow: auto;
  font-size: 13px;
}

.viewer-content :deep(pre) {
  margin: 0;
  padding: 16px;
  background: var(--bg-primary) !important;
  border-radius: 0;
  font-size: 13px;
  line-height: 1.5;
}

.viewer-content :deep(code) {
  font-family: 'JetBrains Mono', monospace;
}

.viewer-raw {
  flex: 1;
  overflow: auto;
  margin: 0;
  padding: 16px;
  font-size: 13px;
  line-height: 1.5;
  color: var(--text-primary);
  background: var(--bg-primary);
}
</style>
