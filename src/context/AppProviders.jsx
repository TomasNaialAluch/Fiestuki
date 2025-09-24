import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { UIProvider } from './UIContext';
import { SearchProvider } from './SearchContext';
import { CartProvider } from './CartContext';

// Provider compuesto que agrupa todos los providers
export function AppProviders({ children }) {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UIProvider>
          <SearchProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </SearchProvider>
        </UIProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
