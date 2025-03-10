#!/usr/bin/env node

/**
 * Build Artifacts Index
 * 
 * This script scans the src/artifacts directory, extracts metadata from artifact files,
 * and generates a JSON index file that can be used by the application.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file's directory (equivalent to __dirname in CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const ARTIFACTS_DIR = path.resolve(__dirname, 'src/artifacts');
const OUTPUT_FILE = path.resolve(__dirname, 'src/artifactsIndex.json');
const IGNORED_FILES = ['.gitkeep', '.DS_Store', 'README.md'];
const IGNORED_DIRS = ['utils', 'helpers', 'node_modules'];
const DEFAULT_TYPE = 'component';

/**
 * Extract metadata from file content
 * @param {string} filePath - Path to the artifact file
 * @param {string} content - Content of the artifact file
 * @returns {Object} Extracted metadata
 */
function extractMetadata(filePath, content) {
  const fileName = path.basename(filePath, path.extname(filePath));
  const relativePath = path.relative(ARTIFACTS_DIR, filePath);
  const fileStats = fs.statSync(filePath);
  
  // Convert component name from CamelCase or kebab-case to human-readable
  const displayName = fileName
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/-/g, ' ')         // Replace hyphens with spaces
    .replace(/^\w/, c => c.toUpperCase()) // Capitalize first letter
    .trim();
  
  // Default metadata
  const metadata = {
    id: fileName.toLowerCase().replace(/\s+/g, '-'),
    name: displayName,
    description: `${displayName} component`,
    path: relativePath,
    type: getArtifactType(filePath, content),
    createdAt: fileStats.birthtime.toISOString(),
    updatedAt: fileStats.mtime.toISOString(),
    tags: []
  };
  
  // Extract JSDoc comments to find better metadata
  const jsdocComment = extractJSDocComment(content);
  if (jsdocComment) {
    // Extract description from JSDoc
    const descriptionMatch = jsdocComment.match(/\*\s+([^@\r\n]+)/);
    if (descriptionMatch && descriptionMatch[1].trim()) {
      metadata.description = descriptionMatch[1].trim();
    }
    
    // Look for tags in JSDoc
    const tagMatches = [...jsdocComment.matchAll(/@(\w+)\s+([^\r\n]+)/g)];
    for (const match of tagMatches) {
      const [_, tagName, tagValue] = match;
      switch (tagName.toLowerCase()) {
        case 'title':
        case 'name':
          metadata.name = tagValue.trim();
          break;
        case 'description':
          metadata.description = tagValue.trim();
          break;
        case 'type':
          metadata.type = tagValue.trim();
          break;
        case 'tags':
          metadata.tags = tagValue.split(',').map(tag => tag.trim());
          break;
      }
    }
  }
  
  // If no tags were found in JSDoc, try to infer from file location or content
  if (metadata.tags.length === 0) {
    metadata.tags = inferTags(filePath, content);
  }
  
  return metadata;
}

/**
 * Extract the first JSDoc comment from file content
 * @param {string} content - File content
 * @returns {string|null} JSDoc comment or null if not found
 */
function extractJSDocComment(content) {
  const jsdocPattern = /\/\*\*\s*([\s\S]*?)\s*\*\//;
  const match = content.match(jsdocPattern);
  return match ? match[1] : null;
}

/**
 * Infer artifact type from file path and content
 * @param {string} filePath - Path to the artifact file
 * @param {string} content - File content
 * @returns {string} Artifact type
 */
function getArtifactType(filePath, content) {
  const relPath = path.relative(ARTIFACTS_DIR, filePath);
  const dirName = path.dirname(relPath);
  
  if (dirName !== '.') {
    // Use directory name as type if file is in a subdirectory
    return dirName;
  }
  
  // Check content for clues about the type
  if (content.includes('Chart') || content.includes('chart')) {
    return 'visualization';
  } else if (content.includes('Table') || content.includes('table')) {
    return 'data-display';
  } else if (content.includes('Form') || content.includes('form')) {
    return 'input';
  }
  
  return DEFAULT_TYPE;
}

/**
 * Infer tags from file path and content
 * @param {string} filePath - Path to the artifact file
 * @param {string} content - File content
 * @returns {string[]} Inferred tags
 */
function inferTags(filePath, content) {
  const tags = new Set();
  const fileName = path.basename(filePath, path.extname(filePath));
  const relPath = path.relative(ARTIFACTS_DIR, filePath);
  const dirName = path.dirname(relPath);
  
  // Add directory as tag if not in root
  if (dirName !== '.') {
    tags.add(dirName);
  }
  
  // Check for common UI patterns
  if (content.includes('Chart') || content.includes('chart')) {
    tags.add('chart');
    tags.add('visualization');
  }
  if (content.includes('Table') || content.includes('table')) {
    tags.add('table');
    tags.add('data');
  }
  if (content.includes('Form') || content.includes('form')) {
    tags.add('form');
    tags.add('input');
  }
  
  return Array.from(tags);
}

/**
 * Scan a directory recursively for artifact files
 * @param {string} dir - Directory to scan
 * @returns {Object[]} Array of artifact metadata objects
 */
function scanDirectory(dir) {
  const artifacts = [];
  
  if (!fs.existsSync(dir)) {
    console.error(`Directory not found: ${dir}`);
    return artifacts;
  }
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (IGNORED_FILES.includes(entry.name)) {
      continue;
    }
    
    if (entry.isDirectory()) {
      if (IGNORED_DIRS.includes(entry.name)) {
        continue;
      }
      // Recursively scan subdirectories
      const subDirArtifacts = scanDirectory(fullPath);
      artifacts.push(...subDirArtifacts);
    } else if (entry.isFile() && (entry.name.endsWith('.jsx') || entry.name.endsWith('.tsx'))) {
      try {
        console.log(`Processing artifact: ${fullPath}`);
        const content = fs.readFileSync(fullPath, 'utf-8');
        const metadata = extractMetadata(fullPath, content);
        artifacts.push(metadata);
      } catch (error) {
        console.error(`Error processing ${fullPath}: ${error.message}`);
      }
    }
  }
  
  return artifacts;
}

/**
 * Main function to build the artifacts index
 */
function buildArtifactsIndex() {
  console.log('Building artifacts index...');
  console.log(`Scanning directory: ${ARTIFACTS_DIR}`);
  
  if (!fs.existsSync(ARTIFACTS_DIR)) {
    console.error(`Artifacts directory not found: ${ARTIFACTS_DIR}`);
    return;
  }
  
  const artifacts = scanDirectory(ARTIFACTS_DIR);
  
  // Sort artifacts by name
  artifacts.sort((a, b) => a.name.localeCompare(b.name));
  
  // Create output directory if it doesn't exist
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Write the index file
  fs.writeFileSync(
    OUTPUT_FILE,
    JSON.stringify({ 
      artifacts, 
      generatedAt: new Date().toISOString(),
      count: artifacts.length
    }, null, 2)
  );
  
  console.log(`Successfully generated artifacts index with ${artifacts.length} artifacts`);
  console.log(`Output written to: ${OUTPUT_FILE}`);
}

// Run the build function
buildArtifactsIndex();

