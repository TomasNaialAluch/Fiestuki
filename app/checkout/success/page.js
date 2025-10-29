'use client'

import NavBar from '../../../src/layout/Header/components/NavBar/NavBar.jsx'
import PaymentSuccess from '../../../src/pages/PaymentSuccess'
import Footer from '../../../src/layout/Footer/Footer.jsx'
import SideCart from '../../../src/components/SideCart'
import SearchNotification from '../../../src/components/SearchNotification'
import NotificationToast from '../../../src/components/NotificationToast'
import AddedToCartModal from '../../../src/components/AddedToCartModal'
import { useUI } from '../../../src/context/UIContext'

export default function PaymentSuccessPage() {
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
        <PaymentSuccess />
      </main>
      <Footer />
      <SideCart open={isSideCartOpen} onClose={() => setIsSideCartOpen(false)} />
      <SearchNotification />
      <NotificationToast />
      <AddedToCartModal />
    </>
  )
}
