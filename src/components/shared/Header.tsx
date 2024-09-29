'use client';

import React from 'react';

const Header = () => {
  return (
    <div 
      className="flex items-center justify-between h-16 px-4" 
      style={{
        backgroundImage: '',
        color: 'white',
      }}
    >
      <div className="flex items-center space-x-4">
        <img 
          src="/images/dao_logo.png" 
          alt="Logo"
          className="h-10 w-auto" 
        />
      </div>

      
    </div>
  );
};

export default Header;
