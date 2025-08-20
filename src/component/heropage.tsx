"use client";

import React from "react";
import Image from "next/image";
import doctopn from "../image/doctor.png";

const HeroSection = () => {
  return (
    <section className="flex justify-between flex-col-reverse lg:flex-row items-center px-6 md:px-12 lg:px-16 py-7 bg-white">
      {/* Left Content */}
      <div className="space-y-6 text-center lg:text-left max-w-2xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-black leading-snug">
          Master Your Medical <br /> Licensing Exams <br /> with Confidence
        </h1>
        <p className="text-gray-700 text-base sm:text-lg md:text-lg leading-relaxed">
          Comprehensive preparation for NCLEX-RN, OMSB, DHA, Saudi Board, and
          more. Join the thousands who've succeeded with our proven
          methodology.
        </p>
      </div>

      {/* Right Content */}
      <div className="mb-10 lg:mb-0 flex justify-center lg:justify-end w-fit lg:w-auto">
        <div className="relative w-[240px] h-[240px] sm:w-[320px] sm:h-[320px] md:w-[400px] md:h-[400px] lg:w-[494px] lg:h-[494px]">
          <Image
            src={doctopn}
            alt="Clinician"
            className="w-full object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
