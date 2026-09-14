import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'outline';
  onClick?: () => void;
  href?: string;
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  type = 'button',
  variant = 'primary',
  onClick,
  href,
  className = '',
  disabled = false
}) => {
  const baseStyles = "interactive-button neon-glow inline-flex items-center justify-center px-8 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-300 disabled:opacity-50 disabled:cursor-not-allowed";
  const variantStyles = variant === 'primary'
    ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-green-500/25 hover:shadow-green-500/40"
    : "bg-white border-2 border-green-500 text-green-600 hover:bg-green-50 hover:border-green-600 shadow-green-500/10 hover:shadow-green-500/20";

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
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button