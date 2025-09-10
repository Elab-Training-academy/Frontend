"use client";
import React, { useEffect, useState } from "react";
import { useQuestionStore } from "@/store/questionStore";

// Utility: find fields in various API shapes
const qText = q => q.question ?? q.text ?? q.questionText ?? q.title ?? "";
const qOptions = q => q.options ?? q.choices ?? q.answers ?? q.optionsList ?? [];
const qCorrect = q => q.correct ?? q.answer ?? q.correctAnswer ?? q.correct_option ?? null;

const QuizQuestion = () => {
  const questions = useQuestionStore(state => state.questions);
  const currentIndex = useQuestionStore(state => state.currentIndex);
  const nextQuestion = useQuestionStore(state => state.nextQuestion);
  const prevQuestion = useQuestionStore(state => state.prevQuestion);
  const setAnswerForCurrent = useQuestionStore(state => state.setAnswerForCurrent);

  const question = questions[currentIndex];
  const [selected, setSelected] = useState(question?.userAnswer ?? null);
  const [submitted, setSubmitted] = useState(Boolean(question?.userAnswer));

  // Reset local selection/submission whenever question (or index) changes
  useEffect(() => {
    setSelected(question?.userAnswer ?? null);
    setSubmitted(Boolean(question?.userAnswer));
  }, [question?.id ?? currentIndex]);

  if (!question) return null;

  const options = qOptions(question).length ? qOptions(question) : (question.optionList ?? [
    // fallback if API uses different structure:
    question.optionA, question.optionB, question.optionC, question.optionD
  ].filter(Boolean));

  const correct = qCorrect(question);

  const onSelect = (opt) => {
    // store answer in Zustand and show feedback
    setAnswerForCurrent(opt);
    setSelected(opt);
    setSubmitted(true);
  };

  const isCorrect = (opt) => (correct == null ? false : opt === correct);

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6">
      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-500">
          Question {currentIndex + 1} / {questions.length}
        </div>
        <div className="text-sm text-gray-500">Difficulty: {question.difficulty ?? "—"}</div>
      </div>

      {/* Question text */}
      <h2 className="text-lg font-semibold text-center mb-6">{qText(question)}</h2>

      {/* Options */}
      <div className="space-y-3">
        {options.map((opt, idx) => {
          // determine style depending on submitted state
          let base = "w-full border rounded-xl px-4 py-3 text-left cursor-pointer transition-colors";
          if (submitted) {
            if (isCorrect(opt)) base += " border-green-500 bg-green-50 text-green-800";
            else if (opt === selected && !isCorrect(opt)) base += " border-red-500 bg-red-50 text-red-800";
            else base += " border-gray-300 bg-white";
          } else {
            base += " border-gray-300 hover:bg-gray-50";
          }

          return (
            <button
              key={idx}
              onClick={() => !submitted && onSelect(opt)}
              disabled={submitted}
              className={base}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {submitted && (
        <div className="mt-6 p-4 rounded-lg bg-gray-50 border">
          <p className="mb-2"><span className="font-medium">Your Answer:</span> {selected}</p>
          {selected === correct ? (
            <p className="text-green-600">✅ Correct: {correct}</p>
          ) : (
            <p className="text-red-600">❌ Incorrect: Correct answer is {correct}</p>
          )}
        </div>
      )}

      {/* Nav buttons */}
      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => prevQuestion()}
          disabled={currentIndex === 0}
          className="py-2 px-4 border rounded-lg disabled:opacity-50"
        >
          Previous
        </button>

        <div className="flex gap-3">
          {currentIndex < questions.length - 1 ? (
            <button
              onClick={() => nextQuestion()}
              className="py-2 px-4 bg-blue-600 text-white rounded-lg"
            >
              Next
            </button>
          ) : (
            <button
              onClick={() => alert("End of quiz — implement results flow")}
              className="py-2 px-4 bg-green-600 text-white rounded-lg"
            >
              Finish
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizQuestion;
