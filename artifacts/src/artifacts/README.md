# Artifact System Documentation

## Overview

The artifact system provides a way to create, manage, and display reusable React components generated with Claude AI. Instead of copy-pasting component code directly into the application, artifacts are stored as individual files in the file system, allowing for better organization, reusability, and maintainability.

## How the Artifact System Works

1. **File-Based Storage**: Each artifact is stored as a separate React component file (`.jsx`) in the `src/artifacts` directory.

2. **Automatic Indexing**: The application automatically scans the artifacts directory to build an index of available artifacts using metadata extracted from each file.

3. **Dynamic Loading**: Artifacts are dynamically loaded and rendered when requested, allowing them to be viewed individually or used within other components.

4. **Navigation System**: The application provides a user interface to browse the artifact index and navigate to individual artifact pages.

## How to Create New Artifacts

### Creating a New Artifact

1. Generate your component with Claude AI or write it manually.
2. Save the component as a `.jsx` file in the `src/artifacts` directory.
3. Follow the expected format (detailed below) to ensure proper indexing and rendering.
4. Your artifact will automatically appear in the artifacts index.

### Basic Template

```jsx
import React from 'react';

// Metadata block (required for proper indexing)
/**
 * @artifactName Your Artifact Name
 * @description A brief description of what this artifact does
 * @author Your Name
 * @dateCreated 2023-11-01
 * @version 1.0
 */

const YourArtifactComponent = () => {
  return (
    <div>
      {/* Your component content here */}
      <h2>Your Artifact Content</h2>
      <p>This is a sample artifact component.</p>
    </div>
  );
};

export default YourArtifactComponent;
```

## Expected Format and Structure

### File Location

All artifacts must be placed in the `src/artifacts` directory.

### File Naming

- Use descriptive names in PascalCase (e.g., `BarChart.jsx`, `DataTable.jsx`)
- Names should reflect the component's purpose
- Use `.jsx` extension for all artifact files

### Required Metadata

Each artifact file must include a metadata comment block at the top of the file with the following information:

```jsx
/**
 * @artifactName Your Artifact Name
 * @description A brief description of what this artifact does
 * @author Your Name
 * @dateCreated YYYY-MM-DD
 * @version 1.0
 */
```

### Component Structure

1. **Single Default Export**: Each artifact file must export a single React component as the default export.
2. **Self-Contained**: Artifacts should ideally be self-contained with all necessary styles and logic.
3. **Props Support**: Design artifacts to accept props for customization when appropriate.

## How to View and Interact with Artifacts

### Browsing the Artifact Index

1. Navigate to the home page of the application (`/`).
2. Browse the list of available artifacts with their names, descriptions, and creation dates.
3. Click on any artifact to view it in detail.

### Viewing Individual Artifacts

1. Click on an artifact in the index to navigate to its dedicated page (`/artifact/:id`).
2. The artifact will be rendered with its full functionality.
3. The page displays the artifact's metadata and the rendered component.

### Using Artifacts in Other Components

Artifacts can be imported and used in other components:

```jsx
import SomeArtifact from '../artifacts/SomeArtifact';

const YourComponent = () => {
  return (
    <div>
      <h1>My Component</h1>
      <SomeArtifact prop1="value1" prop2="value2" />
    </div>
  );
};
```

## Examples

### Example 1: Simple Bar Chart

```jsx
import React from 'react';

/**
 * @artifactName Simple Bar Chart
 * @description A responsive bar chart component with customizable data
 * @author Claude AI
 * @dateCreated 2023-11-01
 * @version 1.0
 */

const BarChart = ({ data = [40, 60, 25, 75, 90] }) => {
  return (
    <div>
      <h2>Bar Chart</h2>
      <div style={{ display: 'flex', alignItems: 'flex-end', height: '200px', gap: '10px' }}>
        {data.map((value, index) => (
          <div
            key={index}
            style={{
              width: '40px',
              height: `${value}%`,
              backgroundColor: '#0088ff',
              borderRadius: '4px 4px 0 0',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default BarChart;
```

### Example 2: Data Table

```jsx
import React from 'react';

/**
 * @artifactName Data Table
 * @description A customizable data table with sortable columns
 * @author Claude AI
 * @dateCreated 2023-11-02
 * @version 1.0
 */

const DataTable = ({ 
  headers = ['Name', 'Age', 'Location'],
  rows = [
    ['John Doe', 32, 'New York'],
    ['Jane Smith', 28, 'San Francisco'],
    ['Bob Johnson', 45, 'Chicago']
  ]
}) => {
  return (
    <div>
      <h2>Data Table</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th 
                key={index}
                style={{ 
                  backgroundColor: '#f2f2f2', 
                  padding: '8px', 
                  textAlign: 'left',
                  borderBottom: '2px solid #ddd'
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr 
              key={rowIndex}
              style={{
                backgroundColor: rowIndex % 2 === 0 ? 'white' : '#f9f9f9'
              }}
            >
              {row.map((cell, cellIndex) => (
                <td 
                  key={cellIndex}
                  style={{ 
                    padding: '8px',
                    borderBottom: '1px solid #ddd'
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
```

## Best Practices

1. **Descriptive Names**: Use clear, descriptive names for your artifacts that indicate their purpose.

2. **Complete Metadata**: Always include comprehensive metadata to make your artifacts discoverable and maintainable.

3. **Props for Customization**: Design artifacts to be customizable through props with sensible defaults.

4. **Responsive Design**: Ensure your artifacts work well on different screen sizes.

5. **Semantic Markup**: Use appropriate HTML elements and follow accessibility best practices.

6. **Self-Contained Styling**: Use inline styles or styled-jsx to keep styling contained within the component.

7. **Documentation**: Include comments explaining complex logic or usage instructions.

8. **Error Handling**: Implement proper error handling for data-dependent artifacts.

9. **Version Control**: Update the version number in metadata when making significant changes.

10. **Performance Considerations**: Keep artifacts lightweight and optimized for performance.

