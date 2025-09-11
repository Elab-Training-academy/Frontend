
"use client";
import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

const SmartPractice = () => {
  const [questionType, setQuestionType] = useState("Mixed Practice");
  const [courseCategories, setCourseCategories] = useState(["All"]);
  const [categories, setCategories] = useState([]);
  const [difficulty, setDifficulty] = useState("Medium");
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({});

  const url = useAuthStore((state) => state.url);

  const questionTypes = ["Mixed Practice", "Fill in the gap", "Multiple choice"];
  const difficulties = ["Easy", "Medium", "Hard"];

  // Mappers
  const difficultyMap = { Easy: "easy", Medium: "medium", Hard: "hard" };
  const questionTypeMap = {
    "Mixed Practice": "mixed",
    "Fill in the gap": "fill_gap",
    "Multiple choice": "single_choice",
  };

  // ✅ Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`${url}/orders/ordered-courses`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.error("Failed to fetch courses:", res.status);
          return;
        }

        const data = await res.json();
        const courseList = Array.isArray(data) ? data : data.courses || [];
        setCourses(courseList);

        if (courseList.length > 0) {
          setSelectedCourse(courseList[0].course_id || courseList[0].id);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, [url]);

  // ✅ Fetch categories
  useEffect(() => {
    if (!selectedCourse) return;

    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(
          `${url}/course-categories/${selectedCourse}/categories`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) throw new Error(`Failed categories: ${res.status}`);
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [selectedCourse, url]);

  const toggleCategory = (category) => {
    if (category === "All") {
      setCourseCategories(["All"]);
    } else {
      const filtered = courseCategories.filter((c) => c !== "All");
      if (courseCategories.includes(category)) {
        const newCategories = filtered.filter((c) => c !== category);
        setCourseCategories(newCategories.length === 0 ? ["All"] : newCategories);
      } else {
        setCourseCategories([...filtered, category]);
      }
    }
  };

  // ✅ Fetch questions
  const startPractice = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Please login");

      const selectedCategoryName = courseCategories.find((c) => c !== "All");
      const selectedCategoryObj = categories.find((c) => c.name === selectedCategoryName);

      const payload = {
        course_id: selectedCourse,
        difficulty: difficultyMap[difficulty],
        question_type: questionTypeMap[questionType],
        course_category_id: selectedCategoryObj?.id || null,
      };

      const res = await fetch(`${url}/sp-questions/filter/questions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Failed to fetch questions: ${res.status}`);
      const data = await res.json();
      setQuestions(data);
      setAnswers({});
      setResults({});
    } catch (err) {
      console.error("Error starting practice:", err);
    }
  };

const submitAnswer = async (questionId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login");

    const q = questions.find((x) => x.id === questionId);
    let payload = { question_id: questionId };

    if (q.question_type === "fill_gap") {
  const userText = (answers[questionId] || "").trim().toLowerCase();

  // try to find matching answer id
  const matchedAnswer = q.answers.find(
    (a) => a.answer.trim().toLowerCase() === userText
  );

  payload = {
    question_id: questionId,
    selected_answer_ids: matchedAnswer ? [matchedAnswer.id] : null, // null instead of []
    text_answer: answers[questionId] || "",
  };
  } else {
      // multiple choice
      const selectedIds = answers[questionId] ? [answers[questionId]] : [];
      payload = {
        question_id: questionId,
        selected_answer_ids: selectedIds,
        text_answer: null,
      };
    }

    const res = await fetch(`${url}/sp-questions/user/submit-answer`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errData = await res.json();
      console.error("Submit failed response:", errData);
      throw new Error(`Failed submit: ${res.status}`);
    }

    const data = await res.json();
    setResults((prev) => ({ ...prev, [questionId]: data }));
  } catch (err) {
    console.error("Error submitting answer:", err);
  }
};



  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Smart Practice</h1>

        {/* Course Selection */}
        <div className="mb-6 space-y-4">
          {/* Select Course */}
          <div>
            <label className="block text-sm font-medium mb-1">Select Course</label>
            <select
              className="w-full border p-2 rounded"
              value={selectedCourse || ""}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              {loadingCourses ? (
                <option>Loading...</option>
              ) : (
                courses.map((c) => (
                  <option key={c.course_id || c.id} value={c.course_id || c.id}>
                    {c.course_name || c.title || "Unnamed Course"}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Select Category */}
          <div>
            <label className="block text-sm font-medium mb-1">Select Category</label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => toggleCategory("All")}
                className={`px-3 py-1 rounded border ${
                  courseCategories.includes("All") ? "bg-blue-600 text-white" : ""
                }`}
              >
                All
              </button>
              {loadingCategories ? (
                <span>Loading...</span>
              ) : (
                categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.name)}
                    className={`px-3 py-1 rounded border ${
                      courseCategories.includes(cat.name)
                        ? "bg-blue-600 text-white"
                        : ""
                    }`}
                  >
                    {cat.name}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Question Type */}
          <div>
            <label className="block text-sm font-medium mb-1">Question Type</label>
            <select
              className="w-full border p-2 rounded"
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
            >
              {questionTypes.map((qt) => (
                <option key={qt} value={qt}>
                  {qt}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium mb-1">Difficulty</label>
            <select
              className="w-full border p-2 rounded"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              {difficulties.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Start Practice button */}
        <button
          onClick={startPractice}
          className="w-full bg-blue-600 text-white py-3 rounded-xl shadow hover:bg-blue-700"
        >
          Start Practice
        </button>

        {/* Questions */}
        {questions.length > 0 && (
          <div className="mt-6 space-y-6">
            {questions.map((q) => (
              <div key={q.id} className="p-6 bg-white rounded-xl shadow">
                <h3 className="font-semibold text-lg mb-4">{q.question}</h3>

                {/* Render answers depending on question type */}
{q.question_type === "fill_gap" ? (
  // Fill in the gap → text input
  <input
    type="text"
    placeholder="Type your answer..."
    value={answers[q.id] || ""}
    onChange={(e) =>
      setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
    }
    className="w-full border p-2 rounded"
  />
) : (
  // Multiple choice → radio buttons
  <div className="space-y-2">
    {q.answers.map((a) => (
      <label key={a.id} className="flex items-center space-x-2">
        <input
          type="radio"
          name={`q-${q.id}`}
          value={a.id}
          checked={answers[q.id] === a.id}
          onChange={() =>
            setAnswers((prev) => ({ ...prev, [q.id]: a.id }))
          }
        />
        <span>{a.answer}</span>
      </label>
    ))}
  </div>
)}


                {/* Submit button */}
                <button
                  onClick={() => submitAnswer(q.id)}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Submit Answer
                </button>

                {/* Show result */}
                {results[q.id] && (
                  <div className="mt-3 p-3 rounded bg-gray-100">
                    <p>
                      {results[q.id].is_correct
                        ? "✅ Correct!"
                        : "❌ Wrong answer"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {results[q.id].reason}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
>>>>>>> f52c74db47bebd2f909403e7389eede5a2b6f559

