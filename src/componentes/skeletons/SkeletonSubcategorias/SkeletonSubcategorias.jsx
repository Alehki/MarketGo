import React from 'react';
import './SkeletonSubcategorias.css';

export const SkeletonSubcategorias = () => {
  return (
    <div className="skeleton-subcategorias-container">
      <div className="skeleton-subcategorias-scroll">
        <div className="skeleton-pill"></div>
        <div className="skeleton-pill"></div>
        <div className="skeleton-pill"></div>
        <div className="skeleton-pill"></div>
      </div>
    </div>
  );
};