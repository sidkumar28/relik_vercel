'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Web3 from 'web3';

const ConnectWallet: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const router = useRouter();

  // Check if wallet is connected on component mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        const { ethereum } = window as any;
        if (ethereum) {
          const web3 = new Web3(ethereum);
          const accounts = await web3.eth.getAccounts();
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
            router.push('/MyOrganization'); // Redirect if already connected
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    checkWalletConnection();
  }, [router]);

  // Function to handle wallet connection
  const connectWallet = async () => {
    try {
      const { ethereum } = window as any;
      if (!ethereum) {
        alert('MetaMask not found!');
        return;
      }

      // Request account access if needed
      const web3 = new Web3(ethereum);
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      setWalletAddress(accounts[0]);
      router.push('/MyOrganization'); // Redirect after successful connection
    } catch (err) {
      console.error(err);
    }
  };

  // Function to handle wallet disconnection
  const disconnectWallet = async () => {
    try {
      setWalletAddress(null); // Clear the wallet address state
      window.location.reload(); // Refresh the page after disconnection
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-start">
      {walletAddress ? (
        <div className="flex flex-col items-start">
          <p className="text-white mb-4">Connected: {walletAddress}</p>
          <button
            onClick={disconnectWallet}
            className="bg-gradient-to-r from-red-500 via-yellow-500 to-purple-500 text-white text-xl mb-6 px-4 py-2 rounded-3xl flex items-center justify-center w-64 h-16 text-center overflow-hidden"
          >
            Disconnect Wallet
          </button>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 text-white text-xl mb-6 px-4 py-2 rounded-3xl flex items-center justify-center w-64 h-16 text-center overflow-hidden"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default ConnectWallet;
