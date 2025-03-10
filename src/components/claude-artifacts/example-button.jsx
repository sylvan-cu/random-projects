import React, { useState } from 'react';

export default function ExampleButton({
  variant = "primary",
  size = "md",
  className = "",
  children,
  onClick,
  disabled = false,
  ...props
}) {
  const [isActive, setIsActive] = useState(false);
  
  // Variant styles mapping
  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
    outline: "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-400",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
  };
  
  // Size styles mapping
  const sizeStyles = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };
  
  // Combine all styles
  const buttonStyles = `
    ${variantStyles[variant] || variantStyles.primary}
    ${sizeStyles[size] || sizeStyles.md}
    rounded-md font-medium transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-opacity-50
    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
    ${isActive ? "transform scale-95" : ""}
    ${className}
  `;
  
  const handleClick = (e) => {
    if (disabled) return;
    
    setIsActive(true);
    setTimeout(() => setIsActive(false), 200);
    
    if (onClick) {
      onClick(e);
    }
  };
  
  return (
    <button
      className={buttonStyles}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

// Example usage:
// <ExampleButton variant="primary" size="md" onClick={() => console.log('Clicked!')}>
//   Click Me
// </ExampleButton>

