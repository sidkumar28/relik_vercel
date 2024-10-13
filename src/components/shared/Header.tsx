'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="text-white bg-gray-900 shadow-lg">
      {/* Container for the logo and desktop navigation */}
      <div className="flex items-center justify-between h-16 px-4 md:px-8 transition-transform duration-500 ease-in-out">
        {/* Logo with fade-in animation */}
        <div className="flex items-center space-x-4 animate-fadeIn">
          <img 
            src="/images/dao_logo.png"  // Replace this with the correct path to your "Relik" logo image
            alt="Logo"
            className="h-10 w-auto" 
          />
          {/* Powered by Accelchain */}
          <div className="flex flex-col items-start">
            <p className="text-sm text-gray-400">Powered by</p>
            <img 
              src="/images/Logo White.png"  // Use the correct path to the "Accelchain" logo image
              alt="Accelchain"
              className="h-6 w-auto animate-fadeIn delay-100" 
            />
          </div>
        </div>

        {/* Desktop Navigation Links (hidden on mobile) */}
        <nav className="hidden md:flex space-x-8 animate-fadeIn delay-150">
          <Link href="/AboutUs" className="text-white hover:text-gray-300 transition-transform transform hover:scale-105">
            About Us
          </Link>
          <Link href="/Contact" className="text-white hover:text-gray-300 transition-transform transform hover:scale-105">
            Contact Us
          </Link>
        </nav>

        {/* Hamburger menu button (visible on mobile) */}
        <button 
          onClick={toggleMobileMenu}
          className="md:hidden focus:outline-none text-white transition-transform transform hover:scale-105"
        >
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
                className="animate-spin"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Links (visible on mobile only) */}
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-gray-900 px-4 pb-4 flex flex-col space-y-2 animate-slideDown">
          <Link href="/AboutUs" className="block text-white py-2 hover:text-gray-300 transition-transform transform hover:scale-105">
            About Us
          </Link>
          <Link href="/Contact" className="block text-white py-2 hover:text-gray-300 transition-transform transform hover:scale-105">
            Contact Us
          </Link>
        </nav>
      )}
    </header>
  );
};

export default Header;
