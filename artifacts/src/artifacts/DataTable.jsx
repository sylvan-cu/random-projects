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

  // Table column headers
  const columns = [
    { id: 'id', label: 'ID' },
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' },
    { id: 'role', label: 'Role' },
    { id: 'status', label: 'Status' },
  ];

  // Styles for the table elements
  const styles = {
    container: {
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      borderRadius: '5px',
      overflow: 'hidden',
    },
    tableHeader: {
      backgroundColor: '#4a90e2',
      color: 'white',
    },
    headerCell: {
      padding: '12px 15px',
      textAlign: 'left',
      fontWeight: 'bold',
    },
    tableRow: (index) => ({
      backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white',
    }),
    tableCell: {
      padding: '12px 15px',
      borderBottom: '1px solid #ddd',
    },
    statusBadge: (status) => ({
      padding: '5px 10px',
      borderRadius: '15px',
      display: 'inline-block',
      backgroundColor: status === 'Active' ? '#4caf50' : '#f44336',
      color: 'white',
      fontSize: '14px',
    }),
    title: {
      color: '#333',
      marginBottom: '20px',
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>User Data Table</h2>
      <table style={styles.table}>
        <thead style={styles.tableHeader}>
          <tr>
            {columns.map((column) => (
              <th key={column.id} style={styles.headerCell}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={row.id} style={styles.tableRow(index)}>
              <td style={styles.tableCell}>{row.id}</td>
              <td style={styles.tableCell}>{row.name}</td>
              <td style={styles.tableCell}>{row.email}</td>
              <td style={styles.tableCell}>{row.role}</td>
              <td style={styles.tableCell}>
                <span style={styles.statusBadge(row.status)}>
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;

