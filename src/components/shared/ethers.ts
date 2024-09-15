import { ethers } from 'ethers';
import { contractABI, contractAddress } from '@/contracts/contract'; // Update with actual path

// Connect to Ethereum
const provider = new ethers.providers.Web3Provider(window.ethereum);
const contract = new ethers.Contract(contractAddress, contractABI, provider);
