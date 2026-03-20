<template>
  <div class="app">
    <header class="app-header">
      <div class="app-title">
        <span class="logo">&#9671;</span> SkillHub
      </div>
      <div class="app-badge">V1 · Hub</div>
    </header>
    <div class="app-body">
      <aside class="sidebar">
        <SkillList
          :skills="skills"
          :selected="selectedSkillName"
          :loading="loadingList"
          @select="selectSkill"
        />
      </aside>
      <main class="content">
        <div v-if="loadingDetail" class="loading-state">
          Loading skill...
        </div>
        <div v-else-if="!selectedSkill" class="empty-state">
          <div class="empty-icon">&#9671;</div>
          <p>Select a skill to explore</p>
        </div>
        <template v-else>
          <SkillDetail :skill="selectedSkill" />
          <div class="files-section">
            <h3 class="section-title">Files</h3>
            <div class="files-panel">
              <div class="file-tree-panel">
                <FileTree
                  :tree="selectedSkill.fileTree"
                  :selectedPath="selectedFilePath"
                  @select-file="selectFile"
                />
              </div>
              <div class="file-viewer-panel">
                <FileViewer
                  :skillName="selectedSkill.name"
                  :filePath="selectedFilePath"
                />
              </div>
            </div>
          </div>
        </template>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import SkillList from './SkillList.vue';
import SkillDetail from './SkillDetail.vue';
import FileTree from './FileTree.vue';
import FileViewer from './FileViewer.vue';

interface SkillSummary {
  name: string;
  description: string;
  fileCount: number;
  totalSize: number;
  hasScripts: boolean;
  hasReferences: boolean;
  hasAssets: boolean;
}

interface SkillDetailData {
  name: string;
  frontmatter: Record<string, unknown>;
  markdownHtml: string;
  fileTree: Record<string, unknown>;
  fileCount: number;
  totalSize: number;
}

const skills = ref<SkillSummary[]>([]);
const selectedSkillName = ref<string | null>(null);
const selectedSkill = ref<SkillDetailData | null>(null);
const selectedFilePath = ref<string | null>(null);
const loadingList = ref(true);
const loadingDetail = ref(false);

onMounted(async () => {
  try {
    const res = await fetch('/api/skills');
    const data = await res.json();
    skills.value = data.skills;
  } catch (e) {
    console.error('Failed to load skills:', e);
  } finally {
    loadingList.value = false;
  }

  // Auto-select first skill
  if (skills.value.length > 0) {
    selectSkill(skills.value[0].name);
  }
});

async function selectSkill(name: string) {
  selectedSkillName.value = name;
  selectedFilePath.value = null;
  loadingDetail.value = true;

  try {
    const res = await fetch(`/api/skills/${encodeURIComponent(name)}`);
    const data = await res.json();
    selectedSkill.value = data;
  } catch (e) {
    console.error('Failed to load skill detail:', e);
    selectedSkill.value = null;
  } finally {
    loadingDetail.value = false;
  }
}

function selectFile(filePath: string) {
  selectedFilePath.value = filePath;
}
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.app-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo {
  color: var(--accent);
  font-size: 20px;
}

.app-badge {
  font-size: 12px;
  color: var(--text-muted);
  background: var(--bg-surface);
  padding: 2px 10px;
  border-radius: 12px;
  border: 1px solid var(--border);
}

.app-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  width: var(--sidebar-width);
  flex-shrink: 0;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border);
  overflow-y: auto;
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60%;
  color: var(--text-muted);
  gap: 12px;
}

.empty-icon {
  font-size: 48px;
  color: var(--border-light);
}

.files-section {
  margin-top: 32px;
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-bottom: 12px;
}

.files-panel {
  display: flex;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  min-height: 300px;
  max-height: 500px;
}

.file-tree-panel {
  width: 240px;
  flex-shrink: 0;
  border-right: 1px solid var(--border);
  overflow-y: auto;
  background: var(--bg-secondary);
}

.file-viewer-panel {
  flex: 1;
  overflow: auto;
}
</style>
