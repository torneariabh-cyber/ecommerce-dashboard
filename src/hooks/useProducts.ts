import { useCallback, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Product, ProductFilters } from '@/types';

export const useProducts = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(
    async (filters?: ProductFilters): Promise<Product[]> => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase.from('products').select('*');

        if (filters?.category) {
          query = query.eq('category', filters.category);
        }

        if (filters?.minPrice !== undefined) {
          query = query.gte('price', filters.minPrice);
        }

        if (filters?.maxPrice !== undefined) {
          query = query.lte('price', filters.maxPrice);
        }

        if (filters?.searchTerm) {
          query = query.or(
            `name.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`
          );
        }

        if (filters?.lowStock) {
          query = query.lt('stock', 10);
        }

        const { data, error } = await query;
        if (error) throw error;

        return data || [];
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao buscar produtos';
        setError(message);
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createProduct = useCallback(
    async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product | null> => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('products')
          .insert([product])
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao criar produto';
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateProduct = useCallback(
    async (id: string, updates: Partial<Product>): Promise<Product | null> => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('products')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao atualizar produto';
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteProduct = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao deletar produto';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};
