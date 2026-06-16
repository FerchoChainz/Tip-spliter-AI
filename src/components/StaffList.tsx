import React, { useState, useMemo } from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { StaffCard } from './StaffCard';
import { StaffForm } from './StaffForm';
import { StaffHistoryModal } from './StaffHistoryModal';
import { dashboardData } from '../data/mockData';
import { useStaff } from '../hooks/useStaff';
import type { Staff } from '../hooks/useStaff';

export interface StaffListProps {
  readonly onNavigate?: (tab: string) => void;
  readonly currentTab?: string;
}

export const StaffList: React.FC<StaffListProps> = ({ onNavigate, currentTab }) => {
  const { staff, loading, error, addStaff, updateStaff, deleteStaff } = useStaff();
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [selectedHistoryStaff, setSelectedHistoryStaff] = useState<Staff | null>(null);
  
  // Filter & Sort State
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy] = useState<'name' | 'role'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showSearch, setShowSearch] = useState(false);

  const handleOpenAdd = () => {
    setEditingStaff(null);
    setShowForm(true);
  };

  const handleOpenEdit = (person: Staff) => {
    setEditingStaff(person);
    setShowForm(true);
  };

  const handleSubmit = async (data: { name: string; role: string; avatar_url: string | null; is_featured: boolean }) => {
    let result;
    if (editingStaff) {
      result = await updateStaff(editingStaff.id, data);
    } else {
      result = await addStaff(data);
    }

    if (result.error) {
      alert(`Error: ${result.error}`);
    } else {
      setShowForm(false);
      setEditingStaff(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this staff member? This action cannot be undone.')) {
      const { error } = await deleteStaff(id);
      if (error) alert(`Error: ${error}`);
    }
  };

  // Derived filtered and sorted staff list
  const filteredStaff = useMemo(() => {
    return staff
      .filter(person => 
        person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.role.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const valA = a[sortBy]?.toLowerCase() || '';
        const valB = b[sortBy]?.toLowerCase() || '';
        if (sortOrder === 'asc') return valA.localeCompare(valB);
        return valB.localeCompare(valA);
      });
  }, [staff, searchTerm, sortBy, sortOrder]);

  const toggleSort = () => {
    if (sortOrder === 'asc') {
      setSortOrder('desc');
    } else {
      setSortOrder('asc');
    }
  };

  // Calculate total tips across all staff
  const totalDistributedTips = useMemo(() => {
    const total = staff.reduce((sum, person) => sum + (person.weekTotalNumeric || 0), 0);
    return `$${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  }, [staff]);

  return (
    <div className="bg-background text-on-surface font-body-md text-body-md min-h-[884px] flex flex-col pb-24 md:pb-0">
      <Header 
        avatarUrl={dashboardData.user.avatarUrl} 
        onNavigate={onNavigate} 
        currentTab={currentTab} 
      />
      
      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-8 pb-[100px] md:pb-24">
        {/* Architectural Header Section */}
        <section className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-whisper-border pb-8">
          <div className="max-w-2xl">
            <h2 className="font-display-xl text-display-xl text-on-surface mb-2">Staff Roster</h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1">
              <p className="font-body-lg text-body-lg text-secondary">Manage personnel and review gratuity distributions.</p>
              {!loading && !error && (
                <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20 shrink-0 self-start sm:self-auto">
                  <span className="font-label-sm text-[10px] text-primary uppercase tracking-widest font-bold">Total Tips</span>
                  <span className="font-mono-data text-primary font-bold">{totalDistributedTips}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Contextual Quick Action (Filters/Sort) */}
          <div className="flex flex-col items-end gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowSearch(!showSearch)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all font-label-sm text-label-sm shadow-[0_-15px_40px_-15px_rgba(0,0,0,0.05)] ${
                  showSearch || searchTerm ? 'bg-primary/10 border-primary text-primary' : 'bg-pure-surface border-whisper-border text-secondary hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{searchTerm ? 'filter_alt' : 'search'}</span>
                {searchTerm ? 'Filtered' : 'Filter'}
              </button>
              <button 
                onClick={toggleSort}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-whisper-border bg-pure-surface text-secondary hover:text-on-surface font-label-sm text-label-sm transition-colors shadow-[0_-15px_40px_-15px_rgba(0,0,0,0.05)]"
              >
                <span className={`material-symbols-outlined text-[18px] transition-transform duration-300 ${sortOrder === 'desc' ? 'rotate-180' : ''}`}>
                  swap_vert
                </span>
                Sort {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
              </button>
            </div>
            
            {showSearch && (
              <div className="w-full md:w-64 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="relative">
                  <input 
                    autoFocus
                    type="text"
                    placeholder="Search name or role..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-surface-container-low border border-whisper-border rounded-lg py-2 pl-10 pr-4 font-body-sm text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  />
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[18px]">search</span>
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-on-surface"
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Loading / Error States */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}

        {error && (
          <div className="bg-error-container text-on-error-container p-6 rounded-xl border border-error/20 mb-8">
            <h3 className="font-bold mb-2">Error loading staff</h3>
            <p>{error}</p>
          </div>
        )}

        {/* Standard Grid for Staff List */}
        {!loading && !error && (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
            {filteredStaff.map((person) => (
              <StaffCard 
                key={person.id}
                id={person.id}
                name={person.name}
                role={person.role}
                avatarUrl={person.avatar_url}
                weekTotal={person.weekTotal || '$0.00'}
                isFeatured={person.is_featured}
                onEdit={() => handleOpenEdit(person)}
                onDelete={() => handleDelete(person.id)}
                onClick={() => setSelectedHistoryStaff(person)}
              />
            ))}
            {filteredStaff.length === 0 && (
              <div className="col-span-full py-20 text-center text-secondary border-2 border-dashed border-whisper-border rounded-xl">
                {searchTerm ? 'No staff members match your search.' : 'No staff members found. Click the button below to add your first member.'}
              </div>
            )}
          </section>
        )}

        {/* Architecturally Integrated "Add Staff" Action Block */}
        <section className="mt-12 md:mt-16 border-t border-whisper-border pt-12 flex justify-center">
          <button 
            onClick={handleOpenAdd}
            className="bg-primary hover:bg-surface-tint text-on-primary font-label-sm text-label-sm px-8 py-4 rounded-lg flex items-center gap-3 transition-transform duration-200 active:scale-[0.98] shadow-[0_10px_30px_-10px_rgba(0,108,73,0.3)]"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>person_add</span>
            Add New Staff Member
          </button>
        </section>
      </main>

      {showForm && (
        <StaffForm 
          initialData={editingStaff}
          onSubmit={handleSubmit} 
          onCancel={() => { setShowForm(false); setEditingStaff(null); }} 
        />
      )}

      {selectedHistoryStaff && (
        <StaffHistoryModal 
          staff={selectedHistoryStaff}
          onClose={() => setSelectedHistoryStaff(null)}
        />
      )}

      <BottomNav onNavigate={onNavigate} currentTab={currentTab} />
    </div>
  );
};