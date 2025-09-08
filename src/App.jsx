import React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import NavBar from './layout/Header/components/NavBar/NavBar.jsx';
import HomePage from './pages/HomePage';
import ItemListContainer from './components/ItemListContainer';
import ItemDetailContainer from './components/ItemDetailContainer';
import CategoryBanner from './components/CategoryBanner';
import Footer from "./layout/Footer/Footer.jsx";
import Breadcrumb from './components/Breadcrumb';

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
  return (
    <>
      <NavBar />
      <main className="pt-20 md:pt-52">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:categoryId" element={<CategoryWithBanner />} />
          <Route path="/item/:itemId" element={<ItemDetailContainer />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;