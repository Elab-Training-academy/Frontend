
"use client";
import React, { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/authStore";

const ProgressModal = ({ moduleId, isOpen, onClose }) => {
  const url = useAuthStore((state) => state.url);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const fetchStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) return setError("No token found");

        const res = await fetch(
          `${url}/answer-options/user/${moduleId}/question-stats`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch stats");

        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError(err.message || "Error fetching stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isOpen, moduleId, url]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 transition-opacity">
      <div className="bg-white rounded-3xl w-96 p-6 relative shadow-xl animate-slideIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
        >
          ✖
        </button>

        {/* Modal Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Quiz Progress
        </h2>

        {/* Loading & Error States */}
        {loading && (
          <p className="text-gray-500 text-center py-6">Loading stats...</p>
        )}
        {error && (
          <p className="text-red-500 text-center py-6 font-medium">{error}</p>
        )}

        {/* Stats Content */}
        {stats && (
          <div className="space-y-6">
            {/* Accuracy Card */}
            <div className="p-4 bg-gray-50 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-gray-800 font-semibold mb-2">Accuracy</h3>
                
                {/* Text */}
                <div className="flex justify-between mb-2 text-sm text-gray-600">
                    <span>Accuracy</span>
                    <span>
                    {Number(stats.accuracy_percentage).toFixed(2)} / 100%
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
                    <div
                    className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                    style={{
                        width: `${Number(stats.accuracy_percentage)}%`,
                    }}
                    ></div>
                </div>
                </div>

            {/* Score Card */}
            <div className="p-4 bg-gray-50 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-gray-800 font-semibold mb-2">Score</h3>
              <div className="flex justify-between mb-2 text-sm text-gray-600">
                <span>Correct Answers</span>
                <span>{stats.total_correct_answers} / {stats.total_questions_answered}</span>
              </div>
              <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
                <div
                  className="bg-green-500 h-4 rounded-full transition-all duration-500"
                  style={{
                    width: `${(stats.total_correct_answers / stats.total_questions) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


const QuestionPage = ({ params }) => {
    const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;
  const url = useAuthStore((state) => state.url);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState({});
  const [reviews, setReviews] = useState([]);
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const [timeUp, setTimeUp] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const timerRef = useRef(null);


  

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return setError("No token found");

        const res = await fetch(`${url}/modules/questions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          setError("Failed to fetch questions");
          return;
        }

        const data = await res.json();
        setQuestions(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Error fetching questions");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [id, url]);

  // Countdown timer
    useEffect(() => {
    if (loading || timeUp) return;

    if (timeLeft <= 0) {
        setTimeUp(true);
        handleSubmit();
        return;
    }

    timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
    }, [timeLeft, loading, timeUp]);


  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleAnswerChange = (q, value, type) => {
    if (timeUp) return;
    setAnswers((prev) => {
      if (type === "multi_choice") {
        const current = prev[q.id] || [];
        if (current.includes(value)) {
          return { ...prev, [q.id]: current.filter((v) => v !== value) };
        } else {
          return { ...prev, [q.id]: [...current, value] };
        }
      } else if (type === "fill_gap") {
        return { ...prev, [q.id]: value };
      } else {
        return { ...prev, [q.id]: value };
      }
    });
  };

  const handleSubmit = async () => {
    clearInterval(timerRef.current); // ✅ stop the timer immediately
    setTimeUp(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return setError("No token found");

      for (const q of questions) {
        let payload = { question_id: q.id, selected_answer_ids: [] };

        if (q.answer_type === "single_choice") {
          if (answers[q.id]) payload.selected_answer_ids = [answers[q.id]];
        }

        if (q.answer_type === "multi_choice") {
          if (answers[q.id]?.length) payload.selected_answer_ids = answers[q.id];
        }

        if (q.answer_type === "fill_gap") {
          payload.text_answer = answers[q.id] || "";
        }

        await fetch(`${url}/answer-options/user/option`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      const reviewRes = await fetch(
        `${url}/answer-options/user/question-reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ module_id: id }),
        }
      );

      if (!reviewRes.ok) throw new Error("Failed to fetch reviews");

      const reviewData = await reviewRes.json();
      setReviews(reviewData);

      // Open progress modal after submit
      setIsProgressOpen(true);
    } catch (err) {
      console.error("Error submitting answers", err);
    }
  };

  const getReviewForQuestion = (qid) => {
    return reviews.find((r) => r.question_id === qid);
  };

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Module Questions</h1>
          <div className="flex items-center gap-4">
            <div
              className={`text-lg font-semibold ${
                timeLeft <= 120 ? "text-red-600" : "text-black"
              }`}
            >
              Time Left: {formatTime(timeLeft)}
            </div>
            <button
              onClick={() => setIsProgressOpen(true)}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              View Progress
            </button>
          </div>
        </div>

        {/* Question Navigation */}
        <div className="mb-6 flex flex-wrap gap-2">
          {questions.map((q, index) => (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(index)}
              className={`w-10 h-10 rounded-full border flex items-center justify-center font-medium ${
                currentIndex === index
                  ? "bg-blue-600 text-white"
                  : answers[q.id]
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {/* Current Question */}
        {!loading && !error && currentQuestion && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {currentIndex + 1}. {currentQuestion.question_text}
              </h2>
              <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700">
                {currentQuestion.answer_type}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Points: {currentQuestion.points}
            </p>

            <div className="space-y-3">
              {currentQuestion.answer_type === "single_choice" &&
                currentQuestion.answer_options.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer ${
                      timeUp ? "opacity-50 pointer-events-none" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name={currentQuestion.id}
                      value={opt.id}
                      checked={answers[currentQuestion.id] === opt.id}
                      onChange={() =>
                        handleAnswerChange(
                          currentQuestion,
                          opt.id,
                          "single_choice"
                        )
                      }
                      disabled={timeUp}
                    />
                    <span>{opt.option_text}</span>
                  </label>
                ))}

              {currentQuestion.answer_type === "multi_choice" &&
                currentQuestion.answer_options.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer ${
                      timeUp ? "opacity-50 pointer-events-none" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      name={currentQuestion.id}
                      value={opt.id}
                      checked={answers[currentQuestion.id]?.includes(opt.id)}
                      onChange={() =>
                        handleAnswerChange(
                          currentQuestion,
                          opt.id,
                          "multi_choice"
                        )
                      }
                      disabled={timeUp}
                    />
                    <span>{opt.option_text}</span>
                  </label>
                ))}

              {currentQuestion.answer_type === "fill_gap" && (
                <input
                  type="text"
                  placeholder="Type your answer..."
                  className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    timeUp ? "opacity-50 pointer-events-none" : ""
                  }`}
                  value={answers[currentQuestion.id] || ""}
                  onChange={(e) =>
                    handleAnswerChange(
                      currentQuestion,
                      e.target.value,
                      "fill_gap"
                    )
                  }
                  disabled={timeUp}
                />
              )}
            </div>

            {/* Review feedback */}
            {timeUp && getReviewForQuestion(currentQuestion.id) && (
              <div className="mt-4 p-3 rounded-lg bg-gray-50 border">
                {getReviewForQuestion(currentQuestion.id).is_correct ? (
                  <p className="text-green-600 font-medium">✅ Correct Answer</p>
                ) : (
                  <p className="text-red-600 font-medium">❌ Incorrect Answer</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        {!loading && !error && questions.length > 0 && !timeUp && (
          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
              disabled={currentIndex === 0}
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 disabled:opacity-50"
            >
              Previous
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() =>
                  setCurrentIndex((prev) =>
                    Math.min(prev + 1, questions.length - 1)
                  )
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Submit & Review
              </button>
            )}
          </div>
        )}

        {/* Progress Modal */}
        <ProgressModal
          moduleId={id}
          isOpen={isProgressOpen}
          onClose={() => setIsProgressOpen(false)}
        />
      </div>
    </div>
  );
};

export default QuestionPage;



