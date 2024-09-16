'use client';

import React, { useState } from 'react';
import Web3 from 'web3';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { contractABI, contractAddress } from '@/contracts/contract';

interface CreateProposalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  daoId: number;
  onProposalCreated: () => void; // New prop
}

const CreateProposalDialog: React.FC<CreateProposalDialogProps> = ({ open, onOpenChange, daoId, onProposalCreated }) => {
  const [proposalDescription, setProposalDescription] = useState('');
  const [voteOptions, setVoteOptions] = useState<string[]>(['', '', '', '']);
  const [votingDuration, setVotingDuration] = useState('');

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...voteOptions];
    newOptions[index] = value;
    setVoteOptions(newOptions);
  };

  const handleCreateProposalSubmit = async () => {
    if (!proposalDescription || voteOptions.some(option => !option) || !votingDuration) {
      alert('Please fill all fields before submitting.');
      return;
    }

    try {
      const { ethereum } = window as any;
      if (!ethereum) {
        alert('MetaMask not found!');
        return;
      }

      const web3 = new Web3(ethereum);
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(contractABI, contractAddress);

      // Convert votingDuration from days to seconds
      const durationInSeconds = Number(votingDuration) * 24 * 60 * 60;
      
      await contract.methods.createProposal(daoId, proposalDescription, voteOptions, durationInSeconds).send({ from: accounts[0] });

      alert('Proposal created successfully');
      onProposalCreated();
    } catch (error) {
      console.error('Error creating proposal:', error);
      alert('Failed to create proposal. Please try again.');
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Proposal</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">Description:</label>
            <textarea
              id="description"
              value={proposalDescription}
              onChange={(e) => setProposalDescription(e.target.value)}
              placeholder="Proposal description"
              className="w-full p-2 border rounded-md"
              rows={3}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Vote Options:</label>
            {voteOptions.map((option, index) => (
              <Input
                key={index}
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="w-full p-2 border rounded-md"
              />
            ))}
          </div>
          <div className="grid gap-2">
            <label htmlFor="duration" className="text-sm font-medium">Voting Duration (in days):</label>
            <Input
              id="duration"
              type="number"
              value={votingDuration}
              onChange={(e) => setVotingDuration(e.target.value)}
              placeholder="e.g. 7"
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreateProposalSubmit} className="bg-gradient-to-r from-pink-500 to-yellow-500">
            Submit
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProposalDialog;