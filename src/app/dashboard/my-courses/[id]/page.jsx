"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { ChevronRight, BookOpen, Clock } from "lucide-react";

const CourseModulesPage = () => {
  const { id } = useParams(); // course_id
  const url = useAuthStore((state) => state.url);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${url}/courses/modules/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.error("Failed to fetch modules:", res.status);
          setModules([]);
          return;
        }

        const data = await res.json();
        console.log(data);
        
        setModules(data);
      } catch (error) {
        console.error("Error fetching modules:", error);
        setModules([]);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchModules();
  }, [id, url]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Course Modules</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/dashboard/my-courses" className="hover:text-blue-600">
            My Courses
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Modules</span>
        </nav>

        {/* Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            📘 Course Modules
          </h2>
          <p className="text-gray-600">
            Explore all modules in this course and access their scheduled classes.
          </p>
        </div>

        {/* Modules Grid */}
        {loading ? (
          <p className="text-gray-500">Loading modules...</p>
        ) : modules.length === 0 ? (
          <p className="text-gray-500">No modules found for this course.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <Link
                key={module.id}
                href={`/dashboard/my-courses/${id}/modules/${module.id}/schedule`}
              >
                <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl shadow hover:shadow-lg transition transform hover:-translate-y-1 cursor-pointer">
                  <div className="flex items-center mb-3">
                    <BookOpen className="w-6 h-6 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-blue-700">
                      {module.title || "Untitled Module"}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium text-gray-800">Order:</span>{" "}
                    {module.order_number || "N/A"}
                  </p>
                  <p className="text-sm flex items-center text-gray-600">
                    <Clock className="w-4 h-4 text-gray-500 mr-1" />
                    Duration:{" "}
                    <span className="ml-1 font-medium text-gray-800">
                      {module.duration || "Not set"}
                    </span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseModulesPage;