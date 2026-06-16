import React, { useState, useEffect } from 'react';
import type { Staff } from '../hooks/useStaff';

export interface StaffFormProps {
  readonly initialData?: Staff | null;
  readonly onSubmit: (data: { name: string; role: string; avatar_url: string | null; is_featured: boolean }) => Promise<void>;
  readonly onCancel: () => void;
}

export const StaffForm: React.FC<StaffFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [role, setRole] = useState(initialData?.role || '');
  const [avatarUrl, setAvatarUrl] = useState(initialData?.avatar_url || '');
  const [isFeatured, setIsFeatured] = useState(initialData?.is_featured || false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setRole(initialData.role);
      setAvatarUrl(initialData.avatar_url || '');
      setIsFeatured(initialData.is_featured);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    const trimmedName = name.trim();
    const trimmedRole = role.trim();

    if (trimmedName.length < 2) {
      setError('Name must be at least 2 characters long.');
      return;
    }

    if (avatarUrl.trim() && !avatarUrl.trim().startsWith('http')) {
      setError('Avatar URL must be a valid link starting with http or https.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        name: trimmedName,
        role: trimmedRole,
        avatar_url: avatarUrl.trim() || null,
        is_featured: isFeatured,
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-on-surface/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-pure-surface w-full max-w-md rounded-2xl shadow-2xl border border-whisper-border overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-headline-md text-headline-md text-on-surface">
              {initialData ? 'Edit Staff Member' : 'Add Staff Member'}
            </h2>
            <button onClick={onCancel} className="text-on-surface-variant hover:text-on-surface">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {error && (
            <div className="bg-error-container text-on-error-container p-4 rounded-lg text-sm mb-6 flex items-center gap-2 border border-error/10">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Full Name</label>
              <input 
                required
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full bg-surface-container-lowest border border-whisper-border rounded-lg py-3 px-4 font-body-md text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              />
            </div>

            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Role / Position</label>
              <input 
                required
                type="text" 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Lead Server"
                className="w-full bg-surface-container-lowest border border-whisper-border rounded-lg py-3 px-4 font-body-md text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              />
            </div>

            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Avatar URL (Optional)</label>
              <input 
                type="url" 
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-surface-container-lowest border border-whisper-border rounded-lg py-3 px-4 font-body-md text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-5 h-5 rounded border-whisper-border text-primary focus:ring-primary transition-all"
              />
              <span className="font-body-md text-on-surface">Mark as Featured / Top Earner</span>
            </label>

            <div className="flex gap-3 mt-4">
              <button 
                type="button"
                onClick={onCancel}
                className="flex-1 px-6 py-3 rounded-lg font-label-sm text-label-sm border border-whisper-border text-on-surface-variant hover:bg-surface-container-low transition-colors"
              >
                Cancel
              </button>
              <button 
                disabled={isSubmitting}
                type="submit"
                className="flex-1 bg-primary text-on-primary px-6 py-3 rounded-lg font-label-sm text-label-sm hover:bg-surface-tint disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></div>
                ) : (
                  initialData ? 'Update Member' : 'Save Member'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};