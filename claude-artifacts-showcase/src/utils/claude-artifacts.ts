import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Define interfaces for artifact metadata
export interface ArtifactMetadata {
  name: string;
  fileName: string;
  filePath: string;
  description?: string;
  lastModified: Date;
}

// Path to the claude artifacts directory
const ARTIFACTS_DIR = 'src/components/claude-artifacts';

/**
 * Get all Claude artifacts from the components directory
 * @returns Array of artifact metadata
 */
export async function getAllArtifacts(): Promise<ArtifactMetadata[]> {
  try {
    const artifactsDir = path.resolve(ARTIFACTS_DIR);
    const artifactFiles = fs.readdirSync(artifactsDir)
      .filter(file => {
        // Filter for JSX or TSX files
        return file.endsWith('.jsx') || file.endsWith('.tsx');
      });

    const artifacts: ArtifactMetadata[] = artifactFiles.map(fileName => {
      const filePath = path.join(artifactsDir, fileName);
      const stats = fs.statSync(filePath);
      
      // Create a name from the filename (remove extension and convert to title case)
      const name = fileName
        .replace(/\.(jsx|tsx)$/, '')
        .split(/[-_]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      return {
        name,
        fileName,
        filePath,
        lastModified: stats.mtime,
        // Description will be extracted from component if available
        description: extractDescriptionFromComponent(filePath)
      };
    });

    // Sort artifacts by last modified date (newest first)
    return artifacts.sort((a, b) => 
      b.lastModified.getTime() - a.lastModified.getTime()
    );
  } catch (error) {
    console.error('Error loading artifacts:', error);
    return [];
  }
}

/**
 * Extract description from component file if available
 * This looks for a comment or constant that might contain description metadata
 */
function extractDescriptionFromComponent(filePath: string): string | undefined {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Try to find a description in JSDoc or other comment formats
    const descriptionMatch = content.match(/\/\*\*[\s\S]*?description:?\s*(['"])(.*?)\1/i) || 
                            content.match(/\/\/\s*description:?\s*(['"])(.*?)\1/i) ||
                            content.match(/description:?\s*(['"])(.*?)\1/i);
    
    if (descriptionMatch && descriptionMatch[2]) {
      return descriptionMatch[2].trim();
    }
    
    return undefined;
  } catch (error) {
    console.error(`Error extracting description from ${filePath}:`, error);
    return undefined;
  }
}

/**
 * Get an artifact by its filename
 * @param fileName The filename of the artifact
 * @returns The artifact metadata or undefined if not found
 */
export async function getArtifactByFileName(fileName: string): Promise<ArtifactMetadata | undefined> {
  const artifacts = await getAllArtifacts();
  return artifacts.find(artifact => artifact.fileName === fileName);
}

/**
 * Get an artifact's import path for dynamic importing
 * @param fileName The filename of the artifact
 * @returns The import path for the artifact
 */
export function getArtifactImportPath(fileName: string): string {
  return `../components/claude-artifacts/${fileName}`;
}

/**
 * Check if the artifacts directory exists and create it if it doesn't
 */
export function ensureArtifactsDirectoryExists(): void {
  const artifactsDir = path.resolve(ARTIFACTS_DIR);
  if (!fs.existsSync(artifactsDir)) {
    fs.mkdirSync(artifactsDir, { recursive: true });
    console.log(`Created artifacts directory at ${artifactsDir}`);
  }
}

/**
 * Get the paths for generating static pages for all artifacts
 * This is useful for Astro's getStaticPaths function
 */
export async function getArtifactPaths() {
  const artifacts = await getAllArtifacts();
  
  return artifacts.map(artifact => ({
    params: { 
      artifact: artifact.fileName.replace(/\.(jsx|tsx)$/, '') 
    },
    props: { artifact }
  }));
}

