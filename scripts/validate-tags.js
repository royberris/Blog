#!/usr/bin/env node

// Simple script to validate blog tags during development
const { validateBlogTags, getAvailableTags } = require('./lib/blog-data.ts');

console.log('🏷️  Blog Tag Validation');
console.log('=====================');

try {
  const issues = validateBlogTags();
  
  if (issues.length === 0) {
    console.log('✅ All blog tags are valid!');
  } else {
    console.log('❌ Found invalid tags:');
    issues.forEach(issue => {
      console.log(`  📄 ${issue.blog}:`);
      issue.invalidTags.forEach(tag => {
        console.log(`    - "${tag}" (invalid)`);
      });
    });
  }
  
  console.log('\n📚 Available tags:');
  const availableTags = getAvailableTags();
  availableTags.forEach(tag => {
    console.log(`  - ${tag}`);
  });
  
} catch (error) {
  console.error('❌ Error validating tags:', error.message);
}