import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'outline';
  onClick?: () => void;
  href?: string;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  type = 'button',
  variant = 'primary',
  onClick,
  href,
  className = ''
}) => {
  const baseStyles = "px-6 py-2 rounded-md font-medium transition-all duration-200 transform hover:scale-105";
  const variantStyles = variant === 'primary' 
    ? "bg-accent-500 text-white hover:bg-accent-600 shadow-md hover:shadow-lg"
    : "border-2 border-accent-500 text-accent-500 hover:bg-accent-50";

  const buttonClasses = `${baseStyles} ${variantStyles} ${className}`;

  if (href) {
    return (
      <a href={href} className={buttonClasses}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={buttonClasses}
    >
      {children}
    </button>
  );
};

export default Button