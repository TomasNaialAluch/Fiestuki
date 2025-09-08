import { useState } from 'react';
import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';
import ShippingInfo from './ShippingInfo';
import PaymentMethods from './PaymentMethods';

export default function ItemDetail({ item }) {
  const allImages = item.images && item.images.length > 0
    ? item.images
    : item.mainImage
      ? [item.mainImage]
      : [];
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = (qty) => {
    alert(`Agregaste ${qty} unidades al carrito`);
  };

  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="max-w-[1400px] mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 gap-16 bg-[#FAF4E4] rounded-2xl p-12 shadow-lg items-start">
      {/* Galería de imágenes */}
      <div className="flex flex-col items-center justify-center">
        <ProductGallery
          allImages={allImages}
          selectedImage={selectedImage}
          onPrevImage={handlePrevImage}
          onNextImage={handleNextImage}
          onSelectImage={setSelectedImage}
          itemName={item.name || item.nombre}
        />
      </div>

      {/* Info del producto */}
      <div className="flex flex-col gap-10 justify-center">
        <ProductInfo
          item={item}
          quantity={quantity}
          setQuantity={setQuantity}
          onAddToCart={handleAddToCart}
        />

        <ShippingInfo />

        <PaymentMethods />
      </div>
    </div>
  );
}