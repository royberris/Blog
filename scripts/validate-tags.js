#!/usr/bin/env node

// Simple script to validate node tags (clusters) during development.
// Standalone on purpose: lib/nodes.ts uses TS path aliases that plain node can't resolve.
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const root = path.join(__dirname, '..');
const nodesDirectory = path.join(root, 'nodes');
const tagsConfig = JSON.parse(fs.readFileSync(path.join(root, 'data', 'tags.json'), 'utf8'));
const knownTags = Object.keys(tagsConfig);

// devto front matter: true, or an object whose tags are 1 to 4 unique lowercase alphanumeric dev.to tags
function validateDevto(devto) {
  if (devto === undefined || devto === true || devto === false) return [];
  if (typeof devto !== 'object' || Array.isArray(devto)) return ['devto must be true or an object'];
  if (devto.tags === undefined) return [];
  const tags = devto.tags;
  if (!Array.isArray(tags) || tags.length === 0 || tags.length > 4) return ['devto.tags must list 1 to 4 tags'];
  const issues = tags
    .filter((tag) => typeof tag !== 'string' || !/^[a-z0-9]+$/.test(tag))
    .map((tag) => `devto tag "${tag}" (must be lowercase alphanumeric)`);
  if (new Set(tags).size !== tags.length) issues.push('devto.tags contains duplicates');
  return issues;
}

console.log('🏷️  Node Tag Validation');
console.log('=====================');

try {
  const files = fs.readdirSync(nodesDirectory).filter((f) => f.endsWith('.md'));
  const slugs = new Set(files.map((f) => f.replace(/\.md$/, '')));
  const issues = [];

  files.forEach((file) => {
    const { data } = matter(fs.readFileSync(path.join(nodesDirectory, file), 'utf8'));
    const invalidTags = (data.tags || []).filter((tag) => !knownTags.includes(tag));
    const brokenRelated = (data.related || []).filter((slug) => !slugs.has(slug));
    const devtoIssues = validateDevto(data.devto);
    if (invalidTags.length || brokenRelated.length || devtoIssues.length) {
      issues.push({ node: file.replace(/\.md$/, ''), invalidTags, brokenRelated, devtoIssues });
    }
  });

  // Legacy /blogs/<slug>/ redirects must point at a node that exists, a list page or /about/
  const legacyPath = path.join(root, 'data', 'legacy-redirects.json');
  const legacy = fs.existsSync(legacyPath) ? JSON.parse(fs.readFileSync(legacyPath, 'utf8')) : {};
  const brokenLegacy = Object.entries(legacy).filter(([, target]) => {
    const node = /^\/nodes\/([^/]+)\/$/.exec(target);
    if (node) return !slugs.has(node[1]);
    return !/^\/((nodes|clusters)\/([^/]+\/)?|about\/)$/.test(target);
  });
  if (brokenLegacy.length) {
    issues.push({ node: 'data/legacy-redirects.json', invalidTags: [], brokenRelated: [], brokenLegacy });
  }

  if (issues.length === 0) {
    console.log('✅ All node tags, related links, dev.to settings and legacy redirects are valid!');
  } else {
    console.log('❌ Found issues:');
    issues.forEach((issue) => {
      console.log(`  📄 ${issue.node}:`);
      issue.invalidTags.forEach((tag) => console.log(`    - tag "${tag}" (invalid)`));
      issue.brokenRelated.forEach((slug) => console.log(`    - related "${slug}" (no such node)`));
      (issue.devtoIssues || []).forEach((message) => console.log(`    - ${message}`));
      (issue.brokenLegacy || []).forEach(([from, to]) => console.log(`    - /blogs/${from}/ → ${to} (no such page)`));
    });
    process.exitCode = 1;
  }

  console.log('\n📚 Available tags:');
  knownTags.sort().forEach((tag) => console.log(`  - ${tag}`));
} catch (error) {
  console.error('❌ Error validating tags:', error.message);
  process.exitCode = 1;
}
