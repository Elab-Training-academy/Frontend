"use client";

import Link from "next/link";

export default function ExamCategorySection() {
  const categories = [
    {
      title: "NCLEX-RN",
      description:
        "Comprehensive NCLEX-RN preparation with AI-powered study plans, unlimited practice questions, and CAT simulations.",
      href: "/nclex",
    },
    {
      title: "Middle East",
      description:
        "Master the OMSB, DHA, SBE examination with region-specific content and expert guidance.",
      href: "/middle-east",
    },
    {
      title: "English",
      description: "Master healthcare-specific English for OET, IELTS.",
      href: "/english",
    },
  ];

  return (
    <section className="py-12 bg-white px-4 sm:px-6 md:px-12 lg:px-16">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4">
          Select Your Exam Category
        </h2>
        <p className="text-center text-gray-600 text-sm sm:text-base md:text-lg mb-10">
          Choose from our comprehensive selection of exam preparation courses designed to help you succeed in your healthcare career.
        </p>

        {/* Responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, index) => (
            <Link
              href={cat.href}
              key={index}
              className="p-6 bg-blue-50  shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col justify-between"
            >
              <h3 className="font-[Inter] font-bold text-lg sm:text-xl text-[#2563EB] mb-2">
                {cat.title}
              </h3>
              <p className="font-[Geist] font-normal text-sm sm:text-base text-[#64748B]">
                {cat.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
