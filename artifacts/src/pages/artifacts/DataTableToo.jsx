import React from 'react';
import { Link } from 'react-router-dom';
import DataTableToo from '../../artifacts/./DataTableToo';

/**
 * Static page for the Data Table Too artifact
 */
export default function DataTableTooPage() {
  return (
    <div className="artifact-container">
      <DataTableToo />
      
      <div className="back-button-container" style={{ position: 'fixed', bottom: '20px', left: '20px' }}>
        <Link to="/" className="back-button">
          ← Back
        </Link>
      </div>
    </div>
  );
}
