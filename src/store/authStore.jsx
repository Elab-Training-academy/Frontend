"use client";

// src/store/authStore.js
import { create } from "zustand";

export const useAuthStore = create((set, get) => ({
  courses: [],
  url: "https://elab-server-xg5r.onrender.com",
  token: null,
  user: null,


  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  clearToken: () => set({ token: null }),

  loadToken: () => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        set({ token: storedToken });
      }
    }
  },

  setCourses: (courses) => set({ courses }),

  // Categories
  categories: [],
  setCategories: (categories) => set({ categories }),

  // Smart Practice
  smartPractices: [],
  setSmartPractices: (smartPractices) => set({ smartPractices }),

  loading: false,

  // Fetch categories
  fetchAllCategories: async () => {
    const url = get().url;
    const newToken = get().token;
    try {
      set({ loading: true });
      const response = await fetch(`${url}/categories/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${newToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        set({ categories: data });
      } else {
        console.error("Failed to fetch categories:", response.status);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      set({ loading: false });
    }
  },

  // Fetch Smart Practice
  fetchAllSmartPractice: async () => {
    const url = get().url;
    const newToken = get().token;
    try {
      set({ loading: true });
      const response = await fetch(`${url}/sp-questions`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${newToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        set({ smartPractices: data });
      } else {
        console.error("Failed to fetch smart practices:", response);
      }
    } catch (err) {
      console.error("Error fetching smart practices:", err);
    } finally {
      set({ loading: false });
    }
  },

  // Fetch all courses
  fetchAllCourses: async () => {
    const { url } = get();
    if (typeof window === "undefined") return;
    set({ loading: true });
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${url}/courses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        console.error("Failed to fetch courses", res.status);
        set({ courses: [] });
        return;
      }
      const data = await res.json();
      set({ courses: data });
    } catch (err) {
      console.error("Error fetching courses:", err);
      set({ courses: [] });
    } finally {
      set({ loading: false });
    }
  },

  // Fetch user
  fetchUser: async () => {
    const { url } = get();
    if (typeof window === "undefined") return;
    set({ loading: true });
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${url}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        console.error("Failed to fetch user", res.status);
        set({ user: null });
        return;
      }
      const data = await res.json();
      set({ user: data });
    } catch (err) {
      console.error("Error fetching user:", err);
      set({ user: null });
    } finally {
      set({ loading: false });
    }
  },

  // Orders
  orders: [],
  ordersLoading: false,
  fetchOrders: async () => {
    const { url } = get();
    if (typeof window === "undefined") return;
    set({ ordersLoading: true });
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${url}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        console.error("Failed to fetch orders", res.status);
        set({ orders: [] });
        return;
      }
      const data = await res.json();
      set({ orders: data });
    } catch (err) {
      console.error("Error fetching orders:", err);
      set({ orders: [] });
    } finally {
      set({ ordersLoading: false });
    }
  },

  // Create order
  createOrder: async (courseId) => {
    const { token, url } = get();
    if (!token) {
      console.error("No token found. User must be logged in.");
      return false;
    }
    try {
      const response = await fetch(`${url}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ course_id: courseId }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to create order:", response.status, errorData);
        return false;
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating order:", error);
      return false;
    }
  },

  // Index courses
  fetchIndexCourses: async () => {
    const { url } = get();
    set({ loading: true });
    try {
      const res = await fetch(`${url}/index/courses`);
      if (!res.ok) {
        console.error("Failed to fetch index courses", res.status);
        set({ courses: [] });
        return;
      }
      const data = await res.json();
      set({ courses: data });
    } catch (err) {
      console.error("Error fetching index courses:", err);
      set({ courses: [] });
    } finally {
      set({ loading: false });
    }
  },

  // Profile
  fetchProfile: async () => {
  const { url } = get();
  set({ loadingProfile: true });
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${url}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return set({ profile: null });
    set({ profile: await res.json() });
  } catch (err) {
    console.error("Error fetching profile:", err);
    set({ profile: null });
  } finally {
    set({ loadingProfile: false });
  }
},

updateProfile: async (updatedData) => {
  const { url } = get();
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${url}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });
    if (!res.ok) return false;
    set({ profile: await res.json() });
    return true;
  } catch (err) {
    console.error("Error updating profile:", err);
    return false;
  }
},


  sendChat: async (message, file = null) => {
  const url = get().url;
  const token = get().token;
  
  try {
    set({ loading: true });
    
    // Prepare request body and headers
    let body;
    let headers = {
      Authorization: `Bearer ${token}`,
    };

    if (file) {
      // Use FormData for file uploads
      const formData = new FormData();
      formData.append("message", message);
      formData.append("file", file);
      body = formData;
    } else {
      // JSON for text-only messages
      headers["Content-Type"] = "application/json";
      body = JSON.stringify({ message });
    }

    const response = await fetch(`${url}/deepseek/chat/`, {
      method: "POST",
      headers,
      body,
    });

    if (response.ok) {
      const data = await response.json();
      
      // Update messages in store
      set((state) => ({
        messages: [
          ...(state.messages || []),
          { 
            role: "user", 
            content: message,
            file: file ? { name: file.name, size: file.size } : null,
            timestamp: new Date().toISOString()
          },
          {
            role: "assistant",
            content: data.reply,
            timestamp: new Date().toISOString()
          }
        ]
      }));
      
      return data;
    } else {
      console.error("Failed to send chat:", response.status);
      return null;
    }
  } catch (err) {
    console.error("Error sending chat:", err);
    return null;
  } finally {
    set({ loading: false });
  }
},
    // getQuestions of smart practice for usr


    
  getQuestions: async (filters = {}) => {
  const url = get().url;
  const token = get().token;

  try {
    set({ loading: true });

    const query = new URLSearchParams(filters).toString();
    const response = await fetch(`${url}/sp-questions/filter/questions?${query}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();

      set({ questions: data.questions || [] });

      return data;
    } else {
      console.error("Failed to fetch questions:", response.status);
      return null;
    }
  } catch (err) {
    console.error("Error fetching questions:", err);
    return null;
  } finally {
    set({ loading: false });
  }
},



}));

