
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
    if (fetchProfile) fetchProfile();
  }, [fetchProfile]);


  useEffect(() => {
    console.log('Navbar - Current profile:', profile);
  }, [profile, loadingProfile]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Exam prep', path: '/ExamPrep' },
    { name: 'Why us', path: '/', section: 'why-us' },
    { name: 'Contact us', path: '/contact' }
  ];

  // Section observer for "Why us"
  useEffect(() => {
    const sectionIds = ["why-us"];
    const observers = [];
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        const observer = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        }, { threshold: 0.5 });
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

  const getDashboardRoute = (role) => {
    switch (role) {
      case "super_admin":
      case "admin":
      case "staff":
        return "/elab-admin";
      case "user":
      default:
        return "/dashboard";
    }
  };

  const handleDashboardRedirect = () => {
    if (!profile) return; // do nothing if profile not loaded yet
    const role = profile.role || localStorage.getItem("role") || "user";
    const redirectPath = getDashboardRoute(role);
    router.push(redirectPath);
  };

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
    if (!profile) return '';
    return profile.profile_picture ||
           profile.profilePicture ||
           profile.avatar || "";
  };

  return (
    <nav className='bg-white shadow-md sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16 lg:h-20'>

          {/* Logo */}
          <button onClick={handleDashboardRedirect} className="flex-shrink-0">
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

          {/* Desktop Profile / Auth Buttons */}
          <div className='hidden lg:flex items-center space-x-4'>

            {loadingProfile ? (
              <div className='flex items-center gap-2 px-4 py-2'>
                <div className='w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
                <span className='text-gray-600'>Loading...</span>
              </div>
            ) : profile ? (
              <button
                onClick={handleDashboardRedirect}
                className='flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-semibold'
              >
                {getProfilePicture() ? (
                    <Image
                      src={getProfilePicture()}
                      alt="Profile"
                      width={32}
                      height={32}
                      className='w-8 h-8 rounded-full object-cover'
                      onError={(e) => { e.target.src = '/default-avatar.png'; }}
                    />
                  ) : (
                    <Image
                      src="/default-avatar.png"
                      alt="Profile"
                      width={32}
                      height={32}
                      className='w-8 h-8 rounded-full object-cover'
                    />
                  )}
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

            {/* Mobile Profile / Auth Buttons */}
            <div className='pt-4 space-y-3 border-t border-gray-200 flex flex-col items-center'>

              {loadingProfile ? (
                <div className='flex items-center gap-2 w-full justify-center py-2'>
                  <div className='w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
                  <span className='text-gray-600'>Loading...</span>
                </div>
              ) : profile ? (
                <button
                  onClick={handleDashboardRedirect}
                  className='flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors duration-200 font-semibold'
                >
                 {getProfilePicture() ? (
                      <Image
                        src={getProfilePicture()}
                        alt="Profile"
                        width={32}
                        height={32}
                        className='w-8 h-8 rounded-full object-cover'
                        onError={(e) => { e.target.src = '/default-avatar.png'; }}
                      />
                    ) : (
                      <Image
                        src="/default-avatar.png"
                        alt="Profile"
                        width={32}
                        height={32}
                        className='w-8 h-8 rounded-full object-cover'
                      />
                    )}
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
