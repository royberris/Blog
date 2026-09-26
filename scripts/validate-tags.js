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
    if (invalidTags.length || brokenRelated.length) {
      issues.push({ node: file.replace(/\.md$/, ''), invalidTags, brokenRelated });
    }
  });

  if (issues.length === 0) {
    console.log('✅ All node tags and related links are valid!');
  } else {
    console.log('❌ Found issues:');
    issues.forEach((issue) => {
      console.log(`  📄 ${issue.node}:`);
      issue.invalidTags.forEach((tag) => console.log(`    - tag "${tag}" (invalid)`));
      issue.brokenRelated.forEach((slug) => console.log(`    - related "${slug}" (no such node)`));
    });
    process.exitCode = 1;
  }

  console.log('\n📚 Available tags:');
  knownTags.sort().forEach((tag) => console.log(`  - ${tag}`));
} catch (error) {
  console.error('❌ Error validating tags:', error.message);
  process.exitCode = 1;
}
