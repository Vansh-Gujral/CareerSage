// import React, { useState } from 'react';

// interface LoginPageProps {
//   onLoginSuccess: () => void;
//   onNavigateToHome: () => void;
// }

// const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigateToHome }) => {
//   const [email, setEmail] = useState('');
//   const [otp, setOtp] = useState('');
//   const [otpSent, setOtpSent] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleGoogleLogin = () => {

//     setIsLoading(true);
//     setTimeout(() => {
//       onLoginSuccess();
//       setIsLoading(false);
//     }, 1000);
//   };

//   const handleSendOtp = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (email.trim() === '') return;
//     // Mock OTP sending
//     setIsLoading(true);
//     setTimeout(() => {
//       setOtpSent(true);
//       setIsLoading(false);
//     }, 1500);
//   };

//   const handleVerifyOtp = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (otp.trim() === '') return;
//     // Mock OTP verification
//     setIsLoading(true);
//     setTimeout(() => {
//       onLoginSuccess();
//       setIsLoading(false);
//     }, 1000);
//   };

//   return (
//     <div className="flex items-center justify-center p-5 pt-20">
//       <div className="w-full max-w-md bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg p-8 sm:p-10 rounded-2xl shadow-2xl border border-white/30 dark:border-slate-700/50 relative">
//         <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t-2xl"></div>
//         <div className="text-center">
//             <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">Welcome Back</h2>
//             <p className="text-slate-600 dark:text-slate-400 mb-8">Login to continue your journey.</p>
//         </div>

//         <div className="space-y-4">
//             <button
//                 onClick={handleGoogleLogin}
//                 disabled={isLoading}
//                 className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-base font-semibold text-slate-700 dark:text-slate-200 transition-all duration-300 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-slate-600 disabled:opacity-50"
//             >
//                 <svg className="w-6 h-6" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path><path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.222 0-9.519-3.356-11.01-7.928l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path><path fill="#1976D2" d="M43.611 20.083H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 36.49 44 30.638 44 24c0-1.341-.138-2.65-.389-3.917z"></path></svg>
//                 Continue with Google
//             </button>

//             <div className="flex items-center my-6">
//                 <div className="flex-grow border-t border-slate-300 dark:border-slate-600"></div>
//                 <span className="flex-shrink mx-4 text-slate-500 dark:text-slate-400">OR</span>
//                 <div className="flex-grow border-t border-slate-300 dark:border-slate-600"></div>
//             </div>

//             {!otpSent ? (
//                 <form onSubmit={handleSendOtp} className="space-y-4">
//                     <div>
//                         <label htmlFor="email" className="block font-bold mb-2 text-slate-700 dark:text-slate-300 text-sm">Email Address</label>
//                         <input
//                             id="email"
//                             type="email"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             placeholder="you@example.com"
//                             className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-base transition-all duration-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
//                             required
//                         />
//                     </div>
//                     <button type="submit" disabled={isLoading} className="w-full px-8 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg transition-transform duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed">
//                         {isLoading ? 'Sending...' : 'Send OTP'}
//                     </button>
//                 </form>
//             ) : (
//                 <form onSubmit={handleVerifyOtp} className="space-y-4">
//                     <p className="text-sm text-center text-slate-600 dark:text-slate-400">An OTP has been sent to <strong>{email}</strong>. <button type="button" onClick={() => setOtpSent(false)} className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Change email</button></p>
//                     <div>
//                         <label htmlFor="otp" className="block font-bold mb-2 text-slate-700 dark:text-slate-300 text-sm">One-Time Password (OTP)</label>
//                         <input
//                             id="otp"
//                             type="text"
//                             value={otp}
//                             onChange={(e) => setOtp(e.target.value)}
//                             placeholder="Enter 6-digit OTP"
//                             className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-base transition-all duration-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
//                             required
//                             maxLength={6}
//                         />
//                     </div>
//                     <button type="submit" disabled={isLoading} className="w-full px-8 py-3 rounded-full bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold text-lg transition-transform duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed">
//                         {isLoading ? 'Verifying...' : 'Verify & Login'}
//                     </button>
//                 </form>
//             )}
//         </div>
//         <div className="mt-8 text-center">
//             <button onClick={onNavigateToHome} className="text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline">
//                 &larr; Back to Home
//             </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;


import React, { useState } from 'react';

// A simple navigate function placeholder. In a real app, you'd use useNavigate() from react-router-dom.
// We will handle navigation in App.tsx for this example.
declare const navigate: (path: string) => void;

function LoginPage({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed. Please check your credentials.');
      }

      const data = await response.json();
      
      // Store tokens securely in localStorage
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      
      onLoginSuccess(); // Notify parent component (App.tsx) that login was successful

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-200 mb-6">Sign In</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <p className="text-red-500 text-center">{error}</p>}
        <div>
          <label className="block font-bold mb-2 text-slate-700 dark:text-slate-300">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
            required
          />
        </div>
        <div>
          <label className="block font-bold mb-2 text-slate-700 dark:text-slate-300">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
            required
          />
        </div>
        <button type="submit" className="w-full px-8 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg hover:scale-105 shadow-lg">
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
