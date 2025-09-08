import { useState, useCallback } from 'react';

export const useProductZoom = () => {
  const [isZoomed, setIsZoomed] = useState(false);

  const toggleZoom = useCallback(() => {
    setIsZoomed(prev => !prev);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isZoomed) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    e.currentTarget.style.setProperty('--zoom-x', `${x}%`);
    e.currentTarget.style.setProperty('--zoom-y', `${y}%`);
  }, [isZoomed]);

  return {
    isZoomed,
    toggleZoom,
    handleMouseMove,
    setIsZoomed
  };
};