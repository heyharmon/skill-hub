<template>
  <div class="tree-node">
    <div
      :class="['node-row', { selected: isFile && node.path === selectedPath }]"
      :style="{ paddingLeft: depth * 16 + 8 + 'px' }"
      @click="handleClick"
    >
      <span v-if="isDirectory" class="toggle">{{ open ? '&#9660;' : '&#9654;' }}</span>
      <span v-else class="toggle spacer"></span>
      <span class="icon">{{ isDirectory ? '&#128193;' : fileIcon }}</span>
      <span class="name">{{ node.name }}</span>
      <span v-if="isFile && node.size != null" class="size">{{ formatSize(node.size) }}</span>
    </div>
    <div v-if="isDirectory && open && node.children">
      <FileTreeNode
        v-for="child in node.children"
        :key="child.path"
        :node="child"
        :depth="depth + 1"
        :selectedPath="selectedPath"
        @select-file="$emit('select-file', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface TreeNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  extension?: string;
  children?: TreeNode[];
}

const props = defineProps<{
  node: TreeNode;
  depth: number;
  selectedPath: string | null;
  defaultOpen?: boolean;
}>();

const emit = defineEmits<{
  'select-file': [path: string];
}>();

const open = ref(props.defaultOpen ?? false);

const isDirectory = computed(() => props.node.type === 'directory');
const isFile = computed(() => props.node.type === 'file');

const fileIcon = computed(() => {
  const ext = props.node.extension;
  if (!ext) return '&#128196;';
  if (['py'].includes(ext)) return '&#128013;';
  if (['js', 'ts'].includes(ext)) return '&#9889;';
  if (['md'].includes(ext)) return '&#128214;';
  if (['json', 'yaml', 'yml', 'toml'].includes(ext)) return '&#9881;';
  if (['sh', 'bash'].includes(ext)) return '&#9654;';
  return '&#128196;';
});

function handleClick() {
  if (isDirectory.value) {
    open.value = !open.value;
  } else {
    emit('select-file', props.node.path);
  }
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}
</script>

<style scoped>
.node-row {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.1s;
}

.node-row:hover {
  background: var(--bg-hover);
}

.node-row.selected {
  background: var(--bg-active);
  color: var(--accent);
}

.toggle {
  font-size: 8px;
  width: 14px;
  text-align: center;
  color: var(--text-muted);
  flex-shrink: 0;
}

.spacer {
  visibility: hidden;
}

.icon {
  font-size: 14px;
  flex-shrink: 0;
}

.name {
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.size {
  margin-left: auto;
  font-size: 10px;
  color: var(--text-muted);
  padding-left: 8px;
}
</style>
