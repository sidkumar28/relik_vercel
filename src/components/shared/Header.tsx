'use client';

import React, { useState } from 'react';
import Link from 'next/link';
// Import icons

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-gray-800 text-white flex-col">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <img 
            src="/images/dao_logo.png" 
            alt="Logo"
            className="h-10 w-auto" 
          />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex space-x-8">
          <Link href="/AboutUs" className="text-white hover:text-gray-300">
            About Us
          </Link>
          <Link href="/Contact" className="text-white hover:text-gray-300">
            Contact Us
          </Link>
        </nav>
      </div>

     <nav className="md:hidden bg-gray-800 px-4 pb-4 flex-wrap">
          <Link href="/AboutUs" className="block text-white py-2 hover:text-gray-300">
            About Us
          </Link>
          <Link href="/Contact" className="block text-white py-2 hover:text-gray-300">
            Contact Us
          </Link>
        </nav>
      
    </header>
  );
};

export default Header;


