// 'use client'
// import React, { useState, useEffect } from 'react';
// import Image from 'next/image';
// import { useRouter, usePathname } from 'next/navigation';
// import max from '../../src/image/logo.png';
// import { FaBars, FaTimes } from "react-icons/fa";
// import { useAuthStore } from '@/store/authStore';

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [activeSection, setActiveSection] = useState(null);
//   const pathname = usePathname();
//   const router = useRouter();

//   // ✅ Fixed: Access store values directly without destructuring
//   const profile = useAuthStore((state) => state.profile);
//   const fetchProfile = useAuthStore((state) => state.fetchProfile);
//   const loadingProfile = useAuthStore((state) => state.loadingProfile);

//   useEffect(() => {
//     // ✅ Fixed: Direct function call without optional chaining
//     if (fetchProfile) {
//       fetchProfile();
//     }
//   }, [fetchProfile]);

//   // ✅ Added: Debug logging to see what's in the profile
//   useEffect(() => {
//     console.log('Navbar - Current profile:', profile);
//     console.log('Navbar - Loading profile:', loadingProfile);
//   }, [profile, loadingProfile]);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const navItems = [
//     { name: 'Home', path: '/' },
//     { name: 'Exam prep', path: '/ExamPrep' },
//     { name: 'Why us', path: '/', section: 'why-us' },
//     { name: 'Contact us', path: '/contact' }
//   ];

//   // IntersectionObserver to highlight active section
//   useEffect(() => {
//     const sectionIds = ["why-us"];
//     const observers = [];

//     sectionIds.forEach((id) => {
//       const element = document.getElementById(id);
//       if (element) {
//         const observer = new IntersectionObserver(
//           ([entry]) => {
//             if (entry.isIntersecting) setActiveSection(id);
//           },
//           { threshold: 0.5 }
//         );
//         observer.observe(element);
//         observers.push(observer);
//       }
//     });

//     return () => observers.forEach((observer) => observer.disconnect());
//   }, []);

//   const isActive = (path, section = null) => {
//     if (section) return activeSection === section;
//     if (path === "/") return pathname === "/" && !activeSection;
//     return pathname.startsWith(path);
//   };

//   const handleNavClick = (path, section = null) => {
//     if (section) {
//       if (pathname !== "/") {
//         router.push("/");
//         setTimeout(() => {
//           const element = document.getElementById(section);
//           if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
//         }, 100);
//       } else {
//         const element = document.getElementById(section);
//         if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
//       }
//     } else {
//       router.push(path);
//     }
//     setIsMenuOpen(false);
//   };

//   // ✅ Helper function to get display name
//   const getDisplayName = () => {
//     if (!profile) return '';
    
//     // Try different possible field names from your API
//     return profile.full_name || 
//            profile.firstName || 
//            profile.first_name || 
//            `${profile.firstName || ''} ${profile.lastName || ''}`.trim() ||
//            profile.name ||
//            'User';
//   };

//   // ✅ Helper function to get profile picture
//   const getProfilePicture = () => {
//     if (!profile) return '/default-avatar.png';
    
//     return profile.profile_picture || 
//            profile.profilePicture || 
//            profile.avatar || 
//            '/default-avatar.png';
//   };

//   return (
//     <nav className='bg-white shadow-md sticky top-0 z-50'>
//       <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
//         <div className='flex items-center justify-between h-16 lg:h-20'>
          
//           {/* Logo */}
//           <a href='/' className='flex-shrink-0'>
//             <Image
//               src={max}
//               alt="Logo"
//               width={600}
//               height={400}
//               className="h-10 lg:h-12 w-auto mb-4"
//             /> 
//           </a>

//           {/* Desktop Navigation */}
//           <ul className='hidden lg:flex items-center space-x-8 font-bold text-gray-700'>
//             {navItems.map((item) => (
//               <li key={item.name}>
//                 <button
//                   onClick={() => handleNavClick(item.path, item.section)}
//                   className={`cursor-pointer transition-colors duration-200 relative ${
//                     isActive(item.path, item.section)
//                       ? 'text-blue-600 after:content-[""] after:absolute after:bottom-[-8px] after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 after:rounded-full'
//                       : 'hover:text-blue-600'
//                   }`}
//                 >
//                   {item.name}
//                 </button>
//               </li>
//             ))}
//           </ul>

//           {/* Desktop Buttons */}
//           <div className='hidden lg:flex items-center space-x-4'>
//             {/* ✅ Added loading state */}
//             {loadingProfile ? (
//               <div className='flex items-center gap-2 px-4 py-2'>
//                 <div className='w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
//                 <span className='text-gray-600'>Loading...</span>
//               </div>
//             ) : profile ? (
//               <button
//                 onClick={() => router.push('/dashboard')}
//                 className='flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-semibold'
//               >
//                 {/* Profile picture */}
//                 <img
//                   src={getProfilePicture()}
//                   alt="Profile"
//                   className='w-8 h-8 rounded-full object-cover'
//                   onError={(e) => {
//                     e.target.src = '/default-avatar.png';
//                   }}
//                 />
//                 {getDisplayName()}
//               </button>
//             ) : (
//               <>
//                 <a href='/login' className='px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200'>
//                   Login
//                 </a>
//                 <a href='/register' className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-semibold'>
//                   Sign Up
//                 </a>
//               </>
//             )}
//           </div>

//           {/* Mobile Menu Button */}
//           <div className='lg:hidden'>
//             <button
//               onClick={toggleMenu}
//               className='p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200'
//             >
//               {isMenuOpen ? <FaTimes className='h-6 w-6' /> : <FaBars className='h-6 w-6' />}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Dropdown */}
//         <div className={`lg:hidden transition-all duration-300 ease-in-out ${
//           isMenuOpen ? 'max-h-screen opacity-100 pb-6' : 'max-h-0 opacity-0 overflow-hidden'
//         }`}>
//           <div className='px-2 pt-2 pb-3 space-y-1 bg-gray-50 rounded-lg mt-2'>
//             <ul className='space-y-3 font-semibold text-gray-700 text-center'>
//               {navItems.map((item) => (
//                 <li key={item.name}>
//                   <button
//                     onClick={() => handleNavClick(item.path, item.section)}
//                     className={`block w-full px-3 py-2 rounded-md cursor-pointer transition-all duration-200 ${
//                       isActive(item.path, item.section)
//                         ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600'
//                         : 'hover:text-blue-600 hover:bg-white'
//                     }`}
//                   >
//                     {item.name}
//                   </button>
//                 </li>
//               ))}
//             </ul>

//             {/* Mobile Buttons */}
//             <div className='pt-4 space-y-3 border-t border-gray-200 flex flex-col items-center'>
//               {loadingProfile ? (
//                 <div className='flex items-center gap-2 w-full justify-center py-2'>
//                   <div className='w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
//                   <span className='text-gray-600'>Loading...</span>
//                 </div>
//               ) : profile ? (
//                 <button
//                   onClick={() => router.push('/dashboard')}
//                   className='flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors duration-200 font-semibold'
//                 >
//                   <img
//                     src={getProfilePicture()}
//                     alt="Profile"
//                     className='w-6 h-6 rounded-full object-cover'
//                     onError={(e) => {
//                       e.target.src = '/default-avatar.png';
//                     }}
//                   />
//                   {getDisplayName()}
//                 </button>
//               ) : (
//                 <>
//                   <a href='/login' className='w-full text-center px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-white rounded-md transition-all duration-200'>
//                     Login
//                   </a>
//                   <a href='/register' className='w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors duration-200 font-semibold'>
//                     Sign Up
//                   </a>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;





'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import max from '../../src/image/logo.png';
import { FaBars, FaTimes } from "react-icons/fa";
import { useAuthStore } from '@/store/authStore';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const profile = useAuthStore((state) => state.profile);
  const fetchProfile = useAuthStore((state) => state.fetchProfile);


  useEffect(() => {
    const getProfile = async () => {
      if (fetchProfile) {
        setLoadingProfile(true);
        try {
          await fetchProfile();
        } catch (err) {
          console.error("Failed to fetch profile:", err);
        } finally {
          setLoadingProfile(false);
        }
      }
    };
    getProfile();
  }, [fetchProfile]);


  useEffect(() => {
    setImageError(false);
  }, [profile?.profile_picture, profile?.profilePicture, profile?.avatar]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Exam prep', path: '/ExamPrep' },
    { name: 'Why us', path: '/', section: 'why-us' },
    { name: 'Contact us', path: '/contact' }
  ];

  useEffect(() => {
    const sectionIds = ["why-us"];
    const observers = [];

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) setActiveSection(id);
          },
          { threshold: 0.5 }
        );
        observer.observe(element);
        observers.push(observer);
      }
    });

    return () => observers.forEach((observer) => observer.disconnect());
  }, []);

  const isActive = (path, section = null) => {
    if (section) return activeSection === section;
    if (path === "/") return pathname === "/" && !activeSection;
    return pathname.startsWith(path);
  };

  const handleNavClick = (path, section = null) => {
    if (section) {
      if (pathname !== "/") {
        router.push("/");
        setTimeout(() => {
          const element = document.getElementById(section);
          if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      } else {
        const element = document.getElementById(section);
        if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      router.push(path);
    }
    setIsMenuOpen(false);
  };

  function getDashboardRoute(role) {
    if (!role) return "/"; // not logged in, go home
    switch (role) {
      case "super_admin":
      case "admin":
      case "staff":
        return "/elab-admin";
      default:
        return "/dashboard";
    }
  }

  const getDisplayName = () => {
    if (!profile) return '';
    return profile.full_name ||
      profile.firstName ||
      profile.first_name ||
      `${profile.firstName || ''} ${profile.lastName || ''}`.trim() ||
      profile.name ||
      'User';
  };

  const getProfilePicture = () => {
    if (!profile || imageError) return '/default-avatar.png';

    const profilePic = profile.profile_picture || profile.profilePicture || profile.avatar;

    if (profilePic && profilePic.startsWith('/')) return profilePic;
    if (profilePic && (profilePic.startsWith('http://') || profilePic.startsWith('https://'))) return profilePic;

    if (profilePic) return profilePic.startsWith('/') ? profilePic : `/${profilePic}`;

    return '/default-avatar.png';
  };

  const handleImageError = (e) => {
    console.log('Image failed to load:', getProfilePicture());
    setImageError(true);
    e.currentTarget.src = '/default-avatar.png';
  };

  return (
    <nav className='bg-white shadow-md sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16 lg:h-20'>
          {/* Logo */}
          <button
            onClick={(e) => {
              e.preventDefault();
              const role = profile?.role || localStorage.getItem("role");
              const redirectPath = getDashboardRoute(role);
              router.push(redirectPath);
            }}
            className="flex-shrink-0"
          >
            <Image
              src={max}
              alt="Logo"
              width={600}
              height={400}
              className="h-10 lg:h-12 w-auto mb-4"
            />
          </button>

          {/* Desktop Navigation */}

          <ul className='hidden lg:flex items-center space-x-8 font-bold text-gray-700'>
            {navItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => handleNavClick(item.path, item.section)}
                  className={`cursor-pointer transition-colors duration-200 relative ${
                    isActive(item.path, item.section)
                      ? 'text-blue-600 after:content-[""] after:absolute after:bottom-[-8px] after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 after:rounded-full'
                      : 'hover:text-blue-600'
                  }`}
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>

          {/* Desktop Buttons */}
          <div className='hidden lg:flex items-center space-x-4'>

            {loadingProfile ? (
              <div className='flex items-center gap-2 px-4 py-2'>
                <div className='w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
                <span className='text-gray-600'>Loading...</span>
              </div>
            ) : profile ? (
              <button
                onClick={() => {
                  const role = profile?.role || localStorage.getItem("role");
                  router.push(getDashboardRoute(role));
                }}
                className='flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-semibold'
              >
                <img
                  src={getProfilePicture()}
                  alt="Profile"
                  className='w-8 h-8 rounded-full object-cover'
                  onError={(e) => (e.currentTarget.src = '/default-avatar.png')}
                />

                {getDisplayName()}
              </button>
            ) : (
              <>
                <a href='/login' className='px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200'>
                  Login
                </a>
                <a href='/register' className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-semibold'>
                  Sign Up
                </a>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className='lg:hidden'>
            <button
              onClick={toggleMenu}
              className='p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200'
            >
              {isMenuOpen ? <FaTimes className='h-6 w-6' /> : <FaBars className='h-6 w-6' />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-screen opacity-100 pb-6' : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className='px-2 pt-2 pb-3 space-y-1 bg-gray-50 rounded-lg mt-2'>
            <ul className='space-y-3 font-semibold text-gray-700 text-center'>
              {navItems.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => handleNavClick(item.path, item.section)}
                    className={`block w-full px-3 py-2 rounded-md cursor-pointer transition-all duration-200 ${
                      isActive(item.path, item.section)
                        ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600'
                        : 'hover:text-blue-600 hover:bg-white'
                    }`}
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>

            {/* Mobile Buttons */}
            <div className='pt-4 space-y-3 border-t border-gray-200 flex flex-col items-center'>

              {loadingProfile ? (
                <div className='flex items-center gap-2 w-full justify-center py-2'>
                  <div className='w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
                  <span className='text-gray-600'>Loading...</span>
                </div>
              ) : profile ? (
                <button
                  onClick={() => {
                    const role = profile?.role || localStorage.getItem("role");
                    router.push(getDashboardRoute(role));
                  }}
                  className='flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors duration-200 font-semibold'
                >
                  <img
                    src={getProfilePicture()}
                    alt="Profile"
                    className='w-6 h-6 rounded-full object-cover'
                    onError={(e) => (e.currentTarget.src = '/default-avatar.png')}
                  />
                  {getDisplayName()}
                </button>
              ) : (
                <>
                  <a href='/login' className='w-full text-center px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-white rounded-md transition-all duration-200'>
                    Login
                  </a>
                  <a href='/register' className='w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors duration-200 font-semibold'>
                    Sign Up
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
