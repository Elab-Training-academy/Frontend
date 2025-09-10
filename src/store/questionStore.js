// src/store/questionStore.js
import { create } from "zustand";
import axios from "axios";

const BASE_URL = "https://elab-server-xg5r.onrender.com";

let TOKEN = null;

// Expose function to update token from anywhere
export const setToken = (token) => {
  TOKEN = token;
  console.log("Token updated:", TOKEN ? "✅ Set" : "❌ Empty");
};

export const useQuestionStore = create((set, get) => ({
  categories: [],
  questions: [],
  currentIndex: 0,
  loading: false,
  error: null,

  // ✅ Utility setters (can be called from UI too)
  setQuestions: (questions) => set({ questions, currentIndex: 0 }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Add user answers tracking
  setAnswerForCurrent: (answer) => {
    const state = get();
    const updatedQuestions = [...state.questions];
    if (updatedQuestions[state.currentIndex]) {
      updatedQuestions[state.currentIndex].userAnswer = answer;
      set({ questions: updatedQuestions });
    }
  },

  // 🔹 1) Fetch categories by courseId
  fetchCategories: async (courseId) => {
    try {
      set({ loading: true, error: null });
      
      if (!TOKEN) {
        throw new Error("Authentication token is missing. Please log in.");
      }

      if (!courseId) {
        throw new Error("Course ID is required to fetch categories");
      }

      const url = `${BASE_URL}/course-categories/${courseId}/categories`;
      console.log("Fetching categories from:", url);

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Categories response:", res.data);
      set({ categories: res.data || [], loading: false });
    } catch (err) {
      console.error("Error fetching categories:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch categories";
      set({
        error: errorMessage,
        loading: false,
        categories: [],
      });
    }
  },

  // 🔹 2) Fetch questions with filters (POST)
  fetchQuestions: async (filters) => {
    try {
      set({ loading: true, error: null });
      
      if (!TOKEN) {
        throw new Error("Authentication token is missing. Please log in.");
      }

      if (!filters.courseId) {
        throw new Error("courseId is required to fetch questions");
      }

      const body = {
        courseId: filters.courseId,
        categoryId: filters.category === "All" ? null : filters.category,
        difficulty: filters.difficulty || "Easy",
        type: filters.type || "Mixed Practice",
        search: filters.search || "",
      };

      console.log("Sending filters:", body);

      const res = await axios.post(
        `${BASE_URL}/sp-questions/filter/questions`,
        body,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      console.log("Questions response:", res.data);

      // API may return { questions: [] } or just []
      const questionsData = res.data?.questions || res.data || [];

      if (!Array.isArray(questionsData)) {
        throw new Error("Invalid response format: questions should be an array");
      }

      set({
        questions: questionsData,
        currentIndex: 0,
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error("Error fetching questions:", err);

      let errorMessage = "Failed to fetch questions";
      if (err.code === "ECONNABORTED") {
        errorMessage = "Request timeout. Please try again.";
      } else if (err.response) {
        errorMessage =
          err.response.data?.message ||
          err.response.data?.error ||
          `Server error: ${err.response.status}`;
      } else if (err.request) {
        errorMessage = "Network error. Please check your connection.";
      } else {
        errorMessage = err.message;
      }

      set({
        error: errorMessage,
        loading: false,
        questions: [],
      });
    }
  },

  // 🔹 Navigation
  nextQuestion: () =>
    set((state) => ({
      currentIndex: Math.min(
        state.currentIndex + 1,
        state.questions.length - 1
      ),
    })),

  prevQuestion: () =>
    set((state) => ({
      currentIndex: Math.max(state.currentIndex - 1, 0),
    })),

  // 🔹 Reset state
  resetQuiz: () =>
    set({
      questions: [],
      currentIndex: 0,
      error: null,
    }),

  // 🔹 Clear error
  clearError: () => set({ error: null }),
}));
