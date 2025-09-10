// "use client";

// import { useEffect, useState } from "react";
// import { useQuestionStore, setToken } from "@/store/questionStore";

// const SmartPracticePage = () => {
//   const {
//     categories,
//     questions,
//     currentIndex,
//     fetchQuestions,
//     nextQuestion,
//     prevQuestion,
//     loading,
//     error,
//     clearError,
//   } = useQuestionStore();

//   const [filters, setFilters] = useState({
//     type: "Mixed Practice",
//     category: "All",
//     difficulty: "Easy",
//     search: "",
//   });

//   const [authStatus, setAuthStatus] = useState("checking");
//   const [courses, setCourses] = useState([]);
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [courseCategories, setCourseCategories] = useState([]);

//   // ✅ Step 1: Get ordered courses
//   useEffect(() => {
//     const init = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           setAuthStatus("unauthenticated");
//           return;
//         }

//         setToken(token);
//         setAuthStatus("authenticated");

//         const res = await fetch(
//           "https://elab-server-xg5r.onrender.com/orders/ordered-courses",
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         if (!res.ok) {
//           console.error("Failed to fetch ordered courses");
//           return;
//         }

//         const userCourses = await res.json();
//         setCourses(userCourses);

//         // auto-select first course if available
//         if (userCourses.length > 0) {
//           setSelectedCourse(userCourses[0].id);
//         }
//       } catch (err) {
//         console.error("Error initializing SmartPractice:", err);
//       }
//     };

//     init();
//   }, []);

//   // ✅ Step 2: Fetch categories when selectedCourse changes
//   useEffect(() => {
//     const fetchCategoriesForCourse = async () => {
//       if (!selectedCourse) return;
//       try {
//         const token = localStorage.getItem("token");
//         const res = await fetch(
//           `https://elab-server-xg5r.onrender.com/course-categories/${selectedCourse}/categories`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         if (res.ok) {
//           const cats = await res.json();
//           setCourseCategories(cats);
//         } else {
//           console.error("Failed to fetch categories for course:", selectedCourse);
//           setCourseCategories([]);
//         }
//       } catch (err) {
//         console.error("Error fetching categories:", err);
//         setCourseCategories([]);
//       }
//     };

//     fetchCategoriesForCourse();
//   }, [selectedCourse]);

//   const handleGetQuestions = async () => {
//     clearError();
//     await fetchQuestions(filters);
//   };

//   const handleFilterChange = (key, value) => {
//     setFilters((prev) => ({
//       ...prev,
//       [key]: value,
//     }));
//   };

//   // ================== UI ==================
//   if (authStatus === "checking") {
//     return <div className="p-4">Checking authentication...</div>;
//   }

//   if (authStatus === "unauthenticated") {
//     return (
//       <div className="p-4">
//         <h1 className="text-xl font-bold text-red-600">Authentication Required</h1>
//         <p>Please log in to access Smart Practice.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 max-w-4xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6">Smart Practice</h1>

//       {/* Loading / Error */}
//       {loading && <p className="text-blue-600 mb-4">Loading...</p>}
//       {error && (
//         <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-4">
//           <p className="text-red-700 font-semibold">Error: {error}</p>
//           <button
//             onClick={clearError}
//             className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
//           >
//             Dismiss
//           </button>
//         </div>
//       )}

//       {/* Course Selection */}
//       {courses.length > 0 && (
//         <div className="bg-white shadow rounded-lg p-6 mb-6">
//           <label className="block text-sm font-medium mb-2">Select Course</label>
//           <select
//             value={selectedCourse || ""}
//             onChange={(e) => setSelectedCourse(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
//           >
//             {courses.map((course) => (
//               <option key={course.id} value={course.id}>
//                 {course.title || `Course ${course.id}`}
//               </option>
//             ))}
//           </select>
//         </div>
//       )}

//       {/* Filters Section */}
//       <div className="bg-white shadow rounded-lg p-6 mb-6">
//         <h2 className="text-lg font-semibold mb-4">Quiz Filters</h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           {/* Type Filter */}
//           <div>
//             <label className="block text-sm font-medium mb-2">Type</label>
//             <select
//               value={filters.type}
//               onChange={(e) => handleFilterChange("type", e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="Mixed Practice">Mixed Practice</option>
//               <option value="Focused Practice">Focused Practice</option>
//               <option value="Mock Exam">Mock Exam</option>
//             </select>
//           </div>

//           {/* Category Filter */}
//           <div>
//             <label className="block text-sm font-medium mb-2">Category</label>
//             <select
//               value={filters.category}
//               onChange={(e) => handleFilterChange("category", e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
//               disabled={courseCategories.length === 0}
//             >
//               <option value="All">All Categories</option>
//               {courseCategories.map((c) => (
//                 <option key={c.id} value={c.id}>
//                   {c.name || c.title || `Category ${c.id}`}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Difficulty Filter */}
//           <div>
//             <label className="block text-sm font-medium mb-2">Difficulty</label>
//             <select
//               value={filters.difficulty}
//               onChange={(e) => handleFilterChange("difficulty", e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="Easy">Easy</option>
//               <option value="Medium">Medium</option>
//               <option value="Hard">Hard</option>
//               <option value="Mixed">Mixed</option>
//             </select>
//           </div>

//           {/* Search Filter */}
//           <div>
//             <label className="block text-sm font-medium mb-2">Search</label>
//             <input
//               type="text"
//               value={filters.search}
//               onChange={(e) => handleFilterChange("search", e.target.value)}
//               placeholder="Search questions..."
//               className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//         </div>

//         {/* Get Questions Button */}
//         <button
//           onClick={handleGetQuestions}
//           disabled={loading}
//           className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {loading ? "Loading Questions..." : "Get Questions"}
//         </button>
//       </div>

//       {/* Show Categories */}
//       {courseCategories.length > 0 && (
//         <div className="bg-white shadow rounded-lg p-6 mb-6">
//           <h2 className="text-lg font-semibold mb-4">
//             Available Categories ({courseCategories.length})
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
//             {courseCategories.map((c) => (
//               <div key={c.id} className="p-2 bg-gray-50 rounded border">
//                 <span className="text-sm font-medium">
//                   {c.name || c.title || `Category ${c.id}`}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Show Questions */}
//       {questions.length > 0 && (
//         <div className="bg-white shadow rounded-lg p-6">
//           <h2 className="text-lg font-semibold mb-4">
//             Questions ({questions.length} found)
//           </h2>

//           <div className="bg-gray-50 p-4 rounded-lg">
//             <h3 className="font-medium mb-2">
//               Question {currentIndex + 1} of {questions.length}
//             </h3>
//             <p className="text-gray-700 mb-4">
//               {questions[currentIndex]?.question ||
//                 questions[currentIndex]?.text ||
//                 questions[currentIndex]?.questionText ||
//                 "Question text not available"}
//             </p>

//             {/* Show options */}
//             {questions[currentIndex]?.options && (
//               <div className="space-y-2">
//                 {questions[currentIndex].options.map((option, i) => (
//                   <div key={i} className="p-2 bg-white rounded border">
//                     <span className="text-sm">{option}</span>
//                   </div>
//                 ))}
//               </div>
//             )}

//             <div className="flex gap-2 mt-4">
//               <button
//                 onClick={prevQuestion}
//                 disabled={currentIndex === 0}
//                 className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
//               >
//                 Previous
//               </button>
//               <button
//                 onClick={nextQuestion}
//                 disabled={currentIndex === questions.length - 1}
//                 className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SmartPracticePage;
 

