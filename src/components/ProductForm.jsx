// src/components/ProductForm.jsx
import React, { useState } from 'react';
import { collection, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../services/firebase';
import { FaUpload, FaTrash, FaSave, FaTimes } from 'react-icons/fa';

export default function ProductForm({ product = null, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: product?.name || product?.nombre || '',
    price: product?.price || product?.precio || '',
    category: product?.category || product?.categoria || '',
    description: product?.description || product?.descripcion || '',
    stock: product?.stock || '',
    images: product?.images || [],
    mainImage: product?.mainImage || ''
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'cumpleaños',
    'despedida', 
    'baby-shower',
    'religion',
    'fiestas-patrias'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar pegado desde Word/rich text preservando formato
  const handlePasteDescription = (e) => {
    e.preventDefault();
    
    // Obtener datos del clipboard
    const clipboardData = e.clipboardData || window.clipboardData;
    const htmlData = clipboardData.getData('text/html');
    const plainData = clipboardData.getData('text/plain');
    
    let cleanedText = '';
    
    // Si hay HTML, procesarlo para preservar listas y formato
    if (htmlData) {
      // Crear un elemento temporal para parsear HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlData;
      
      // Función recursiva para procesar nodos y preservar formato
      const processNode = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent;
        }
        
        if (node.nodeType === Node.ELEMENT_NODE) {
          const tagName = node.tagName?.toLowerCase();
          
          // Si es un elemento de lista (ul/ol)
          if (tagName === 'ul' || tagName === 'ol') {
            const listItems = Array.from(node.querySelectorAll(':scope > li'));
            if (listItems.length === 0) {
              // Si no hay li directos, buscar en todos los niveles
              const allLis = Array.from(node.querySelectorAll('li'));
              return allLis.map((li) => {
                const itemText = processNode(li).trim();
                // Convertir a bullet points solo si no empieza ya con uno
                return itemText.match(/^[•·▪▫-]\s/) ? itemText : `• ${itemText}`;
              }).join('\n') + '\n';
            }
            return listItems.map((li) => {
              const itemText = processNode(li).trim();
              // Mantener bullet si ya existe, sino agregar
              return itemText.match(/^[•·▪▫-]\s/) ? itemText : `• ${itemText}`;
            }).join('\n') + '\n';
          }
          
          // Si es un elemento de lista individual
          if (tagName === 'li') {
            const children = Array.from(node.childNodes);
            const content = children.map(processNode).join('').trim();
            // Si ya tiene bullet al inicio, mantenerlo
            return content;
          }
          
          // Si es un salto de línea (br)
          if (tagName === 'br') {
            return '\n';
          }
          
          // Si es un párrafo (p) o div, agregar salto de línea después
          if (tagName === 'p' || tagName === 'div') {
            const children = Array.from(node.childNodes);
            const content = children.map(processNode).join('').trim();
            return content ? content + '\n' : '';
          }
          
          // Para otros elementos, procesar sus hijos
          const children = Array.from(node.childNodes);
          return children.map(processNode).join('');
        }
        
        return '';
      };
      
      cleanedText = processNode(tempDiv);
      
      // Normalizar diferentes tipos de bullets a uno estándar
      cleanedText = cleanedText
        .replace(/^[·▪▫-]\s+/gm, '• ')  // Convertir otros bullets a • 
        .replace(/\u2022/g, '•')         // Unicode bullet
        .replace(/\u25CF/g, '•')         // Black circle
        .replace(/\u25E6/g, '•');        // White bullet
      
      // Limpiar múltiples saltos de línea seguidos (máximo 2)
      cleanedText = cleanedText.replace(/\n{3,}/g, '\n\n');
      
      // Limpiar espacios al inicio y final de cada línea, pero mantener bullets
      cleanedText = cleanedText.split('\n').map(line => {
        const trimmed = line.trim();
        // Si la línea empieza con bullet, mantenerlo
        if (trimmed.match(/^[•·▪▫-]/)) {
          return trimmed;
        }
        return trimmed;
      }).join('\n');
      
    } else if (plainData) {
      // Si es solo texto plano, también procesar bullets
      cleanedText = plainData
        .replace(/^[·▪▫-]\s+/gm, '• ')
        .replace(/\u2022/g, '•')
        .replace(/\u25CF/g, '•')
        .replace(/\u25E6/g, '•');
    }
    
    // Insertar el texto en la posición del cursor
    const textarea = e.target;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentValue = formData.description;
    
    // No hacer trim() completo para no perder saltos de línea finales
    const textToInsert = cleanedText.trimEnd();
    
    const newValue = 
      currentValue.substring(0, start) + 
      textToInsert + 
      currentValue.substring(end);
    
    setFormData(prev => ({
      ...prev,
      description: newValue
    }));
    
    // Restaurar posición del cursor después del texto pegado
    setTimeout(() => {
      const newPosition = start + textToInsert.length;
      textarea.setSelectionRange(newPosition, newPosition);
      textarea.focus();
    }, 0);
  };

  const handleImageUpload = async (files) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setError('');

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name} no es una imagen válida`);
        }

        // Validar tamaño (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name} es demasiado grande (máximo 5MB)`);
        }

        const fileName = `${Date.now()}_${file.name}`;
        const imageRef = ref(storage, `products/${fileName}`);
        
        const snapshot = await uploadBytes(imageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        
        return {
          name: file.name,
          url: downloadURL,
          ref: imageRef.fullPath
        };
      });

      const uploadedImages = await Promise.all(uploadPromises);
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedImages]
      }));

      // Si no hay imagen principal, usar la primera subida
      if (!formData.mainImage && uploadedImages.length > 0) {
        setFormData(prev => ({
          ...prev,
          mainImage: uploadedImages[0].url
        }));
      }

    } catch (error) {
      console.error('Error subiendo imágenes:', error);
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (imageIndex) => {
    const imageToRemove = formData.images[imageIndex];
    
    try {
      // Eliminar de Storage
      if (imageToRemove.ref) {
        const imageRef = ref(storage, imageToRemove.ref);
        await deleteObject(imageRef);
      }

      // Actualizar estado
      const newImages = formData.images.filter((_, index) => index !== imageIndex);
      const newMainImage = formData.mainImage === imageToRemove.url ? 
        (newImages.length > 0 ? newImages[0].url : '') : formData.mainImage;

      setFormData(prev => ({
        ...prev,
        images: newImages,
        mainImage: newMainImage
      }));

    } catch (error) {
      console.error('Error eliminando imagen:', error);
      setError('Error eliminando imagen');
    }
  };

  const setMainImage = (imageUrl) => {
    setFormData(prev => ({
      ...prev,
      mainImage: imageUrl
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        category: formData.category,
        description: formData.description,
        stock: parseInt(formData.stock) || 0,
        images: formData.images,
        mainImage: formData.mainImage,
        updatedAt: new Date()
      };

      if (product) {
        // Actualizar producto existente
        await updateDoc(doc(db, 'products', product.id), productData);
      } else {
        // Crear nuevo producto
        productData.createdAt = new Date();
        await addDoc(collection(db, 'products'), productData);
      }

      onSuccess?.();
      onClose?.();

    } catch (error) {
      console.error('Error guardando producto:', error);
      setError('Error guardando el producto');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!product || !confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return;
    }

    try {
      // Eliminar imágenes del storage
      for (const image of formData.images) {
        if (image.ref) {
          const imageRef = ref(storage, image.ref);
          await deleteObject(imageRef);
        }
      }

      // Eliminar producto de Firestore
      await deleteDoc(doc(db, 'products', product.id));
      
      onSuccess?.();
      onClose?.();

    } catch (error) {
      console.error('Error eliminando producto:', error);
      setError('Error eliminando el producto');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold font-baloo text-gray-800">
              {product ? 'Editar Producto' : 'Agregar Producto'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información Básica */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Información Básica</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  onPaste={handlePasteDescription}
                  rows="6"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent font-mono text-sm whitespace-pre-wrap"
                  placeholder="Puedes pegar texto desde Word y se mantendrán las listas y saltos de línea..."
                />
              </div>
            </div>

            {/* Imágenes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Imágenes</h3>
              
              {/* Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subir Imágenes
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files)}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <FaUpload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-gray-600">
                      {uploading ? 'Subiendo...' : 'Haz clic para subir imágenes'}
                    </span>
                    <span className="text-sm text-gray-400 mt-1">
                      Máximo 5MB por imagen
                    </span>
                  </label>
                </div>
              </div>

              {/* Imágenes Subidas */}
              {formData.images.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imágenes del Producto
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image.url}
                          alt={`Imagen ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                        />
                        
                        {/* Indicador de imagen principal */}
                        {formData.mainImage === image.url && (
                          <div className="absolute top-1 left-1 bg-[#FF6B35] text-white text-xs px-2 py-1 rounded">
                            Principal
                          </div>
                        )}
                        
                        {/* Botones de acción */}
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => setMainImage(image.url)}
                            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            title="Hacer imagen principal"
                          >
                            ⭐
                          </button>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                            title="Eliminar imagen"
                          >
                            <FaTrash className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
            {product && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <FaTrash className="w-4 h-4" />
                Eliminar
              </button>
            )}
            
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-[#FF6B35] text-white rounded-lg hover:bg-[#E55A31] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <FaSave className="w-4 h-4" />
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



