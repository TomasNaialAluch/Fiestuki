import NavBar from './components/NavBar';
import { Routes, Route, useParams } from 'react-router-dom';
import ItemDetailContainer from './components/ItemDetailContainer';
import CategoryButtons from './components/CategoryButtons';
import CategoryBanner from './components/CategoryBanner';
import ItemListContainer from './components/ItemListContainer';
import HomePage from './pages/HomePage';

function NotFound() {
  return (
    <div>404 - Not Found</div>
  );
}

function CategoryWithBanner() {
  const { categoryId } = useParams();
  return (
    <>
      <CategoryButtons />
      <CategoryBanner categoryId={categoryId} />
      <ItemListContainer greeting="Filtrado por categoría" />
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
    </>
  );
}

export default App;