export default function ItemListContainer({ greeting }) {
  return (
    <div className="text-center mt-8">
      {/* Mensaje de bienvenida */}
      <h2 className="text-2xl font-bold mb-4">{greeting}</h2>
      <div className="max-w-3xl mx-auto text-lg text-gray-700 space-y-4 text-justify px-4">
        <p>
          ¡Bienvenido a la tienda digital donde la diversión y la alegría son protagonistas!
        </p>
        <p>
          Próximamente vas a poder encontrar todo lo que necesitás para hacer de tu cumpleaños o evento una verdadera fiesta: cotillón original, colorido y de tendencia, pensado para que cada celebración sea única y memorable.
        </p>
        <p>
          En Fiestuki queremos que tu día especial sea inolvidable. ¡Preparate para descubrir productos que llenarán de magia y sonrisas cada momento!
        </p>
      </div>
    </div>
  )
}
