import { useCallback, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Sale, SaleFilters, DailySales, MonthlySales } from '@/types';

export const useSales = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSales = useCallback(
    async (filters?: SaleFilters): Promise<Sale[]> => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase.from('sales').select('*');

        if (filters?.startDate) {
          query = query.gte('sale_date', filters.startDate);
        }

        if (filters?.endDate) {
          query = query.lte('sale_date', filters.endDate);
        }

        if (filters?.customerId) {
          query = query.eq('customer_id', filters.customerId);
        }

        if (filters?.status && filters.status !== 'all') {
          query = query.eq('status', filters.status);
        }

        if (filters?.minAmount !== undefined) {
          query = query.gte('total_amount', filters.minAmount);
        }

        if (filters?.maxAmount !== undefined) {
          query = query.lte('total_amount', filters.maxAmount);
        }

        if (filters?.searchTerm) {
          query = query.or(
            `customer_name.ilike.%${filters.searchTerm}%,id.ilike.%${filters.searchTerm}%`
          );
        }

        query = query.order('sale_date', { ascending: false });

        const { data, error } = await query;
        if (error) throw error;

        return data || [];
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao buscar vendas';
        setError(message);
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createSale = useCallback(
    async (sale: Omit<Sale, 'id' | 'created_at' | 'updated_at'>): Promise<Sale | null> => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('sales')
          .insert([sale])
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao criar venda';
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateSale = useCallback(
    async (id: string, updates: Partial<Sale>): Promise<Sale | null> => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('sales')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao atualizar venda';
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteSale = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.from('sales').delete().eq('id', id);
      if (error) throw error;

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao deletar venda';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const calculateDailySales = useCallback((sales: Sale[]): DailySales[] => {
    const dailyMap = new Map<string, DailySales>();

    sales.forEach((sale) => {
      const key = sale.sale_date;
      const existing = dailyMap.get(key);

      if (existing) {
        existing.sales += 1;
        existing.revenue += sale.total_amount;
        existing.ordersCount += 1;
      } else {
        dailyMap.set(key, {
          date: key,
          day: sale.day,
          month: sale.month,
          year: sale.year,
          sales: 1,
          revenue: sale.total_amount,
          ordersCount: 1,
        });
      }
    });

    return Array.from(dailyMap.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, []);

  const calculateMonthlySales = useCallback((sales: Sale[]): MonthlySales[] => {
    const monthlyMap = new Map<string, MonthlySales>();

    sales.forEach((sale) => {
      const key = `${sale.year}-${String(sale.month).padStart(2, '0')}`;
      const existing = monthlyMap.get(key);

      if (existing) {
        existing.revenue += sale.total_amount;
        existing.ordersCount += 1;
      } else {
        monthlyMap.set(key, {
          month: sale.month,
          year: sale.year,
          revenue: sale.total_amount,
          ordersCount: 1,
        });
      }
    });

    return Array.from(monthlyMap.values()).sort(
      (a, b) => a.year - b.year || a.month - b.month
    );
  }, []);

  return {
    loading,
    error,
    fetchSales,
    createSale,
    updateSale,
    deleteSale,
    calculateDailySales,
    calculateMonthlySales,
  };
};
