import React from 'react';
import { Link } from 'react-router-dom';
import DataTable from '../../artifacts/./DataTable';

/**
 * Static page for the Data Table artifact
 */
export default function DataTablePage() {
  return (
    <div className="artifact-container">
      <DataTable />
      
      <div className="back-button-container" style={{ position: 'fixed', bottom: '20px', left: '20px' }}>
        <Link to="/" className="back-button">
          ← Back
        </Link>
      </div>
    </div>
  );
}
