import React from 'react';

export interface StatsGridProps {
  todayTotal: string;
  todayTarget: string;
  activeStaffCount: number;
  averagePerStaff: string;
  averageDescription: string;
  latestContributionTime: string;
  latestContributionLocation: string;
  latestContributionRef: string;
  latestContributionAmount: string;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  todayTotal,
  todayTarget,
  activeStaffCount,
  averagePerStaff,
  averageDescription,
  latestContributionTime,
  latestContributionLocation,
  latestContributionRef,
  latestContributionAmount
}) => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-gutter auto-rows-[minmax(180px,auto)]">
      {/* Large Card: Today's Intake */}
      <div className="md:col-span-8 bg-pure-surface border border-whisper-border rounded-xl p-6 md:p-8 shadow-[0_-15px_40px_-15px_rgba(0,0,0,0.05)] flex flex-col justify-between group hover:border-primary-container/30 transition-colors">
        <div className="flex justify-between items-start">
          <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center text-primary border border-whisper-border">
            <span className="material-symbols-outlined">today</span>
          </div>
          <button className="text-tertiary hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined">more_horiz</span>
          </button>
        </div>
        <div className="mt-8">
          <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Total Tips Today</p>
          <div className="flex items-end gap-3">
            <span className="font-headline-lg text-headline-lg text-on-surface">{todayTotal}</span>
            <span className="font-mono-data text-mono-data text-tertiary mb-2">/ target {todayTarget}</span>
          </div>
        </div>
      </div>

      {/* Small Card: Staff Active */}
      <div className="md:col-span-4 bg-primary text-on-primary rounded-xl p-6 md:p-8 shadow-[0_-15px_40px_-15px_rgba(0,0,0,0.05)] flex flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="relative z-10 flex justify-between items-start">
          <div className="w-12 h-12 rounded-full bg-on-primary/20 flex items-center justify-center text-on-primary backdrop-blur-sm">
            <span className="material-symbols-outlined">groups</span>
          </div>
        </div>
        <div className="relative z-10 mt-8">
          <p className="font-label-sm text-label-sm text-on-primary/80 mb-1">Active Staff Count</p>
          <div className="flex items-end gap-2">
            <span className="font-headline-lg text-headline-lg text-on-primary">{activeStaffCount}</span>
            <span className="font-body-md text-body-md text-on-primary/80 mb-2">clocked in</span>
          </div>
        </div>
      </div>

      {/* Medium Card: Average Per Staff */}
      <div className="md:col-span-6 bg-pure-surface border border-whisper-border rounded-xl p-6 md:p-8 shadow-[0_-15px_40px_-15px_rgba(0,0,0,0.05)] flex flex-col justify-between">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant border border-whisper-border">
            <span className="material-symbols-outlined text-[20px]">calculate</span>
          </div>
          <p className="font-label-sm text-label-sm text-on-surface-variant">Average Per Staff (Est.)</p>
        </div>
        <div>
          <span className="font-headline-md text-headline-md text-on-surface">{averagePerStaff}</span>
          <p className="font-body-md text-body-md text-tertiary mt-2">{averageDescription}</p>
        </div>
      </div>

      {/* Medium Card: Recent Transaction */}
      <div className="md:col-span-6 bg-pure-surface border border-whisper-border rounded-xl p-6 md:p-8 shadow-[0_-15px_40px_-15px_rgba(0,0,0,0.05)] flex flex-col justify-between">
        <div className="flex justify-between items-center mb-6">
          <p className="font-label-sm text-label-sm text-on-surface-variant">Latest Contribution</p>
          <span className="font-mono-data text-mono-data text-tertiary">{latestContributionTime}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-canvas-white rounded-lg border border-whisper-border flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined">receipt_long</span>
          </div>
          <div className="flex-grow">
            <p className="font-body-md text-body-md text-on-surface font-medium">{latestContributionLocation}</p>
            <p className="font-mono-data text-mono-data text-tertiary mt-1">Ref: {latestContributionRef}</p>
          </div>
          <div className="text-right">
            <span className="font-headline-md text-headline-md text-primary-container">{latestContributionAmount}</span>
          </div>
        </div>
      </div>
    </section>
  );
};