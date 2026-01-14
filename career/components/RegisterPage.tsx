import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

function RegisterPage() {
  // === STATE MANAGEMENT ===
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Hook for programmatic navigation

  // === FORM SUBMISSION HANDLER ===
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      // This is the API call to your Django backend's register endpoint
      const response = await fetch('http://127.0.0.1:8000/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      if (!response.ok) {
        // Handle errors from the backend (e.g., username already exists)
        const errorData = await response.json();
        const errorMessages = Object.values(errorData).flat().join(' ');
        throw new Error(errorMessages || 'Registration failed.');
      }

      // On success
      setMessage('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login'); // Redirect to the login page after 2 seconds
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-slate-200 to-slate-300 dark:from-slate-800 dark:via-slate-900 dark:to-black">
      <div className="w-full max-w-md mx-auto p-8 bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30 dark:border-slate-700/50">
        <h2 className="text-3xl font-extrabold text-center text-slate-800 dark:text-slate-200 mb-6">Create Your Account</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-bold mb-2 text-slate-700 dark:text-slate-300">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 transition-all duration-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
              placeholder="Choose a username"
            />
          </div>
          <div>
            <label className="block font-bold mb-2 text-slate-700 dark:text-slate-300">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 transition-all duration-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
              placeholder="your.email@example.com"
            />
          </div>
          <div>
            <label className="block font-bold mb-2 text-slate-700 dark:text-slate-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 transition-all duration-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
              placeholder="Create a strong password"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-8 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg transition-transform duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            {isLoading ? 'Registering...' : 'Sign Up'}
          </button>
          {message && <p className="text-center mt-4 text-green-600 dark:text-green-400">{message}</p>}
          {error && <p className="text-center mt-4 text-red-500">{error}</p>}
        </form>
        <p className="text-center text-slate-600 dark:text-slate-400 mt-6">
          Already have an account? <a href="/login" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Log In</a>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;

