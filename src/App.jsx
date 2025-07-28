import NavBar from './components/NavBar'
import ItemListContainer from './components/ItemListContainer'

function App() {
  return (
    <>
      <NavBar />
      <div className="pt-20 md:pt-52">
        <ItemListContainer greeting="¡Bienvenido a Fiestuki!" />
      </div>
    </>
  )
}

export default App
