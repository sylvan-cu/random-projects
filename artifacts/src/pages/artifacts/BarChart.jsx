import React from 'react';
import { Link } from 'react-router-dom';
import BarChart from '../../artifacts/./BarChart';

/**
 * Static page for the Bar Chart artifact
 */
export default function BarChartPage() {
  return (
    <div className="artifact-container">
      <BarChart />
      
      <div className="back-button-container" style={{ position: 'fixed', bottom: '20px', left: '20px' }}>
        <Link to="/" className="back-button">
          ← Back
        </Link>
      </div>
    </div>
  );
}
