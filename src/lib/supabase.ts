import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions para Supabase
export type Database = {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          email: string;
          phone: string;
          address: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['customers']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['customers']['Insert']>;
      };
      products: {
        Row: {
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
        };
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
      sales: {
        Row: {
          id: string;
          user_id: string;
          customer_id: string;
          customer_name: string;
          total_amount: number;
          sale_date: string;
          day: number;
          month: number;
          year: number;
          status: 'pending' | 'completed' | 'cancelled';
          items: Array<{
            product_id: string;
            product_name: string;
            quantity: number;
            price: number;
            subtotal: number;
          }>;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['sales']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['sales']['Insert']>;
      };
    };
  };
};
