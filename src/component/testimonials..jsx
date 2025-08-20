"use client";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import star from "../image/star.png";
import herodocto from "../image/herodoctor.png";

const Testimonials = () => {
  const reviews = [
    {
      name: "Maria Santos",
      role: "DHA Licensed Nurse",
      feedback:
        "Thanks to ELAB Academy, I passed my DHA exam in just 2 months of preparation. The mock exams and detailed analytics helped me track my progress effectively.",
    },
    {
      name: "Dr. Ahmed Hassan",
      role: "OMSB Resident",
      feedback:
        "The Middle East exam preparation was exactly what I needed. The regional content and practice questions were spot-on. Highly recommended!",
    },
    {
      name: "Sarah Johnson",
      role: "NCLEX-RN Graduate",
      feedback:
        "ELAB Academy transformed my NCLEX preparation. The AI-powered study plans helped me focus on my weak areas, and I passed on my first attempt!",
    },
  ];

  return (
    <section className="bg-[#F9FAFB] py-9 px-4 sm:px-6 md:px-12 lg:px-16">
      {/* Top Section */}
      <div className="flex flex-col-reverse lg:flex-row justify-between items-center gap-8 mb-10">
        {/* Left Content */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center lg:text-left max-w-xl lg:max-w-2xl space-y-4"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-snug text-gray-900">
            Join Thousands of{" "}
            <span className="text-blue-600">Successful Clinicians</span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
            At ELAB Academy, we believe that access, accuracy, and accountability are
            the cornerstones of effective preparation. That’s why we stand with you
            at every step—from registration to exam day, and even to your first day
            on the job abroad.
          </p>
          
          <motion.button

            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition"
          >
            Enroll Now →
          </motion.button>
        </motion.div>

        {/* Right Image */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="flex justify-center lg:justify-end w-full lg:w-auto"
        >
          <div className="relative w-[220px] sm:w-[260px] md:w-[300px] lg:w-[340px]">
            <Image
              src={herodocto}
              alt="Clinician"
              className="w-full object-cover"
            />
          </div>
        </motion.div>
      </div>

      {/* Testimonials Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        {reviews.map((review, i) => (
          <motion.div
            key={i}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-lg transition"
          >
            {/* Star Rating */}
            <div className="flex mb-3">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <Image
                    key={index}
                    src={star}
                    alt="star"
                    className="w-5 h-5 mr-1"
                  />
                ))}
            </div>

            {/* Feedback */}
            <p className="text-gray-700 italic mb-4 leading-relaxed">
              "{review.feedback}"
            </p>

            {/* Name & Role */}
            <h4 className="font-semibold text-gray-900">{review.name}</h4>
            <p className="text-gray-500 text-sm">{review.role}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Testimonials;
