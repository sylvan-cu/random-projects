import React from 'react';
import './BarChart.css';

const BarChart = ({ title = "Sample Bar Chart", data = null }) => {
  // Default data if none is provided
  const chartData = data || [
    { label: 'Jan', value: 45 },
    { label: 'Feb', value: 72 },
    { label: 'Mar', value: 38 },
    { label: 'Apr', value: 94 },
    { label: 'May', value: 65 },
    { label: 'Jun', value: 58 }
  ];

  // Find the maximum value for scaling
  const maxValue = Math.max(...chartData.map(item => item.value));

  return (
    <div className="bar-chart-container">
      <h2 className="chart-title">{title}</h2>
      
      <div className="chart-area">
        {chartData.map((item, index) => (
          <div className="bar-container" key={index}>
            <div 
              className="bar" 
              style={{ 
                height: `${(item.value / maxValue) * 100}%`,
                backgroundColor: `hsl(${index * 40}, 70%, 60%)`
              }}
            >
              <span className="bar-value">{item.value}</span>
            </div>
            <div className="bar-label">{item.label}</div>
          </div>
        ))}
      </div>
      
      <style jsx>{`
        .bar-chart-container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          background-color: white;
        }
        
        .chart-title {
          text-align: center;
          margin-bottom: 20px;
          color: #333;
          font-size: 1.5rem;
        }
        
        .chart-area {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          height: 250px;
          margin-top: 20px;
          border-bottom: 2px solid #ddd;
          border-left: 2px solid #ddd;
          padding: 0 10px 20px 10px;
        }
        
        .bar-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          margin: 0 5px;
        }
        
        .bar {
          width: 100%;
          max-width: 40px;
          border-radius: 4px 4px 0 0;
          transition: height 0.5s ease;
          position: relative;
          display: flex;
          justify-content: center;
        }
        
        .bar-value {
          position: absolute;
          top: -25px;
          font-size: 0.8rem;
          font-weight: bold;
        }
        
        .bar-label {
          margin-top: 8px;
          font-size: 0.8rem;
          color: #555;
        }
      `}</style>
    </div>
  );
};

export default BarChart;

