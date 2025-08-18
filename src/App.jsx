import NavBar from './components/NavBar';
import ItemListContainer from './components/ItemListContainer';
import { Routes, Route, useParams } from 'react-router-dom';
import ItemDetailContainer from './components/ItemDetailContainer';
import CategoryButtons from './components/CategoryButtons';
import CategoryBanner from './components/CategoryBanner';
import HomeBanners from './components/HomeBanners';

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
          <Route path="/" element={
            <>
              <div
                style={{
                  background: '#faf4e4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '120px',
                  fontFamily: "'Baloo 2', Inter, sans-serif",
                  fontWeight: 800,
                  fontSize: 28,
                  color: '#3E3E3E',
                  textAlign: 'center',
                  borderRadius: '16px'
                }}
              >
                ¡Bienvenido a Fiestuki!
              </div>
              <CategoryButtons />
              <HomeBanners />
              <ItemListContainer greeting="" />
            </>
          } />
          <Route path="/category/:categoryId" element={<CategoryWithBanner />} />
          <Route path="/item/:itemId" element={<ItemDetailContainer />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}

export default App;