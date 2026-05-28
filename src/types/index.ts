// ==================== CUSTOMER ====================
export interface Customer {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
}

// ==================== PRODUCT ====================
export interface Product {
  id: string;
  user_id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

// ==================== SALE ====================
export interface SaleItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  user_id: string;
  customer_id: string;
  customer_name: string;
  items: SaleItem[];
  total_amount: number;
  sale_date: string;
  day: number;
  month: number;
  year: number;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

// ==================== STATISTICS ====================
export interface DashboardStats {
  totalSales: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  averageOrderValue: number;
  salesGrowth: number;
  revenueGrowth: number;
}

export interface DailySales {
  date: string;
  day: number;
  month: number;
  year: number;
  sales: number;
  revenue: number;
  ordersCount: number;
}

export interface MonthlySales {
  month: number;
  year: number;
  revenue: number;
  ordersCount: number;
}

// ==================== FILTERS ====================
export interface SaleFilters {
  startDate?: string;
  endDate?: string;
  customerId?: string;
  status?: 'pending' | 'completed' | 'cancelled' | 'all';
  minAmount?: number;
  maxAmount?: number;
  searchTerm?: string;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  searchTerm?: string;
  lowStock?: boolean;
}

export interface CustomerFilters {
  searchTerm?: string;
  sortBy?: 'name' | 'email' | 'created_at';
  sortOrder?: 'asc' | 'desc';
}

// ==================== NOTIFICATIONS ====================
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

// ==================== USER ====================
export interface User {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}
