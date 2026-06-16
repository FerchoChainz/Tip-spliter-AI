import React from 'react';
import { Header } from './Header';
import { HeroSection } from './HeroSection';
import { StatsGrid } from './StatsGrid';
import { BottomNav } from './BottomNav';
import { dashboardData } from '../data/mockData';
import { useDashboardStats } from '../hooks/useDashboardStats';

export interface DashboardProps {
  readonly onNavigate?: (tab: string) => void;
  readonly currentTab?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, currentTab }) => {
  const { 
    weeklyTotal, 
    todayTotal, 
    activeStaffCount, 
    averagePerStaff, 
    latestContribution, 
    loading, 
    error 
  } = useDashboardStats();

  return (
    <div className="bg-background text-on-surface font-body-md text-body-md min-h-[884px] flex flex-col pb-24 md:pb-0">
      <Header 
        avatarUrl={dashboardData.user.avatarUrl} 
        onNavigate={onNavigate} 
        currentTab={currentTab} 
      />
      
      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-8 md:pt-12 pb-12">
        {loading ? (
          <div className="flex justify-center py-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-error-container text-on-error-container p-6 rounded-xl border border-error/20">
            {error}
          </div>
        ) : (
          <>
            <HeroSection 
              total={weeklyTotal} 
              increase="+0.0%" // Could be calculated comparing to last week
              description="Current accumulation based on live database entries. Distribution is pending manager approval." 
            />
            <StatsGrid 
              todayTotal={todayTotal}
              todayTarget="$1k" // Placeholder target
              activeStaffCount={activeStaffCount}
              averagePerStaff={averagePerStaff}
              averageDescription="Based on total pool and all registered staff."
              latestContributionTime={latestContribution.time}
              latestContributionLocation={latestContribution.location}
              latestContributionRef="Live Sync"
              latestContributionAmount={latestContribution.amount}
            />
          </>
        )}
      </main>

      <BottomNav onNavigate={onNavigate} currentTab={currentTab} />
    </div>
  );
};