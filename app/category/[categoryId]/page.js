'use client'

import { useParams } from 'next/navigation'
import NavBar from '../../../src/layout/Header/components/NavBar/NavBar.jsx'
import Breadcrumb from '../../../src/components/Breadcrumb'
import CategoryBanner from '../../../src/components/CategoryBanner'
import ItemListContainer from '../../../src/components/ItemListContainer'
import Footer from '../../../src/layout/Footer/Footer.jsx'
import SideCart from '../../../src/components/SideCart'
import SearchNotification from '../../../src/components/SearchNotification'
import NotificationToast from '../../../src/components/NotificationToast'
import AddedToCartModal from '../../../src/components/AddedToCartModal'
import { useUI } from '../../../src/context/UIContext'

export default function CategoryPage() {
  const { categoryId } = useParams()
  const { isSideCartOpen, setIsSideCartOpen, isNavBarHidden, isNavBarScrolled } = useUI()

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
        <Breadcrumb categoryId={categoryId} />
        <CategoryBanner categoryId={categoryId} />
        <ItemListContainer greeting="Filtrado por categoría" categoryId={categoryId} />
      </main>
      <Footer />
      <SideCart open={isSideCartOpen} onClose={() => setIsSideCartOpen(false)} />
      <SearchNotification />
      <NotificationToast />
      <AddedToCartModal />
    </>
  )
}
