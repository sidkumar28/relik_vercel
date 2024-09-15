'use client';

import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { contractABI, contractAddress } from '@/contracts/contract';

interface Proposal {
  id: number;
  description: string;
  optionDescriptions: string[];
  optionVoteCounts: number[];
  executed: boolean;
  deadline: bigint;
  totalVotes: number;
}

interface ProposalDrawerProps {
  open: boolean;
  onClose: () => void;
  daoId: number;
  proposalId: number;
}

const ProposalDrawer: React.FC<ProposalDrawerProps> = ({ open, onClose, daoId, proposalId }) => {
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

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

  useEffect(() => {
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
            totalVotes: proposalData[5],
          });
        } catch (error) {
          console.error('Error fetching proposal:', error);
        }
      }
    };

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

  const handleVote = async (optionIndex: number) => {
    if (web3 && account && daoId !== undefined && proposalId !== undefined) {
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      try {
        await contract.methods.vote(daoId, proposalId, optionIndex).send({ from: account });
        alert('Vote submitted successfully!');
      } catch (error) {
        console.error('Error while voting:', error);
      }
    }
  };

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{`Proposal ${proposalId}`}</DrawerTitle>
          <DrawerDescription>{proposal?.description || 'Loading...'}</DrawerDescription>
          <p className="text-sm text-gray-500 mt-2">{timeRemaining}</p>
        </DrawerHeader>

        <div className="p-4">
          <h3 className="text-xl font-semibold mb-4">Vote Options</h3>
          {proposal?.optionDescriptions && proposal.optionDescriptions.length > 0 ? (
            proposal.optionDescriptions.map((option, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between">
                  <p>{option}</p>
                  <p>{`Votes: ${proposal?.optionVoteCounts[index]}`}</p>
                </div>
                <Button onClick={() => handleVote(index)} className="mt-2" disabled={timeRemaining === "Voting ended"}>
                  Vote for this option
                </Button>
              </div>
            ))
          ) : (
            <p>No vote options available.</p>
          )}
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ProposalDrawer;