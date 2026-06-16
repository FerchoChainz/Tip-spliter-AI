import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface Staff {
  id: string;
  name: string;
  role: string;
  avatar_url: string | null;
  is_featured: boolean;
  // Dynamic fields
  weekTotal?: string;
  weekTotalNumeric?: number;
  attendance?: Array<{ date: string; amount: number; weight: number }>;
}

export const useStaff = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch all staff members
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('*')
        .order('name', { ascending: true });

      if (staffError) throw staffError;

      // 2. Fetch all tip allocations with their associated log dates
      const { data: tipsData, error: tipsError } = await supabase
        .from('tip_allocations')
        .select(`
          staff_id, 
          amount, 
          weight,
          daily_logs (
            date
          )
        `);

      if (tipsError) throw tipsError;

      // 3. Aggregate tips and attendance by staff_id, then by date
      const statsByStaff = (tipsData || []).reduce((acc: Record<string, { total: number; historyByDate: Record<string, any> }>, curr: any) => {
        if (!acc[curr.staff_id]) acc[curr.staff_id] = { total: 0, historyByDate: {} };
        
        const amount = Number(curr.amount) || 0;
        acc[curr.staff_id].total += amount;
        
        if (curr.daily_logs && curr.daily_logs.date) {
          const date = curr.daily_logs.date;
          // Group by date to avoid "extra day" duplicates
          if (!acc[curr.staff_id].historyByDate[date]) {
            acc[curr.staff_id].historyByDate[date] = { date, amount: 0, weight: 0 };
          }
          acc[curr.staff_id].historyByDate[date].amount += amount;
          acc[curr.staff_id].historyByDate[date].weight = curr.weight || 1.0;
        }
        
        return acc;
      }, {});

      // 4. Map staff with their aggregated data
      const mappedStaff = (staffData || []).map((s: any) => {
        const stats = statsByStaff[s.id] || { total: 0, historyByDate: {} };
        
        // Convert the date map to a sorted array
        const sortedHistory = Object.values(stats.historyByDate).sort((a: any, b: any) => b.date.localeCompare(a.date));

        return {
          ...s,
          weekTotal: `$${stats.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
          weekTotalNumeric: stats.total,
          attendance: sortedHistory as any[]
        };
      });

      setStaff(mappedStaff);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addStaff = async (newStaff: Omit<Staff, 'id' | 'weekTotal' | 'weekTotalNumeric' | 'attendance'>) => {
    try {
      const { data, error } = await supabase
        .from('staff')
        .insert([newStaff])
        .select();

      if (error) throw error;
      
      await fetchStaff();
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err.message };
    }
  };

  const updateStaff = async (id: string, updates: Partial<Omit<Staff, 'id' | 'weekTotal' | 'weekTotalNumeric' | 'attendance'>>) => {
    try {
      const { data, error } = await supabase
        .from('staff')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;
      
      await fetchStaff();
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err.message };
    }
  };

  const deleteStaff = async (id: string) => {
    try {
      const { error } = await supabase
        .from('staff')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchStaff();
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  return { staff, loading, error, refresh: fetchStaff, addStaff, updateStaff, deleteStaff };
};
