import React from 'react';
import './SkeletonCard.css'; // Asegurate de que importe su CSS

// 🟢 Añadimos { className = '' } a los parámetros
export const SkeletonCard = ({ className = '' }) => {
  return (
    <div className={`skeleton-card ${className}`}>
      <div className="skeleton-card-img"></div>
      <div className="skeleton-card-content">
        <div className="skeleton-line skeleton-price"></div>
        <div className="skeleton-line skeleton-title"></div>
        <div className="skeleton-line skeleton-button"></div>
      </div>
    </div>
  );
};