// // import React, { useState } from 'react';
// // import { Link, useNavigate } from 'react-router-dom';
// // import { useAuth } from '../contexts/AuthContext';
// // import { HiMenu, HiX, HiUser, HiLogout, HiViewGrid } from 'react-icons/hi';
// // import { Menu, Transition } from '@headlessui/react';
// // import { useTranslation } from 'react-i18next';
// // import LanguageSwitcher from '../components/sharedComp/LanguageSwitcher' 

// // const Header = () => {
// //   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
// //   const { user, logout, isAuthenticated, loading } = useAuth();
// //   const navigate = useNavigate();
// //   const { t } = useTranslation();

// //   const handleLogout = () => {
// //     logout();
// //     navigate('/');
// //   };

// //   const handleDashboard = () => {
// //     navigate(getDashboardPath());
// //   };

// //   const navigation = [
// //     { name: t('navigation.home'), href: '/' },
// //     { name: t('navigation.services'), href: '/services' },
// //     ...(isAuthenticated ? [] : [{ name: t('home.cta.become_provider'), href: '/provider/register' }]),
// //     { name: t('navigation.about'), href: '/about' },
// //     { name: t('navigation.contact'), href: '/contact' },
// //   ];

// //   const getDashboardPath = () => {
// //     if (user?.role === 'admin') return '/admin';
// //     if (user?.role === 'provider') return '/provider/dashboard';
// //     return '/dashboard';
// //   };

// //   const getServicesPath = () => {
// //     if (user?.role === 'provider') return '/provider/services';
// //     return '/services';
// //   };

// //   const handleLogoClick = () => {
// //     if (isAuthenticated) {
// //       // Redirect based on user role
// //       if (user?.role === 'provider') {
// //         navigate('/provider/dashboard');
// //       } else {
// //         navigate('/');
// //       }
// //     } else {
// //       navigate('/');
// //     }
// //   };

// //   return (
// //     <header className="bg-white shadow-sm sticky top-0 z-50">
// //       <nav className="container-custom">
// //         <div className="flex justify-between items-center h-16">
// //           {/* Logo */}
// //           <button onClick={handleLogoClick} className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
// //             <img src="/baitk-logo.png" alt="Baitak" className="h-10 w-10" />
// //             <span className="text-2xl font-bold text-gradient">Baitak</span>
// //           </button>

// //           {/* Desktop Navigation */}
// //           <div className="hidden md:flex items-center space-x-8">
// //             {loading ? (
// //               <div className="flex items-center space-x-8">
// //                 <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
// //                 <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
// //               </div>
// //             ) : (
// //               navigation.map((item, index) => (
// //                 <Link
// //                   key={item.name}
// //                   to={item.href}
// //                   className={`navigation-link text-gray-700 hover:text-primary-600 font-medium transition-colors`}
// //                 >
// //                   {item.name}
// //                 </Link>
// //               ))
// //             )}
// //           </div>

// //           {/* Desktop Auth Buttons */}
// //           <div className="hidden md:flex items-center space-x-4">
// //             <LanguageSwitcher />
// //             {loading ? (
// //               <div className="flex items-center space-x-4">
// //                 <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
// //                 <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
// //               </div>
// //             ) : isAuthenticated ? (
// //               <Menu as="div" className="relative">
// //                 <Menu.Button className="flex items-center space-x-2 text-gray-700 hover:text-primary-600">
// //                   <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
// //                     <HiUser className="w-5 h-5 text-primary-600" />
// //                   </div>
// //                   <span className="font-medium">{user?.first_name}</span>
// //                 </Menu.Button>
// //                 <Transition
// //                   enter="transition ease-out duration-100"
// //                   enterFrom="transform opacity-0 scale-95"
// //                   enterTo="transform opacity-100 scale-100"
// //                   leave="transition ease-in duration-75"
// //                   leaveFrom="transform opacity-100 scale-100"
// //                   leaveTo="transform opacity-0 scale-95"
// //                 >
// //                   <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1">
// //                     <Menu.Item>
// //                       {({ active }) => (
// //                         <button
// //                           onClick={handleDashboard}
// //                           className={`${
// //                             active ? 'bg-gray-100' : ''
// //                           } block w-full text-left px-4 py-2 text-sm text-gray-700`}
// //                         >
// //                           <div className="flex items-center space-x-2">
// //                             <HiViewGrid />
// //                             <span>{t('navigation.dashboard')}</span>
// //                           </div>
// //                         </button>
// //                       )}
// //                     </Menu.Item>
// //                     <Menu.Item>
// //                       {({ active }) => (
// //                         <button
// //                           onClick={handleLogout}
// //                           className={`${
// //                             active ? 'bg-gray-100' : ''
// //                           } block w-full text-left px-4 py-2 text-sm text-gray-700`}
// //                         >
// //                           <div className="flex items-center space-x-2">
// //                             <HiLogout />
// //                             <span>{t('navigation.logout')}</span>
// //                           </div>
// //                         </button>
// //                       )}
// //                     </Menu.Item>
// //                   </Menu.Items>
// //                 </Transition>
// //               </Menu>
// //             ) : (
// //               <>
// //                 <Link to="/login" className="btn-secondary">
// //                   {t('navigation.login')}
// //                 </Link>
// //                 <Link to="/signup" className="btn-primary">
// //                   {t('navigation.signup')}
// //                 </Link>
// //               </>
// //             )}
// //           </div>

// //           {/* Mobile menu button */}
// //           <button
// //             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
// //             className="md:hidden p-2"
// //           >
// //             {mobileMenuOpen ? (
// //               <HiX className="h-6 w-6 text-gray-700" />
// //             ) : (
// //               <HiMenu className="h-6 w-6 text-gray-700" />
// //             )}
// //           </button>
// //         </div>

// //         {/* Mobile Navigation */}
// //         {mobileMenuOpen && (
// //           <div className="md:hidden py-4 border-t">
// //             <div className="flex flex-col space-y-4">
// //               {loading ? (
// //                 <div className="flex flex-col space-y-4">
// //                   <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
// //                   <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
// //                 </div>
// //               ) : isAuthenticated ? (
// //                 <Link
// //                   to={getDashboardPath()}
// //                   className="text-gray-700 hover:text-primary-600 font-medium"
// //                   onClick={() => setMobileMenuOpen(false)}
// //                 >
// //                   {t('navigation.dashboard')}
// //                 </Link>
// //               ) : (
// //                 navigation.map((item, index) => (
// //                   <Link
// //                     key={item.name}
// //                     to={item.href}
// //                     className={`text-gray-700 hover:text-primary-600 font-medium ${
// //                       index < navigation.length - 1 ? 'mb-4' : ''
// //                     }`}
// //                     onClick={() => setMobileMenuOpen(false)}
// //                   >
// //                     {item.name}
// //                   </Link>
// //                 ))
// //               )}
// //               <div className="pt-4 border-t space-y-2">
// //                 {loading ? (
// //                   <div className="flex flex-col space-y-2">
// //                     <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
// //                     <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
// //                   </div>
// //                 ) : isAuthenticated ? (
// //                   <button
// //                     onClick={() => {
// //                       handleLogout();
// //                       setMobileMenuOpen(false);
// //                     }}
// //                     className="block w-full text-left py-2 text-gray-700 font-medium"
// //                   >
// //                     {t('navigation.logout')}
// //                   </button>
// //                 ) : (
// //                   <>
// //                     <Link
// //                       to="/login"
// //                       className="block py-2 text-gray-700 font-medium"
// //                       onClick={() => setMobileMenuOpen(false)}
// //                     >
// //                       {t('navigation.login')}
// //                     </Link>
// //                     <Link
// //                       to="/signup"
// //                       className="block py-2 text-primary-600 font-medium"
// //                       onClick={() => setMobileMenuOpen(false)}
// //                     >
// //                       {t('navigation.signup')}
// //                     </Link>
// //                   </>
// //                 )}
// //               </div>
// //             </div>
// //           </div>
// //         )}
// //       </nav>
// //     </header>
// //   );
// // };

// // export default Header;
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import { HiMenu,HiBell, HiX, HiUser, HiLogout, HiViewGrid } from 'react-icons/hi';
// import { Menu, Transition } from '@headlessui/react';
// import { useTranslation } from 'react-i18next';
// import LanguageSwitcher from '../components/sharedComp/LanguageSwitcher';

// const Header = () => {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const { user, logout, isAuthenticated, loading } = useAuth();
//   const navigate = useNavigate();
//   const { t } = useTranslation();

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//   };

//   const handleDashboard = () => {
//     navigate(getDashboardPath());
//   };

//   const getDashboardPath = () => {
//     if (user?.role === 'admin') return '/admin';
//     if (user?.role === 'provider') return '/provider/dashboard';
//     return '/dashboard';
//   };

//   const navigation = [
//     { name: t('navigation.home'), href: '/' },
//     { name: t('navigation.services'), href: '/services' },
//     { name: t('navigation.about'), href: '/about' },
//     { name: t('navigation.contact'), href: '/contact' },
//   ];

//   return (
//     <header className="bg-white shadow-sm sticky top-0 z-50 w-full">
//       <nav className="container mx-auto px-6">
//         <div className="flex justify-between items-center h-20">

//           {/* Logo */}
//           <button
//             onClick={() => navigate('/')}
//             className="flex items-center space-x-2 hover:opacity-80"
//           >
//             <img src="/baitk-logo.png" alt="Baitak" className="h-10 w-auto" />
//           </button>

//           {/* CENTER NAV LINKS */}
//           <div className="hidden md:flex items-center space-x-10 mx-auto">
//             {navigation.map((item) => (
//               <Link
//                 key={item.name}
//                 to={item.href}
//                 className="text-gray-700 hover:text-green-600 font-medium text-[15px]"
//               >
//                 {item.name}
//               </Link>
//             ))}
//           </div>

//           {/* RIGHT SECTION */}
//           <div className="hidden md:flex items-center space-x-5">

     
//             {/* Language + Notification */}
// <div className="flex items-center space-x-3 relative">

//   {/* Language Switcher */}
//   <LanguageSwitcher />
//   {/* Bell Icon */}
//   <button className="relative">
//     <HiBell className="w-5 h-5 text-gray-700" />

//     {/* RED BADGE */}
//     <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-[6px] py-[1px] rounded-full">
//       1
//     </span>
//   </button>

// </div>


//             {/* Become a Provider */}
//             {!isAuthenticated && (
//               <Link
//                 to="/provider/register"
//                 className="bg-green-600 text-white px-5 py-2 rounded-md font-medium hover:bg-green-700 transition"
//               >
//                 {t('home.cta.become_provider')}
//               </Link>
//             )}

//             {/* Auth Buttons */}
//             {isAuthenticated ? (
//               <Menu as="div" className="relative">
//                 <Menu.Button className="flex items-center px-3 py-2 bg-green-100 rounded-full">
//                   <HiUser className="w-5 h-5 text-green-700 mr-2" />
//                   <span className="font-medium text-gray-700">{user?.first_name}</span>
//                 </Menu.Button>

//                 <Transition
//                   enter="transition duration-100"
//                   enterFrom="opacity-0 scale-95"
//                   enterTo="opacity-100 scale-100"
//                   leave="transition duration-75"
//                   leaveFrom="opacity-100 scale-100"
//                   leaveTo="opacity-0 scale-95"
//                 >
//                   <Menu.Items className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-48 py-2">
//                     <Menu.Item>
//                       <button
//                         onClick={handleDashboard}
//                         className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left"
//                       >
//                         <HiViewGrid className="mr-2" />
//                         {t('navigation.dashboard')}
//                       </button>
//                     </Menu.Item>

//                     <Menu.Item>
//                       <button
//                         onClick={handleLogout}
//                         className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left"
//                       >
//                         <HiLogout className="mr-2" />
//                         {t('navigation.logout')}
//                       </button>
//                     </Menu.Item>
//                   </Menu.Items>
//                 </Transition>
//               </Menu>
//             ) : (
//               <>
//                 <Link
//                   to="/login"
//                   className="border border-green-600 text-green-600 px-5 py-2 rounded-full font-medium hover:bg-green-50 transition"
//                 >
//                   {t('navigation.login')}
//                 </Link>

//                 <Link
//                   to="/signup"
//                   className="bg-green-600 text-white px-5 py-2 rounded-full font-medium hover:bg-green-700 transition"
//                 >
//                   {t('navigation.signup')}
//                 </Link>
//               </>
//             )}
//           </div>

//           Mobile Button
//           <button
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             className="md:hidden p-2"
//           >
//             {mobileMenuOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
//           </button>
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default Header;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { HiMenu, HiBell, HiX, HiUser, HiLogout, HiViewGrid } from 'react-icons/hi';
import { Menu, Transition } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/sharedComp/LanguageSwitcher';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isArabic = localStorage.getItem("i18nextLng") === "ar";


  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDashboard = () => {
    navigate(getDashboardPath());
  };

  const getDashboardPath = () => {
    if (user?.role === 'admin') return '/admin';
    if (user?.role === 'provider') return '/provider/dashboard';
    return '/dashboard';
  };

  const navigation = [
    { name: t('navigation.home'), href: '/' },
    { name: t('navigation.services'), href: '/services' },
    { name: t('navigation.about'), href: '/about' },
    { name: t('navigation.contact'), href: '/contact' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 w-full">
      <nav className="container mx-auto px-6">
        {/* TOP BAR */}
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 hover:opacity-80"
          >
            <img src="/baitk-logo.png" alt="Baitak" className="h-10 w-auto" />
          </button>

          {/* CENTER NAV LINKS (Desktop) */}
          {/* <div className="hidden md:flex items-center space-x-10 mx-auto"> */}
          <div
  className={`hidden md:flex items-center mx-auto ${
    isArabic ? "space-x-reverse space-x-10" : "space-x-10"
  }`}
>
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-700 hover:text-green-600 font-medium text-[15px]"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* RIGHT SECTION (Desktop) */}
          <div className="hidden md:flex items-center space-x-5">

            {/* Language + Notification */}
            <div className="flex items-center space-x-3 relative">

              <LanguageSwitcher />

              <button className="relative">
                <HiBell className="w-5 h-5 text-gray-700" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-[6px] py-[1px] rounded-full">
                  1
                </span>
              </button>

            </div>

            {/* Become a Provider */}
            {!isAuthenticated && (
              <Link
                to="/provider/register"
                className="bg-green-600 text-white px-5 py-2 rounded-md font-medium hover:bg-green-700 transition"
              >
                {t('home.cta.become_provider')}
              </Link>
            )}

            {/* Auth Dropdown */}
            {isAuthenticated ? (
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center px-3 py-2 bg-green-100 rounded-full">
                  <HiUser className="w-5 h-5 text-green-700 mr-2" />
                  <span className="font-medium text-gray-700">{user?.first_name}</span>
                </Menu.Button>

                <Transition
                  enter="transition duration-100"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="transition duration-75"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-48 py-2">
                    <Menu.Item>
                      <button
                        onClick={handleDashboard}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left"
                      >
                        <HiViewGrid className="mr-2" />
                        {t('navigation.dashboard')}
                      </button>
                    </Menu.Item>

                    <Menu.Item>
                      <button
                        onClick={handleLogout}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left"
                      >
                        <HiLogout className="mr-2" />
                        {t('navigation.logout')}
                      </button>
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <>
                <Link
                  to="/login"
                  className="border border-green-600 text-green-600 px-5 py-2 rounded-full font-medium hover:bg-green-50 transition"
                >
                  {t('navigation.login')}
                </Link>

                <Link
                  to="/signup"
                  className="bg-green-600 text-white px-5 py-2 rounded-full font-medium hover:bg-green-700 transition"
                >
                  {t('navigation.signup')}
                </Link>
              </>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            {mobileMenuOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
          </button>
        </div>

        {/* ---------------- MOBILE MENU ---------------- */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white shadow-md border-t animate-slideDown">

            {/* Navigation links */}
            <div className="flex flex-col px-6 py-4 space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 font-medium py-2 border-b border-gray-100"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Language Switcher */}
            <div className="px-6 py-3 border-t">
              <LanguageSwitcher />
            </div>

            {/* Become a provider */}
            {!isAuthenticated && (
              <div className="px-6 py-3">
                <Link
                  to="/provider/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-green-600 text-white block w-full text-center px-5 py-2 rounded-md font-medium hover:bg-green-700 transition"
                >
                  {t('home.cta.become_provider')}
                </Link>
              </div>
            )}

            {/* Auth controls */}
            <div className="px-6 py-3 space-y-2 border-t">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => {
                      handleDashboard();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 bg-gray-100 rounded-lg"
                  >
                    <HiViewGrid /> {t('navigation.dashboard')}
                  </button>

                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 bg-gray-100 rounded-lg"
                  >
                    <HiLogout /> {t('navigation.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center px-4 py-2 border border-green-600 text-green-600 rounded-lg"
                  >
                    {t('navigation.login')}
                  </Link>

                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center px-4 py-2 bg-green-600 text-white rounded-lg"
                  >
                    {t('navigation.signup')}
                  </Link>
                </>
              )}
            </div>

          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
