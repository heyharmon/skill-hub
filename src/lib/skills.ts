import path from 'node:path';
import fs from 'node:fs';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';

// --- Types ---

export interface SkillSource {
  type: 'hub' | 'project';
  projectName?: string;
  projectPath?: string;
}

export interface SkillFrontmatter {
  name: string;
  description: string;
  license?: string;
  allowedTools?: string;
  compatibility?: string;
  metadata?: Record<string, unknown>;
}

export interface SkillFileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  extension?: string;
  children?: SkillFileNode[];
}

export interface SkillSummary {
  name: string;
  description: string;
  source: SkillSource;
  folderPath: string;
  fileCount: number;
  totalSize: number;
  hasScripts: boolean;
  hasReferences: boolean;
  hasAssets: boolean;
}

export interface SkillDetail {
  name: string;
  source: SkillSource;
  folderPath: string;
  frontmatter: SkillFrontmatter;
  markdownBody: string;
  markdownHtml: string;
  fileTree: SkillFileNode;
  fileCount: number;
  totalSize: number;
}

// --- Constants ---

const LANGUAGE_MAP: Record<string, string> = {
  py: 'python',
  js: 'javascript',
  ts: 'typescript',
  sh: 'bash',
  bash: 'bash',
  md: 'markdown',
  json: 'json',
  yaml: 'yaml',
  yml: 'yaml',
  html: 'html',
  css: 'css',
  xml: 'xml',
  sql: 'sql',
  rb: 'ruby',
  go: 'go',
  rs: 'rust',
  java: 'java',
  kt: 'kotlin',
  swift: 'swift',
  c: 'c',
  cpp: 'cpp',
  h: 'c',
  txt: 'text',
  toml: 'toml',
  ini: 'ini',
  cfg: 'ini',
  env: 'text',
  r: 'r',
};

const TEXT_EXTENSIONS = new Set(Object.keys(LANGUAGE_MAP));

// --- Markdown renderer ---

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

// --- Functions ---

export function getSkillsDir(): string {
  const base = process.env.SKILLS_DIR || process.cwd();
  return path.join(base, '.claude', 'skills');
}

export function isTextFile(filePath: string): boolean {
  const ext = path.extname(filePath).slice(1).toLowerCase();
  return TEXT_EXTENSIONS.has(ext);
}

export function getLanguage(filePath: string): string {
  const ext = path.extname(filePath).slice(1).toLowerCase();
  return LANGUAGE_MAP[ext] || 'text';
}

export function walkDirectory(dirPath: string, relativeTo: string): SkillFileNode {
  const name = path.basename(dirPath);
  const relPath = path.relative(relativeTo, dirPath);
  const stat = fs.statSync(dirPath);

  if (!stat.isDirectory()) {
    return {
      name,
      path: relPath,
      type: 'file',
      size: stat.size,
      extension: path.extname(name).slice(1).toLowerCase() || undefined,
    };
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  entries.sort((a, b) => {
    // Directories first, then files, alphabetical within each group
    if (a.isDirectory() && !b.isDirectory()) return -1;
    if (!a.isDirectory() && b.isDirectory()) return 1;
    return a.name.localeCompare(b.name);
  });

  const children: SkillFileNode[] = entries.map((entry) =>
    walkDirectory(path.join(dirPath, entry.name), relativeTo)
  );

  return {
    name,
    path: relPath || '.',
    type: 'directory',
    children,
  };
}

function countFiles(node: SkillFileNode): number {
  if (node.type === 'file') return 1;
  return (node.children || []).reduce((sum, child) => sum + countFiles(child), 0);
}

function totalSize(node: SkillFileNode): number {
  if (node.type === 'file') return node.size || 0;
  return (node.children || []).reduce((sum, child) => sum + totalSize(child), 0);
}

function hasSubdir(dirPath: string, name: string): boolean {
  const sub = path.join(dirPath, name);
  return fs.existsSync(sub) && fs.statSync(sub).isDirectory();
}

export function parseFrontmatter(raw: Record<string, unknown>): SkillFrontmatter {
  return {
    name: String(raw.name || ''),
    description: String(raw.description || ''),
    license: raw.license ? String(raw.license) : undefined,
    allowedTools: raw['allowed-tools'] ? String(raw['allowed-tools']) : undefined,
    compatibility: raw.compatibility ? String(raw.compatibility) : undefined,
    metadata: raw.metadata as Record<string, unknown> | undefined,
  };
}

export function listSkills(): SkillSummary[] {
  const skillsDir = getSkillsDir();

  if (!fs.existsSync(skillsDir)) {
    return [];
  }

  const entries = fs.readdirSync(skillsDir, { withFileTypes: true });
  const skills: SkillSummary[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const skillDir = path.join(skillsDir, entry.name);
    const skillMdPath = path.join(skillDir, 'SKILL.md');

    if (!fs.existsSync(skillMdPath)) continue;

    const raw = fs.readFileSync(skillMdPath, 'utf-8');
    const { data } = matter(raw);
    const fm = parseFrontmatter(data);
    const tree = walkDirectory(skillDir, skillDir);

    skills.push({
      name: fm.name || entry.name,
      description: fm.description,
      source: { type: 'hub' },
      folderPath: skillDir,
      fileCount: countFiles(tree),
      totalSize: totalSize(tree),
      hasScripts: hasSubdir(skillDir, 'scripts'),
      hasReferences: hasSubdir(skillDir, 'references'),
      hasAssets: hasSubdir(skillDir, 'assets'),
    });
  }

  skills.sort((a, b) => a.name.localeCompare(b.name));
  return skills;
}

export function getSkillDetail(name: string): SkillDetail | null {
  const skillsDir = getSkillsDir();
  const skillDir = path.join(skillsDir, name);
  const skillMdPath = path.join(skillDir, 'SKILL.md');

  if (!fs.existsSync(skillMdPath)) {
    return null;
  }

  const raw = fs.readFileSync(skillMdPath, 'utf-8');
  const { data, content } = matter(raw);
  const fm = parseFrontmatter(data);
  const tree = walkDirectory(skillDir, skillDir);

  return {
    name: fm.name || name,
    source: { type: 'hub' },
    folderPath: skillDir,
    frontmatter: fm,
    markdownBody: content,
    markdownHtml: md.render(content),
    fileTree: tree,
    fileCount: countFiles(tree),
    totalSize: totalSize(tree),
  };
}

export function getFileContent(
  skillName: string,
  filePath: string
): { content: string; language: string; size: number } | { error: string; status: number } {
  const skillsDir = getSkillsDir();
  const skillDir = path.resolve(skillsDir, skillName);
  const resolvedPath = path.resolve(skillDir, filePath);

  // Path traversal prevention
  if (!resolvedPath.startsWith(skillDir + path.sep) && resolvedPath !== skillDir) {
    return { error: 'Invalid file path', status: 400 };
  }

  if (!fs.existsSync(resolvedPath)) {
    return { error: 'File not found', status: 404 };
  }

  const stat = fs.statSync(resolvedPath);
  if (stat.isDirectory()) {
    return { error: 'Path is a directory', status: 400 };
  }

  if (!isTextFile(resolvedPath)) {
    return { error: 'Binary file cannot be displayed as text', status: 400 };
  }

  const content = fs.readFileSync(resolvedPath, 'utf-8');
  const language = getLanguage(resolvedPath);

  return { content, language, size: stat.size };
}
