import React from 'react';

const InfoCard = ({ children, title, variant = 'default' }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'stateLaw':
        return 'border-l-4 border-primary';
      case 'script':
        return 'border-l-4 border-accent';
      default:
        return '';
    }
  };

  return (
    <div className={`card ${getVariantStyles()}`}>
      {title && (
        <h3 className="text-lg font-semibold text-text mb-4">{title}</h3>
      )}
      {children}
    </div>
  );
};

export default InfoCard;