'use client';

import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { contractABI, contractAddress } from '@/contracts/contract';
import { X } from 'lucide-react'; // Assuming you're using lucide-react for icons
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';


interface Proposal {
  id: number;
  description: string;
  optionDescriptions: string[];
  optionVoteCounts: (number | bigint)[]; // Can be number or bigint
  executed: boolean;
  deadline: bigint;
  totalVotes: number;
}

interface ProposalSidebarProps {
  open: boolean;
  onClose: () => void;
  daoId: number;
  proposalId: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];


const ProposalSidebar: React.FC<ProposalSidebarProps> = ({ open, onClose, daoId, proposalId }) => {
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<string>('');

  useEffect(() => {
    const initWeb3 = async () => {
      if ((window as any).ethereum) {
        const web3Instance = new Web3((window as any).ethereum);
        setWeb3(web3Instance);

        const accounts = await web3Instance.eth.requestAccounts();
        setAccount(accounts[0]);
      } else {
        console.error('MetaMask not found!');
      }
    };

    initWeb3();
  }, []);

  useEffect
    const fetchProposal = async () => {
      if (web3 && daoId !== undefined && proposalId !== undefined) {
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        try {
          const proposalData = await contract.methods.getProposal(daoId, proposalId).call() as [string, string[], number[], boolean, number, number];
          
          setProposal({
            id: proposalId,
            description: proposalData[0],
            optionDescriptions: proposalData[1],
            optionVoteCounts: proposalData[2],
            executed: proposalData[3],
            deadline: BigInt(proposalData[4]),
            totalVotes: proposalData[4],
          });
        } catch (error) {
          console.error('Error fetching proposal:', error);
        }
      }
    };
  
    useEffect(() => {
      fetchProposal();
    }, [daoId, proposalId, web3]);
  
    
  
  useEffect(() => {
    const updateTimeRemaining = () => {
      if (proposal) {
        const now = BigInt(Math.floor(Date.now() / 1000));
        const deadline = BigInt(proposal.deadline);
        const timeLeft = deadline - now;
  
        if (timeLeft <= BigInt(0)) {
          setTimeRemaining("Voting ended");
        } else {
          const days = Number(timeLeft / BigInt(24 * 60 * 60));
          const hours = Number((timeLeft % BigInt(24 * 60 * 60)) / BigInt(60 * 60));
          const minutes = Number((timeLeft % BigInt(60 * 60)) / BigInt(60));
          setTimeRemaining(`${days}d ${hours}h ${minutes}m remaining`);
        }
      }
    };
  
    updateTimeRemaining();
    const timer = setInterval(updateTimeRemaining, 60000); // Update every minute
  
    return () => clearInterval(timer);
  }, [proposal]);

  const handleVote = async () => {
    if (web3 && account && daoId !== undefined && proposalId !== undefined && selectedOption !== '') {
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      try {
        const optionIndex = parseInt(selectedOption);
        await contract.methods.vote(daoId, proposalId, optionIndex).send({ from: account });
        alert('Vote submitted successfully!');
        // Refetch the proposal data after successful vote
        await fetchProposal();
        setSelectedOption(''); // Reset the selected option
      } catch (error) {
        console.error('Error while voting:', error);
        alert('Failed to submit vote. Please try again.');
      }
    }
  };
  const prepareChartData = () => {
    if (!proposal) return [];
    return proposal.optionDescriptions
      .map((option, index) => ({
        name: option || `Option ${index + 1}`,
        value: Number(proposal.optionVoteCounts[index])
      }))
      .filter(option => option.name !== '');
  };

  return (
    <div className={`fixed top-0 right-0 w-96 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto`}>
      <div className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Proposal Details</h2>
          <Button variant="ghost" onClick={onClose} className="p-1">
            <X className="h-6 w-6 text-black" />
          </Button>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">{proposal?.description || 'Loading...'}</h3>
          <p className="text-sm text-gray-600">{timeRemaining}</p>
        </div>

        <div className="mb-6 flex-grow">
          <h4 className="text-lg font-semibold text-gray-700 mb-4">Vote Options</h4>
          {proposal?.optionDescriptions && proposal.optionDescriptions.length > 0 ? (
            <div className="space-y-4">
              <Select onValueChange={setSelectedOption} disabled={timeRemaining === "Voting ended"}>
                <SelectTrigger className="w-full text-black">
                  <SelectValue 
                    placeholder="Select an option to vote"
                    className='text-black'  
                  />
                </SelectTrigger>
                <SelectContent>
                  {proposal.optionDescriptions
                    .filter(option => option !== '')
                    .map((option, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {option} (Votes: {proposal.optionVoteCounts[index]})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={handleVote} 
                className="w-full bg-blue-500 hover:bg-blue-600 text-white" 
                disabled={timeRemaining === "Voting ended" || !selectedOption}
              >
                Vote
              </Button>
            </div>
          ) : (
            <p>No vote options available.</p>
          )}
        </div>

        <div className="mt-auto">
          <h4 className="text-lg font-semibold text-gray-700 mb-4">Vote Distribution</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={prepareChartData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {prepareChartData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ProposalSidebar;