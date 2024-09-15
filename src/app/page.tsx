'use client';
import React from 'react';
import Image from 'next/image';
import ConnectWallet from '@/components/shared/ConnectWallet';

const Home = () => {
  return (
    <div className="flex flex-col md:flex-row max-w-6xl mx-auto items-center p-10 gap-10 bg-gradient-to-b from-[#051937] via-[#004d7a] to-[#008793] rounded-lg shadow-lg border-2 border-orange-200">
      <div className="flex flex-col justify-center w-full md:w-1/2 text-center md:text-left p-8 ">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Empower Your Vote
        </h1>
        <p className="text-md md:text-lg text-gray-200 mb-8">
          Unlock the power of decentralized governance with our intuitive platform. Every vote matters, and together, we shape the future of decision-making. Join us in this journey toward transparent, collective governance. 
        </p>
        <div>
          <ConnectWallet />
        </div>
      </div>
      <div className="flex justify-center items-center w-full md:w-1/2 p-8">
        <Image 
          src="/images/eth.png" 
          alt="landingpage"
          width={600}
          height={600}
          className='object-contain'
        />
      </div>
    </div>
  );
};

export default Home;
