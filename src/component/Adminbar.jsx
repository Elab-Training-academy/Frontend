// // components/Sidebar.jsx
// "use client";
// import { useState } from "react";
// import { usePathname } from "next/navigation";
// import Image from "next/image";
// import img1 from "../../src/image/logo.png";
// import Link from "next/link";
// import {
//   LayoutDashboard,
//   BookOpen,
//   Users,
//   HelpCircle,
//   PlayCircle,
//   CreditCard,
//   FileText,
//   Shield,
//   Layers,
//   BarChart,
//   Settings,
//   LogOut,
//   Sliders,
//   ChevronDown,
//   ChevronRight,
//   X,
//   ToggleLeft,
//   Lock,
//   Database,
//   Gauge,
//   Mail,
// } from "lucide-react";

// const menuItems = [
//   { name: "Overview", href: "/elab-admin", icon: LayoutDashboard },
//   { name: "Course Management", href: "/elab-admin/courses", icon: BookOpen },
//   { name: "User Management", href: "/elab-admin/users", icon: Users },
//   { name: "Question Bank", href: "/elab-admin/questions", icon: HelpCircle },
//   { name: "Categories", href: "/elab-admin/categories", icon: HelpCircle },
//   { name: "Smart Practice", href: "/elab-admin/practice", icon: PlayCircle },
//   { name: "Subscription management", href: "/elab-admin/subscription", icon: CreditCard },
//   { name: "CAT Testing", href: "/elab-admin/cat-testing", icon: PlayCircle },
//   { name: "Case Studies", href: "/elab-admin/case-studies", icon: FileText },
//   { name: "Flashcards", href: "/elab-admin/flashcards", icon: Layers },
//   { name: "Analytics", href: "/elab-admin/analytics", icon: BarChart },

//   {
//     name: "Platform Configuration",
//     href: "/platform",
//     icon: Sliders,
//     subItems: [
      
//       { name: "Features", href: "/platform/features", icon: ToggleLeft },
//       { name: "Email", href: "/platform/email", icon: Mail },
//       { name: "Security", href: "/platform/security", icon: Lock },
//       { name: "Database", href: "/platform/database", icon: Database },
//       { name: "Limits", href: "/platform/limits", icon: Gauge },
//     ],
//   },
// ];


//   const superAdminLinks = [
//     { name: "User Management", href: "/elab-admin/users" },
//     { name: "Platform Configuration", href: "/elab-admin/config" },
//   ];


//     const adminLinks = [
//     { name: "Courses", href: "/elab-admin/courses" },
//     { name: "Question Bank", href: "/elab-admin/questions" },
//     { name: "Smart Practice", href: "/elab-admin/smart-practice" },
//     { name: "Flash Cards", href: "/elab-admin/flashcards" },
//     { name: "Case Studies", href: "/elab-admin/case-studies" },
//   ];


//    const links =
//     role === "super_admin" ? [...adminLinks, ...superAdminLinks] : adminLinks;

//  const handleLogout = () => {
//   localStorage.clear();
//   sessionStorage.clear();

//   // clear cookies
//   document.cookie.split(";").forEach((c) => {
//     document.cookie = c
//       .replace(/^ +/, "")
//       .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
//   });

//   // Force a clean navigation
//   window.location.href = "/login";
// };

// export default function Sidebar({ onClose }) {
//   const pathname = usePathname();
//   const [openMenu, setOpenMenu] = useState(null);

//   const handleClose = () => {
//     if (typeof onClose === "function") onClose();
//   };

//   const handleNavigation = () => {
//     if (window.innerWidth < 1024) handleClose();
//   };

//   return (
//     <aside className="w-70 h-screen overflow-y-auto bg-white border-r p-4 flex flex-col">
//       {/* Header with Logo + Close */}
//       <div className="p-4 flex items-center justify-between border-b border-gray-200">
//         <Image src={img1} alt="ELAB Logo" className="w-[120px] h-auto" priority />
//         <button
//           onClick={handleClose}
//           className="lg:hidden p-1 rounded-md hover:bg-gray-100 transition-colors"
//           aria-label="Close navigation menu"
//         >
//           <X size={20} className="text-gray-600" />
//         </button>
//       </div>

//       {/* Menu */}
//       <nav className="space-y-1 mt-4 flex-1 overflow-y-auto">
//         {menuItems.map((item, i) => {
//           const Icon = item.icon;
//           const isActive = pathname === item.href;

//           if (item.subItems) {
//             const isOpen = openMenu === item.name;
//             return (
//               <div key={i}>
//                 {/* Parent Item */}
//                 <button
//                   onClick={() => setOpenMenu(isOpen ? null : item.name)}
//                   className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
//                     isOpen ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-50"
//                   }`}
//                 >
//                   <div className="flex items-center gap-3">
//                     <Icon
//                       size={18}
//                       className={isOpen ? "text-blue-600" : "text-gray-500"}
//                     />
//                     <span className="text-sm font-medium">{item.name}</span>
//                   </div>
//                   {isOpen ? (
//                     <ChevronDown size={16} className="text-gray-500" />
//                   ) : (
//                     <ChevronRight size={16} className="text-gray-500" />
//                   )}
//                 </button>

//                 {/* Submenu */}
//                 {isOpen && (
//                   <div className="ml-6 mt-1 space-y-1">
//                     {item.subItems.map((sub, idx) => {
//                       const SubIcon = sub.icon;
//                       const subActive = pathname === sub.href;
//                       return (
//                         <Link
//                           key={idx}
//                           href={sub.href}
//                           onClick={handleNavigation}
//                           className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition ${
//                             subActive
//                               ? "text-blue-600 font-medium bg-blue-50"
//                               : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
//                           }`}
//                         >
//                           <SubIcon size={16} className="text-gray-400" />
//                           <span>{sub.name}</span>
//                         </Link>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>
//             );
//           }

//           return (
//             <Link
//               key={i}
//               href={item.href}
//               onClick={handleNavigation}
//               className="block"
//             >
//               <div
//                 className={`mx-2 flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
//                   isActive
//                     ? "bg-blue-100 text-blue-600 shadow-sm border-l-4 border-blue-500"
//                     : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
//                 }`}
//               >
//                 <Icon
//                   size={18}
//                   className={isActive ? "text-blue-600" : "text-gray-500"}
//                 />
//                 <span className={`font-medium text-sm ${isActive ? "font-semibold" : ""}`}>
//                   {item.name}
//                 </span>
//               </div>
//             </Link>
//           );
//         })}
//       </nav>

//       {/* Bottom Section */}
//       <div className="border-t pt-4 space-y-2 sticky bottom-0 bg-white">
//         <Link
//           href="/settings"
//           className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
//         >
//           <Settings size={18} />
//           <span className="text-sm font-medium">Settings</span>
//         </Link>
//         <button
//           className="w-full flex items-center gap-3 px-4 py-3 text-red-500 font-medium hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
//           onClick={handleLogout}
//         >
//           <LogOut size={18} />
//           <span className="text-sm">Logout</span>
//         </button>

//         {/* User Info */}
//         <div className="flex items-center gap-2 mt-4">
//           <img src="/profile.jpg" alt="user" className="w-8 h-8 rounded-full" />
//           <div>
//             <p className="text-sm font-medium">Admin User</p>
//             <p className="text-xs text-gray-500">admin@example.com</p>
//           </div>
//         </div>
//       </div>
//     </aside>
//   );
// }







"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import img1 from "../../src/image/logo.png";
import Link from "next/link";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  HelpCircle,
  PlayCircle,
  CreditCard,
  FileText,
  Layers,
  BarChart,
  Sliders,
  ChevronDown,
  ChevronRight,
  X,
  ToggleLeft,
  Lock,
  Database,
  Gauge,
  Mail,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

// 🔹 Full Admin menu (Admin gets everything here)
const adminLinks = [
  { name: "Overview", href: "/elab-admin", icon: LayoutDashboard },
  { name: "Course Management", href: "/elab-admin/courses", icon: BookOpen },
  { name: "Question Bank", href: "/elab-admin/questions", icon: HelpCircle },
  { name: "Smart Practice", href: "/elab-admin/practice", icon: PlayCircle },
  { name: "Case Studies", href: "/elab-admin/case-studies", icon: FileText },
  { name: "Flashcards", href: "/elab-admin/flashcards", icon: Layers },
  { name: "User Management", href: "/elab-admin/users", icon: Users },
  { name: "Subscription Management", href: "/elab-admin/subscription", icon: CreditCard },
  { name: "Analytics", href: "/elab-admin/analytics", icon: BarChart },
  {
    name: "Platform Configuration",
    href: "/platform",
    icon: Sliders,
    subItems: [
      { name: "Features", href: "/platform/features", icon: ToggleLeft },
      { name: "Email", href: "/platform/email", icon: Mail },
      { name: "Security", href: "/platform/security", icon: Lock },
      { name: "Database", href: "/platform/database", icon: Database },
      { name: "Limits", href: "/platform/limits", icon: Gauge },
    ],
  },
];

// 🔹 Staff menu (limited)
const staffLinks = [
  { name: "Overview", href: "/elab-admin", icon: LayoutDashboard },
  { name: "Course Management", href: "/elab-admin/courses", icon: BookOpen },
  { name: "Question Bank", href: "/elab-admin/questions", icon: HelpCircle },
  { name: "Smart Practice", href: "/elab-admin/practice", icon: PlayCircle },
  { name: "Case Studies", href: "/elab-admin/case-studies", icon: FileText },
  { name: "Flashcards", href: "/elab-admin/flashcards", icon: Layers },
];

export default function Sidebar({ onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(null);


const role = localStorage.getItem("role")

  console.log("Sidebar Role:", role); // ✅ Debug

  const links = role === "admin" ? adminLinks : staffLinks;

  const handleClose = () => {
    if (typeof onClose === "function") onClose();
  };

  const handleNavigation = () => {
    if (window.innerWidth < 1024) handleClose();
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
    });
    router.replace("/login");
  };

  return (
    <aside className="w-70 h-screen overflow-y-auto bg-white border-r p-4 flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-200">
        <Link href="/" onClick={handleClose}>
          <Image src={img1} alt="ELAB Logo" className="w-[120px] h-auto cursor-pointer" priority />
        </Link>
        <button
          onClick={handleClose}
          className="lg:hidden p-1 rounded-md hover:bg-gray-100 transition-colors"
        >
          <X size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Menu */}
      <nav className="space-y-1 mt-4 flex-1 overflow-y-auto">
        {links.map((item, i) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (item.subItems) {
            const isOpen = openMenu === item.name;
            return (
              <div key={i}>
                <button
                  onClick={() => setOpenMenu(isOpen ? null : item.name)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                    isOpen ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={isOpen ? "text-blue-600" : "text-gray-500"} />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
                {isOpen && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.subItems.map((sub, idx) => {
                      const SubIcon = sub.icon;
                      const subActive = pathname === sub.href;
                      return (
                        <Link
                          key={idx}
                          href={sub.href}
                          onClick={handleNavigation}
                          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition ${
                            subActive
                              ? "text-blue-600 font-medium bg-blue-50"
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                          }`}
                        >
                          <SubIcon size={16} />
                          <span>{sub.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link key={i} href={item.href} onClick={handleNavigation} className="block">
              <div
                className={`mx-2 flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-blue-100 text-blue-600 border-l-4 border-blue-500"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon size={18} className={isActive ? "text-blue-600" : "text-gray-500"} />
                <span className={`font-medium text-sm ${isActive ? "font-semibold" : ""}`}>
                  {item.name}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="border-t pt-4 space-y-2 sticky bottom-0 bg-white">
        <Link
          href="/settings"
          className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
        >
          <Settings size={18} />
          <span className="text-sm font-medium">Settings</span>
        </Link>
        <button
          className="w-full flex items-center gap-3 px-4 py-3 text-red-500 font-medium hover:text-red-600 hover:bg-red-50 rounded-lg"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span className="text-sm">Logout</span>
        </button>

        {/* User Info */}
        {/* {user && (
          <div className="flex items-center gap-2 mt-4">
            <img src="/profile.jpg" alt="user" className="w-8 h-8 rounded-full" />
            <div>
              <p className="text-sm font-medium">{user.name || "Admin User"}</p>
              <p className="text-xs text-gray-500">{user.email || "admin@example.com"}</p>
              <p className="text-xs text-gray-400 capitalize">{user.role}</p>
            </div>
          </div>
        )} */}
      </div>
    </aside>
  );
}
