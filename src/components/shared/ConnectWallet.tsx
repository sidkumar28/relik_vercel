'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ethers } from 'ethers';

const ConnectWallet = () => {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false); // State to track wallet connection

  const connectWalletHandler = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        // Check if MetaMask is connected
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });

        if (accounts.length > 0) {
          // Wallet is already connected
          setIsConnected(true);
          router.push('/MyOrganization');
        } else {
          // Request connection to MetaMask
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          setIsConnected(true);
          router.push('/MyOrganization');
        }
      } catch (error) {
        console.error('Error connecting wallet:', error);
        alert('Failed to connect wallet. Please check your MetaMask.');
      }
    } else {
      // MetaMask is not installed
      alert('MetaMask is not installed. Please install MetaMask to proceed.');
    }
  };

  return (
    <div>
      <button
        onClick={connectWalletHandler}
        className="bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 text-white text-xl px-4 py-2 rounded-3xl flex items-center justify-center w-52 h-16 text-center overflow-hidden"
        style={{ whiteSpace: 'nowrap' }}
      >
        Connect Wallet
      </button>
    </div>
  );
};

export default ConnectWallet;
