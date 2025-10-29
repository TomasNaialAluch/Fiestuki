'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import NavBar from '../../src/layout/Header/components/NavBar/NavBar.jsx'
import SearchBar from '../../src/layout/Header/components/SearchBar/SearchBar.jsx'
import ItemListContainer from '../../src/components/ItemListContainer'
import Footer from '../../src/layout/Footer/Footer.jsx'
import SideCart from '../../src/components/SideCart'
import SearchNotification from '../../src/components/SearchNotification'
import NotificationToast from '../../src/components/NotificationToast'
import AddedToCartModal from '../../src/components/AddedToCartModal'
import { useUI } from '../../src/context/UIContext'
import { useSearch } from '../../src/context/SearchContext'
import { FaSearch } from 'react-icons/fa'

const categorias = [
  { id: 'cumpleaños', nombre: 'Cumpleaños', color: '#FF5722', bg: '#FF5722', text: 'white' },
  { id: 'despedida', nombre: 'Despedida', color: '#FFC107', bg: '#FFC107', text: 'white' },
  { id: 'baby-shower', nombre: 'Baby Shower', color: '#4CAF50', bg: '#4CAF50', text: 'white' },
  { id: 'religion', nombre: 'Religión', color: '#F48FB1', bg: '#F48FB1', text: 'white' },
  { id: 'fiestas-patrias', nombre: 'Fiestas Patrias', color: '#1976D2', bg: '#1976D2', text: 'white' },
];

export default function SearchPage() {
  const { isSideCartOpen, setIsSideCartOpen, isNavBarHidden, isNavBarScrolled } = useUI()
  const { search } = useSearch()
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState(null)

  // Enfocar el input cuando se carga la página en mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      const searchInput = document.querySelector('.search-input')
      if (searchInput) {
        setTimeout(() => searchInput.focus(), 300)
      }
    }
  }, [])

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId)
    router.push(`/category/${categoryId}`)
  }

  return (
    <>
      <NavBar />
      <main className={`transition-all duration-300 ${
        isNavBarHidden 
          ? 'pt-0' 
          : isNavBarScrolled 
            ? 'pt-20 md:pt-20' 
            : 'pt-20 md:pt-52'
      }`}>
        {/* Header de búsqueda - Mobile First */}
        <div className="bg-[#FAF4E4] pb-6">
          <div className="container mx-auto px-4 md:px-8 pt-6 max-w-7xl flex flex-col items-center">
            {/* Título */}
            <h1 className="text-2xl md:text-3xl font-baloo font-bold text-gray-800 mb-4 md:mb-6 text-center">
              🔍 Buscar Productos
            </h1>
            
            {/* Buscador - centrado */}
            <div className="w-full max-w-lg flex flex-col items-center">
              <div className="w-full flex justify-center px-4">
                <div className="w-full max-w-[500px]">
                  <SearchBar placeholder="Buscar productos, categorías..." fullWidth={true} enableDropdown={false} />
                </div>
              </div>
              
              {/* Chips de categorías */}
              <div className="mt-6 w-full max-w-2xl">
                <p className="text-sm font-baloo font-semibold text-gray-600 mb-3 text-center">
                  Filtrar por categoría:
                </p>
                <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                  {categorias.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.id)}
                      className={`px-4 py-2 rounded-full font-baloo font-bold text-sm md:text-base transition-all duration-200 hover:scale-105 ${
                        selectedCategory === cat.id 
                          ? 'ring-2 ring-gray-800 ring-offset-2' 
                          : ''
                      }`}
                      style={{
                        backgroundColor: cat.bg,
                        color: cat.text
                      }}
                    >
                      {cat.nombre}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Mensaje si no hay búsqueda */}
              {!search || search.trim() === '' ? (
                <div className="mt-6 text-center text-gray-500 font-baloo">
                  <p className="text-lg mb-2">Escribe algo para buscar...</p>
                  <p className="text-sm">Encuentra todos los productos de Fiestuki</p>
                </div>
              ) : (
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 font-baloo">
                    Resultados para: <span className="font-bold text-[#FF6B35]">"{search}"</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lista de productos filtrados */}
        {search && search.trim() !== '' ? (
          <ItemListContainer greeting={null} />
        ) : (
          <div className="container mx-auto px-4 md:px-8 py-12 max-w-7xl">
            <div className="text-center text-gray-400">
              <FaSearch className="text-6xl mx-auto mb-4 opacity-30" />
              <p className="text-lg font-baloo">No hay búsqueda activa</p>
              <p className="text-sm mt-2">Ingresa un término de búsqueda arriba</p>
            </div>
          </div>
        )}
      </main>
      <Footer />
      <SideCart open={isSideCartOpen} onClose={() => setIsSideCartOpen(false)} />
      <SearchNotification />
      <NotificationToast />
      <AddedToCartModal />
    </>
  )
}

