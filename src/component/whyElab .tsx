"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

import aipoer from "../image/aipower.png"; // AI-powered image
import adaptive from "../image/adaptive.png"; // Adaptive testing image
import regional from "../image/regional.png"; // Regional content image
import analytics from "../image/analytics.png"; // Analytics image
import groups from "../image/groups.png"; // Study groups image
import success from "../image/success.png"; // Add success icon if exported

// const fadeUp = {
//   hidden: { opacity: 0, y: 40 },
//   show: (delay = 0) => ({
//     opacity: 1,
//     y: 0,
//     transition: { duration: 0.6, ease: "easeOut", delay },
//   }),
// };

const WhyElab = () => {
  const features = [
    {
      img: aipoer,
      title: "AI-Powered Learning",
      desc: "ELAB Assist provides personalized study recommendations and intelligent tutoring",
    },
    {
      img: adaptive,
      title: "Adaptive Testing",
      desc: "Smart practice sessions that adapt to your skill level and learning pace",
    },
    {
      img: regional,
      title: "Regional Content",
      desc: "Tailored content for Middle East (OMSB, DHA, Saudi Board) and Western exams",
    },
    {
      img: analytics,
      title: "Real-time Analytics",
      desc: "Track your progress with personalized study insights and intelligent reporting",
    },
    {
      img: groups,
      title: "Study Groups",
      desc: "Join collaborative learning communities and share knowledge",
    },
    {
      img: success, // fallback if you have a success icon image
      title: "Guaranteed Success",
      desc: "Comprehensive preparation with proven results and pass guarantees",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-9 px-6 md:px-9 lg:px-28">
      {/* Heading */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="text-center max-w-3xl mx-auto mb-5"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Why Choose <span className="text-blue-600">ELAB Academy</span>
        </h2>
        <p className="text-gray-600 text-lg">
          Comprehensive preparation platform designed specifically for healthcare professionals
        </p>
      </motion.div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            custom={i * 0.15}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition"
          >
            {/* Image Icon */}
            <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-blue-50 mb-3">
              <Image src={feature.img} alt={feature.title} className="w-8 h-8 object-contain" />
            </div>

            {/* Text */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default WhyElab;
