<template>
  <div class="skill-list">
    <div class="list-header">Skills</div>
    <div v-if="loading" class="list-loading">Loading...</div>
    <div v-else-if="skills.length === 0" class="list-empty">No skills found</div>
    <ul v-else class="list">
      <li
        v-for="skill in skills"
        :key="skill.name"
        :class="['list-item', { active: skill.name === selected }]"
        @click="$emit('select', skill.name)"
      >
        <div class="skill-name">{{ skill.name }}</div>
        <div class="skill-meta">
          <span class="file-count">{{ skill.fileCount }} files</span>
          <span v-if="skill.hasScripts" class="badge" title="Has scripts">S</span>
          <span v-if="skill.hasReferences" class="badge" title="Has references">R</span>
          <span v-if="skill.hasAssets" class="badge" title="Has assets">A</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  skills: Array<{
    name: string;
    description: string;
    fileCount: number;
    hasScripts: boolean;
    hasReferences: boolean;
    hasAssets: boolean;
  }>;
  selected: string | null;
  loading: boolean;
}>();

defineEmits<{
  select: [name: string];
}>();
</script>

<style scoped>
.skill-list {
  padding: 8px 0;
}

.list-header {
  padding: 8px 16px 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
}

.list-loading,
.list-empty {
  padding: 16px;
  color: var(--text-muted);
  font-size: 13px;
}

.list {
  list-style: none;
}

.list-item {
  padding: 8px 16px;
  cursor: pointer;
  border-left: 2px solid transparent;
  transition: background 0.1s;
}

.list-item:hover {
  background: var(--bg-hover);
}

.list-item.active {
  background: var(--bg-active);
  border-left-color: var(--accent);
}

.skill-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  font-family: 'JetBrains Mono', monospace;
}

.skill-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 2px;
}

.file-count {
  font-size: 11px;
  color: var(--text-muted);
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  font-size: 9px;
  font-weight: 600;
  border-radius: 3px;
  background: var(--bg-surface);
  color: var(--text-secondary);
  border: 1px solid var(--border);
}
</style>
