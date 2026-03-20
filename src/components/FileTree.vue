<template>
  <div class="file-tree">
    <FileTreeNode
      :node="tree"
      :depth="0"
      :selectedPath="selectedPath"
      :defaultOpen="true"
      @select-file="$emit('select-file', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import FileTreeNode from './FileTreeNode.vue';

defineProps<{
  tree: {
    name: string;
    path: string;
    type: 'file' | 'directory';
    size?: number;
    extension?: string;
    children?: Array<Record<string, unknown>>;
  };
  selectedPath: string | null;
}>();

defineEmits<{
  'select-file': [path: string];
}>();
</script>

<style scoped>
.file-tree {
  padding: 8px 0;
  font-size: 13px;
  font-family: 'JetBrains Mono', monospace;
}
</style>
