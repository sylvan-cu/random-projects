import React from 'react';

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
    <div className="w-full max-w-[700px] mx-auto p-6 shadow-xl rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 transition-all duration-300 hover:shadow-2xl">
      <h2 className="text-center mb-6 font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-2xl">{title}</h2>
      
      <div className="relative h-[280px] mt-6 border-b-2 border-l-2 border-indigo-200 bg-indigo-50/40 rounded-lg overflow-hidden">
        {/* Y-axis label */}
        <div className="absolute -left-10 top-1/2 -rotate-90 text-xs font-medium text-indigo-600">Values</div>
        
        {/* Grid lines */}
        <div className="absolute inset-0 w-full h-full">
          {[0, 25, 50, 75, 100].map((line) => (
            <div 
              key={line} 
              className="absolute w-full border-t border-indigo-100 text-xs text-indigo-400 font-medium"
              style={{ bottom: `${line}%` }}
            >
              <span className="absolute -left-8">{Math.round(maxValue * line / 100)}</span>
            </div>
          ))}
        </div>
        
        {/* X-axis label */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-[-24px] text-xs font-medium text-indigo-600">Months</div>
        
        {/* Chart content with bars */}
        <div className="flex items-end justify-around h-full pt-5 px-4 pb-8">
          {chartData.map((item, index) => (
            <div className="flex flex-col items-center group" key={index}>
              <div 
                className="w-[36px] md:w-[48px] rounded-t-lg relative flex justify-center transition-all duration-500 ease-in-out transform group-hover:scale-105 cursor-pointer overflow-hidden"
                style={{ 
                  height: `${(item.value / maxValue) * 90}%`, // 90% to leave room for labels
                  background: `linear-gradient(to top, hsl(${210 + index * 30}, 80%, 55%), hsl(${210 + index * 30}, 90%, 65%))`
                }}
              >
                <div className="absolute inset-0 bg-white opacity-20 group-hover:opacity-0 transition-opacity duration-300"></div>
                <span className="absolute -top-7 text-sm font-bold text-indigo-700 bg-white/90 px-2 py-1 rounded-full shadow-sm group-hover:bg-indigo-100 transition-all duration-300">
                  {item.value}
                </span>
                <div className="h-full w-full absolute bottom-0 opacity-20 group-hover:opacity-40 transition-opacity duration-300 bg-gradient-to-t from-indigo-900 to-transparent"></div>
              </div>
              <div className="mt-3 text-xs font-semibold text-indigo-700 group-hover:text-indigo-900 transition-colors duration-300">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 text-center text-xs text-gray-500 italic">
        Hover over bars for details
      </div>
    </div>
  );
};

export default BarChart;
