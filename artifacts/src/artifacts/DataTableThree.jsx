import React from 'react';

const DataTableThree = () => {
  // Sample data for the table
  const data = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Developer', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Designer', status: 'Active' },
    { id: 3, name: 'Robert Johnson', email: 'robert@example.com', role: 'Manager', status: 'Inactive' },
    { id: 4, name: 'Emily Davis', email: 'emily@example.com', role: 'Developer', status: 'Active' },
    { id: 5, name: 'Michael Brown', email: 'michael@example.com', role: 'Designer', status: 'Inactive' },
  ];

  // Table column headers
  const columns = [
    { id: 'id', label: 'ID' },
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' },
    { id: 'role', label: 'Role' },
    { id: 'status', label: 'Status' },
  ];

  return (
    <div className="p-5 font-sans">
      <h2 className="text-gray-800 mb-5">User Data Table</h2>
      <div className="overflow-hidden rounded shadow">
        <table className="w-full border-collapse">
          <thead className="bg-blue-500 text-white">
            <tr>
              {columns.map((column) => (
                <th key={column.id} className="p-3 text-left font-bold">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={row.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="p-3 border-b border-gray-200">{row.id}</td>
                <td className="p-3 border-b border-gray-200">{row.name}</td>
                <td className="p-3 border-b border-gray-200">{row.email}</td>
                <td className="p-3 border-b border-gray-200">{row.role}</td>
                <td className="p-3 border-b border-gray-200">
                  <span className={`px-2 py-1 rounded-full text-sm text-white ${row.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTableThree;