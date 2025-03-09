import React, { useState, useEffect } from 'react';

const DynamicComponentRenderer = ({ componentCode }) => {
  const [Component, setComponent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!componentCode) return;

    const renderComponent = async () => {
      try {
        // This is a simplified version and won't work as-is in a browser
        // In a real application, you'd need to use a build system or eval with caution
        
        // For demonstration purposes only:
        const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
        
        // Create a function that returns the component
        const createComponent = new AsyncFunction(
          'React', 
          'require', 
          `
          ${componentCode}
          return (() => {
            const exportedComponent = (typeof exports !== 'undefined' ? exports.default : null);
            return exportedComponent || Component || MyComponent || Chart || App;
          })();
          `
        );
        
        // Mock require function for common libraries
        const mockRequire = (name) => {
          const libs = {
            'react': React,
            'recharts': () => console.warn('Recharts would be imported here'),
            'lodash': () => console.warn('Lodash would be imported here'),
            'papaparse': () => console.warn('PapaParse would be imported here'),
            // Add other libraries as needed
          };
          
          return libs[name] || (() => ({}));
        };
        
        // Create the component
        const componentFn = await createComponent(React, mockRequire);
        setComponent(() => componentFn);
        setError(null);
      } catch (err) {
        console.error('Error rendering component:', err);
        setError(`Failed to render component: ${err.message}`);
        setComponent(null);
      }
    };

    renderComponent();
  }, [componentCode]);

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        <p className="font-bold">Error:</p>
        <p>{error}</p>
        <p className="mt-2 text-sm">
          Note: Dynamic component rendering has security implications and limitations in browsers.
          For production use, consider a server-side approach or a build process.
        </p>
      </div>
    );
  }

  if (!Component) {
    return <div className="p-4 text-gray-500">Loading component...</div>;
  }

  try {
    return (
      <div className="component-container">
        <Component />
      </div>
    );
  } catch (renderError) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        <p className="font-bold">Render Error:</p>
        <p>{renderError.message}</p>
      </div>
    );
  }
};

export default DynamicComponentRenderer;