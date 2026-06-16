import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { StaffList } from './components/StaffList';
import { DailySplit } from './components/DailySplit';
import { WeeklySummary } from './components/WeeklySummary';

function App() {
  const [session, setSession] = useState<any>(null);
  const [currentScreen, setCurrentScreen] = useState('home');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Session error:', error.message);
        setSession(null);
      } else {
        setSession(session);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if ((event as string) === 'SIGNED_OUT' || (event as string) === 'USER_DELETED') {
        // Clear local cache/state if needed
        setCurrentScreen('home');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <Dashboard onNavigate={setCurrentScreen} currentTab={currentScreen} />;
      case 'staff':
        return <StaffList onNavigate={setCurrentScreen} currentTab={currentScreen} />;
      case 'split':
        return <DailySplit onNavigate={setCurrentScreen} currentTab={currentScreen} />;
      case 'summary':
        return <WeeklySummary onNavigate={setCurrentScreen} currentTab={currentScreen} />;
      default:
        return <Dashboard onNavigate={setCurrentScreen} currentTab={currentScreen} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <div key={session.user.id} className="app-container min-h-screen flex flex-col">
      {renderScreen()}
    </div>
  );
}

export default App;