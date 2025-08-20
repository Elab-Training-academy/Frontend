'use client';
import React from "react";
import AboutElab from '@/component/aboutElab'
import HeroSection from '@/component/heropage'
import Testimonials from '@/component/testimonials.'
import Examprep from '@/component/Examprep'
import WhyElab from '@/component/whyElab '


const Home = () => {
  return (
    <div>
      <HeroSection/>
      <Testimonials/>
      <Examprep />
      <WhyElab />
      <AboutElab/>
    </div>
  )
}

export default Home