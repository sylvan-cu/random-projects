import React from 'react';

// Use Vite's import.meta.glob to automatically discover and import all components
// from the claude-artifacts directory
const componentModules = import.meta.glob('./claude-artifacts/*.jsx', { eager: true });

console.log('Found component modules:', Object.keys(componentModules));

// Create a map of component names (without file extension) to their components
const artifactComponents = {};

// Process each discovered module
Object.entries(componentModules).forEach(([path, module]) => {
  // Extract the file name without extension from the path
  // Example: './claude-artifacts/example-button.jsx' -> 'example-button'
  const fileName = path.split('/').pop().replace('.jsx', '');
  console.log(`Processing component: ${path} -> ${fileName}`, module.default ? 'has default export' : 'NO DEFAULT EXPORT');
  
  // Add the component to our map
  artifactComponents[fileName] = module.default;
});

console.log('Registered artifact components:', Object.keys(artifactComponents));


export default artifactComponents;
