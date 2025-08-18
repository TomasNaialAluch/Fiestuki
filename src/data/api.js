// src/data/api.js
import products from './products.js';

export function getProducts() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(products);
    }, 1000);
  });
}

export function getProductsByCategory(categoryId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(products.filter(p => p.categoria === categoryId));
    }, 1000);
  });
}

export function getProductById(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(products.find(p => p.id === id));
    }, 1000);
  });
}
