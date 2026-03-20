<template>
  <div class="skill-detail">
    <!-- Frontmatter Card -->
    <div class="frontmatter-card">
      <div class="fm-header">
        <h1 class="fm-name">{{ skill.frontmatter.name }}</h1>
        <span v-if="skill.frontmatter.license" class="fm-license">{{ skill.frontmatter.license }}</span>
      </div>
      <p class="fm-description">{{ skill.frontmatter.description }}</p>

      <div class="fm-fields">
        <div v-if="skill.frontmatter.allowedTools" class="fm-field">
          <span class="fm-label">Allowed Tools</span>
          <code class="fm-value mono">{{ skill.frontmatter.allowedTools }}</code>
        </div>
        <div v-if="skill.frontmatter.compatibility" class="fm-field">
          <span class="fm-label">Compatibility</span>
          <span class="fm-value">{{ skill.frontmatter.compatibility }}</span>
        </div>
        <template v-if="skill.frontmatter.metadata">
          <div v-for="(value, key) in skill.frontmatter.metadata" :key="key" class="fm-field">
            <span class="fm-label">{{ key }}</span>
            <span class="fm-value">{{ formatValue(value) }}</span>
          </div>
        </template>
      </div>

      <div class="fm-stats">
        <span>{{ skill.fileCount }} files</span>
        <span class="dot">·</span>
        <span>{{ formatBytes(skill.totalSize) }}</span>
      </div>
    </div>

    <!-- Markdown Body -->
    <div class="markdown-body" v-html="skill.markdownHtml"></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  skill: {
    frontmatter: {
      name: string;
      description: string;
      license?: string;
      allowedTools?: string;
      compatibility?: string;
      metadata?: Record<string, unknown>;
    };
    markdownHtml: string;
    fileCount: number;
    totalSize: number;
  };
}>();

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatValue(value: unknown): string {
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'object' && value !== null) return JSON.stringify(value);
  return String(value);
}
</script>

<style scoped>
.skill-detail {
  max-width: var(--content-max-width);
}

.frontmatter-card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px 24px;
  margin-bottom: 24px;
}

.fm-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.fm-name {
  font-size: 22px;
  font-weight: 600;
  font-family: 'JetBrains Mono', monospace;
  color: var(--text-primary);
}

.fm-license {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
  background: var(--bg-hover);
  color: var(--teal);
  border: 1px solid var(--border);
}

.fm-description {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 16px;
}

.fm-fields {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
  margin-bottom: 12px;
}

.fm-field {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 13px;
}

.fm-label {
  color: var(--text-muted);
  font-weight: 500;
}

.fm-value {
  color: var(--text-secondary);
}

.fm-value.mono {
  font-size: 12px;
  background: var(--bg-primary);
  padding: 1px 6px;
  border-radius: var(--radius-sm);
}

.fm-stats {
  font-size: 12px;
  color: var(--text-muted);
  display: flex;
  gap: 6px;
}

.dot {
  color: var(--border-light);
}

/* Markdown body styles */
.markdown-body {
  max-width: var(--content-max-width);
  line-height: 1.7;
  color: var(--text-primary);
}

.markdown-body :deep(h1) {
  font-size: 24px;
  font-weight: 600;
  margin: 32px 0 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
}

.markdown-body :deep(h2) {
  font-size: 20px;
  font-weight: 600;
  margin: 28px 0 12px;
  color: var(--text-primary);
}

.markdown-body :deep(h3) {
  font-size: 16px;
  font-weight: 600;
  margin: 24px 0 8px;
  color: var(--text-primary);
}

.markdown-body :deep(p) {
  margin: 0 0 12px;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  margin: 0 0 12px;
  padding-left: 24px;
}

.markdown-body :deep(li) {
  margin-bottom: 4px;
}

.markdown-body :deep(code) {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  background: var(--bg-surface);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  color: var(--lavender);
}

.markdown-body :deep(pre) {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
  margin: 0 0 16px;
  overflow-x: auto;
}

.markdown-body :deep(pre code) {
  background: none;
  padding: 0;
  font-size: 13px;
  color: var(--text-primary);
}

.markdown-body :deep(strong) {
  font-weight: 600;
  color: var(--text-primary);
}

.markdown-body :deep(hr) {
  border: none;
  border-top: 1px solid var(--border);
  margin: 24px 0;
}

.markdown-body :deep(blockquote) {
  border-left: 3px solid var(--accent-dim);
  padding-left: 16px;
  color: var(--text-secondary);
  margin: 0 0 12px;
}

.markdown-body :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 0 0 16px;
}

.markdown-body :deep(th),
.markdown-body :deep(td) {
  border: 1px solid var(--border);
  padding: 8px 12px;
  text-align: left;
}

.markdown-body :deep(th) {
  background: var(--bg-surface);
  font-weight: 600;
}
</style>
