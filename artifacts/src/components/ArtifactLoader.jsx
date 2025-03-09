import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAvailableArtifacts } from '../utils/artifactLoader';
const ArtifactLoader = () => {
  // State for storing artifacts loaded from the utility
  const [artifacts, setArtifacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Load artifacts when component mounts
  useEffect(() => {
    setLoading(true);
    getAvailableArtifacts()
      .then(result => {
        setArtifacts(result);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load artifacts:', err);
        setError('Failed to load artifacts. Please try again later.');
        setLoading(false);
      });
  }, []);
  
  const [showInstructions, setShowInstructions] = useState(false);
  
  // Toggle the create new artifact instructions
  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Claude Artifact Library</h1>
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Available Artifacts</h2>
          <button
            onClick={toggleInstructions}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Create New Artifact
          </button>
        </div>
        
        {showInstructions && (
          <div className="mt-4 p-4 bg-white rounded-lg border border-green-200">
            <h3 className="text-lg font-medium mb-2">Creating New Artifacts</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Generate a React component with Claude AI</li>
              <li>Save the component as a .jsx file in the <code className="bg-gray-100 px-1 rounded">src/artifacts</code> directory</li>
              <li>Make sure your component has a default export</li>
              <li>Refresh this page to see your artifact in the list</li>
            </ol>
            <div className="mt-4 p-3 bg-gray-100 rounded text-xs font-mono">
              <p>// Example artifact file structure:</p>
              <p>import React from 'react';</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Artifact Index</h2>
        
        {loading && (
          <p className="text-gray-500">Loading artifacts...</p>
        )}
        
        {error && (
          <p className="text-red-500">{error}</p>
        )}
        
        {!loading && !error && artifacts.length === 0 ? (
          <p className="text-gray-500 italic">No artifacts found. Create your first artifact!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!loading && artifacts.map((artifact) => (
              <div key={artifact.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="bg-gray-200 p-3">
                  <h3 className="font-medium">{artifact.name}</h3>
                  <span className="text-xs text-gray-600 ml-2">{artifact.type}</span>
                </div>
                <div className="p-4 bg-white">
                  <p className="text-gray-600 mb-3">{artifact.description}</p>
                  <p className="text-xs text-gray-500 mb-4">
                    Created: {artifact.createdAt.toLocaleDateString()}
                    {artifact.tags && artifact.tags.length > 0 && (
                      <span className="ml-2">
                        Tags: {artifact.tags.join(', ')}
                      </span>
                    )}
                  </p>
                  <Link 
                    to={`/artifact/${artifact.id}`}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 inline-block"
                  >
                    View Artifact
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">How It Works</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Claude AI helps you generate visualization artifacts</li>
          <li>Save the artifact files to your file system</li>
          <li>Browse your artifacts in this index</li>
          <li>Click on any artifact to view it in action</li>
        </ol>
      </div>
    </div>
  );
};

export default ArtifactLoader;