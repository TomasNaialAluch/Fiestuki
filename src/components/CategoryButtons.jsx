import { Link, useLocation } from 'react-router-dom';
import './CategoryButtons.css';

const categorias = [
  { to: '/category/cumples', texto: 'Cumples', clase: 'ft-rojo' },
  { to: '/category/despedida', texto: 'Despedida de Soltera', clase: 'ft-amarillo' },
  { to: '/category/baby-shower', texto: 'Baby Shower', clase: 'ft-verde' },
  { to: '/category/religion', texto: 'Religión', clase: 'ft-rosa' },
  { to: '/category/fiestas-patrias', texto: 'Fiestas Patrias', clase: 'ft-celeste' },
];

export default function CategoryButtons() {
  const location = useLocation();
  return (
    <section className="ft-categorias">
      <div className="ft-wrap">
        {categorias.map(cat => (
          <Link
            key={cat.to}
            to={cat.to}
            className={`ft-btn ${cat.clase}${location.pathname === cat.to ? ' ft-activo' : ''}`}
          >
            {cat.texto}
          </Link>
        ))}
      </div>
    </section>
  );
}
