import { create } from 'zustand';
import { Customer, Product, Sale, DailySales } from '@/types';

interface DashboardStore {
  // State
  customers: Customer[];
  products: Product[];
  sales: Sale[];
  dailySales: DailySales[];
  selectedCustomer: Customer | null;
  selectedProduct: Product | null;
  selectedSale: Sale | null;
  
  // Filters
  showFilters: boolean;
  
  // Customer actions
  setCustomers: (customers: Customer[]) => void;
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  setSelectedCustomer: (customer: Customer | null) => void;
  
  // Product actions
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  setSelectedProduct: (product: Product | null) => void;
  
  // Sale actions
  setSales: (sales: Sale[]) => void;
  addSale: (sale: Sale) => void;
  updateSale: (id: string, sale: Partial<Sale>) => void;
  deleteSale: (id: string) => void;
  setSelectedSale: (sale: Sale | null) => void;
  
  // Daily sales
  setDailySales: (dailySales: DailySales[]) => void;
  
  // UI actions
  setShowFilters: (show: boolean) => void;
  toggleFilters: () => void;
  
  // Reset
  reset: () => void;
}

const initialState = {
  customers: [],
  products: [],
  sales: [],
  dailySales: [],
  selectedCustomer: null,
  selectedProduct: null,
  selectedSale: null,
  showFilters: false,
};

export const useDashboardStore = create<DashboardStore>((set) => ({
  ...initialState,
  
  setCustomers: (customers) => set({ customers }),
  addCustomer: (customer) =>
    set((state) => ({
      customers: [...state.customers, customer],
    })),
  updateCustomer: (id, updates) =>
    set((state) => ({
      customers: state.customers.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    })),
  deleteCustomer: (id) =>
    set((state) => ({
      customers: state.customers.filter((c) => c.id !== id),
    })),
  setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),
  
  setProducts: (products) => set({ products }),
  addProduct: (product) =>
    set((state) => ({
      products: [...state.products, product],
    })),
  updateProduct: (id, updates) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),
  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  
  setSales: (sales) => set({ sales }),
  addSale: (sale) =>
    set((state) => ({
      sales: [...state.sales, sale],
    })),
  updateSale: (id, updates) =>
    set((state) => ({
      sales: state.sales.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    })),
  deleteSale: (id) =>
    set((state) => ({
      sales: state.sales.filter((s) => s.id !== id),
    })),
  setSelectedSale: (sale) => set({ selectedSale: sale }),
  
  setDailySales: (dailySales) => set({ dailySales }),
  
  setShowFilters: (show) => set({ showFilters: show }),
  toggleFilters: () =>
    set((state) => ({
      showFilters: !state.showFilters,
    })),
  
  reset: () => set(initialState),
}));
