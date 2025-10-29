import React from 'react';
import { useLocation } from 'react-router-dom';
import WhatsappFAB from './components/WhatsappFAB.jsx';
import { Routes, Route, useParams } from 'react-router-dom';
import NavBar from './layout/Header/components/NavBar/NavBar.jsx';
import HomePage from './pages/HomePage';
import ItemListContainer from './components/ItemListContainer';
import ItemDetailContainer from './components/ItemDetailContainer';
import CategoryBanner from './components/CategoryBanner';
import Footer from "./layout/Footer/Footer.jsx";
import Breadcrumb from './components/Breadcrumb';
import SideCart from './components/SideCart'
import SearchNotification from './components/SearchNotification'
import NotificationToast from './components/NotificationToast'
import AddedToCartModal from './components/AddedToCartModal'
import { useCart } from './context/CartContext'
import { useUI } from './context/UIContext'
import Checkout from './pages/Checkout';
import Users from './pages/Users';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailure from './pages/PaymentFailure';
import AdminPanel from './pages/AdminPanel';
import SearchPage from './pages/SearchPage';

function NotFound() {
  return (
    <div>404 - Not Found</div>
  );
}

function CategoryWithBanner() {
  const { categoryId } = useParams();
  return (
    <>
      <Breadcrumb categoryId={categoryId} />
      <CategoryBanner categoryId={categoryId} />
      <ItemListContainer greeting="Filtrado por categoría" categoryId={categoryId} />
    </>
  );
}

function App() {
  const { isSideCartOpen, setIsSideCartOpen, isNavBarHidden, isNavBarScrolled } = useUI();
  const location = useLocation();
  const isCheckout = location.pathname.startsWith('/checkout');

  return (
    <>
      <NavBar />
      <main className={`transition-all duration-300 ${
        isCheckout 
          ? 'pt-0 md:pt-20' 
          : (isNavBarHidden 
              ? 'pt-0' 
              : isNavBarScrolled 
                ? 'pt-20 md:pt-20' 
                : 'pt-20 md:pt-52')
      }`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:categoryId" element={<CategoryWithBanner />} />
          <Route path="/item/:itemId" element={<ItemDetailContainer />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/users" element={<Users />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/checkout/success" element={<PaymentSuccess />} />
          <Route path="/checkout/failure" element={<PaymentFailure />} />
          <Route path="/checkout/pending" element={<PaymentFailure />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      {/* FAB de WhatsApp - oculto en checkout, users y admin */}
      {!(isCheckout || location.pathname.startsWith('/users') || location.pathname.startsWith('/admin')) && (
        <WhatsappFAB />
      )}
      <SideCart open={isSideCartOpen} onClose={() => setIsSideCartOpen(false)} />
      <SearchNotification />
      <NotificationToast />
      <AddedToCartModal />
    </>
  );
}

export default App;