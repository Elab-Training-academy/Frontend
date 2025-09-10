"use client";
import React from "react";
import { useQuestionStore } from "@/store/questionStore";

const QuizPage = () => {
  const { questions, currentIndex, nextQuestion, prevQuestion } =
    useQuestionStore();

  if (questions.length === 0) {
    return <p className="p-6">No questions found. Go back and try again.</p>;
  }

  const current = questions[currentIndex];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">
        Question {currentIndex + 1} of {questions.length}
      </h1>
      <div className="bg-white shadow rounded-lg p-4">
        <p className="mb-4">{current.questionText}</p>
        {current.options &&
          current.options.map((opt, i) => (
            <div key={i} className="mb-2">
              <label className="flex items-center space-x-2">
                <input type="radio" name="option" />
                <span>{opt}</span>
              </label>
            </div>
          ))}
      </div>

      {/* Nav */}
      <div className="flex justify-between mt-6">
        <button
          onClick={prevQuestion}
          disabled={currentIndex === 0}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={nextQuestion}
          disabled={currentIndex === questions.length - 1}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default QuizPage;
