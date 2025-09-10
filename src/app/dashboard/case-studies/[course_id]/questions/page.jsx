// "use client";

// import React, { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { useAuthStore } from "@/store/authStore";

// export default function CaseStudyQuestions() {
//   const { course_id } = useParams(); // ✅ correct param
//   const url = useAuthStore((state) => state.url);
//   const [questions, setQuestions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedAnswers, setSelectedAnswers] = useState({});
//   const [showModal, setShowModal] = useState(false);
//   const router = useRouter();

//   // ✅ Fetch case study questions
//   useEffect(() => {
//     if (!course_id) return;

//     const fetchQuestions = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           router.push("/login");
//           return;
//         }

//         const res = await fetch(`${url}/case-studies/${course_id}/questions`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (!res.ok) throw new Error("Failed to fetch questions");

//         const data = await res.json();
//         setQuestions(Array.isArray(data) ? data : [data]);
//       } catch (err) {
//         console.error("Error fetching questions:", err);
//         setQuestions([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchQuestions();
//   }, [course_id, url, router]);

//   // ✅ Handle selecting an answer
//   const handleAnswerSelect = (qId, optionId) => {
//     setSelectedAnswers((prev) => ({
//       ...prev,
//       [qId]: optionId,
//     }));
//   };

//   // ✅ Submit answers
//   const handleSubmit = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       router.push("/login");
//       return;
//     }

//     try {
//       for (const q of questions) {
//         const selectedAnswerId = selectedAnswers[q.id];
//         if (!selectedAnswerId) continue; // skip unanswered

//         const payload = {
//           case_study_id: course_id, // ✅ FIX: send course_id, not q.id
//           selected_answer_id: selectedAnswerId,
//         };

//         const res = await fetch(`${url}/case-studies/user/option`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(payload),
//         });

//         if (!res.ok) {
//           console.error("Failed to submit answer for:", q.id);
//           continue;
//         }

//         const result = await res.json();
//         console.log("Answer submitted:", result);
//       }

//       // ✅ Now submit review after answers
//       const reviewRes = await fetch(
//         `${url}/case-studies/${course_id}/reviews`,
//         {
//           method: "GET",
//           headers: {
//             // "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!reviewRes.ok) throw new Error("Failed to submit review");

//       alert("Case study submitted successfully!");
//       router.push("/dashboard/case-studies");
//     } catch (err) {
//       console.error("Error submitting answers:", err);
//       alert("Failed to submit answers. Please try again.");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <p className="text-gray-600 text-lg">Loading questions...</p>
//       </div>
//     );
//   }

//   if (questions.length === 0) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <p className="text-red-500 text-lg">No questions available.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md">
//         <h1 className="text-2xl font-bold text-blue-600 mb-4">
//           Case Study Questions
//         </h1>
//         <p className="text-gray-500 mb-6">
//           Answer the following questions carefully.
//         </p>

//         {questions.map((q, index) => (
//           <div
//             key={q.id}
//             className="mb-8 p-4 border border-gray-200 rounded-lg shadow-sm"
//           >
//             <h2 className="text-lg font-semibold mb-3">
//               {index + 1}. {q.questions}
//             </h2>

//             <div className="space-y-2">
//               {q.answers_options.map((opt) => (
//                 <label
//                   key={opt.id}
//                   className={`flex items-center p-2 border rounded-lg cursor-pointer ${
//                     selectedAnswers[q.id] === opt.id
//                       ? "border-blue-500 bg-blue-50"
//                       : "border-gray-300"
//                   }`}
//                 >
//                   <input
//                     type="radio"
//                     name={`question-${q.id}`}
//                     value={opt.id}
//                     checked={selectedAnswers[q.id] === opt.id}
//                     onChange={() => handleAnswerSelect(q.id, opt.id)}
//                     className="mr-3"
//                   />
//                   {opt.options}
//                 </label>
//               ))}
//             </div>
//           </div>
//         ))}

//         <div className="text-center">
//           <button
//             onClick={() => setShowModal(true)}
//             className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
//           >
//             Submit Answers
//           </button>
//         </div>
//       </div>

//       {/* ✅ Confirmation Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//             <h2 className="text-lg font-semibold mb-4 text-gray-800">
//               Confirm Submission
//             </h2>
//             <p className="text-gray-600 mb-6">
//               Are you sure you want to submit? You won’t be able to change your
//               answers.
//             </p>

//             <div className="flex justify-end gap-3">
//               <button
//                 className="px-4 py-2 rounded-lg border border-gray-400 text-gray-600 hover:bg-gray-100"
//                 onClick={() => setShowModal(false)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
//                 onClick={handleSubmit}
//               >
//                 Yes, Submit
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CaseStudyQuestions() {
  const { course_id } = useParams();
  const url = useAuthStore((state) => state.url);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [stats, setStats] = useState(null);
  const router = useRouter();

  // ✅ Fetch questions
  useEffect(() => {
    if (!course_id) return;

    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const res = await fetch(`${url}/case-studies/${course_id}/questions`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch questions");

        const data = await res.json();
        setQuestions(Array.isArray(data) ? data : [data]);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [course_id, url, router]);

  // ✅ Handle selecting an answer
  const handleAnswerSelect = (qId, optionId) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [qId]: optionId,
    }));
  };

  // ✅ Submit answers
  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      // Submit each answer
      for (const q of questions) {
        const selectedAnswerId = selectedAnswers[q.id];
        if (!selectedAnswerId) continue;

        const payload = {
          case_study_id: course_id,
          answers_options: q.id,
          selected_answer_id: selectedAnswerId,
        };

        await fetch(`${url}/case-studies/user/option`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      // Submit review
      await fetch(`${url}/case-studies/${course_id}/reviews`, {
        method: "GET", // ⚠️ confirm with backend if POST is required
        headers: { Authorization: `Bearer ${token}` },
      });

      // Fetch stats
      const statsRes = await fetch(
        `${url}/case-studies/user/${course_id}/case-study-stats`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!statsRes.ok) throw new Error("Failed to fetch stats");

      const statsData = await statsRes.json();
      setStats(statsData);
      setShowConfirmModal(false);
      setShowResultModal(true);

      toast.success("Case study submitted successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (err) {
      console.error("Error submitting answers:", err);
      toast.error("Failed to submit answers. Please try again.", {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 text-lg">Loading questions...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 text-lg">No questions available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ToastContainer />
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">
          Case Study Questions
        </h1>
        <p className="text-gray-500 mb-6">
          Answer the following questions carefully.
        </p>

        {questions.map((q, index) => (
          <div
            key={q.id}
            className="mb-8 p-4 border border-gray-200 rounded-lg shadow-sm"
          >
            <h2 className="text-lg font-semibold mb-3">
              {index + 1}. {q.questions}
            </h2>

            <div className="space-y-2">
              {q.answers_options.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-center p-2 border rounded-lg cursor-pointer ${
                    selectedAnswers[q.id] === opt.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    value={opt.id}
                    checked={selectedAnswers[q.id] === opt.id}
                    onChange={() => handleAnswerSelect(q.id, opt.id)}
                    className="mr-3"
                  />
                  {opt.options}
                </label>
              ))}
            </div>
          </div>
        ))}

        <div className="text-center">
          <button
            onClick={() => setShowConfirmModal(true)}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
          >
            Submit Answers
          </button>
        </div>
      </div>

      {/* ✅ Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Confirm Submission
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to submit? You won’t be able to change your
              answers.
            </p>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg border border-gray-400 text-gray-600 hover:bg-gray-100"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                onClick={handleSubmit}
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Result Modal (Figma Design) */}
      {showResultModal && stats && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Here’s how you did in your case studies.
            </h2>

            <p className="text-gray-700 mb-3">
              <span className="font-semibold text-blue-600">
                Score: {stats.correct_answers}/{stats.total_questions} (
                {stats.score}%)
              </span>{" "}
              {stats.passed ? (
                <span className="text-green-600 font-medium">✅ Pass</span>
              ) : (
                <span className="text-red-600 font-medium">❌ Fail</span>
              )}
            </p>

            <p className="text-gray-700 mb-6">
              You Earned:{" "}
              <span className="font-semibold text-blue-600">
                +{stats.points} points 👍
              </span>
            </p>

            <div className="flex flex-col gap-3">
              <button
                className="w-full py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                // onClick={() =>
                //   router.push(`/dashboard/case-studies/${course_id}/review`)
                // }
              >
                Review Case Studies Answers →
              </button>
              <button
                className="w-full py-3 rounded-lg border border-gray-400 text-gray-600 hover:bg-gray-100"
                onClick={() => router.push("/dashboard/case-studies")}
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
