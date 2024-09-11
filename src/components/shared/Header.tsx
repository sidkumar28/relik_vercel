'use client';

import React from 'react';
import ConnectWallet from './ConnectWallet';

const Header = () => {
  return (
    <div 
      className="flex items-center justify-between h-16 px-4" 
      style={{
        backgroundImage: 'bg-gradient-to-b from-[#051937] via-[#004d7a] to-[#008793]  ',
        color: 'white',
      }}
    >
      <div className="flex items-center space-x-4">
        {/* <img 
          src="/images/logo.png" 
          alt="Logo"
          className="h-8 w-auto" 
        /> */}
        <div className="text-4xl font-bold">DAO</div>
      </div>

      
    </div>
  );
};

export default Header;
