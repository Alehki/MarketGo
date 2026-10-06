import React from 'react';
import './SkeletonCategoriaCard.css'; // Asegurate de importar su CSS

export const SkeletonCategoriaCard = () => {
  return (
    <div className="card-categoria-home skeleton-categoria">
      <div className="card-categoria-img">
        <div className="skeleton-img-box skeleton-shimmer"></div>
      </div>
      <div className="card-categoria-info">
        <div className="skeleton-text-line skeleton-shimmer"></div>
        <div className="skeleton-arrow-circle skeleton-shimmer"></div>
      </div>
    </div>
  );
};