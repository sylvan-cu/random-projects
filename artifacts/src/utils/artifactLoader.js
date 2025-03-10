/**
 * Artifact Loader Utility
 * 
 * This utility provides functions to discover and load artifacts from the file system.
 * In a browser environment, we can't directly scan the file system, so this implementation
 * provides a simulation of that functionality with hardcoded examples.
 * 
 * In a full implementation with a backend:
 * 1. The backend would scan the artifacts directory on the server
 * 2. It would expose an API endpoint that returns metadata about available artifacts
 * 3. The frontend would call this API to get the list of artifacts
 * 4. The actual artifact components would be dynamically imported when needed
 */

import { lazy } from 'react';
import artifactsIndex from '../artifactsIndex.json';

/**
 * Process artifacts from the index
 * - Convert date strings to Date objects
 * - Ensure consistent data structure
 */
const processedArtifacts = artifactsIndex.artifacts.map(artifact => ({
  ...artifact,
  createdAt: new Date(artifact.createdAt),
  updatedAt: new Date(artifact.updatedAt || artifact.createdAt)
}));

/**
 * Get all available artifacts
 * 
 * @returns {ArtifactInfo[]} Array of artifact metadata
 * 
 * In a real implementation with a backend:
 * - This would make an API call to the backend to get the list of artifacts
 * - The backend would scan the artifacts directory and return metadata
 * - Metadata could be extracted from file comments, separate metadata files, or DB
 */
export function getAvailableArtifacts() {
  // In production, this would fetch from an API
  // return fetch('/api/artifacts').then(res => res.json());
  
  return Promise.resolve(processedArtifacts);
}

/**
 * Get a specific artifact by ID
 * 
 * @param {string} id - The artifact ID to retrieve
 * @returns {ArtifactInfo|null} The artifact metadata or null if not found
 */
export function getArtifactById(id) {
  // In production, this would fetch a specific artifact
  // return fetch(`/api/artifacts/${id}`).then(res => res.json());
  
  const artifact = processedArtifacts.find(a => a.id === id);
  return Promise.resolve(artifact || null);
}

/**
 * Dynamically load an artifact component
 * 
 * @param {string} id - The artifact ID to load
 * @returns {Promise<React.ComponentType>} A promise that resolves to the component
 * 
 * In a real implementation:
 * - This would dynamically import the component file
 * - The backend could serve the component file or it could be stored in the frontend
 * - Code splitting would be used for optimization
 */
export function loadArtifactComponent(id) {
  // Find the artifact in our processed list
  const artifact = processedArtifacts.find(a => a.id === id);
  
  if (!artifact) {
    console.error(`Artifact with ID "${id}" not found`);
    return Promise.resolve(null);
  }
  
  try {
    // For Vite compatibility, handle known artifacts explicitly
    // and fall back to dynamic import with @vite-ignore for others
    switch (id.toLowerCase()) {
      case 'barchart':
        return Promise.resolve(lazy(() => import('../artifacts/BarChart.jsx')));
      case 'datatable':
        return Promise.resolve(lazy(() => import('../artifacts/DataTable.jsx')));
      default:
        // Extract the component name and path from the artifact data
        const componentPath = artifact.path;
        
        // Normalize the path for import
        // Remove file extension if present
        const normalizedPath = componentPath.replace(/\.(jsx|tsx|js)$/, '');
        
        // Add @vite-ignore comment to suppress Vite warnings about dynamic imports
        return Promise.resolve(lazy(() => import(/* @vite-ignore */ `../artifacts/${normalizedPath}`)));
    }
  } catch (error) {
    console.error(`Error loading artifact component "${id}":`, error);
    return Promise.resolve(null);
  }
}

/**
 * Create a new artifact
 * 
 * @param {Object} artifactData - The data for the new artifact
 * @returns {Promise<ArtifactInfo>} A promise that resolves to the created artifact
 * 
 * In a real implementation with a backend:
 * - This would make a POST request to create a new artifact
 * - The backend would save the file to the artifacts directory
 * - It would return the metadata for the new artifact
 */
export function createArtifact(artifactData) {
  // In production, this would be an API call
  // return fetch('/api/artifacts', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(artifactData)
  // }).then(res => res.json());
  
  console.log('Creating artifact:', artifactData);
  return Promise.resolve({
    ...artifactData,
    id: `artifact-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date()
  });
}


/**
 * How this would work with a real backend:
 * 
 * 1. Directory Structure:
 *    /artifacts/
 *      /bar-chart/
 *        index.jsx - The component code
 *        metadata.json - Component metadata
 *        preview.png - Preview image
 *      /data-table/
 *        index.jsx
 *        metadata.json
 *        preview.png
 * 
 * 2. Backend API:
 *    - GET /api/artifacts - Returns list of all artifacts with metadata
 *    - GET /api/artifacts/:id - Returns specific artifact metadata
 *    - POST /api/artifacts - Creates a new artifact
 *    - PUT /api/artifacts/:id - Updates an existing artifact
 *    - DELETE /api/artifacts/:id - Removes an artifact
 * 
 * 3. Scanning Process:
 *    - Backend would recursively scan the artifacts directory
 *    - For each subdirectory, it would read the metadata.json file
 *    - If no metadata file exists, it could extract metadata from comments
 *    - It would compile an index of all artifacts with their metadata
 * 
 * 4. Loading Process:
 *    - Frontend requests artifact list from backend
 *    - User clicks on an artifact
 *    - Frontend dynamically imports the artifact component
 *    - Component is rendered with appropriate props
 */

