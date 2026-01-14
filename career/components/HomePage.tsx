import React from 'react';

interface HomePageProps {
  onNavigateToLogin: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigateToLogin }) => {
  return (
    <div className="flex flex-col items-center justify-center p-5 text-center pt-20">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-5xl sm:text-7xl font-extrabold bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800 dark:from-slate-200 dark:via-slate-300 dark:to-slate-200 text-transparent bg-clip-text mb-4">
            Navigate Your Career Path
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 font-medium max-w-2xl mx-auto">
            Get personalized roadmaps and AI-powered advice to achieve your professional goals with Career Sage.
          </p>
        </header>

        <div className="mb-12">
          <button
            onClick={onNavigateToLogin}
            className="px-12 py-4 rounded-full bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white font-bold text-xl transition-transform duration-300 hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800"
          >
            Get Started
          </button>
        </div>

        <section className="grid md:grid-cols-2 gap-8 text-left">
          <div className="bg-white/30 dark:bg-slate-800/30 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/40">
            <div className="text-4xl mb-4">🗺️</div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">Personalized Roadmaps</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Input your academic details and career aspirations to generate a step-by-step pathway to success. Tailored advice just for you.
            </p>
          </div>
          <div className="bg-white/30 dark:bg-slate-800/30 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/40">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">AI-Powered Advisor</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Chat with Career Sage, our intelligent chatbot, to get instant answers to your career-related questions, anytime you need.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
