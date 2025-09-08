import { Link } from 'react-router-dom';

export default function Breadcrumb({ categoryId }) {
  const getCategoryName = (id) => {
    const categories = {
      'cumpleaños': 'Cumpleaños',
      'despedida': 'Despedida de Soltera',
      'baby-shower': 'Baby Shower',
      'religion': 'Religión',
      'fiestas-patrias': 'Fiestas Patrias'
    };
    return categories[id] || id;
  };

  return (
    <nav className="container mx-auto px-8 md:px-12 lg:px-16 py-4 max-w-7xl">
      <ol className="flex items-center space-x-2 text-sm font-baloo">
        <li>
          <Link 
            to="/" 
            className="text-[#FF6B35] hover:text-[#E55A31] transition-colors font-semibold"
          >
            Inicio
          </Link>
        </li>
        <li className="text-gray-400">
          <span>/</span>
        </li>
        <li>
          <span className="text-gray-600 font-semibold">Categorías</span>
        </li>
        {categoryId && (
          <>
            <li className="text-gray-400">
              <span>/</span>
            </li>
            <li>
              <span className="text-[#8E44AD] font-bold">
                {getCategoryName(categoryId)}
              </span>
            </li>
          </>
        )}
      </ol>
    </nav>
  );
}