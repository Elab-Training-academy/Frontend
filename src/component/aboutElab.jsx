"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import adaptive from "../image/adaptive.png"; // Vision image
import mission from "../image/mission.png"; // Mission image

const AboutElab = () => {
  // counters
  const [students, setStudents] = useState(0);
  const [passRate, setPassRate] = useState(0);

  useEffect(() => {
    let studentTarget = 15000;
    let passTarget = 95;

    const studentInterval = setInterval(() => {
      setStudents((prev) => {
        if (prev < studentTarget) return prev + 250; // speed
        clearInterval(studentInterval);
        return studentTarget;
      });
    }, 50);

    const passInterval = setInterval(() => {
      setPassRate((prev) => {
        if (prev < passTarget) return prev + 1;
        clearInterval(passInterval);
        return passTarget;
      });
    }, 80);

    return () => {
      clearInterval(studentInterval);
      clearInterval(passInterval);
    };
  }, []);

  return (
    <section className="  text-black px-6 md:px-20 lg:px-16 py-5 bg-white">
      {/* Heading */}
      <div className=" flex flex-col items-center w-full mx-auto ">
        <h2 className="text-2xl md:text-3xl font-semibold mb-1 ">
          About <span className="text-blue-500">ELAB Academy</span>
        </h2>
        <p className="text-gray-500 text-lg mb-1">
          Empowering Healthcare Professionals to Succeed — Wherever They Are.
        </p>
        <p className="text-gray-400 mb-3">
          ELAB Academy is the academic division of ELAB Solutions International
          LLC, a globally trusted partner for healthcare licensure and
          professional development. Founded with a bold mission to simplify and
          strengthen the journey of international healthcare professionals. ELAB
          Academy provides high-impact exam preparation, licensure support, and
          career advancement training for nurses, midwives, doctors,
          pharmacists, and allied health professionals.
        </p>
        <p className="text-gray-400 mb-3">
          We specialize in preparing candidates for critical licensure and
          qualifying exams such as the Saudi SCFHS licensing exam, Prometric,
          NCLEX- RN/PN, CGFNS, DHA, HAAD, MOHAP, and English language
          proficiency exams like OET and IELTS. But we are more than just a test
          prep center.
        </p>
        <p className="text-gray-400">
          At ELAB Academy, we combine rigorous academic content, smart
          technology, and hands-on licensing guidance to deliver a unique
          end-to-end solution—from learning to licensure. Whether you're
          studying from Nigeria, the Philippines, Kenya, India, Saudi Arabia, or
          the United States, our programs are built to meet you where you are— 
          and take you where you want to go.
        </p>
      </div>

      {/* Vision & Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mt-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:scale-105 transition-transform">
          <div className="flex justify-center mb-4">
            <Image
              src={adaptive}
              alt="Vision"
              className="w-20 h-20 object-contain"
            />
          </div>
          <h3 className="text-lg font-semibold mb-2">Our Vision</h3>
          <p className="text-gray-600">
            To be the most trusted global hub for healthcare exam readiness and
            licensing success.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:scale-105 transition-transform">
          <div className="flex justify-center mb-4">
            <Image
              src={mission}
              alt="Mission"
              className="w-20 h-20 object-contain"
            />
          </div>
          <h3 className="text-lg font-semibold mb-2">Our Mission</h3>
          <p className="text-gray-600">
            To equip every international healthcare professional with the tools,
            knowledge, and support to pass their licensing exams confidently and
            practice without borders.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mt-16 max-w-5xl mx-auto">
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-blue-500">
            {students.toLocaleString()}+
          </h3>
          <p className="text-gray-400">Active Students</p>
        </div>
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-blue-500">
            {passRate}%
          </h3>
          <p className="text-gray-400">Pass Rate</p>
        </div>
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-blue-500">
            50,000+
          </h3>
          <p className="text-gray-400">Practice Questions</p>
        </div>
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-blue-500">24/7</h3>
          <p className="text-gray-400">Support Available</p>
        </div>
      </div>
    </section>
  );
};

export default AboutElab;
