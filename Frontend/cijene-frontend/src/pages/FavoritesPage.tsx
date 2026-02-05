// Favorites page component

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Package, Store, Trash2, ShoppingCart } from 'lucide-react';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { useFavoriteProducts, useFavoriteStores, useFavoriteActions } from '../stores/appStore';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { FavoritesList } from '../components/favorites';
import { useLanguage } from '../contexts/LanguageContext';

type TabType = 'products' | 'stores';

export const FavoritesPage: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>('products');
  const products = useFavoriteProducts();
  const stores = useFavoriteStores();
  const { removeProduct, removeStore } = useFavoriteActions();

  const handleClearAll = () => {
    const confirmMessage = activeTab === 'products'
      ? t('favorites.confirmClear.products')
      : t('favorites.confirmClear.stores');

    if (window.confirm(confirmMessage)) {
      if (activeTab === 'products') {
        products.forEach(product => removeProduct(product.ean || product.id || ''));
      } else {
        stores.forEach(store => removeStore(store.id));
      }
    }
  };

  const handleRemoveProduct = (productId: string) => {
    removeProduct(productId);
  };

  const handleRemoveStore = (storeId: string) => {
    removeStore(storeId);
  };

  const currentItems = activeTab === 'products' ? products : stores;
  const hasItems = currentItems.length > 0;

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('favorites.title')}</h1>
            <p className="text-gray-600">
              {t('favorites.subtitle')}
            </p>
          </div>

          {hasItems && (
            <Button
              variant="outline"
              onClick={handleClearAll}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {activeTab === 'products' ? t('favorites.clear.products') : t('favorites.clear.stores')}
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('favorites.products')}</p>
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('favorites.stores')}</p>
                <p className="text-2xl font-bold text-gray-900">{stores.length}</p>
              </div>
              <Store className="h-8 w-8 text-blue-600" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('products')}
                className={`py-4 px-6 border-b-2 font-medium transition-colors ${activeTab === 'products'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                {t('favorites.products')} ({products.length})
              </button>
              <button
                onClick={() => setActiveTab('stores')}
                className={`py-4 px-6 border-b-2 font-medium transition-colors ${activeTab === 'stores'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                {t('favorites.stores')} ({stores.length})
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <FavoritesList
              type={activeTab}
              items={currentItems}
              onRemoveItem={activeTab === 'products' ? handleRemoveProduct : handleRemoveStore}
            />
          </div>
        </div>

        {/* Quick Actions */}
        {(products.length > 0 || stores.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center mb-3">
                <Heart className="h-6 w-6 text-red-500 mr-2" />
                <h3 className="text-lg font-semibold">{t('favorites.alerts.title')}</h3>
              </div>
              <p className="text-gray-600 mb-4">{t('favorites.alerts.text')}</p>
              <Button variant="outline" className="w-full" disabled>
                {t('favorites.alerts.action')}
              </Button>
            </Card>

            <Card className="p-6">
              <div className="flex items-center mb-3">
                <ShoppingCart className="h-6 w-6 text-green-500 mr-2" />
                <h3 className="text-lg font-semibold">{t('favorites.shopping.title')}</h3>
              </div>
              <p className="text-gray-600 mb-4">{t('favorites.shopping.text')}</p>
              <Button variant="outline" className="w-full" disabled>
                {t('favorites.shopping.action')}
              </Button>
            </Card>

            <Card className="p-6">
              <div className="flex items-center mb-3">
                <Package className="h-6 w-6 text-blue-500 mr-2" />
                <h3 className="text-lg font-semibold">{t('favorites.history.title')}</h3>
              </div>
              <p className="text-gray-600 mb-4">{t('favorites.history.text')}</p>
              <Link to="/archives">
                <Button variant="outline" className="w-full">
                  {t('favorites.history.action')}
                </Button>
              </Link>
            </Card>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};
