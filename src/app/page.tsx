import React from 'react'
import Home from '../../src/Mainpage/Home'; 
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';
import Faq from '../component/Faq';
import Trial from '@/component/Trial'
const page = () => {
  return (
    <>
        <Navbar />
        <Home />
        <Faq />
        <Trial />
        <Footer />
    </>
  )
}

export default page


