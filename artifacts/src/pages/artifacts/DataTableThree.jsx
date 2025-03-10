import React from 'react';
import { Link } from 'react-router-dom';
import DataTableThree from '../../artifacts/./DataTableThree';

/**
 * Static page for the Data Table Three artifact
 */
export default function DataTableThreePage() {
  return (
    <div className="artifact-container">
      <DataTableThree />
      
      <div className="back-button-container" style={{ position: 'fixed', bottom: '20px', left: '20px' }}>
        <Link to="/" className="back-button">
          ← Back
        </Link>
      </div>
    </div>
  );
}
