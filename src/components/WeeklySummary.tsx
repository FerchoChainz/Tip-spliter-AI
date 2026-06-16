import React, { useState, useMemo } from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { SummaryTimelineItem } from './SummaryTimelineItem';
import { dashboardData } from '../data/mockData';
import { useDailyLogs } from '../hooks/useDailyLogs';

export interface WeeklySummaryProps {
  readonly onNavigate?: (tab: string) => void;
  readonly currentTab?: string;
}

export const WeeklySummary: React.FC<WeeklySummaryProps> = ({ onNavigate, currentTab }) => {
  const { logs, loading, error, finalizeWeek } = useDailyLogs();
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Helper to get day name and formatted date from ISO string
  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString + 'T00:00:00'); 
      if (isNaN(d.getTime())) throw new Error('Invalid Date');
      return {
        day: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
        formatted: d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' })
      };
    } catch {
      return { day: '???', formatted: '00/00' };
    }
  };

  // Filter and deduplicate logs for the current week only
  const currentWeekLogs = useMemo(() => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1));
    monday.setHours(0, 0, 0, 0);

    // Use a map to keep only one log per date (preferring 'Finalized' over 'Completed')
    const logMap: Record<string, any> = {};
    
    logs.forEach(log => {
      const logDate = new Date(log.date + 'T00:00:00');
      if (logDate >= monday) {
        const existing = logMap[log.date];
        if (!existing || log.status === 'Finalized') {
          logMap[log.date] = log;
        }
      }
    });

    return Object.values(logMap).sort((a, b) => b.date.localeCompare(a.date));
  }, [logs]);

  // Map filtered logs to summary items
  const summaryItems = currentWeekLogs.map(log => {
    const { day, formatted } = formatDate(log.date);
    const amount = Number(log.total_tips) || 0;
    
    // Business Rule placeholder: 20% to Bar, 80% to Floor
    const barAmount = (amount * 0.20).toFixed(2);
    const floorAmount = (amount * 0.80).toFixed(2);

    return {
      day,
      date: formatted,
      totalTips: `$${amount.toFixed(2)}`,
      status: log.status,
      splits: [
        { label: 'Bar (20%)', amount: `$${barAmount}` },
        { label: 'Floor (80%)', amount: `$${floorAmount}` }
      ]
    };
  });

  const weekTotal = currentWeekLogs.reduce((sum, log) => sum + (Number(log.total_tips) || 0), 0).toFixed(2);
  const hasCompletableLogs = currentWeekLogs.some(log => log.status === 'Completed');

  const handleFinalize = async () => {
    if (!window.confirm('Are you sure you want to finalize this week? This will lock all current logs.')) {
      return;
    }

    setIsFinalizing(true);
    const { error } = await finalizeWeek();
    setIsFinalizing(false);

    if (error) {
      alert(`Error finalizing week: ${error}`);
    } else {
      setSuccessMessage('Week finalized successfully!');
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  };

  return (
    <div className="bg-background text-on-background antialiased min-h-[884px] flex flex-col font-body-md pb-24 md:pb-0">
      <Header 
        avatarUrl={dashboardData.user.avatarUrl} 
        onNavigate={onNavigate} 
        currentTab={currentTab} 
      />
      
      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 flex flex-col gap-12">
        {/* Header Section */}
        <section className="flex flex-col gap-4 max-w-3xl">
          <h2 className="font-display-xl text-display-xl text-on-surface">Weekly Summary</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Review collected gratuities and finalized split distributions. 
            Current week total: <span className="font-mono-data text-on-surface font-bold">${weekTotal}</span>
          </p>
        </section>

        {/* Loading / Error / Empty States */}
        {(loading && !isFinalizing) && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}

        {error && (
          <div className="bg-error-container text-on-error-container p-6 rounded-xl border border-error/20">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-primary/10 text-primary p-4 rounded-xl border border-primary/20 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <span className="material-symbols-outlined">check_circle</span>
            {successMessage}
          </div>
        )}

        {!loading && !error && summaryItems.length === 0 && (
          <div className="py-20 text-center text-secondary border-2 border-dashed border-whisper-border rounded-xl">
            No tip logs found for this week. Start by adding entries in the Split tab.
          </div>
        )}

        {/* Vertical Timeline List */}
        {!loading && !error && summaryItems.length > 0 && (
          <section className="relative flex flex-col gap-8 w-full max-w-4xl mx-auto">
            {/* Timeline Line */}
            <div className="absolute left-[19px] top-4 bottom-4 w-px bg-whisper-border hidden md:block"></div>
            
            {summaryItems.map((item, index) => (
              <SummaryTimelineItem 
                key={index}
                day={item.day}
                date={item.date}
                totalTips={item.totalTips}
                splits={item.splits}
                status={item.status}
              />
            ))}
          </section>
        )}

        {/* CTA Section */}
        {!loading && summaryItems.length > 0 && (
          <section className="flex justify-center md:justify-end w-full max-w-4xl mx-auto mt-8">
            <button 
              disabled={isFinalizing || !hasCompletableLogs}
              onClick={handleFinalize}
              className={`font-body-md px-8 py-4 rounded-xl shadow-[0_-15px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-200 w-full md:w-auto flex items-center justify-center gap-2 ${
                hasCompletableLogs 
                  ? 'bg-primary text-on-primary hover:bg-surface-tint active:scale-95' 
                  : 'bg-surface-container-high text-on-surface-variant cursor-not-allowed'
              }`}
            >
              {isFinalizing ? (
                <>
                  <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></div>
                  Finalizing...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">task_alt</span>
                  {hasCompletableLogs ? 'Finalize Week' : 'Week Finalized'}
                </>
              )}
            </button>
          </section>
        )}
      </main>

      <BottomNav onNavigate={onNavigate} currentTab={currentTab} />
    </div>
  );
};