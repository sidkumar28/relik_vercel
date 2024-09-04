import React, { useState } from 'react';
import { ethers } from 'ethers';

const ConnectWallet = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);

  const connectWalletHandler = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        if (!isConnected) {
          const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
          await tempProvider.send('eth_requestAccounts', []);
          const signer = tempProvider.getSigner();
          const accountBalance = await signer.getBalance();
          const formattedBalance = ethers.utils.formatEther(accountBalance);

          setProvider(tempProvider);
          setBalance(formattedBalance);
          setIsConnected(true);
          setErrorMessage(null);
        } else {
          // Confirm disconnection
          const confirmDisconnect = window.confirm('Do you want to disconnect the wallet?');
          if (confirmDisconnect) {
            setProvider(null);
            setBalance(null);
            setIsConnected(false);
            setErrorMessage(null);
          }
        }
      } catch (error) {
        console.error('Error connecting wallet:', error);
        setErrorMessage('Failed to connect wallet. Please check your console for details.');
      }
    } else {
      setErrorMessage('Please install MetaMask');
    }
  };

  return (
    <div>
      <button
        onClick={connectWalletHandler}
        className="bg-blue-500 text-white px-4 py-2 rounded-3xl flex items-center justify-center w-44 h-12 text-center overflow-hidden"
        style={{ whiteSpace: 'nowrap' }}
      >
        {isConnected ? `(${balance} ETH)` : 'Connect Wallet'}
      </button>
      {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}
    </div>
  );
};

export default ConnectWallet;
