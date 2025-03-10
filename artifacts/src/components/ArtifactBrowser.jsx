import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAvailableArtifacts } from '../utils/artifactLoader';

/**
 * ArtifactBrowser Component
 * 
 * A component for browsing, searching, and filtering artifacts in a grid layout.
 * Provides an interface to discover and access artifacts with filtering capabilities.
 */
const ArtifactBrowser = () => {
  // State for artifacts data, loading status, and filtering
  const [artifacts, setArtifacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  
  // Load artifacts on component mount
  useEffect(() => {
    const fetchArtifacts = async () => {
      try {
        const data = await getAvailableArtifacts();
        setArtifacts(data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading artifacts:', err);
        setError('Failed to load artifacts. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchArtifacts();
  }, []);
  
  // Extract all unique types and tags from artifacts for filtering
  const allTypes = [...new Set(artifacts.map(artifact => artifact.type))].sort();
  
  const allTags = [...new Set(
    artifacts.flatMap(artifact => artifact.tags || [])
  )].sort();
  
  // Handle tag selection toggle
  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };
  
  // Filter artifacts based on search term, type, and tags
  const filteredArtifacts = artifacts.filter(artifact => {
    // Filter by search term (case insensitive)
    const matchesSearch = searchTerm === '' || 
      artifact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artifact.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (artifact.tags && artifact.tags.some(tag => 
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    
    // Filter by type
    const matchesType = selectedType === '' || artifact.type === selectedType;
    
    // Filter by tags
    const matchesTags = selectedTags.length === 0 || 
      (artifact.tags && selectedTags.every(tag => artifact.tags.includes(tag)));
    
    return matchesSearch && matchesType && matchesTags;
  });
  
  // Handle loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg">Loading artifacts...</div>
      </div>
    );
  }
  
  // Handle error state
  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }
  
  // Render artifact browser UI
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Artifact Browser</h1>
      
      {/* Search and Filter Section */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Search input */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search artifacts
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, description, or tags..."
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Type filter */}
          <div>
            <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by type
            </label>
            <select
              id="type-filter"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All types</option>
              {allTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Tags filter */}
        {allTags.length > 0 && (
          <div>
            <p className="block text-sm font-medium text-gray-700 mb-2">
              Filter by tags
            </p>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 text-sm rounded-full ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Active filters summary */}
        {(selectedType || selectedTags.length > 0 || searchTerm) && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex items-center text-sm">
              <span className="mr-2 font-medium">Active filters:</span>
              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    Search: {searchTerm}
                  </span>
                )}
                {selectedType && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                    Type: {selectedType}
                  </span>
                )}
                {selectedTags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                    Tag: {tag}
                  </span>
                ))}
              </div>
              {(selectedType || selectedTags.length > 0 || searchTerm) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedType('');
                    setSelectedTags([]);
                  }}
                  className="ml-auto text-xs text-red-600 hover:text-red-800"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Results Count */}
      <p className="mb-4 text-gray-600">
        Showing {filteredArtifacts.length} of {artifacts.length} artifacts
      </p>
      
      {/* No results message */}
      {filteredArtifacts.length === 0 && (
        <div className="p-8 text-center bg-gray-50 rounded-lg border">
          <p className="text-gray-500">No artifacts match your current filters.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedType('');
              setSelectedTags([]);
            }}
            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Clear Filters
          </button>
        </div>
      )}
      
      {/* Artifacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArtifacts.map(artifact => (
          <Link 
            to={`/artifact/${artifact.id}`} 
            key={artifact.id}
            className="block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="bg-gray-100 px-4 py-3 border-b">
              <h3 className="font-semibold truncate">{artifact.name}</h3>
              <div className="flex items-center justify-between">
                <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  {artifact.type}
                </span>
                <span className="text-xs text-gray-500">
                  Updated: {artifact.updatedAt.toLocaleDateString()}
                </span>
              </div>
            </div>
            
            <div className="p-4 bg-white">
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {artifact.description}
              </p>
              
              {/* Tags */}
              {artifact.tags && artifact.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {artifact.tags.map(tag => (
                    <span 
                      key={`${artifact.id}-${tag}`}
                      className="inline-block px-2 py-1 text-xs bg-gray-200 text-gray-800 rounded-full"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleTag(tag);
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ArtifactBrowser;

