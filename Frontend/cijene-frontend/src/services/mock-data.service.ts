// Mock data service for testing and development when API is not accessible
import type { ProductSearchResponse, Product, StoreSearchResponse, Store } from '../types';

export class MockDataService {
  private static instance: MockDataService;

  public static getInstance(): MockDataService {
    if (!MockDataService.instance) {
      MockDataService.instance = new MockDataService();
    }
    return MockDataService.instance;
  }

  private mockProducts: Product[] = [
    {
      id: '1',
      name: 'Milk 1L',
      brand: 'Dukat',
      category: 'Dairy',
      ean: '3850103951234',
      description: 'Fresh milk 1L',
      chain: 'KONZUM'
    },
    {
      id: '2', 
      name: 'Bread White 500g',
      brand: 'Klara',
      category: 'Bakery',
      ean: '3850103951235',
      description: 'White bread 500g',
      chain: 'KONZUM'
    },
    {
      id: '3',
      name: 'Yogurt Strawberry 180g',
      brand: 'Dukat',
      category: 'Dairy',
      ean: '3850103951236',
      description: 'Strawberry yogurt 180g',
      chain: 'SPAR'
    },
    {
      id: '4',
      name: 'Chicken Breast 1kg',
      brand: 'Vindija',
      category: 'Meat',
      ean: '3850103951237',
      description: 'Fresh chicken breast 1kg',
      chain: 'KONZUM'
    },
    {
      id: '5',
      name: 'Orange Juice 1L',
      brand: 'Natureta',
      category: 'Beverages', 
      ean: '3850103951238',
      description: '100% orange juice 1L',
      chain: 'LIDL'
    }
  ];

  private mockStores: Store[] = [
    {
      id: '1',
      name: 'Konzum Ilica',
      chain_code: 'KONZUM',
      chain: 'Konzum',
      address: 'Ilica 1, Zagreb',
      city: 'Zagreb',
      latitude: 45.8150,
      longitude: 15.9819,
      phone: '+385 1 234 5678'
    },
    {
      id: '2',
      name: 'Spar Centar',
      chain_code: 'SPAR',
      chain: 'Spar', 
      address: 'Trg bana Jelačića 5, Zagreb',
      city: 'Zagreb',
      latitude: 45.8131,
      longitude: 15.9775,
      phone: '+385 1 234 5679'
    }
  ];

  async getMockProducts(params: any = {}): Promise<ProductSearchResponse> {
    // Simulate API delay
    await this.delay(500);

    let filteredProducts = [...this.mockProducts];

    // Apply search filters
    if (params.query) {
      const query = params.query.toLowerCase();
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(query) ||
        (product.brand && product.brand.toLowerCase().includes(query)) ||
        (product.category && product.category.toLowerCase().includes(query))
      );
    }

    if (params.ean) {
      filteredProducts = filteredProducts.filter(product => product.ean === params.ean);
    }

    if (params.chains && params.chains.length > 0) {
      filteredProducts = filteredProducts.filter(product => 
        product.chain && params.chains.includes(product.chain)
      );
    }

    // Apply pagination
    const page = params.page || 1;
    const perPage = params.per_page || 20;
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return {
      products: paginatedProducts,
      total_count: filteredProducts.length,
      page,
      per_page: perPage
    };
  }

  async getMockStores(params: any = {}): Promise<StoreSearchResponse> {
    await this.delay(300);

    let filteredStores = [...this.mockStores];

    if (params.chain_code) {
      filteredStores = filteredStores.filter(store => store.chain_code === params.chain_code);
    }

    if (params.query) {
      const query = params.query.toLowerCase();
      filteredStores = filteredStores.filter(store => 
        store.name.toLowerCase().includes(query) ||
        store.address.toLowerCase().includes(query)
      );
    }

    const page = params.page || 1;
    const perPage = params.per_page || 20;
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedStores = filteredStores.slice(startIndex, endIndex);

    return {
      stores: paginatedStores,
      total_count: filteredStores.length,
      page,
      per_page: perPage
    };
  }

  async getMockChains() {
    await this.delay(200);
    
    return {
      chains: [
        { 
          code: 'KONZUM', 
          name: 'Konzum', 
          stores_count: 150,
          products_count: 15000,
          last_updated: '2025-01-27T12:00:00Z'
        },
        { 
          code: 'SPAR', 
          name: 'Spar', 
          stores_count: 95,
          products_count: 12000,
          last_updated: '2025-01-27T12:00:00Z'
        },
        { 
          code: 'PLODINE', 
          name: 'Plodine', 
          stores_count: 75,
          products_count: 10000,
          last_updated: '2025-01-27T12:00:00Z'
        },
        { 
          code: 'TOMMY', 
          name: 'Tommy', 
          stores_count: 60,
          products_count: 8000,
          last_updated: '2025-01-27T12:00:00Z'
        },
        { 
          code: 'LIDL', 
          name: 'Lidl', 
          stores_count: 45,
          products_count: 9000,
          last_updated: '2025-01-27T12:00:00Z'
        }
      ]
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const mockDataService = MockDataService.getInstance();