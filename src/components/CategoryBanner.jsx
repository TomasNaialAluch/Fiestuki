import React from 'react';
import getBannerByCategory from '../services/bannerService';

export default function CategoryBanner({ categoryId }) {
  const banner = getBannerByCategory(categoryId);
  if (!banner) return null;
  return (
    <div style={{ background: '#faf4e4', width: '100%' }}>
      <img
        src={banner}
        alt={`Banner ${categoryId}`}
        style={{
          display: 'block',
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          borderRadius: '16px',
          boxShadow: '0 2px 16px 0 rgba(0,0,0,0.04)'
        }}
      />
    </div>
  );
}
