import React from 'react';

export interface StaffCardProps {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly avatarUrl: string | null;
  readonly weekTotal: string;
  readonly isFeatured?: boolean;
  readonly onEdit?: () => void;
  readonly onDelete?: () => void;
  readonly onClick?: () => void;
}

export const StaffCard: React.FC<StaffCardProps> = ({
  name,
  role,
  avatarUrl,
  weekTotal,
  isFeatured = false,
  onEdit,
  onDelete,
  onClick,
}) => {
  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit?.();
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete?.();
  };

  const handleCardClick = () => {
    onClick?.();
  };

  return (
    <article 
      onClick={handleCardClick}
      className="bg-pure-surface border border-whisper-border rounded-xl p-6 flex flex-col justify-between gap-6 hover:translate-y-[-2px] hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer group active:scale-[0.98]"
    >
      <div className="flex items-center justify-between">
        <div className="w-12 h-12 rounded-full overflow-hidden border border-whisper-border shrink-0 bg-surface-container">
          {avatarUrl ? (
            <img alt={name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" src={avatarUrl} />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="material-symbols-outlined text-tertiary">person</span>
            </div>
          )}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <button 
            onClick={handleEditClick}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-surface-container-low border border-whisper-border hover:bg-surface-container-high transition-colors text-secondary hover:text-primary"
            title="Edit Member"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
          <button 
            onClick={handleDeleteClick}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-surface-container-low border border-whisper-border hover:bg-error-container/10 transition-colors text-secondary hover:text-error"
            title="Delete Member"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
      </div>
      
      <div className="relative">
        {isFeatured && (
          <div className="absolute -top-2 -right-2 w-2 h-2 bg-primary rounded-full" title="Featured Member" />
        )}
        <h3 className="font-headline-md text-body-lg font-bold text-on-surface line-clamp-1">{name}</h3>
        <p className="font-label-sm text-label-sm text-secondary mt-1 line-clamp-1">{role}</p>
      </div>

      <div className="pt-4 border-t border-whisper-border flex justify-between items-end group-hover:border-primary/20 transition-colors">
        <div className="flex flex-col">
          <span className="font-label-sm text-label-sm text-tertiary">Weekly Tips</span>
          <span className="font-mono-data text-[1.25rem] text-primary font-bold">{weekTotal}</span>
        </div>
        <span className="material-symbols-outlined text-tertiary group-hover:text-primary transition-all duration-300 group-hover:translate-x-1">chevron_right</span>
      </div>
    </article>
  );
};