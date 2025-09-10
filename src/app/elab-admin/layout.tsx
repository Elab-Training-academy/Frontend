"use client";
import { useState, useEffect } from "react";
import Admin from "@/component/Adminbar";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem("token"); // or from your authStore
    if (!token) {
      router.replace("/login"); // 🚀 Redirect if no token
    }
  }, [router]);

  // Close sidebar when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const adminRoles = ["admin", "staff"];

  if (!token) {
    router.replace("/login");
  } else if (adminRoles.includes(role as string)) {
    setAllowed(true);
  } else {
    router.replace("/dashboard");
  }
}, [router]);


  if (!allowed) return null; // while checking


  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile toggle button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(true)}
        aria-label="Open navigation menu"
      >
        <Menu size={22} className="text-gray-700" />
      </button>

      {/* Desktop Sidebar - Always visible on lg+ screens */}
      <div className="hidden lg:block w-64 shrink-0">
        <div className="fixed top-0 left-0 h-full w-74">
          {/* <Admin /> No onClose here */}
          <Admin onClose={() => setIsOpen(false)} />
        </div>
      </div>

      {/* Mobile Sidebar - Sliding panel */}
      <div
        className={`fixed lg:hidden z-40 inset-y-0 left-0 w-64 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <Admin onClose={() => setIsOpen(false)} /> {/* Pass onClose only for mobile */}
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-0 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-6">{children}</div>
      </main>
    </div>
  );
}
