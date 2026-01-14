import React, { useState, useEffect } from 'react';
import CareerPathway from './components/CareerPathway';
import Chatbot from './components/Chatbot';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import Navbar from './components/Navbar';
import ProfilePage from './components/ProfilePage';

export interface UserProfile {
  name: string;
  educationLevel: string;
  institution: string;
  fieldOfStudy: string;
  email: string;
  contactNumber: string;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [page, setPage] = useState('home'); // 'home', 'login', 'dashboard', 'profile'
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    // Protect authenticated routes
    if ((page === 'dashboard' || page === 'profile') && !isAuthenticated) {
      setPage('login');
    }
    
    // Load profile data on auth
    if(isAuthenticated) {
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
            setProfile(JSON.parse(savedProfile));
        } else {
          // Initialize with a default profile if none exists
          const defaultProfile: UserProfile = {
            name: 'New User',
            email: '',
            contactNumber: '',
            educationLevel: '',
            institution: '',
            fieldOfStudy: ''
          };
          setProfile(defaultProfile);
          localStorage.setItem('userProfile', JSON.stringify(defaultProfile));
        }
    }

  }, [page, isAuthenticated]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const navigateTo = (targetPage: string) => {
    setPage(targetPage);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setPage('dashboard');
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setProfile(null);
    localStorage.removeItem('userProfile');
    setPage('home');
  };
  
  const handleProfileSave = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('userProfile', JSON.stringify(newProfile));
    alert('Profile saved successfully!');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-200 transition-colors duration-300">
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        isAuthenticated={isAuthenticated}
        page={page}
        navigateTo={navigateTo}
      />
      <main>
        {page === 'home' && <HomePage onNavigateToLogin={() => navigateTo('login')} />}
        {page === 'login' && <LoginPage onLoginSuccess={handleLoginSuccess} onNavigateToHome={() => navigateTo('home')} />}
        {page === 'dashboard' && isAuthenticated && (
          <div className="relative">
            <CareerPathway />
            <Chatbot />
          </div>
        )}
        {page === 'profile' && isAuthenticated && (
          <ProfilePage profile={profile} onSave={handleProfileSave} onLogout={handleLogout} />
        )}
      </main>
    </div>
  );
}

export default App;