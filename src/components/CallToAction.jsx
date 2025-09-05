import React from 'react';

const CallToAction = ({ children, variant = 'default', onClick, className = '', disabled = false }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'record':
        return 'btn-primary';
      case 'shareAlert':
        return 'btn-accent';
      default:
        return 'btn-outline';
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${getVariantStyles()} ${className} flex items-center justify-center transition-all duration-200 ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {children}
    </button>
  );
};

export default CallToAction;