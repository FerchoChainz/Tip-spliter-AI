import React from 'react';

export interface BottomNavProps {
  readonly currentTab?: string;
  readonly onNavigate?: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ 
  currentTab = 'home',
  onNavigate 
}) => {
  return (
    <nav className="md:hidden bg-pure-surface dark:bg-inverse-surface fixed bottom-0 w-full z-50 rounded-t-xl border-t border-whisper-border shadow-[0_-15px_40px_-15px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center w-full px-4 pb-6 pt-3">
        {[
          { id: 'home', label: 'Home', icon: 'home' },
          { id: 'summary', label: 'Summary', icon: 'analytics' },
          { id: 'staff', label: 'Staff', icon: 'group' },
          { id: 'split', label: 'Split', icon: 'edit_calendar' },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => onNavigate?.(tab.id)}
            className={`flex flex-col items-center justify-center transition-all duration-200 ${
              currentTab === tab.id 
                ? 'text-primary dark:text-primary-fixed-dim bg-secondary-fixed/50 dark:bg-secondary-fixed-dim/10 rounded-xl px-4 py-1 scale-90' 
                : 'text-on-secondary-container dark:text-on-secondary-fixed-variant hover:text-primary'
            }`}
          >
            <span 
              className="material-symbols-outlined mb-1" 
              style={{ fontVariationSettings: `'FILL' ${currentTab === tab.id ? 1 : 0}` }}
            >
              {tab.icon}
            </span>
            <span className="font-label-sm text-label-sm text-[10px]">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};