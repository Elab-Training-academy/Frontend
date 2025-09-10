// 'use client';
// import React, { useState, useRef } from 'react';
// import Image from 'next/image';
// import { useRouter } from 'next/navigation'; // ✅ Import router
// import max from '../../image/Group 75.png';
// import { useAuthStore } from '@/store/authStore';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { motion } from 'framer-motion';

// const OtpVerificationPage = ({ email: initialEmail }) => {
//   const [email] = useState(initialEmail || '');
//   const [otp, setOtp] = useState(['', '', '', '', '', '']);
//   const otpRefs = useRef([]);
//   const url = useAuthStore((state) => state.url);
//   const router = useRouter(); // ✅ Initialize router

//   // Submit OTP for verification
//   const handleOtpSubmit = async (e) => {
//     e.preventDefault();
//     const otpCode = otp.join('');
//     try {
//       const res = await fetch(`${url}/auth/verify-otp`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, otp: otpCode }),
//       });

//       if (res.ok) {
//         toast.success('OTP verified successfully!');
        
        
//         setTimeout(() => {
//           router.push(`/resetpassword?${encodeURIComponent(email)}`);
//         }, 1500);
//       } else {
//         toast.error('Invalid OTP');
//       }
//     } catch (err) {
//       toast.error('Error verifying OTP');
//     }
//   };

//   const handleOtpChange = (value, index) => {
//     if (/^[0-9]?$/.test(value)) {
//       const newOtp = [...otp];
//       newOtp[index] = value;
//       setOtp(newOtp);
//       if (value && index < 5) otpRefs.current[index + 1]?.focus();
//     }
//   };

//   const handleResendOtp = async () => {
//     try {
//       const res = await fetch(`${url}/auth/request-otp`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email }),
//       });
//       if (res.ok) toast.info(`OTP resent to ${email}`);
//     } catch (err) {
//       toast.error('Error resending OTP');
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col justify-center items-center px-4">
//       <div className="flex flex-col items-center text-center max-w-md w-full">
//          <a href='/' className="flex items-center justify-center mb-4">
//           <Image
//             src={max}
//             alt="ELAB Logo"
//             className="w-[100%] max-w-[80px] sm:max-w-[70px] md:max-w-[50px] lg:max-w-[80px] xl:max-w-[70px] h-auto"
//           />
//         </a>

//         {/* OTP Verification */}
//         <motion.div
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.4 }}
//           className="w-full"
//         >
//           <h1 className="text-2xl font-bold mb-2">Verify OTP</h1>
//           <p className="text-gray-600 mb-6">
//             Enter the code we sent to <span className="font-semibold">{email}</span>
//           </p>
//           <form onSubmit={handleOtpSubmit} className="w-full flex flex-col gap-3">
//             <div className="flex justify-between gap-2">
//               {otp.map((digit, index) => (
//                 <input
//                   key={index}
//                   type="text"
//                   maxLength={1}
//                   value={digit}
//                   ref={(el) => (otpRefs.current[index] = el)}
//                   onChange={(e) => handleOtpChange(e.target.value, index)}
//                   className="w-12 h-12 border rounded-md text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               ))}
//             </div>
//             <button
//               type="submit"
//               className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-green-600 transition mt-4"
//             >
//               Verify OTP
//             </button>
//           </form>
//           <p className="mt-4 text-sm">
//             Didn't receive the code?{' '}
//             <button
//               type="button"
//               onClick={handleResendOtp}
//               className="text-blue-500 underline hover:text-blue-700"
//             >
//               Resend
//             </button>
//           </p>
//         </motion.div>

//         <p className="text-gray-600 text-center text-xs mt-16">
//           © {new Date().getFullYear()}. Designed by Tosh Consult Inc.
//         </p>
//       </div>

//       {/* Toast notifications */}
//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
//     </div>
//   );
// };

// export default OtpVerificationPage;



"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import max from "../../image/Group 75.png";
import { useAuthStore } from "@/store/authStore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

const OtpVerificationPage = ({ searchParams }) => {
  const [email] = useState(searchParams?.email || "");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef([]);
  const url = useAuthStore((state) => state.url);
  const router = useRouter();

  // Submit OTP for verification
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    try {
      const res = await fetch(`${url}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpCode }),
      });

      if (res.ok) {
        toast.success("OTP verified successfully!");
        setTimeout(() => {
          router.push(`/reset-password?email=${encodeURIComponent(email)}`);
        }, 1500);
      } else {
        toast.error("Invalid OTP");
      }
    } catch (err) {
      toast.error("Error verifying OTP");
    }
  };

  const handleOtpChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) otpRefs.current[index + 1]?.focus();
    }
  };

  const handleResendOtp = async () => {
    try {
      const res = await fetch(`${url}/auth/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) toast.info(`OTP resent to ${email}`);
    } catch (err) {
      toast.error("Error resending OTP");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4">
      <div className="flex flex-col items-center text-center max-w-md w-full">
        <a href="/" className="flex items-center justify-center mb-4">
          <Image
            src={max}
            alt="ELAB Logo"
            className="w-[100%] max-w-[80px] sm:max-w-[70px] md:max-w-[50px] lg:max-w-[80px] xl:max-w-[70px] h-auto"
          />
        </a>

        {/* OTP Verification */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full"
        >
          <h1 className="text-2xl font-bold mb-2">Verify OTP</h1>
          <p className="text-gray-600 mb-6">
            Enter the code we sent to{" "}
            <span className="font-semibold">{email}</span>
          </p>
          <form
            onSubmit={handleOtpSubmit}
            className="w-full flex flex-col gap-3"
          >
            <div className="flex justify-between gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  ref={(el) => (otpRefs.current[index] = el)}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  className="w-12 h-12 border rounded-md text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ))}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-green-600 transition mt-4"
            >
              Verify OTP
            </button>
          </form>
          <p className="mt-4 text-sm">
            Didn't receive the code?{" "}
            <button
              type="button"
              onClick={handleResendOtp}
              className="text-blue-500 underline hover:text-blue-700"
            >
              Resend
            </button>
          </p>
        </motion.div>

        <p className="text-gray-600 text-center text-xs mt-16">
          © {new Date().getFullYear()}. Designed by Tosh Consult Inc.
        </p>
      </div>

      {/* Toast notifications */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default OtpVerificationPage;

