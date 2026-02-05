// Hook for common favorite functionality across different card types

import { useCallback } from 'react';
import { useFavoriteActions } from '../stores/appStore';
import type { Product, Store } from '../types';

export interface UseFavoriteParams<T> {
  item: T;
  getId: (item: T) => string;
  addFavorite: (item: T) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export function useFavorite<T>({
  item,
  getId,
  addFavorite,
  removeFavorite,
  isFavorite
}: UseFavoriteParams<T>) {
  const itemId = getId(item);
  const favorite = isFavorite(itemId);

  const toggleFavorite = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    
    if (favorite) {
      removeFavorite(itemId);
    } else {
      addFavorite(item);
    }
  }, [favorite, itemId, item, addFavorite, removeFavorite]);

  return {
    isFavorite: favorite,
    toggleFavorite
  };
}

// Specific implementations for different types
export function useProductFavorite(product: Product) {
  const { isProductFavorite, addProduct, removeProduct } = useFavoriteActions();
  
  return useFavorite({
    item: product,
    getId: (p) => p.ean || p.id || '',
    addFavorite: addProduct,
    removeFavorite: removeProduct,
    isFavorite: isProductFavorite
  });
}

export function useStoreFavorite(store: Store) {
  const { isStoreFavorite, addStore, removeStore } = useFavoriteActions();
  
  return useFavorite({
    item: store,
    getId: (s) => s.id,
    addFavorite: addStore,
    removeFavorite: removeStore,
    isFavorite: isStoreFavorite
  });
}