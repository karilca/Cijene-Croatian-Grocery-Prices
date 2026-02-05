// Products page component

import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductSearch, ProductCard, ProductDetails } from '../components/product';
import { CompareBar } from '../components/product/CompareBar';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';

import { useProductSearch } from '../hooks/useApiQueries';
import type { ProductSearchRequest, Product } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useState<ProductSearchRequest>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<'search' | 'details'>('search');
  const [urlSearchParams] = useSearchParams();

  // Initialize/update search params from URL
  React.useEffect(() => {
    const query = urlSearchParams.get('q');
    const ean = urlSearchParams.get('ean');
    const chainCode = urlSearchParams.get('chain_code');

    if (query || ean || chainCode) {
      setSearchParams({
        query: query || undefined,
        ean: ean || undefined,
        chain_code: chainCode || undefined
      });
    }
  }, [urlSearchParams]);

  // Search results
  const {
    data: searchResults,
    isLoading: searchLoading,
    error: searchError
  } = useProductSearch(searchParams, {
    enabled: !!(searchParams.query || searchParams.ean || searchParams.chain_code)
  });

  const { t } = useLanguage();

  const handleSearch = (params: ProductSearchRequest) => {
    setSearchParams(params);
    setSelectedProduct(null);
    setViewMode('search');
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setViewMode('details');
  };

  const handleBackToSearch = () => {
    setSelectedProduct(null);
    setViewMode('search');
  };

  const hasSearched = !!(searchParams.query || searchParams.ean || searchParams.chain_code);

  if (viewMode === 'details' && selectedProduct) {
    return (
      <div className="max-w-6xl mx-auto">
        <ProductDetails
          product={selectedProduct}
          onBack={handleBackToSearch}
        />
        <CompareBar />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-32">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('products.title')}</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          {t('products.subtitle')}
        </p>
      </div>

      {/* Search Component */}
      <ProductSearch
        onSearch={handleSearch}
        isLoading={searchLoading}
        className="max-w-4xl mx-auto"
      />

      {/* Search Results */}
      {hasSearched && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {t('products.results')}
              {searchResults && (
                <span className="text-gray-600 font-normal ml-2">
                  ({searchResults.total_count} {t('products.found')})
                </span>
              )}
            </h2>

            {searchResults && searchResults.products.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {t('common.page')} {searchResults.page} {t('common.of')} {Math.ceil(searchResults.total_count / searchResults.per_page)}
                </span>
              </div>
            )}
          </div>

          {searchLoading && (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
              <span className="ml-3 text-gray-600">{t('products.searching')}</span>
            </div>
          )}

          {searchError && (
            <ErrorMessage
              title={t('products.error.title')}
              message={searchError instanceof Error ? searchError.message : t('products.error.message')}
              onRetry={() => handleSearch(searchParams)}
            />
          )}

          {searchResults && !searchLoading && (
            <>
              {searchResults.products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {searchResults.products.map((product, index) => (
                    <ProductCard
                      key={product.ean || product.id || index}
                      product={product}
                      onViewDetails={handleProductSelect}
                      showPricing={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg mb-4">{t('products.noResults')}</p>
                  <p className="text-gray-500">{t('products.tryAdjusting')}</p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Compare floating bar */}
      <CompareBar />
    </div>
  );
};
