import React, { useState, useEffect } from 'react';

export interface DayAccordionProps {
  readonly day: string;
  readonly shortDay: string;
  readonly date: string;
  readonly isoDate: string; // YYYY-MM-DD
  readonly status: string;
  readonly initialTotalTips: number;
  readonly initialStaffOnDuty: Array<{ staff_id: string; weight: number }> | string[];
  readonly allStaff: Array<{ id: string; name: string; role: string }>;
  readonly onSave: (date: string, totalTips: number, staffWithWeights: Array<{ id: string; weight: number }>) => Promise<any>;
}

export const DayAccordion: React.FC<DayAccordionProps> = ({
  day,
  shortDay,
  date,
  isoDate,
  status: initialStatus,
  initialTotalTips,
  initialStaffOnDuty,
  allStaff,
  onSave,
}) => {
  const [isExpanded, setIsExpanded] = useState(initialStatus === 'Completed');
  const [totalTips, setTotalTips] = useState(initialTotalTips);
  
  // Normalize initialStaffOnDuty to Array<{id, weight}>
  const normalizeInitialStaff = (): Array<{ id: string; weight: number }> => {
    if (!initialStaffOnDuty || initialStaffOnDuty.length === 0) return [];
    if (typeof initialStaffOnDuty[0] === 'string') {
      return (initialStaffOnDuty as string[]).map(id => ({ id, weight: 1.0 }));
    }
    return (initialStaffOnDuty as any[]).map(s => ({ id: s.staff_id || s.id, weight: s.weight || 1.0 }));
  };

  const [selectedStaff, setSelectedStaff] = useState<Array<{ id: string; weight: number }>>(normalizeInitialStaff());
  const [isSaving, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(initialStatus);
  const [error, setError] = useState<string | null>(null);

  // Sync state if props change
  useEffect(() => {
    setTotalTips(initialTotalTips);
    setSelectedStaff(normalizeInitialStaff());
    setStatus(initialStatus);
  }, [initialTotalTips, initialStaffOnDuty, initialStatus]);

  const toggleStaff = (id: string) => {
    setSelectedStaff(prev => {
      const exists = prev.find(s => s.id === id);
      if (exists) return prev.filter(s => s.id !== id);
      return [...prev, { id, weight: 1.0 }];
    });
  };

  const updateWeight = (id: string, weight: number) => {
    setSelectedStaff(prev => prev.map(s => s.id === id ? { ...s, weight } : s));
  };

  const handleSave = async () => {
    setError(null);

    if (totalTips < 0) {
      setError('Total tips cannot be negative.');
      return;
    }

    if (selectedStaff.length === 0 && totalTips > 0) {
      setError('Please select at least one staff member.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await onSave(isoDate, totalTips, selectedStaff);
      if (result.error) throw new Error(result.error);
    } catch (err: any) {
      setError(err.message || 'Failed to save log.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Weighted Calculation
  const totalWeights = selectedStaff.reduce((sum, s) => sum + s.weight, 0);
  const fullShare = totalWeights > 0 ? (totalTips / totalWeights) : 0;
  const halfShare = fullShare * 0.5;

  return (
    <div className="bg-pure-surface rounded-xl border border-whisper-border shadow-[0_4px_20px_-10px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300">
      <button 
        aria-expanded={isExpanded}
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 md:p-8 hover:bg-surface-container-lowest transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={`h-12 w-12 rounded-lg ${isExpanded ? 'bg-surface-container-low text-primary' : 'bg-surface-container-low text-on-surface'} flex items-center justify-center font-headline-md text-headline-md`}>
            {shortDay}
          </div>
          <div className="text-left">
            <h3 className="font-headline-md text-headline-md text-on-surface">{day}</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">{date}</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right hidden md:block">
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Status</p>
            <p className={`font-body-md text-body-md ${status === 'Completed' ? 'text-primary' : 'text-on-surface-variant'} font-medium flex items-center gap-1`}>
              {status === 'Completed' && <span className="material-symbols-outlined text-sm">check_circle</span>}
              {status}
            </p>
          </div>
          <span className={`material-symbols-outlined text-on-surface-variant transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
            expand_more
          </span>
        </div>
      </button>

      <div className={`transition-all duration-300 ease-out overflow-hidden ${isExpanded ? 'max-h-[3000px] border-t border-whisper-border bg-canvas-white/30' : 'max-h-0'}`}>
        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          {/* Left Col: Tip Entry */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {error && (
              <div className="bg-error-container text-on-error-container p-4 rounded-lg text-sm flex items-center gap-2 border border-error/10">
                <span className="material-symbols-outlined text-[18px]">error</span>
                {error}
              </div>
            )}
            
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Total Tips Collected</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-headline-md text-headline-md text-on-surface-variant">$</span>
                <input 
                  className="w-full bg-pure-surface border border-whisper-border rounded-lg py-4 pl-10 pr-4 font-headline-md text-headline-md text-on-surface focus:ring-2 focus:ring-primary focus:border-primary transition-shadow placeholder:text-surface-variant outline-none" 
                  placeholder="0.00" 
                  type="number" 
                  min="0"
                  step="0.01"
                  value={totalTips === 0 ? '' : totalTips}
                  onChange={(e) => setTotalTips(Number(e.target.value))}
                />
              </div>
            </div>
            
            <div className="bg-surface-container-low rounded-lg p-6 mt-auto">
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Live Calculation (Weighted)</p>
              <div className="flex justify-between items-end mb-4 border-b border-whisper-border pb-4">
                <span className="font-body-lg text-body-lg text-on-surface">Total Weights</span>
                <span className="font-headline-md text-headline-md text-on-surface">{totalWeights}</span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">Full Shift (1.0):</span>
                  <span className="font-mono-data font-bold text-primary">${fullShare.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">Half Shift (0.5):</span>
                  <span className="font-mono-data font-bold text-primary">${halfShare.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <button 
              disabled={isSaving}
              onClick={handleSave}
              className="w-full bg-primary text-on-primary py-4 px-6 rounded-lg font-body-lg text-body-lg hover:opacity-90 active:scale-[0.98] transition-all shadow-sm flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></div>
              ) : (
                `Save ${day} Log`
              )}
            </button>
          </div>

          {/* Right Col: Staff Selection */}
          <div className="lg:col-span-7">
            <div className="flex justify-between items-center mb-4">
              <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Staff on Duty & Shifts</label>
              <button 
                className="font-label-sm text-label-sm text-primary hover:underline"
                onClick={() => setSelectedStaff(selectedStaff.length === allStaff.length ? [] : allStaff.map(s => ({ id: s.id, weight: 1.0 })))}
              >
                {selectedStaff.length === allStaff.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {allStaff.map((staff) => {
                const selection = selectedStaff.find(s => s.id === staff.id);
                const isSelected = !!selection;
                
                return (
                  <div key={staff.id} className={`bg-pure-surface border rounded-xl p-4 transition-all ${isSelected ? 'border-primary bg-surface-container-low shadow-sm' : 'border-whisper-border hover:border-outline-variant'}`}>
                    <div className="flex items-center gap-4">
                      <div className="relative cursor-pointer flex items-center gap-4 flex-1" onClick={() => toggleStaff(staff.id)}>
                        <div className="h-10 w-10 rounded-full bg-surface-container flex items-center justify-center overflow-hidden shrink-0">
                          <span className="material-symbols-outlined text-on-surface-variant">person</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-body-md text-body-md font-medium text-on-surface">{staff.name}</p>
                          <p className="font-label-sm text-label-sm text-on-surface-variant">{staff.role}</p>
                        </div>
                        <span className={`material-symbols-outlined transition-colors shrink-0 ${isSelected ? 'text-primary' : 'text-surface-variant'}`}>
                          {isSelected ? 'check_circle' : 'radio_button_unchecked'}
                        </span>
                      </div>
                      
                      {isSelected && (
                        <div className="flex items-center bg-pure-surface border border-whisper-border rounded-lg p-1 gap-1">
                          <button 
                            onClick={() => updateWeight(staff.id, 1.0)}
                            className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${selection.weight === 1.0 ? 'bg-primary text-on-primary' : 'text-secondary hover:bg-surface-container'}`}
                          >
                            Full
                          </button>
                          <button 
                            onClick={() => updateWeight(staff.id, 0.5)}
                            className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${selection.weight === 0.5 ? 'bg-primary text-on-primary' : 'text-secondary hover:bg-surface-container'}`}
                          >
                            Half
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};