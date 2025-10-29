import ItemListContainer from '../components/ItemListContainer'
import CategoryButtons from '../components/CategoryButtons'
import HomeBanners from '../components/HomeBanners'

export default function HomePage() {
  return (
    <>
      {/* Desktop: botones arriba */}
      <div className="hidden md:block">
        <CategoryButtons />
      </div>
      
      {/* Mobile: botones dentro del componente de banners (después de primera imagen) */}
      <HomeBanners categoryButtonsSlot={
        <div className="block md:hidden">
          <CategoryButtons />
        </div>
      } />
    </>
  )
}