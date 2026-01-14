import React, { useState, useEffect, useCallback } from 'react';

// --- Type Definitions for API data ---
interface User {
  id: number;
  username: string;
  email: string;
}

interface UserProfile {
  id: number;
  user: User;
  student_type: 'School' | 'College' | 'Other' | null;
  school_class: number | null;
  college_degree: string | null;
  college_year: string | null;
  other_status: string | null;
  pincode: string | null;
  city: string | null;
  state: string | null;
}

// --- Main Component ---
function ProfilePage() {
  // State for the profile data from our backend
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  // State for each individual form field
  const [studentType, setStudentType] = useState<'School' | 'College' | 'Other' | ''>('');
  const [schoolClass, setSchoolClass] = useState('');
  const [collegeDegree, setCollegeDegree] = useState('');
  const [collegeYear, setCollegeYear] = useState('');
  const [otherStatus, setOtherStatus] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  // State for UI feedback
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPincodeLoading, setIsPincodeLoading] = useState(false);

  // --- Fetches initial profile data when the page loads ---
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) { 
        setError("You are not logged in.");
        setIsLoading(false); 
        return; 
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/api/profile/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Could not fetch your profile data.');
        
        const data: UserProfile = await response.json();
        setProfile(data);
        // Populate form fields with the data we received
        setStudentType(data.student_type || '');
        setSchoolClass(data.school_class?.toString() || '');
        setCollegeDegree(data.college_degree || '');
        setCollegeYear(data.college_year || '');
        setOtherStatus(data.other_status || '');
        setPincode(data.pincode || '');
        setCity(data.city || '');
        setState(data.state || '');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // --- Fetches location from the external pincode API ---
  const fetchLocationFromPincode = useCallback(async (code: string) => {
    if (code.length !== 6) {
        setCity('');
        setState('');
        return;
    };
    setIsPincodeLoading(true);
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${code}`);
      const data = await response.json();
      if (data && data[0]?.Status === 'Success') {
        const postOffice = data[0].PostOffice[0];
        setCity(postOffice.Block);
        setState(postOffice.State);
      } else {
        setCity('Not found');
        setState('Not found');
      }
    } catch (error) {
      console.error("Failed to fetch pincode data:", error);
      setCity('Error');
      setState('Error');
    } finally {
      setIsPincodeLoading(false);
    }
  }, []);

  // Debounces the pincode API call to avoid too many requests
  useEffect(() => {
    const timer = setTimeout(() => {
        fetchLocationFromPincode(pincode);
    }, 500); 
    return () => clearTimeout(timer);
  }, [pincode, fetchLocationFromPincode]);


  // --- Handles the form submission to update the profile ---
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    setMessage('');
    setError('');
    
    // Prepare the data payload based on the user's selections
    const payload: Partial<UserProfile> = {
        student_type: studentType || null,
        school_class: studentType === 'School' ? (schoolClass ? parseInt(schoolClass, 10) : null) : null,
        college_degree: studentType === 'College' ? collegeDegree : null,
        college_year: studentType === 'College' ? collegeYear : null,
        other_status: studentType === 'Other' ? otherStatus : null,
        pincode: pincode || null,
        city: city || null,
        state: state || null,
    };
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/profile/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(Object.values(errorData).flat().join(' ') || 'Failed to update profile.');
      }
      
      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setMessage('Profile updated successfully!');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred.');
    }
  };

  // --- Render Logic ---
  if (isLoading) return <div className="text-center text-slate-600 dark:text-slate-400 p-10">Loading Profile...</div>;
  if (!profile) return <div className="text-center text-red-500 p-10">Please log in to view your profile.</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-200 mb-6">Your Profile</h2>
      <div className="text-center mb-8 pb-4 border-b border-slate-300 dark:border-slate-600">
        <p><strong>Username:</strong> {profile.user.username}</p>
        <p><strong>Email:</strong> {profile.user.email}</p>
      </div>

      <form onSubmit={handleUpdate} className="space-y-6">
        {/* Student Type Selection */}
        <div>
            <label className="block font-bold mb-2 text-slate-700 dark:text-slate-300">Current Status</label>
            <select value={studentType} onChange={e => setStudentType(e.target.value as any)} className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none">
                <option value="">Select your status</option>
                <option value="School">School Student</option>
                <option value="College">College Student</option>
                <option value="Other">Other (Dropper, Graduated, etc.)</option>
            </select>
        </div>

        {/* Conditional Fields based on Student Type */}
        {studentType === 'School' && (
            <div>
                <label className="block font-bold mb-2 text-slate-700 dark:text-slate-300">Current Class</label>
                <input type="number" value={schoolClass} onChange={e => setSchoolClass(e.target.value)} className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none" placeholder="e.g., 10 or 12"/>
            </div>
        )}

        {studentType === 'College' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block font-bold mb-2 text-slate-700 dark:text-slate-300">Degree</label>
                    <input type="text" value={collegeDegree} onChange={e => setCollegeDegree(e.target.value)} className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none" placeholder="e.g., B.Tech, B.Sc"/>
                </div>
                <div>
                    <label className="block font-bold mb-2 text-slate-700 dark:text-slate-300">Year</label>
                    <input type="text" value={collegeYear} onChange={e => setCollegeYear(e.target.value)} className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none" placeholder="e.g., 1st Year, Final Year"/>
                </div>
            </div>
        )}

        {studentType === 'Other' && (
            <div>
                <label className="block font-bold mb-2 text-slate-700 dark:text-slate-300">Describe Your Status</label>
                <input type="text" value={otherStatus} onChange={e => setOtherStatus(e.target.value)} className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none" placeholder="e.g., Dropper, Graduated"/>
            </div>
        )}

        {/* Location Fields */}
        <div>
          <label className="block font-bold mb-2 text-slate-700 dark:text-slate-300">Pincode</label>
          <input type="text" value={pincode} onChange={e => setPincode(e.target.value)} maxLength={6} className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none" placeholder="Enter 6-digit pincode"/>
        </div>
        
        {(city || state || isPincodeLoading) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block font-bold mb-2 text-slate-700 dark:text-slate-300">City</label>
                    <input type="text" value={isPincodeLoading ? 'Loading...' : city} disabled className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-800" />
                </div>
                <div>
                    <label className="block font-bold mb-2 text-slate-700 dark:text-slate-300">State</label>
                    <input type="text" value={isPincodeLoading ? 'Loading...' : state} disabled className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-800" />
                </div>
            </div>
        )}

        <button type="submit" className="w-full px-8 py-3 rounded-full bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold text-lg hover:scale-105 shadow-lg">
          Update Profile
        </button>
        {message && <p className="text-center mt-4 text-green-600 dark:text-green-400">{message}</p>}
        {error && <p className="text-center mt-4 text-red-500">{error}</p>}
      </form>
    </div>
  );
}

export default ProfilePage;

