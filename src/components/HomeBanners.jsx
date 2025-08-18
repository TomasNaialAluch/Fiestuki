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

export default function HomeBanners() {
  return (
    <>
      {/* Mobile */}
      <div className="block md:hidden">
        {Object.values(mobileBanners).map((src, i) => (
          <img
            key={`mobile-${i}`}
            src={src}
            alt={`Mobile Banner ${i + 1}`}
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
