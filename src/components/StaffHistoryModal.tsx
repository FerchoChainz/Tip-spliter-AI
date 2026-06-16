import React from 'react';
import type { Staff } from '../hooks/useStaff';

export interface StaffHistoryModalProps {
  readonly staff: Staff;
  readonly onClose: () => void;
}

export const StaffHistoryModal: React.FC<StaffHistoryModalProps> = ({ staff, onClose }) => {
  return (
    <div className="fixed inset-0 bg-on-surface/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-pure-surface w-full max-w-lg rounded-2xl shadow-2xl border border-whisper-border overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden border border-whisper-border bg-surface-container">
                {staff.avatar_url ? (
                  <img alt={staff.name} className="w-full h-full object-cover" src={staff.avatar_url} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-tertiary text-2xl">person</span>
                  </div>
                )}
              </div>
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface">{staff.name}</h2>
                <p className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">{staff.role}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface p-1">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-surface-container-low rounded-xl p-4 border border-whisper-border">
              <p className="font-label-sm text-[10px] text-tertiary uppercase tracking-widest mb-1">Total Earned</p>
              <p className="font-mono-data text-xl text-primary font-bold">{staff.weekTotal}</p>
            </div>
            <div className="bg-surface-container-low rounded-xl p-4 border border-whisper-border">
              <p className="font-label-sm text-[10px] text-tertiary uppercase tracking-widest mb-1">Days Worked</p>
              <p className="font-mono-data text-xl text-on-surface font-bold">{staff.attendance?.length || 0}</p>
            </div>
          </div>

          {/* Attendance List */}
          <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-4 px-1">Attendance History</h3>
          <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {staff.attendance && staff.attendance.length > 0 ? (
              <div className="flex flex-col gap-2">
                {staff.attendance.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-pure-surface border border-whisper-border rounded-xl hover:border-primary/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold ${entry.weight === 1.0 ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>
                        {entry.weight === 1.0 ? 'FULL' : 'HALF'}
                      </div>
                      <span className="font-body-md text-on-surface">
                        {new Date(entry.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' })}
                      </span>
                    </div>
                    <span className="font-mono-data text-on-surface font-medium">${entry.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-secondary border-2 border-dashed border-whisper-border rounded-xl">
                No history recorded yet.
              </div>
            )}
          </div>

          <button 
            onClick={onClose}
            className="w-full mt-8 bg-surface-container-high text-on-surface font-label-sm text-label-sm py-4 rounded-xl hover:bg-surface-container-highest transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
