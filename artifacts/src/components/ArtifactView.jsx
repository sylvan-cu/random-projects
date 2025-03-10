import React, { useState, useEffect, Suspense } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getArtifactById, loadArtifactComponent } from '../utils/artifactLoader';

/**
 * ArtifactView Component
 * 
 * Displays a detailed view of a single artifact with metadata and renders
 * the dynamically loaded artifact component based on the artifact's path.
 */
const ArtifactView = () => {
  // Get the artifact ID from URL parameters
  const { id } = useParams();
  const navigate = useNavigate();
  
  // States for data, loading, and error handling
  const [artifact, setArtifact] = useState(null);
  const [ArtifactComponent, setArtifactComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Load artifact data and component when ID changes
  useEffect(() => {
    // Reset states when ID changes
    setLoading(true);
    setError(null);
    setArtifact(null);
    setArtifactComponent(null);
    
    const loadArtifact = async () => {
      try {
        // Get artifact metadata using the ID
        const artifactData = await getArtifactById(id);
        
        if (!artifactData) {
          setError(`Artifact with ID "${id}" not found`);
          setLoading(false);
          return;
        }
        
        setArtifact(artifactData);
        
        // Load the artifact component based on its path from the index
        const component = await loadArtifactComponent(id);
        setArtifactComponent(component);
        setLoading(false);
      } catch (err) {
        console.error('Error loading artifact:', err);
        setError(`Failed to load artifact: ${err.message}`);
        setLoading(false);
      }
    };
    
    loadArtifact();
  }, [id]);
  
  // Handle loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg">Loading artifact...</div>
      </div>
    );
  }
  
  // Handle error state
  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button 
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Artifacts List
        </button>
      </div>
    );
  }
  
  // Handle case where artifact is not found
  if (!artifact) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-4">
          Artifact not found
        </div>
        <Link 
          to="/"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Artifacts List
        </Link>
      </div>
    );
  }
  
  // Render the artifact view with metadata and component
  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Artifact Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{artifact.name}</h1>
        <p className="text-gray-600 mb-4">{artifact.description}</p>
        
        {/* Metadata section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
          <div>
            <span className="font-medium text-gray-600">Type: </span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
              {artifact.type}
            </span>
          </div>
          
          <div>
            <span className="font-medium text-gray-600">ID: </span>
            <code className="px-2 py-1 bg-gray-100 rounded">{artifact.id}</code>
          </div>
          
          <div>
            <span className="font-medium text-gray-600">Created: </span>
            <span>{artifact.createdAt.toLocaleDateString()}</span>
          </div>
          
          <div>
            <span className="font-medium text-gray-600">Updated: </span>
            <span>{artifact.updatedAt.toLocaleDateString()}</span>
          </div>
        </div>
        
        {/* Tags */}
        {artifact.tags && artifact.tags.length > 0 && (
          <div className="mb-4">
            <span className="font-medium text-gray-600 mr-2">Tags:</span>
            {artifact.tags.map(tag => (
              <span 
                key={tag} 
                className="inline-block px-2 py-1 mr-2 mb-2 bg-gray-200 text-gray-800 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      
      {/* Component Display */}
      <div className="mb-6 border rounded-lg overflow-hidden">
        <div className="bg-gray-100 px-4 py-3 border-b">
          <h2 className="font-semibold">{artifact.name} Preview</h2>
        </div>
        
        <div className="p-6 bg-white">
          {ArtifactComponent ? (
            <Suspense fallback={<div className="p-4 text-center">Loading component...</div>}>
              <div className="artifact-preview">
                <ArtifactComponent />
              </div>
            </Suspense>
          ) : (
            <div className="p-8 text-center bg-gray-50 rounded">
              <p className="text-gray-500">Component preview not available</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Technical Information */}
      <div className="mb-6 border rounded-lg overflow-hidden">
        <div className="bg-gray-100 px-4 py-3 border-b">
          <h2 className="font-semibold">Technical Information</h2>
        </div>
        
        <div className="p-4 bg-white">
          <div className="mb-2">
            <span className="font-medium text-gray-600">Path: </span>
            <code className="px-2 py-1 bg-gray-100 rounded">{artifact.path}</code>
          </div>
          
          <p className="text-sm text-gray-600 mt-2">
            This component is loaded from the artifacts directory based on its index entry.
          </p>
        </div>
      </div>
      
      {/* Navigation */}
      <div className="flex gap-3">
        <Link 
          to="/"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Artifacts List
        </Link>
      </div>
    </div>
  );
};

export default ArtifactView;

