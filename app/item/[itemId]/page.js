'use client'

import NavBar from '../../../src/layout/Header/components/NavBar/NavBar.jsx'
import ItemDetailContainer from '../../../src/components/ItemDetailContainer'
import Footer from '../../../src/layout/Footer/Footer.jsx'
import SideCart from '../../../src/components/SideCart'
import SearchNotification from '../../../src/components/SearchNotification'
import NotificationToast from '../../../src/components/NotificationToast'
import AddedToCartModal from '../../../src/components/AddedToCartModal'
import { useUI } from '../../../src/context/UIContext'

export default function ItemPage() {
  const { isSideCartOpen, setIsSideCartOpen, isNavBarHidden } = useUI()

  return (
    <>
      <NavBar />
      <main className={`transition-all duration-500 ${
        isNavBarHidden ? 'pt-0' : 'pt-20 md:pt-52'
      }`}>
        <ItemDetailContainer />
      </main>
      <Footer />
      <SideCart open={isSideCartOpen} onClose={() => setIsSideCartOpen(false)} />
      <SearchNotification />
      <NotificationToast />
      <AddedToCartModal />
    </>
  )
}
