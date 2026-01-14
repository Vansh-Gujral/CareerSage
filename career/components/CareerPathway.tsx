// import React, { useState, useEffect } from 'react';

// // --- Type Definitions for our API data ---
// interface Resource {
//   id: number;
//   title: string;
//   link: string;
//   resource_type: string;
// }
// interface Milestone {
//   id: number;
//   title: string;
//   description: string;
//   target_class: number;
//   resources: Resource[];
// }
// interface Career {
//   id: number;
//   name: string;
// }
// interface Field {
//   id: number;
//   name: string;
// }
// interface Sector {
//   id: number;
//   name: string;
// }

// // Reusable Select Component (Updated to handle API data)
// interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
//   label?: string; // Label is now optional
//   options: ({ id: number | string; name: string })[];
//   placeholder: string;
// }
// const SelectInput: React.FC<SelectProps> = ({ label, options, placeholder, ...props }) => (
//   <div>
//     {label && <label className="block font-bold mb-2 text-slate-700 dark:text-slate-300 text-base">{label}</label>}
//     <select
//       {...props}
//       className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-base transition-all duration-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:opacity-60"
//     >
//       <option value="">{placeholder}</option>
//       {options.map((opt) => (
//         <option key={opt.id} value={opt.id}>{opt.name}</option>
//       ))}
//     </select>
//   </div>
// );


// // --- Main Component ---
// function CareerPathway() {
//   // === STATE MANAGEMENT ===
//   const [academicType, setAcademicType] = useState('school');
//   const [academics, setAcademics] = useState({ degree: '', major: '', year: '' });
//   const [school, setSchool] = useState({ level: 'Secondary', className: '8', stream: '' });

//   // State to hold all the choice data from the API
//   const [sectors, setSectors] = useState<Sector[]>([]);
//   const [fieldsBySector, setFieldsBySector] = useState<Record<string, Field[]>>({});
//   const [careersByField, setCareersByField] = useState<Record<string, Career[]>>({});

//   // State to hold the user's multiple career goal selections
//   const [goals, setGoals] = useState([{ sectorId: '', fieldId: '', careerId: '' }]);

//   // State for the final results (now holds a SINGLE roadmap)
//   const [submitted, setSubmitted] = useState(false);
//   const [roadmap, setRoadmap] = useState<Milestone[] | null>(null);
//   const [activeCareerName, setActiveCareerName] = useState('');
//   const [isLoading, setIsLoading] = useState(false);


//   // === DATA FETCHING ===
//   useEffect(() => {
//     const fetchSectors = async () => {
//       try {
//         const response = await fetch('http://127.0.0.1:8000/api/sectors/');
//         setSectors(await response.json());
//       } catch (error) {
//         console.error("Failed to fetch sectors:", error);
//       }
//     };
//     fetchSectors();
//   }, []);

//   // === HANDLERS ===
//   const handleGoalChange = (index: number, key: 'sectorId' | 'fieldId' | 'careerId', value: string) => {
//     const newGoals = [...goals];
//     newGoals[index][key] = value;

//     if (key === 'sectorId') {
//       newGoals[index].fieldId = '';
//       newGoals[index].careerId = '';
//       fetchFieldsForSector(value);
//     }
//     if (key === 'fieldId') {
//       newGoals[index].careerId = '';
//       fetchCareersForField(value);
//     }
//     setGoals(newGoals);
//   };
  
//   const fetchFieldsForSector = async (sectorId: string) => {
//     if (!sectorId || fieldsBySector[sectorId]) return;
//     try {
//       const response = await fetch(`http://127.0.0.1:8000/api/fields/?sector_id=${sectorId}`);
//       const data = await response.json();
//       setFieldsBySector(prev => ({ ...prev, [sectorId]: data }));
//     } catch (error) {
//       console.error(`Failed to fetch fields for sector ${sectorId}:`, error);
//     }
//   };

//   const fetchCareersForField = async (fieldId: string) => {
//     if (!fieldId || careersByField[fieldId]) return;
//     try {
//       const response = await fetch(`http://127.0.0.1:8000/api/careers/?field_id=${fieldId}`);
//       const data = await response.json();
//       setCareersByField(prev => ({ ...prev, [fieldId]: data }));
//     } catch (error) {
//       console.error(`Failed to fetch careers for field ${fieldId}:`, error);
//     }
//   };

//   const addGoal = () => {
//     setGoals([...goals, { sectorId: '', fieldId: '', careerId: '' }]);
//   };

//   const removeGoal = (index: number) => {
//     setGoals(goals.filter((_, i) => i !== index));
//   };

//   // --- NEW: Handler for generating a SINGLE roadmap ---
//   const handleGenerateSingleRoadmap = async (goal: { sectorId: string; fieldId: string; careerId: string; }) => {
//     if (!goal.careerId) {
//       alert("Please select a complete career goal to generate its pathway.");
//       return;
//     }

//     setIsLoading(true);
//     setRoadmap(null);
    
//     const currentClass = (academicType === 'school' && school.className) ? school.className : '8';

//     try {
//       const allCareers = Object.values(careersByField).flat();
//       const career = allCareers.find(c => c.id === parseInt(goal.careerId));
//       setActiveCareerName(career?.name || 'Selected Goal');

//       const response = await fetch(`http://127.0.0.1:8000/api/roadmap/?career_id=${goal.careerId}&current_class=${currentClass}`);
//       const data = await response.json();
      
//       setRoadmap(data);
//       setSubmitted(true);

//     } catch (error) {
//       console.error("Error fetching roadmap:", error);
//       alert("Failed to generate the pathway. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setSubmitted(false);
//     setRoadmap(null);
//     setActiveCareerName('');
//   };

//   const getSchoolClasses = () => {
//     if (school.level === 'Primary') return ['1','2','3','4','5'];
//     if (school.level === 'Middle') return ['6','7','8'];
//     if (school.level === 'Secondary') return ['9','10'];
//     if (school.level === 'Senior Secondary') return ['11','12'];
//     return [];
//   };
  
//   const groupedMilestones = roadmap?.reduce((acc, milestone) => {
//     const key = `Class ${milestone.target_class}`;
//     if (!acc[key]) {
//       acc[key] = [];
//     }
//     acc[key].push(milestone);
//     return acc;
//   }, {} as Record<string, Milestone[]>);


//   return (
//     <div className="bg-transparent p-5 sm:p-10">
//       {/* Dynamic CSS for the timeline tree view */}
//       <style>{`
//         .timeline-container {
//           position: relative;
//           padding-left: 50px;
//         }
//         .timeline-container::before {
//           content: '';
//           position: absolute;
//           left: 15px;
//           top: 20px;
//           bottom: 20px;
//           width: 4px;
//           background-color: #cbd5e1;
//           border-radius: 2px;
//         }
//         .timeline-level {
//           position: relative;
//           margin-bottom: 30px;
//         }
//         .timeline-year-node {
//           position: absolute;
//           left: -48px;
//           top: 0;
//           width: 70px;
//           height: 70px;
//           border-radius: 50%;
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           color: white;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-weight: bold;
//           font-size: 0.9rem;
//           text-align: center;
//           border: 4px solid #fff;
//           box-shadow: 0 0 0 4px #cbd5e1;
//           z-index: 10;
//         }
//       `}</style>
      
//       <div className="max-w-5xl mx-auto relative z-10">
//         <header className="text-center mb-12 p-10 bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/40">
//           <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800 dark:from-slate-200 dark:via-slate-300 dark:to-slate-200 text-transparent bg-clip-text mb-3">
//             🚀 Career Pathway Planner
//           </h1>
//           <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
//             Plan your journey to success with personalized career guidance
//           </p>
//         </header>

//         {!submitted && (
//           <form onSubmit={(e) => e.preventDefault()} className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg p-8 sm:p-12 rounded-2xl shadow-2xl border border-white/30 dark:border-slate-700/50 relative">
//              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t-2xl"></div>
            
//             <section>
//               <div className="flex items-center mb-6 pb-4 border-b-2 border-slate-200 dark:border-slate-700">
//                 <span className="text-3xl mr-3">🎯</span>
//                 <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Career Goals</h3>
//               </div>
//               <div className="space-y-4">
//               {goals.map((goal, i) => (
//                 <div key={i} className="grid grid-cols-1 md:grid-cols-[2fr,2fr,3fr,1fr] gap-4 p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-700 items-center">
//                     <SelectInput placeholder="Select Sector" options={sectors} value={goal.sectorId} onChange={(e) => handleGoalChange(i, 'sectorId', e.target.value)} />
//                     <SelectInput placeholder="Select Field" options={fieldsBySector[goal.sectorId] || []} value={goal.fieldId} onChange={(e) => handleGoalChange(i, 'fieldId', e.target.value)} disabled={!goal.sectorId} />
//                     <SelectInput placeholder="Select Profession" options={careersByField[goal.fieldId] || []} value={goal.careerId} onChange={(e) => handleGoalChange(i, 'careerId', e.target.value)} disabled={!goal.fieldId} />
//                     <div className="flex gap-2">
//                         {goals.length > 1 && <button type="button" onClick={() => removeGoal(i)} className="w-1/2 px-2 py-2 rounded-lg border-2 border-red-500 text-red-500 bg-white dark:bg-slate-700 font-semibold transition-all duration-300 hover:bg-red-500 hover:text-white">✕</button>}
//                         {/* --- NEW: Individual Generate Button --- */}
//                         <button type="button" onClick={() => handleGenerateSingleRoadmap(goal)} disabled={!goal.careerId || isLoading} className="w-full px-4 py-3 rounded-lg bg-green-500 text-white font-bold transition-all duration-300 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed">
//                           {isLoading ? '...' : '🚀'}
//                         </button>
//                     </div>
//                 </div>
//               ))}
//               </div>
//             </section>
            
//             <div className="flex flex-wrap gap-4 mt-8 justify-center">
//               <button type="button" onClick={addGoal} className="px-8 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg transition-transform duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
//                 ➕ Add another goal
//               </button>
//             </div>
//           </form>
//         )}

//         {submitted && (
//           <div>
//             <div className="flex justify-between items-center mb-8 bg-white/30 dark:bg-slate-800/30 p-5 rounded-xl shadow-lg backdrop-blur-sm border border-white/20 dark:border-slate-700/40">
//               <div className="flex items-center">
//                 <span className="text-3xl mr-3">🗺️</span>
//                 <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-200">Your Pathway to becoming a {activeCareerName}</h3>
//               </div>
//               <button onClick={resetForm} className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold transition-transform duration-300 hover:scale-105 shadow-md">
//                 ⬅️ Back to Goals
//               </button>
//             </div>

//             <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg p-8 sm:p-10 rounded-2xl shadow-2xl border border-white/30 dark:border-slate-700/50">
//                <div className="timeline-container">
//                   {groupedMilestones && Object.keys(groupedMilestones).length > 0 ? Object.keys(groupedMilestones).sort((a,b) => parseInt(a.split(' ')[1]) - parseInt(b.split(' ')[1])).map((targetClass, index) => (
//                     <div key={index} className="timeline-level">
//                       <div className="timeline-year-node">{targetClass.replace('Class ', '')}th</div>
//                       <div className="pl-24 pt-2 pb-8 space-y-4">
//                         {groupedMilestones[targetClass].map(milestone => (
//                           <div key={milestone.id} className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800/50 dark:to-slate-700/50 border-2 border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
//                             <h4 className="font-bold text-xl text-slate-800 dark:text-slate-200 mb-2">📍 {milestone.title}</h4>
//                             <p className="text-slate-600 dark:text-slate-400 mb-4">{milestone.description}</p>
//                             {milestone.resources.length > 0 && (
//                               <div>
//                                 <h5 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Resources:</h5>
//                                 <ul className="list-disc list-inside space-y-1">
//                                   {milestone.resources.map(res => (
//                                     <li key={res.id}>
//                                       <a href={res.link} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">
//                                         {res.title} ({res.resource_type})
//                                       </a>
//                                     </li>
//                                   ))}
//                                 </ul>
//                               </div>
//                             )}
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )) : (
//                      <p className="text-center text-slate-600 dark:text-slate-400 text-lg p-10">No roadmap steps found for this career path from your current class.</p>
//                   )}
//                 </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default CareerPathway;

import React, { useState, useEffect } from 'react';

// --- Type Definitions for our API data ---
interface Resource {
  id: number;
  title: string;
  link: string;
  resource_type: string;
}
interface Milestone {
  id: number;
  title: string;
  description: string;
  target_class: number;
  resources: Resource[];
}
interface Career {
  id: number;
  name: string;
}
interface Field {
  id: number;
  name: string;
}
interface Sector {
  id: number;
  name: string;
}

// Reusable Select Component (Updated to handle API data)
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: ({ id: number | string; name: string })[];
  placeholder: string;
}
const SelectInput: React.FC<SelectProps> = ({ label, options, placeholder, ...props }) => (
  <div>
    {label && <label className="block font-bold mb-2 text-slate-700 dark:text-slate-300 text-base">{label}</label>}
    <select
      {...props}
      className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-base transition-all duration-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:opacity-60"
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.id} value={opt.id}>{opt.name}</option>
      ))}
    </select>
  </div>
);

// --- Main Component ---
function CareerPathway() {
  // === STATE MANAGEMENT ===
  // State for API-driven dropdown data
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [fieldsBySector, setFieldsBySector] = useState<Record<string, Field[]>>({});
  const [careersByField, setCareersByField] = useState<Record<string, Career[]>>({});

  // State for the user's multiple goal selections
  const [goals, setGoals] = useState([{ sectorId: '', fieldId: '', careerId: '' }]);
  
  // State for results (now holds a SINGLE roadmap)
  const [submitted, setSubmitted] = useState(false);
  const [roadmap, setRoadmap] = useState<Milestone[] | null>(null);
  const [activeCareerName, setActiveCareerName] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  // === DATA FETCHING ===
  useEffect(() => {
    const fetchSectors = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/sectors/');
        setSectors(await response.json());
      } catch (error) {
        console.error("Failed to fetch sectors:", error);
      }
    };
    fetchSectors();
  }, []);

  // === HANDLERS for user interaction ===
  const handleGoalChange = (index: number, key: 'sectorId' | 'fieldId' | 'careerId', value: string) => {
    const newGoals = [...goals];
    newGoals[index][key] = value;

    if (key === 'sectorId') {
      newGoals[index].fieldId = '';
      newGoals[index].careerId = '';
      fetchFieldsForSector(value);
    }
    if (key === 'fieldId') {
      newGoals[index].careerId = '';
      fetchCareersForField(value);
    }
    setGoals(newGoals);
  };
  
  const fetchFieldsForSector = async (sectorId: string) => {
    if (!sectorId || fieldsBySector[sectorId]) return;
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/fields/?sector_id=${sectorId}`);
      const data = await response.json();
      setFieldsBySector(prev => ({ ...prev, [sectorId]: data }));
    } catch (error) {
      console.error(`Failed to fetch fields for sector ${sectorId}:`, error);
    }
  };

  const fetchCareersForField = async (fieldId: string) => {
    if (!fieldId || careersByField[fieldId]) return;
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/careers/?field_id=${fieldId}`);
      const data = await response.json();
      setCareersByField(prev => ({ ...prev, [fieldId]: data }));
    } catch (error) {
      console.error(`Failed to fetch careers for field ${fieldId}:`, error);
    }
  };

  const addGoal = () => setGoals([...goals, { sectorId: '', fieldId: '', careerId: '' }]);
  const removeGoal = (index: number) => setGoals(goals.filter((_, i) => i !== index));

  // --- NEW: Handler for generating a SINGLE roadmap ---
  const handleGenerateSingleRoadmap = async (goal: { careerId: string; }) => {
    if (!goal.careerId) {
      alert("Please select a complete career goal to generate its pathway.");
      return;
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
      alert("You must be logged in to generate a pathway. Please go to the login page.");
      return;
    }

    setIsLoading(true);
    setRoadmap(null);
    
    try {
      const allCareers = Object.values(careersByField).flat();
      const career = allCareers.find(c => c.id === parseInt(goal.careerId));
      setActiveCareerName(career?.name || 'Selected Goal');

      const response = await fetch(`http://127.0.0.1:8000/api/roadmap/?career_id=${goal.careerId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate pathway. Please ensure your profile is updated.');
      }
      
      const data = await response.json();
      
      setRoadmap(data);
      setSubmitted(true);

    } catch (error) {
      console.error("Error fetching roadmap:", error);
      alert(error instanceof Error ? error.message : "Failed to generate the pathway.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setRoadmap(null);
    setActiveCareerName('');
  };
  // --- Grouping logic for the tree view ---
  const groupedMilestones = roadmap?.reduce((acc, milestone) => {
    let arr = ["1st year","2nd year","3rd year","4th year","5th year","6th year","7th year","8th year"];
    let a = milestone.target_class;
    let b =a.toString();
    if (a>12){
      b=arr[a-13];
    }
    // console.log("Target Class:", b);
    const key = `Class ${milestone.target_class}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(milestone);
    return acc;
  }, {} as Record<string, Milestone[]>);


  return (
    <div className="bg-transparent p-5 sm:p-10">
      {/* Dynamic CSS for the timeline tree view */}
      <style>{`
        .timeline-container { position: relative; padding-left: 50px; }
        .timeline-container::before { content: ''; position: absolute; left: 15px; top: 20px; bottom: 20px; width: 4px; background-color: #cbd5e1; border-radius: 2px; }
        .timeline-level { position: relative; margin-bottom: 30px; }
        .timeline-year-node { position: absolute; left: -48px; top: 0; width: 70px; height: 70px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.9rem; text-align: center; border: 4px solid #fff; box-shadow: 0 0 0 4px #cbd5e1; z-index: 10; }
      `}</style>
      
      <div className="max-w-5xl mx-auto relative z-10">
        <header className="text-center mb-12 p-10 bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/40">
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800 dark:from-slate-200 dark:via-slate-300 dark:to-slate-200 text-transparent bg-clip-text mb-3">
            🚀 Career Pathway Planner
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
            Plan your journey to success with personalized career guidance
          </p>
        </header>

        {!submitted && (
          <form onSubmit={(e) => e.preventDefault()} className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg p-8 sm:p-12 rounded-2xl shadow-2xl border border-white/30 dark:border-slate-700/50 relative">
             <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t-2xl"></div>
            
            <section>
              <div className="flex items-center mb-6 pb-4 border-b-2 border-slate-200 dark:border-slate-700">
                <span className="text-3xl mr-3">🎯</span>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Career Goals</h3>
              </div>
              <div className="space-y-4">
              {goals.map((goal, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-[2fr,2fr,3fr,1fr] gap-4 p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-700 items-center">
                    <SelectInput placeholder="Select Sector" options={sectors} value={goal.sectorId} onChange={(e) => handleGoalChange(i, 'sectorId', e.target.value)} />
                    <SelectInput placeholder="Select Field" options={fieldsBySector[goal.sectorId] || []} value={goal.fieldId} onChange={(e) => handleGoalChange(i, 'fieldId', e.target.value)} disabled={!goal.sectorId} />
                    <SelectInput placeholder="Select Profession" options={careersByField[goal.fieldId] || []} value={goal.careerId} onChange={(e) => handleGoalChange(i, 'careerId', e.target.value)} disabled={!goal.fieldId} />
                    <div className="flex gap-2">
                        {goals.length > 1 && <button type="button" onClick={() => removeGoal(i)} className="w-1/2 px-2 py-2 rounded-lg border-2 border-red-500 text-red-500 bg-white dark:bg-slate-700 font-semibold transition-all duration-300 hover:bg-red-500 hover:text-white">✕</button>}
                        <button type="button" onClick={() => handleGenerateSingleRoadmap(goal)} disabled={!goal.careerId || isLoading} className="w-full px-4 py-3 rounded-lg bg-green-500 text-white font-bold transition-all duration-300 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed">
                          {isLoading ? '...' : '🚀'}
                        </button>
                    </div>
                </div>
              ))}
              </div>
            </section>
            
            <div className="flex flex-wrap gap-4 mt-8 justify-center">
              <button type="button" onClick={addGoal} className="px-8 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg transition-transform duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                ➕ Add another goal
              </button>
            </div>
          </form>
        )}

        {submitted && (
          <div>
            <div className="flex justify-between items-center mb-8 bg-white/30 dark:bg-slate-800/30 p-5 rounded-xl shadow-lg backdrop-blur-sm border border-white/20 dark:border-slate-700/40">
              <div className="flex items-center">
                <span className="text-3xl mr-3">🗺️</span>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-200">Your Pathway to becoming a {activeCareerName}</h3>
              </div>
              <button onClick={resetForm} className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold transition-transform duration-300 hover:scale-105 shadow-md">
                ⬅️ Back to Goals
              </button>
            </div>

            <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg p-8 sm:p-10 rounded-2xl shadow-2xl border border-white/30 dark:border-slate-700/50">
               <div className="timeline-container">
                  {groupedMilestones && Object.keys(groupedMilestones).length > 0 ? Object.keys(groupedMilestones).sort((a,b) => parseInt(a.split(' ')[1]) - parseInt(b.split(' ')[1])).map((targetClass, index) => (
                    <div key={index} className="timeline-level">
                      
                      <div className="timeline-year-node">{targetClass.replace('Class ', '')}th</div>
                      <div className="pl-24 pt-2 pb-8 space-y-4">
                        {groupedMilestones[targetClass].map(milestone => (
                          <div key={milestone.id} className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800/50 dark:to-slate-700/50 border-2 border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                            <h4 className="font-bold text-xl text-slate-800 dark:text-slate-200 mb-2">📍 {milestone.title}</h4>
                            <p className="text-slate-600 dark:text-slate-400 mb-4">{milestone.description}</p>
                            {milestone.resources.length > 0 && (
                              <div>
                                <h5 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Resources:</h5>
                                <ul className="list-disc list-inside space-y-1">
                                  {milestone.resources.map(res => (
                                    <li key={res.id}>
                                      <a href={res.link} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                                        {res.title} ({res.resource_type})
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )) : (
                     <p className="text-center text-slate-600 dark:text-slate-400 text-lg p-10">No roadmap steps found for this career path. Please ensure your academic details are updated in your profile.</p>
                  )}
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CareerPathway;

