import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export const useDashboardStats = () => {
  const [stats, setStats] = useState({
    weeklyTotal: '$0.00',
    todayTotal: '$0.00',
    activeStaffCount: 0,
    averagePerStaff: '$0.00',
    latestContribution: {
      time: 'No data',
      amount: '$0.00',
      location: 'N/A'
    },
    loading: true,
    error: null as string | null
  });

  const fetchStats = async () => {
    try {
      // 1. Fetch Staff Count
      const { count: staffCount, error: staffError } = await supabase
        .from('staff')
        .select('*', { count: 'exact', head: true });

      if (staffError) throw staffError;

      // 2. Fetch Weekly Total (Sum of all logs)
      const { data: logsData, error: logsError } = await supabase
        .from('daily_logs')
        .select('total_tips, date, created_at')
        .order('date', { ascending: false });

      if (logsError) throw logsError;

      const weeklySum = (logsData || []).reduce((sum, log) => sum + Number(log.total_tips), 0);
      
      // 3. Find Today's Total
      const todayIso = new Date().toISOString().split('T')[0];
      const todayLog = (logsData || []).find(l => l.date === todayIso);
      const todaySum = todayLog ? Number(todayLog.total_tips) : 0;

      // 4. Calculate Average
      const average = staffCount && staffCount > 0 ? (weeklySum / staffCount) : 0;

      // 5. Latest Contribution (Most recently created log)
      const latest = (logsData || []).sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0];

      setStats({
        weeklyTotal: `$${weeklySum.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        todayTotal: `$${todaySum.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        activeStaffCount: staffCount || 0,
        averagePerStaff: `$${average.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        latestContribution: {
          time: latest ? new Date(latest.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : 'No data',
          amount: latest ? `+$${Number(latest.total_tips).toFixed(2)}` : '$0.00',
          location: latest ? `Log for ${latest.date}` : 'N/A'
        },
        loading: false,
        error: null
      });

    } catch (err: any) {
      setStats(prev => ({ ...prev, error: err.message, loading: false }));
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { ...stats, refresh: fetchStats };
};
