import React from 'react';

export interface HeroSectionProps {
  total: string;
  increase: string;
  description: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ total, increase, description }) => {
  return (
    <section className="mb-12 md:mb-16">
      <div className="flex flex-col gap-2">
        <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Weekly Gratuity Pool</p>
        <div className="flex items-baseline gap-4">
          <h2 className="font-display-xl text-display-xl text-on-surface">{total}</h2>
          <span className="font-label-sm text-label-sm text-primary-container bg-primary-container/10 px-2 py-1 rounded-DEFAULT border border-primary-container/20 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">trending_up</span>
            {increase}
          </span>
        </div>
        <p className="font-body-md text-body-md text-tertiary max-w-xl mt-4">
          {description}
        </p>
      </div>
    </section>
  );
};