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
  deadline: number;
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
  const [account, setAccount] = useState<string | null>(null); // Store user's account

  useEffect(() => {
    const fetchProposal = async () => {
      if (web3 && daoId !== undefined && proposalId !== undefined) {
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        try {
          // Explicitly type the proposal data returned from the contract
          const proposalData = await contract.methods.getProposal(daoId, proposalId).call() as [string, string[], number[], boolean, number, number];
          
          setProposal({
            id: proposalId,
            description: proposalData[0],       // description (string)
            optionDescriptions: proposalData[1], // optionDescriptions (string[])
            optionVoteCounts: proposalData[2],  // optionVoteCounts (number[])
            executed: proposalData[3],          // executed (boolean)
            deadline: proposalData[4],          // deadline (number)
            totalVotes: proposalData[5],        // totalVotes (number)
          });
        } catch (error) {
          console.error('Error fetching proposal:', error);
        }
      }
    };

    fetchProposal();
  }, [daoId, proposalId, web3]);

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
                <Button onClick={() => handleVote(index)} className="mt-2">
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
