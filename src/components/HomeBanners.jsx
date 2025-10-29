import React from "react"

// Banners para mobile
const mobileBanners = import.meta.glob("../assets/banners/mobile/*.{png,jpg,jpeg}", {
  eager: true,
  as: "url",
})

// Banners para desktop
const desktopBanners = import.meta.glob("../assets/banners/desktop/*.{png,jpg,jpeg}", {
  eager: true,
  as: "url",
})

export default function HomeBanners({ categoryButtonsSlot }) {
  // Filtrar la imagen que no queremos mostrar
  const filteredMobileBanners = Object.entries(mobileBanners).filter(([path]) => 
    !path.includes('sin boton')
  );
  
  const mobileBannersArray = Object.values(Object.fromEntries(filteredMobileBanners));
  const firstMobileBanner = mobileBannersArray[0];
  const restMobileBanners = mobileBannersArray.slice(1);
  
  return (
    <>
      {/* Mobile */}
      <div className="block md:hidden">
        {/* Primera imagen */}
        {firstMobileBanner && (
          <img
            key="mobile-0"
            src={firstMobileBanner}
            alt="Mobile Banner 1"
            className="w-full block"
          />
        )}
        
        {/* Botones de categoría (slot) */}
        {categoryButtonsSlot}
        
        {/* Resto de imágenes */}
        {restMobileBanners.map((src, i) => (
          <img
            key={`mobile-${i + 1}`}
            src={src}
            alt={`Mobile Banner ${i + 2}`}
            className="w-full block"
          />
        ))}
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        {Object.values(desktopBanners).map((src, i) => (
          <img
            key={`desktop-${i}`}
            src={src}
            alt={`Desktop Banner ${i + 1}`}
            className="w-full block"
          />
        ))}
      </div>
    </>
  )
}
