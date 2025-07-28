// src/components/CartWidget.jsx

import { useState } from 'react'
import { FaShoppingCart } from 'react-icons/fa'

export default function CartWidget() {
  const [itemsCount, setItemsCount] = useState(0)

  return (
    // Icono de carrito con badge de cantidad
    <div className="relative cursor-pointer">
      <FaShoppingCart className="text-2xl text-gray-700" />
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
        {itemsCount}
      </span>
    </div>
  )
}
