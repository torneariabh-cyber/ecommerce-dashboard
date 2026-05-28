import { useCallback, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Customer, CustomerFilters } from '@/types';

export const useCustomers = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = useCallback(
    async (filters?: CustomerFilters): Promise<Customer[]> => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase.from('customers').select('*');

        if (filters?.searchTerm) {
          query = query.or(
            `name.ilike.%${filters.searchTerm}%,email.ilike.%${filters.searchTerm}%`
          );
        }

        const sortBy = filters?.sortBy || 'created_at';
        const sortOrder = filters?.sortOrder || 'desc';
        query = query.order(sortBy, { ascending: sortOrder === 'asc' });

        const { data, error } = await query;
        if (error) throw error;

        return data || [];
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao buscar clientes';
        setError(message);
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createCustomer = useCallback(
    async (customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>): Promise<Customer | null> => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('customers')
          .insert([customer])
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao criar cliente';
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateCustomer = useCallback(
    async (id: string, updates: Partial<Customer>): Promise<Customer | null> => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('customers')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao atualizar cliente';
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteCustomer = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.from('customers').delete().eq('id', id);
      if (error) throw error;

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao deletar cliente';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  };
};
