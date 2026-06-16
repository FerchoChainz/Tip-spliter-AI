import React from 'react';
import { supabase } from '../lib/supabase';

export interface HeaderProps {
  readonly avatarUrl: string;
  readonly title?: string;
  readonly currentTab?: string;
  readonly onNavigate?: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  avatarUrl, 
  title = "Tip Spliter",
  currentTab = 'home',
  onNavigate
}) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="bg-background/80 dark:bg-background/80 backdrop-blur-md w-full top-0 sticky border-b border-whisper-border z-40">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleLogout}
            className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden shrink-0 border border-whisper-border group relative"
            title="Sign Out"
          >
            <img 
              alt="Profile" 
              className="w-full h-full object-cover grayscale group-hover:opacity-20 transition-all duration-300" 
              src={avatarUrl}
            />
            <span className="material-symbols-outlined absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-on-surface transition-opacity text-[20px]">logout</span>
          </button>
          <h1 className="font-headline-md text-headline-md text-on-surface dark:text-inverse-on-surface tracking-tight hidden sm:block">
            {title}
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {[
            { id: 'home', label: 'Home', icon: 'home' },
            { id: 'summary', label: 'Summary', icon: 'analytics' },
            { id: 'staff', label: 'Staff', icon: 'group' },
            { id: 'split', label: 'Daily Split', icon: 'edit_calendar' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => onNavigate?.(tab.id)}
              className={`font-label-sm text-label-sm hover:opacity-80 transition-opacity flex items-center gap-2 relative ${
                currentTab === tab.id ? 'text-primary' : 'text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[1.25rem]">{tab.icon}</span>
              {tab.label}
              {currentTab === tab.id && (
                <div className="absolute -bottom-2 left-0 w-full h-[2px] bg-primary rounded-full"></div>
              )}
            </button>
          ))}
        </nav>

        <button className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant dark:text-outline hover:opacity-80 transition-opacity hover:scale-95 duration-100 bg-surface-container-low border border-whisper-border">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>notifications</span>
        </button>
      </div>
    </header>
  );
};