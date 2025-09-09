// src/components/ItemDetailContainer.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../data/api';
import ItemDetail from './ItemDetail';
import ItemDetailMobile from './ItemDetailMobile';
import { useCart } from '../context/CartContext';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

export default function ItemDetailContainer() {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isMobile } = useDeviceDetection();

  useEffect(() => {
    setLoading(true);
    getProductById(itemId)
      .then((data) => {
        setItem(data);
        setLoading(false);
        setQuantity(1);
        setSelectedImage(0);
      })
      .catch((err) => {
        setError('Error al cargar el producto');
        setLoading(false);
      });
  }, [itemId]);

  if (loading) return <div className="text-center mt-8 text-lg text-gray-500">Cargando producto...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;
  if (!item) return <div className="text-center mt-8 text-red-500">Producto no encontrado</div>;

  const handleBack = () => {
    if (item.category || item.categoria) {
      navigate(`/category/${item.category || item.categoria}`);
    } else {
      navigate(-1);
    }
  };

  // Galería de imágenes
  const allImages = item.images || item.imagenes || [item.mainImage || item.imagen];

  const handlePrevImage = (e) => {
    if (e) e.stopPropagation();
    setSelectedImage((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    if (e) e.stopPropagation();
    setSelectedImage((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const handleSelectImage = (idx) => setSelectedImage(idx);

  const handleAddToCart = (qty) => {
    addToCart(item, qty);
    // Si querés, podés mostrar un mensaje de éxito acá
  };

  return (
    <div className="max-w-[1400px] mx-auto px-8 md:px-12 lg:px-16">
      <div
        onClick={handleBack}
        className="mb-4 cursor-pointer text-[#FF6B35] hover:underline font-baloo font-semibold flex items-center gap-1 text-base w-fit"
        style={{ userSelect: 'none' }}
      >
        <span style={{ fontSize: 18 }}>←</span>
        {item.category || item.categoria
          ? `Volver a ${item.category || item.categoria}`
          : 'Volver atrás'}
      </div>
      {isMobile ? (
        <ItemDetailMobile
          item={item}
          quantity={quantity}
          setQuantity={setQuantity}
          onAddToCart={handleAddToCart}
          allImages={allImages}
          selectedImage={selectedImage}
          onPrevImage={handlePrevImage}
          onNextImage={handleNextImage}
          onSelectImage={handleSelectImage}
        />
      ) : (
        <ItemDetail
          item={item}
          quantity={quantity}
          setQuantity={setQuantity}
          onAddToCart={handleAddToCart}
          allImages={allImages}
          selectedImage={selectedImage}
          onPrevImage={handlePrevImage}
          onNextImage={handleNextImage}
          onSelectImage={handleSelectImage}
        />
      )}
    </div>
  );
}
