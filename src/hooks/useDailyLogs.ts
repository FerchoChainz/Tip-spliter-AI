import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface DailyLog {
  id: string;
  date: string;
  total_tips: number;
  status: 'Pending' | 'Completed' | 'Finalized';
  staff_allocations?: Array<{ staff_id: string; weight: number }>; // Updated to include weight
}

export const useDailyLogs = () => {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      
      // Fetch logs
      const { data: logsData, error: logsError } = await supabase
        .from('daily_logs')
        .select('*')
        .order('date', { ascending: false });

      if (logsError) throw logsError;

      // Fetch allocations for these logs
      const logIds = (logsData || []).map(l => l.id);
      const { data: allocData, error: allocError } = await supabase
        .from('tip_allocations')
        .select('log_id, staff_id, weight')
        .in('log_id', logIds);

      if (allocError) throw allocError;

      // Group allocations by log_id
      const allocationsByLog = (allocData || []).reduce((acc: any, curr) => {
        if (!acc[curr.log_id]) acc[curr.log_id] = [];
        acc[curr.log_id].push({ staff_id: curr.staff_id, weight: curr.weight || 1.0 });
        return acc;
      }, {});

      const mappedLogs = (logsData || []).map(log => ({
        ...log,
        staff_allocations: allocationsByLog[log.id] || []
      }));

      setLogs(mappedLogs);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveLog = async (date: string, totalTips: number, staffWithWeights: Array<{ id: string; weight: number }>) => {
    try {
      // 1. Upsert daily log
      const { data: logData, error: logError } = await supabase
        .from('daily_logs')
        .upsert({ 
          date, 
          total_tips: totalTips, 
          status: 'Completed' 
        }, { onConflict: 'date' })
        .select()
        .single();

      if (logError) throw logError;

      // 2. Delete existing allocations for this log
      const { error: deleteError } = await supabase
        .from('tip_allocations')
        .delete()
        .eq('log_id', logData.id);

      if (deleteError) throw deleteError;

      // 3. Calculate weighted distribution
      // Total Weight = Sum of all weights
      // Share per weight = Total Tips / Total Weight
      // Staff share = Share per weight * Staff weight
      
      if (staffWithWeights.length > 0) {
        const totalWeight = staffWithWeights.reduce((sum, s) => sum + s.weight, 0);
        const sharePerWeight = totalTips / totalWeight;

        const allocations = staffWithWeights.map(s => ({
          log_id: logData.id,
          staff_id: s.id,
          weight: s.weight,
          amount: sharePerWeight * s.weight
        }));

        const { error: insertError } = await supabase
          .from('tip_allocations')
          .insert(allocations);

        if (insertError) throw insertError;
      }

      await fetchLogs();
      return { data: logData, error: null };
    } catch (err: any) {
      return { data: null, error: err.message };
    }
  };

  const finalizeWeek = async () => {
    try {
      setLoading(true);
      // Update all 'Completed' logs to 'Finalized'
      const { error: updateError } = await supabase
        .from('daily_logs')
        .update({ status: 'Finalized' })
        .eq('status', 'Completed');

      if (updateError) throw updateError;

      await fetchLogs();
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const resetWeek = async () => {
    try {
      setLoading(true);
      
      const { error: allocError } = await supabase
        .from('tip_allocations')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); 

      if (allocError) throw allocError;

      const { error: logsError } = await supabase
        .from('daily_logs')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); 

      if (logsError) throw logsError;

      await fetchLogs();
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return { logs, loading, error, refresh: fetchLogs, saveLog, finalizeWeek, resetWeek };
};
