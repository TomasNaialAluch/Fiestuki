import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useUI } from '../context/UIContext';
import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';
import ShippingInfo from './ShippingInfo';
import PaymentMethods from './PaymentMethods';

export default function ItemDetail({
  item,
  quantity,
  setQuantity,
  onAddToCart,
  allImages,
  selectedImage,
  onPrevImage,
  onNextImage,
  onSelectImage,
}) {
  const { cart, addToCart } = useCart();
  const { showAddedProductModal } = useUI();
  const [error, setError] = useState('');
  const cartItem = cart.find(prod => prod.id === item.id);
  const alreadyInCart = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = (qty) => {
    if (qty + alreadyInCart > item.stock) {
      setError('No hay suficiente stock disponible');
      return;
    }
    addToCart(item, qty);
    showAddedProductModal(item, qty);
    setError('');
  };

  return (
    <div className="max-w-[1400px] mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 gap-16 bg-[#FAF4E4] rounded-2xl p-12 shadow-lg items-start">
      {/* Galería de imágenes */}
      <div className="flex flex-col items-center justify-center">
        <ProductGallery
          allImages={allImages}
          selectedImage={selectedImage}
          onPrevImage={onPrevImage}
          onNextImage={onNextImage}
          onSelectImage={onSelectImage}
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
          error={error}
        />

        <ShippingInfo />

        <PaymentMethods />
      </div>
    </div>
  );
}