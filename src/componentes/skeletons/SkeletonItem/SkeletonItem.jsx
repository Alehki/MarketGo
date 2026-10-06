import React from 'react';
import './SkeletonItem.css';

export const SkeletonItem = () => {
  return (
    <div className="skeleton-item">
      <div className="skeleton-icon"></div>
      <div className="skeleton-text"></div>
    </div>
  );
};