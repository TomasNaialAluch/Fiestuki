import ItemListContainer from '../components/ItemListContainer'
import CategoryButtons from '../components/CategoryButtons'
import HomeBanners from '../components/HomeBanners'

export default function HomePage() {
  return (
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
  )
}