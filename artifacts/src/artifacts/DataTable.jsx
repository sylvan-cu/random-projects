import React from 'react';

const DataTable = () => {
  // Sample data for the table
  const data = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Developer', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Designer', status: 'Active' },
    { id: 3, name: 'Robert Johnson', email: 'robert@example.com', role: 'Manager', status: 'Inactive' },
    { id: 4, name: 'Emily Davis', email: 'emily@example.com', role: 'Developer', status: 'Active' },
    { id: 5, name: 'Michael Brown', email: 'michael@example.com', role: 'Designer', status: 'Inactive' },
  ];
  
  // State for row hover (in a real component, use useState)
  const [hoveredRow, setHoveredRow] = React.useState(null);

  // Table column headers
  const columns = [
    { id: 'id', label: 'ID' },
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' },
    { id: 'role', label: 'Role' },
    { id: 'status', label: 'Status' },
  ];

  return (
    <div className="p-8 font-sans bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen flex flex-col items-center">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-xl overflow-hidden border border-purple-100 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1">
        <div className="px-6 py-5 bg-gradient-to-r from-violet-600 to-indigo-600 flex justify-between items-center">
          <h2 className="text-white text-xl font-bold tracking-wide">User Data Table</h2>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search users..." 
              className="py-2 pl-8 pr-4 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm transition-all"
            />
            <svg className="w-4 h-4 absolute left-2.5 top-3 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <table className="w-full border-collapse">
          <thead className="bg-gradient-to-r from-violet-500 to-indigo-500 text-white">
            <tr>
              {columns.map((column) => (
                <th key={column.id} className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                  <div className="flex items-center space-x-1 cursor-pointer hover:text-indigo-100 transition-colors">
                    <span>{column.label}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row, index) => (
              <tr 
                key={row.id} 
                className={`${
                  index % 2 === 0 ? 'bg-white' : 'bg-indigo-50/50'
                } hover:bg-indigo-100/80 transition-colors duration-150 cursor-pointer`}
                onMouseEnter={() => setHoveredRow(row.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div className="flex items-center">
                    <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gradient-to-br from-violet-400 to-indigo-400 flex items-center justify-center text-white font-bold mr-3">
                      {row.id}
                    </div>
                    <span className="font-semibold">{row.id}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">{row.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600">{row.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 inline-flex text-xs font-semibold rounded-md bg-indigo-100 text-indigo-800">
                    {row.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center transition-all duration-300 ${
                    row.status === 'Active' 
                      ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-sm shadow-green-200' 
                      : 'bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-sm shadow-red-200'
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${row.status === 'Active' ? 'bg-green-100' : 'bg-red-100'} mr-1.5 animate-pulse`}></span>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-600">Showing <span className="font-medium">{data.length}</span> users</div>
          <div className="flex space-x-1">
            <button className="px-3 py-1.5 rounded-md bg-white border border-gray-300 text-gray-600 text-sm hover:bg-gray-50 transition-colors">Previous</button>
            <button className="px-3 py-1.5 rounded-md bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm hover:opacity-90 transition-opacity">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;

