// src/components/ItemList.jsx

import Item from './Item';

export default function ItemList({ items }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
      {items.map((item) => (
        <Item key={item.id} item={item} />
      ))}
    </div>
  );
}
