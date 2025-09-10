// 'use client';
// import React, { useState } from 'react';
// import BlurText from './BlurText';
// import Image from 'next/image';
// import max from '../../image/Group 75.png';
// import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
// import { useAuthStore } from "../../store/authStore";
// import { useRouter } from 'next/navigation';
// import { toast } from 'react-toastify';
// import ToastWrapper from '../../component/ToastWrapper'; // import wrapper

// const LoginPage = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [signin, setSignin] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);



//   const url = useAuthStore((state) => state.url);
//   const setToken = useAuthStore((state) => state.setToken); 
//   const router = useRouter();

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   setSignin(true);

//   try {
//     const res = await fetch(`${url}/auth/login`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     });

//     const data = await res.json();

//     if (res.ok) {
//       toast.success("Login successful!");

//       // Save token + role
//       localStorage.setItem("token", data.access_token);
//       localStorage.setItem("role", data.role); // 👈 store role too

//       if (setToken) setToken(data.access_token);

//       // Redirect based on role
//       if (data.role === "user") {
//         router.push("/dashboard");
//       } else if (data.role === "staff") {
//         router.push("/elab-admin"); // staff limited dashboard
//       } else if (data.role === "super-admin") {
//         router.push("/elab-admin"); // super-admin full dashboard
//       } else {
//         toast.error("Unknown role! Contact support.");
//       }
//     } else {
//       toast.error(data.detail || "Login failed!");
//     }
//   } catch (error) {
//     console.error(error);
//     toast.error("No Internet Connection!");
//   } finally {
//     setSignin(false);
//   }
// };


//   return (
//     <main className="flex items-center justify-center min-h-screen bg-white px-4 sm:px-6 lg:px-8">
//       <div className="w-full max-w-md space-y-6">
//         <a href='/' className="flex items-center justify-center">
//           <Image
//             src={max}
//             alt="ELAB Logo"
//             className="w-[50%] max-w-[80px] sm:max-w-[70px] md:max-w-[50px] lg:max-w-[80px] xl:max-w-[70px] h-auto mb-4"
//           />
//         </a>

//         <div className="flex flex-col items-center justify-center gap-1">
//           <BlurText
//             text="Welcome Back"
//             className="text-[32px] sm:text-[50px] font-bold text-center"
//             delay={150}
//             animateBy="words"
//             direction="top"
            
//           />
//           <p className="text-[18px] font-normal text-center text-gray-700">
//             Ready to pick up where you left off?
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="flex flex-col gap-2">
//             <label htmlFor="email" className="font-bold">Email Address</label>
//             <input
//               id="email"
//               type="email"
//               placeholder="Enter your email"
//               className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               onChange={(e) => setEmail(e.target.value)}
//               value={email}
//               required
//             />
//           </div>

//           <div className="flex flex-col gap-2 relative">
//             <label htmlFor="password" className="font-bold">Password</label>
//             <input
//               id="password"
//               type={showPassword ? 'text' : 'password'}
//               placeholder="Enter your password"
//               className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//               onChange={(e) => setPassword(e.target.value)}
//               value={password}
//             />
//             <span
//               className="absolute right-3 top-[45px] cursor-pointer text-sm text-gray-600"
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
//             </span>
//           </div>

//           <a href='/forget-password' className="text-sm text-blue-600 cursor-pointer hover:underline">
//             Forgot Password? Get a new one
//           </a>

//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition flex justify-center items-center"
//             disabled={signin}
//           >
//             {signin ? (
//               <div className="flex items-center gap-2">
//                 <svg
//                   className="animate-spin h-5 w-5 text-white"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8v8z"
//                   ></path>
//                 </svg>
//                 Signing in...
//               </div>
//             ) : (
//               'Sign In'
//             )}
//           </button>
//         </form>

//         <p className="text-center text-sm">
//           Not registered?{' '}
//           <a href='/register' className="text-blue-600 cursor-pointer hover:underline">
//             Create an account
//           </a>
//         </p>

//         <p className="text-gray-600 text-center text-xs">
//           © {new Date().getFullYear()}. Designed by Tosh Consult Inc.
//         </p>
//       </div>

//       {/* Toastify Wrapper */}
//       <ToastWrapper />
//     </main>
//   );
// };

// export default LoginPage;




'use client';
import React, { useState } from 'react';
import BlurText from './BlurText';
import Image from 'next/image';
import max from '../../image/Group 75.png';
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import { useAuthStore } from "../../store/authStore";
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import ToastWrapper from '../../component/ToastWrapper';


// ✅ central route resolver
function getDashboardRoute(role) {
  switch (role) {
    case "admin":
      return "/elab-admin";
    case "staff":
      return "/elab-admin"; 
    default:
      return "/dashboard"; // normal user dashboard
  }
}


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signin, setSignin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const url = useAuthStore((state) => state.url);
  const setToken = useAuthStore((state) => state.setToken);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSignin(true);

    try {
      const res = await fetch(`${url}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
if (res.ok) {
  toast.success("Login successful!");

  // save token
  localStorage.setItem("token", data.access_token);

  // Debug whole response
  console.log("Full API response:", data);

  // Try to read role safely
  const role =
    (data.role || data.user?.role || data.data?.role || "").toLowerCase();
  console.log("Extracted role:", role);

  localStorage.setItem("role", role);

  if (setToken) setToken(data.access_token);

  // redirect
  const redirectPath = getDashboardRoute(role);
  console.log("Redirecting to:", redirectPath);
  router.push(redirectPath);
}
 
      
      else {
        toast.error(data.detail || "Login failed!");
      }
    } catch (error) {
      console.error(error);
      toast.error("No Internet Connection!");
    } finally {
      setSignin(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-white px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <a href='/' className="flex items-center justify-center">
          <Image
            src={max}
            alt="ELAB Logo"
            className="w-[50%] max-w-[80px] sm:max-w-[70px] md:max-w-[50px] lg:max-w-[80px] xl:max-w-[70px] h-auto mb-4"
          />
        </a>

        <div className="flex flex-col items-center justify-center gap-1">
          <BlurText
            text="Welcome Back"
            className="text-[32px] sm:text-[50px] font-bold text-center"
            delay={150}
            animateBy="words"
            direction="top"
          />
          <p className="text-[18px] font-normal text-center text-gray-700">
            Ready to pick up where you left off?
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-bold">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>

          <div className="flex flex-col gap-2 relative">
            <label htmlFor="password" className="font-bold">Password</label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <span
              className="absolute right-3 top-[45px] cursor-pointer text-sm text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </span>
          </div>

          <a href='/forget-password' className="text-sm text-blue-600 cursor-pointer hover:underline">
            Forgot Password? Get a new one
          </a>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition flex justify-center items-center"
            disabled={signin}
          >
            {signin ? (
              <div className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
                Signing in...
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="text-center text-sm">
          Not registered?{' '}
          <a href='/register' className="text-blue-600 cursor-pointer hover:underline">
            Create an account
          </a>
        </p>

        <p className="text-gray-600 text-center text-xs">
          © {new Date().getFullYear()}. Designed by Tosh Consult Inc.
        </p>
      </div>

      {/* Toastify Wrapper */}
      <ToastWrapper />
    </main>
  );
};

export default LoginPage;

