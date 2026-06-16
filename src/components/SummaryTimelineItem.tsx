import React from 'react';

export interface SummaryTimelineItemProps {
  readonly day: string;
  readonly date: string;
  readonly totalTips: string;
  readonly splits: Array<{ label: string; amount: string }>;
  readonly status?: 'Pending' | 'Completed' | 'Finalized';
}

export const SummaryTimelineItem: React.FC<SummaryTimelineItemProps> = ({
  day,
  date,
  totalTips,
  splits,
  status = 'Completed'
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'Finalized': return 'bg-primary/10 text-primary border-primary/20';
      case 'Completed': return 'bg-surface-container-high text-on-surface-variant border-whisper-border';
      default: return 'bg-surface-container text-secondary border-whisper-border';
    }
  };

  return (
    <article className="flex flex-col md:flex-row gap-6 md:gap-12 relative group">
      {/* Date Node */}
      <div className="flex items-center gap-4 md:w-32 shrink-0 md:justify-end z-10 bg-background md:bg-transparent py-2 md:py-0">
        <div className="font-mono-data text-mono-data text-on-surface-variant md:text-right">
          <div>{day}</div>
          <div className="mt-1">{date}</div>
        </div>
        <div className={`w-2.5 h-2.5 rounded-full border-2 border-surface shrink-0 hidden md:block transition-colors duration-300 ${status === 'Finalized' ? 'bg-primary' : 'bg-surface-container-high'}`}></div>
      </div>
      
      {/* Data Card */}
      <div className="flex-grow bg-pure-surface border border-whisper-border rounded-xl p-6 md:p-8 hover:-translate-y-1 transition-transform duration-300 shadow-[0_-15px_40px_-15px_rgba(0,0,0,0.02)] relative overflow-hidden">
        {status === 'Finalized' && (
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-2xl"></div>
        )}
        
        <div className="flex justify-between items-start mb-6 pb-6 border-b border-whisper-border">
          <div className="flex flex-col gap-1">
            <div className="font-body-md text-body-md text-on-surface-variant">Total Tips</div>
            <div className="font-mono-data text-headline-md text-on-surface">{totalTips}</div>
          </div>
          <span className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest ${getStatusColor()}`}>
            {status}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {splits.map((split, index) => (
            <div key={index} className="flex flex-col gap-1">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{split.label}</span>
              <span className={`font-mono-data text-mono-data ${index === 0 ? 'text-primary' : 'text-on-surface'}`}>{split.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
};