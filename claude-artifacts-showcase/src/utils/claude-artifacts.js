import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

// Define the directory where Claude artifacts are stored
const ARTIFACTS_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '../components/claude-artifacts'
);

/**
 * Get the paths to all artifact files in the format required by Astro's getStaticPaths
 * @returns {Array<{params: {artifact: string}, props: {fileName: string, name: string, path: string, metadata: Object}}>} 
 *         Array of objects with params and props for Astro's getStaticPaths
 */
export function getArtifactPaths() {
  try {
    if (!fs.existsSync(ARTIFACTS_DIR)) {
      console.warn(`Artifacts directory not found: ${ARTIFACTS_DIR}`);
      return [];
    }

    const artifacts = fs
      .readdirSync(ARTIFACTS_DIR)
      .filter(file => {
        // Filter for React component files (jsx or tsx extensions)
        return file.endsWith('.jsx') || file.endsWith('.tsx');
      });
    
    // Return array in the format Astro expects for getStaticPaths
    return artifacts.map(fileName => {
      const name = path.basename(fileName, path.extname(fileName));
      const filePath = path.join(ARTIFACTS_DIR, fileName);
      // Read file content and pass it directly to getArtifactMetadata to avoid circular dependency
      let content = null;
      try {
        content = fs.readFileSync(filePath, 'utf-8');
      } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
      }
      const metadata = getArtifactMetadata(name, filePath, content);
      
      return {
        params: { artifact: name },
        props: { 
          fileName,
          name,
          path: filePath,
          metadata
        }
      };
    });
  } catch (error) {
    console.error('Error reading artifacts directory:', error);
    return [];
  }
}

/**
 * Get information about all artifacts
 * @returns {Array<{fileName: string, name: string, path: string}>} Array of artifact info objects
 */
export function getAllArtifacts() {
  const artifactPaths = getArtifactPaths();
  
  return artifactPaths.map(item => {
    // Extract data from the new getArtifactPaths structure
    const { props } = item;
    const { fileName, name, path: artifactPath, metadata } = props;
    
    // Calculate relative path
    const relativePath = path.relative(ARTIFACTS_DIR, artifactPath);
    
    return {
      fileName,
      name,
      path: artifactPath,
      relativePath,
      metadata
    };
  });
}

/**
 * Get information about a specific artifact by its filename
 * @param {string} fileName - The filename of the artifact
 * @returns {Object|null} The artifact info or null if not found
 */
export function getArtifactByFileName(fileName) {
  const artifacts = getAllArtifacts();
  const artifact = artifacts.find(artifact => artifact.fileName === fileName) || null;
  
  if (!artifact) {
    console.warn(`Artifact with filename "${fileName}" not found`);
    return null;
  }
  
  return artifact;
}

/**
 * Get information about a specific artifact by its name (without extension)
 * @param {string} name - The name of the artifact (without extension)
 * @returns {Object|null} The artifact info or null if not found
 */
export function getArtifactByName(name) {
  const artifacts = getAllArtifacts();
  const artifact = artifacts.find(artifact => artifact.name === name) || null;
  
  if (!artifact) {
    console.warn(`Artifact with name "${name}" not found`);
    return null;
  }
  
  return artifact;
}

/**
 * Dynamically import a specific artifact component
 * @param {string} name - The name of the artifact (without extension)
 * @returns {Promise<Component>} A promise that resolves to the component
 */
export async function importArtifactComponent(name) {
  const artifact = getArtifactByName(name);
  
  if (!artifact) {
    throw new Error(`Artifact not found: ${name}`);
  }
  
  try {
    // Using dynamic import to load the component
    const module = await import(/* @vite-ignore */ `../components/claude-artifacts/${artifact.fileName}`);
    return module.default || module;
  } catch (error) {
    console.error(`Error importing artifact ${name}:`, error);
    throw error;
  }
}

/**
 * Reads the content of an artifact file
 * @param {string} name - The name of the artifact (without extension)
 * @returns {string|null} The content of the file or null if not found
 */
export function getArtifactContent(name) {
  const artifact = getArtifactByName(name);
  
  if (!artifact) {
    return null;
  }
  
  try {
    return fs.readFileSync(artifact.path, 'utf-8');
  } catch (error) {
    console.error(`Error reading artifact ${name}:`, error);
    return null;
  }
}

/**
 * Extract metadata from artifact content (JSDoc comments, etc.)
 * @param {string} name - The name of the artifact (without extension) 
 * @param {string} [filePath] - Optional direct path to the file
 * @param {string} [content] - Optional content of the file
 * @returns {Object} The extracted metadata
 */
export function getArtifactMetadata(name, filePath, content) {
  // If content is not provided directly, try to get it
  if (!content) {
    // If filePath is provided, read content from the file directly
    if (filePath && fs.existsSync(filePath)) {
      try {
        content = fs.readFileSync(filePath, 'utf-8');
      } catch (error) {
        console.error(`Error reading file at ${filePath}:`, error);
        content = null;
      }
    } else {
      // Fall back to the original behavior
      content = getArtifactContent(name);
    }
  }
  
  if (!content) {
    return { title: name, description: '' };
  }
  
  // Default metadata
  let metadata = {
    title: formatTitle(name),
    description: '',
  };
  
  // Try to extract JSDoc-style comments for metadata
  const titleMatch = content.match(/\* @title\s+(.+)$/m);
  if (titleMatch && titleMatch[1]) {
    metadata.title = titleMatch[1].trim();
  }
  
  const descriptionMatch = content.match(/\* @description\s+(.+)$/m);
  if (descriptionMatch && descriptionMatch[1]) {
    metadata.description = descriptionMatch[1].trim();
  }
  
  // If no JSDoc title/description found, try to extract from regular comments
  if (!titleMatch && !descriptionMatch) {
    const commentMatch = content.match(/\/\*\*?([\s\S]*?)\*\//);
    if (commentMatch && commentMatch[1]) {
      const comment = commentMatch[1].trim();
      metadata.description = comment;
    }
  }
  
  return metadata;
}

/**
 * Format a filename into a readable title
 * @param {string} name - The artifact name (filename without extension)
 * @returns {string} A formatted title
 */
function formatTitle(name) {
  return name
    .replace(/[-_]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Convert camelCase to spaces
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

