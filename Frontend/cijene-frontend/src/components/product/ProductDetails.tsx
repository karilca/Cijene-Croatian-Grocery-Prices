import React, { useState } from 'react';
import { Heart, Package, Barcode, MapPin, Calendar, TrendingDown, TrendingUp, Star, ChevronLeft } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { useFavoriteActions } from '../../stores/appStore';
import { useProductPrices } from '../../hooks/useApiQueries';
import { useLanguage } from '../../contexts/LanguageContext';
import type { Product, Price } from '../../types';

interface ProductDetailsProps {
  product: Product;
  onBack?: () => void;
  className?: string;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  onBack,
  className = ''
}) => {
  const [selectedDate, setSelectedDate] = useState('');
  const { isProductFavorite, addProduct, removeProduct } = useFavoriteActions();
  const { t } = useLanguage();

  const isFavorite = isProductFavorite(product.ean || product.id || '');

  // Fetch pricing data
  const {
    data: priceComparison,
    isLoading: pricesLoading,
    error: pricesError
  } = useProductPrices(
    {
      eans: product.ean || product.id || ''
    },
    product,
    { enabled: !!(product.ean || product.id) }
  );

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      removeProduct(product.ean || product.id || '');
    } else {
      addProduct(product);
    }
  };

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `€${numPrice.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-GB');
    } catch {
      return dateString;
    }
  };

  const getBestPrice = (prices: Price[]) => {
    if (!prices.length) return null;
    return prices.reduce((best, current) => {
      const currentPrice = current.special_price || current.price;
      const bestPrice = best.special_price || best.price;
      return currentPrice < bestPrice ? current : best;
    });
  };

  const getWorstPrice = (prices: Price[]) => {
    if (!prices.length) return null;
    return prices.reduce((worst, current) => {
      const currentPrice = current.special_price || current.price;
      const worstPrice = worst.special_price || worst.price;
      return currentPrice > worstPrice ? current : worst;
    });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-start gap-4">
        {onBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mt-1"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        )}

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {product.name || t('common.unknownProduct')}
              </h1>
              {product.brand && (
                <p className="text-lg text-gray-600 mb-2">
                  {t('common.by')} {product.brand}
                </p>
              )}
            </div>

            <Button
              variant="ghost"
              onClick={handleFavoriteToggle}
              className={`p-2 ${isFavorite
                ? 'text-red-500 hover:text-red-600'
                : 'text-gray-400 hover:text-red-500'
                }`}
            >
              <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* Product Information */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">{t('productDetails.productInfo')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Info */}
          <div className="space-y-3">
            {product.ean && (
              <div className="flex items-center gap-3">
                <Barcode className="w-5 h-5 text-gray-400" />
                <div>
                  <span className="text-sm text-gray-500">{t('productDetails.eanCode')}</span>
                  <p className="font-mono font-medium">{product.ean}</p>
                </div>
              </div>
            )}

            {(product.quantity || product.unit) && (
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-gray-400" />
                <div>
                  <span className="text-sm text-gray-500">{t('productDetails.size')}</span>
                  <p className="font-medium">
                    {product.quantity && product.unit
                      ? `${product.quantity} ${product.unit}`
                      : product.quantity || product.unit
                    }
                  </p>
                </div>
              </div>
            )}

            {product.category && (
              <div>
                <span className="text-sm text-gray-500">{t('productDetails.category')}</span>
                <p className="font-medium">{product.category}</p>
              </div>
            )}
          </div>

          {/* Chain Info */}
          <div className="space-y-3">
            {product.chain && (
              <div>
                <span className="text-sm text-gray-500">{t('productDetails.availableAt')}</span>
                <div className="mt-1">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {product.chain}
                  </span>
                </div>
              </div>
            )}

            {product.chain_code && (
              <div>
                <span className="text-sm text-gray-500">{t('productDetails.chainCode')}</span>
                <p className="font-mono font-medium">{product.chain_code}</p>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="font-medium mb-2">{t('productDetails.description')}</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>
        )}
      </Card>

      {/* Price Comparison */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{t('productDetails.priceComparison')}</h2>

          {/* Date filter */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {pricesLoading && (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner size="lg" />
            <span className="ml-3 text-gray-600">{t('productDetails.loadingPrices')}</span>
          </div>
        )}

        {pricesError && (
          <ErrorMessage
            title={t('productDetails.priceLoadingError')}
            message={pricesError instanceof Error ? pricesError.message : 'Failed to load price comparison data'}
            onRetry={() => window.location.reload()}
          />
        )}

        {priceComparison && !pricesLoading && (
          <div className="space-y-4">
            {/* Price Summary */}
            {priceComparison.prices.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                    <TrendingDown className="w-4 h-4" />
                    <span className="text-sm font-medium">{t('productDetails.bestPrice')}</span>
                  </div>
                  <p className="text-xl font-bold text-green-600">
                    {formatPrice(priceComparison.min_price)}
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                    <Star className="w-4 h-4" />
                    <span className="text-sm font-medium">{t('productDetails.average')}</span>
                  </div>
                  <p className="text-xl font-bold text-blue-600">
                    {formatPrice(priceComparison.avg_price)}
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-red-600 mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">{t('productDetails.highest')}</span>
                  </div>
                  <p className="text-xl font-bold text-red-600">
                    {formatPrice(priceComparison.max_price)}
                  </p>
                </div>
              </div>
            )}

            {/* Price List */}
            {priceComparison.prices.length > 0 ? (
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">{t('productDetails.storesAndPrices')}</h3>
                <div className="space-y-2">
                  {priceComparison.prices.map((price, index) => {
                    const isCurrentBest = getBestPrice(priceComparison.prices)?.store_id === price.store_id;
                    const isCurrentWorst = getWorstPrice(priceComparison.prices)?.store_id === price.store_id;
                    const finalPrice = price.special_price || price.price;

                    return (
                      <div
                        key={index}
                        className={`p-3 border rounded-lg ${isCurrentBest ? 'border-green-200 bg-green-50' :
                          isCurrentWorst ? 'border-red-200 bg-red-50' :
                            'border-gray-200 bg-white'
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{price.chain}</span>
                              {isCurrentBest && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                  {t('productDetails.bestPrice')}
                                </span>
                              )}
                              {price.special_price && (
                                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                                  {t('productDetails.specialOffer')}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                              <MapPin className="w-3 h-3" />
                              <span>{t('productDetails.storeId').replace('{id}', price.store_id)}</span>
                              <span>•</span>
                              <span>{formatDate(price.date)}</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              {price.special_price && (
                                <span className="text-sm text-gray-500 line-through">
                                  {formatPrice(price.price)}
                                </span>
                              )}
                              <span className={`text-lg font-bold ${isCurrentBest ? 'text-green-600' :
                                isCurrentWorst ? 'text-red-600' : 'text-gray-900'
                                }`}>
                                {formatPrice(finalPrice)}
                              </span>
                            </div>
                            {price.unit && (
                              <div className="text-xs text-gray-500">
                                {t('productDetails.per').replace('{unit}', price.unit)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">{t('productDetails.noData')}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {t('productDetails.tryDifferentDate')}
                </p>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};
