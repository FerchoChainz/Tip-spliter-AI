import React from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { DayAccordion } from './DayAccordion';
import { dashboardData } from '../data/mockData';
import { useStaff } from '../hooks/useStaff';
import { useDailyLogs } from '../hooks/useDailyLogs';

export interface DailySplitProps {
  readonly onNavigate?: (tab: string) => void;
  readonly currentTab?: string;
}

export const DailySplit: React.FC<DailySplitProps> = ({ onNavigate, currentTab }) => {
  const { staff } = useStaff();
  const { logs, loading, error, saveLog, resetWeek } = useDailyLogs();

  const handleResetWeek = async () => {
    if (window.confirm('Are you sure you want to reset the entire week? This will permanently delete all tip logs and allocations for the current week.')) {
      const { error } = await resetWeek();
      if (error) alert(`Error resetting week: ${error}`);
    }
  };

  // Helper to generate the last 7 days starting from a specific date (or today)
  const generateCurrentWeek = () => {
    const days = [];
    const today = new Date();
    // Move to previous Monday
    const monday = new Date(today);
    monday.setDate(today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1));
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      
      const isoDate = d.toISOString().split('T')[0];
      const existingLog = logs.find(l => l.date === isoDate);
      
      days.push({
        day: d.toLocaleDateString('en-US', { weekday: 'long' }),
        shortDay: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        isoDate,
        status: existingLog?.status || 'Pending',
        totalTips: existingLog?.total_tips || 0,
        staffOnDuty: existingLog?.staff_allocations || []
      });
    }
    return days;
  };

  const weekDays = generateCurrentWeek();

  return (
    <div className="bg-canvas-white text-on-surface font-body-md text-body-md min-h-[884px] flex flex-col pb-24 md:pb-0">
      <Header 
        avatarUrl={dashboardData.user.avatarUrl} 
        onNavigate={onNavigate} 
        currentTab={currentTab} 
      />
      
      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-24 pb-32">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="font-display-xl text-display-xl text-on-surface mb-4">Weekly Gratuity Log</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">Enter daily tips and assign staff to calculate individual shares automatically.</p>
            </div>
            <button 
              onClick={handleResetWeek}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-error/20 text-error hover:bg-error/5 transition-colors font-label-sm text-label-sm"
              title="Clear all logs for the current week"
            >
              <span className="material-symbols-outlined text-[20px]">restart_alt</span>
              Reset Week
            </button>
          </div>

          {loading && logs.length === 0 ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {weekDays.map((day) => (
                <DayAccordion 
                  key={day.isoDate}
                  day={day.day}
                  shortDay={day.shortDay}
                  date={day.date}
                  isoDate={day.isoDate}
                  status={day.status}
                  initialTotalTips={day.totalTips}
                  initialStaffOnDuty={day.staffOnDuty}
                  allStaff={staff}
                  onSave={saveLog}
                />
              ))}
            </div>
          )}

          {error && (
            <div className="mt-8 bg-error-container text-on-error-container p-4 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>
      </main>

      <BottomNav onNavigate={onNavigate} currentTab={currentTab} />
    </div>
  );
};