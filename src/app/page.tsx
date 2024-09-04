'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Home = () => {
  const router = useRouter();

  const handleCreateOrganization = () => {
    router.push('/CreateOrganization'); 
  };

  const handleMyOrganizations = () => {
    router.push('/MyOrganization'); 
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 max-w-6xl mx-auto gap-10 items-center">
      
      <div className="p-8 text-center md:text-left">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Empower Your Vote
        </h1>
        <p className="text-md md:text-lg text-gray-200 mb-8">
          Unlock the power of decentralized governance with our intuitive platform. Every vote matters, and together, we shape the future of decision-making. Join us in this journey toward transparent, collective governance.
        </p>
        <div className="flex flex-col sm:flex-row justify-center md:justify-start items-center gap-4">
          <button 
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-yellow-500 text-black font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform"
            aria-label="Create an Organization"
            onClick={handleCreateOrganization}
          >
            Create an Organization
          </button>
          <button 
            className="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg shadow-lg hover:bg-white hover:text-black  hover:scale-105 transition-transform"
            aria-label="My Organizations"
            onClick={handleMyOrganizations}
          >
            My Organizations
          </button>
        </div>
      </div>

      {/* Image Section */}
      <div className="image-container p-8">
        <Image src="/images/eth.png"
         alt="landingpage"
         width={1000}
         height={1000}
         className='max-h-full object-contain object-center max-w-full'
         />
      </div>
    </div>
  );
};

export default Home;
