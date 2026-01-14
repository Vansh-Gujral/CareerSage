import React from 'react';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { ProfileIcon } from './icons/ProfileIcon';

interface NavbarProps {
  theme: string;
  toggleTheme: () => void;
  isAuthenticated: boolean;
  page: string;
  navigateTo: (page: string) => void;
}

const NavLink: React.FC<{
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ isActive, onClick, children }) => {
  const activeClasses = 'text-indigo-600 dark:text-indigo-400 border-indigo-500';
  const inactiveClasses = 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-transparent';
  
  return (
    <button
      onClick={onClick}
      className={`font-semibold transition-all duration-200 pb-1 text-sm border-b-2 ${isActive ? activeClasses : inactiveClasses}`}
    >
      {children}
    </button>
  );
};


const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme, isAuthenticated, page, navigateTo }) => {
  const handleBrandClick = () => {
    navigateTo(isAuthenticated ? 'dashboard' : 'home');
  };
  
  return (
    <nav className="sticky top-0 z-40 w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button onClick={handleBrandClick} className="focus:outline-none" aria-label="Go to homepage">
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                Career Sage
              </span>
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-6">
              {!isAuthenticated ? (
                <>
                  <NavLink isActive={page === 'home'} onClick={() => navigateTo('home')}>
                    Home
                  </NavLink>
                  <NavLink isActive={page === 'login'} onClick={() => navigateTo('login')}>
                    Login
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink isActive={page === 'dashboard'} onClick={() => navigateTo('dashboard')}>
                    Dashboard
                  </NavLink>
                </>
              )}
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-800 focus:ring-indigo-500"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button>

            {isAuthenticated && (
              <button 
                onClick={() => navigateTo('profile')} 
                className={`p-2 rounded-full transition-colors duration-200 ${page === 'profile' ? 'bg-indigo-100 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                aria-label="Go to profile"
              >
                <ProfileIcon />
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;