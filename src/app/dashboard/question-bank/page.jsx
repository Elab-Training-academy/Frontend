// "use client";
// import React, { useEffect, useState } from "react";
// import { Search, Bell, Clock } from "lucide-react";
// import { useAuthStore } from "@/store/authStore";

// const QuestionBank = () => {
//   const url = useAuthStore(state => state.url);
//   const newToken = useAuthStore(state => state.token)
//   const [questions, setQuestions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const getToken = localStorage.getItem('token')
//   console.log(getToken);
  

//   // Fetch questions from API
//   useEffect(() => {
//     const fetchQuestions = async () => {
//       try {
//         const res = await fetch(`${url}/questions`, {
//           method: 'GET',
//           headers: {
//             Authorization: `Bearer ${getToken}`,
//           }
//         })
        
//         if (!res.ok) {
//           throw new Error(`HTTP error! status: ${res.status}`);
//         }
        
//         const data = await res.json();
        
//         // Check if data is an array, if not, try to extract questions from response
//         if (Array.isArray(data)) {
//           setQuestions(data);
//         } else if (data.questions && Array.isArray(data.questions)) {
//           setQuestions(data.questions);
//         } else if (data.data && Array.isArray(data.data)) {
//           setQuestions(data.data);
//         } else {
//           console.error("Unexpected API response structure:", data);
//           setError("Unexpected data format received from server");
//           setQuestions([]); // Set to empty array to prevent map error
//         }
//       } catch (err) {
//         console.error("Error fetching questions:", err);
//         setError(err.message);
//         setQuestions([]); // Set to empty array to prevent map error
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchQuestions();
//   }, [url, getToken]); // Added dependencies

//   // ... rest of your component code remains the same until the return statement

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div className="flex items-center space-x-4">
//             <div className="relative flex-1 max-w-md">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <input
//                 type="text"
//                 placeholder="Type a command or search..."
//                 className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//           </div>
//           <Bell className="w-6 h-6 text-gray-600" />
//         </div>

//         {/* Title */}
//         <div className="mb-12">
//           <h1 className="text-4xl font-bold text-gray-900 mb-4">Question Bank</h1>
//           <p className="text-gray-600 text-lg max-w-4xl">
//             Select a practice mode to match your learning style.
//           </p>
//         </div>

//         {/* Questions Section */}
//         <div className="bg-white rounded-2xl border border-gray-200 p-6">
//           <h2 className="text-xl font-semibold text-gray-900 mb-6">
//             All Questions
//           </h2>

//           {loading ? (
//             <p className="text-gray-500">Loading questions...</p>
//           ) : error ? (
//             <p className="text-red-500">Error: {error}</p>
//           ) : questions.length === 0 ? (
//             <p className="text-gray-500">No questions available.</p>
//           ) : (
//             <div className="space-y-6">
//               {questions.map((q, index) => (
//                 <div
//                   key={q.id || index}
//                   className="p-4 border border-gray-200 rounded-xl bg-gray-50"
//                 >
//                   <h3 className="font-medium text-gray-900 mb-2">
//                     {index + 1}. {q.question_text}
//                   </h3>
//                   <ul className="space-y-2">
//                     {q.answer_options && q.answer_options.map((opt) => (
//                       <li
//                         key={opt.id || opt.option_text}
//                         className="flex items-center space-x-2 text-gray-700"
//                       >
//                         <input
//                           type={
//                             q.answer_type === "select_all"
//                               ? "checkbox"
//                               : "radio"
//                           }
//                           name={q.id}
//                           value={opt.option_text}
//                           className="text-blue-600"
//                         />
//                         <span>{opt.option_text}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QuestionBank;



"use client";
import React, { useEffect, useState } from "react";
import { Search, Bell } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";

const QuestionBank = () => {
  const url = useAuthStore((state) => state.url);
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingModules, setLoadingModules] = useState(false);

  // Fetch all courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return console.error("No token found");

        const res = await fetch(`${url}/orders/ordered-courses`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.error("Failed to fetch courses:", res.status);
          setCourses([]);
          return;
        }

        const data = await res.json();
        console.log("Courses response:", data);
        setCourses(Array.isArray(data) ? data : data.courses || []);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, [url]);

  // Fetch modules when a course is selected
  const fetchModules = async (courseId) => {
    setLoadingModules(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return console.error("No token found");

      const res = await fetch(`${url}/courses/modules/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.error("Failed to fetch modules:", res.status);
        setModules([]);
        return;
      }

      const data = await res.json();
      console.log("Modules response:", data);
      if (Array.isArray(data)) {
        setModules(data);
      } else if (data.modules) {
        setModules(data.modules);
      } else {
        setModules([]);
      }
    } catch (err) {
      console.error("Error fetching modules:", err);
      setModules([]);
    } finally {
      setLoadingModules(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search modules..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Bell className="w-6 h-6 text-gray-600" />
        </div>

        {/* Title */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Question Bank
          </h1>
          <p className="text-gray-600 text-lg max-w-4xl">
            Select a course, then choose a module to see its questions.
          </p>
        </div>

        {/* Courses */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Courses</h2>
          {loadingCourses ? (
            <p className="text-gray-500">Loading courses...</p>
          ) : courses.length === 0 ? (
            <p className="text-gray-500">No courses available.</p>
          ) : (
            <select
              className="border p-2 rounded-lg"
              onChange={(e) => {
                const courseId = e.target.value;
                setSelectedCourse(courseId);
                if (courseId) fetchModules(courseId);
              }}
            >
              <option value="">-- Select a course --</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Modules */}
        {selectedCourse && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Modules</h2>
            {loadingModules ? (
              <p className="text-gray-500">Loading modules...</p>
            ) : modules.length === 0 ? (
              <p className="text-gray-500">No modules available.</p>
            ) : (
              <div className="space-y-6">
                {modules.map((m, index) => (
                  <Link key ={m.id} href={`/dashboard/question-bank/${m.id}`}>
                  <div
                    key={m.id || index}
                    className="p-4 border border-gray-200 rounded-xl bg-gray-50 hover:bg-blue-50 cursor-pointer"
                  >
                    <h3 className="font-medium text-gray-900 mb-1">
                      {index + 1}. {m.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Duration: {m.duration ?? "N/A"} mins 
                    </p>
                    <p className="text-sm text-gray-600">
                      Total Question: {m.total_questions}
                    </p>
                  </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionBank;
