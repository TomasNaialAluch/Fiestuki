// filepath: c:\Users\Naial\Downloads\Fiestuki+Aluch\src\hooks\useImageGallery.js
import { useState, useCallback, useMemo } from 'react';

export const useImageGallery = (item) => {
  const [selectedImage, setSelectedImage] = useState(0);

  const allImages = useMemo(() => {
    if (!item) return [];
    return [item.mainImage, ...(item.images || [])].filter(Boolean);
  }, [item]);

  const handlePrevImage = useCallback(() => {
    setSelectedImage(prev => prev === 0 ? allImages.length - 1 : prev - 1);
  }, [allImages.length]);

  const handleNextImage = useCallback(() => {
    setSelectedImage(prev => prev === allImages.length - 1 ? 0 : prev + 1);
  }, [allImages.length]);

  const selectImage = useCallback((index) => {
    setSelectedImage(index);
  }, []);

  return {
    selectedImage,
    allImages,
    handlePrevImage,
    handleNextImage,
    selectImage
  };
};