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
  const [voteOptions, setVoteOptions] = useState<string[]>(['']);
  const [newOption, setNewOption] = useState('');
  const [votingDuration, setVotingDuration] = useState('');

  const handleAddOption = () => {
    if (newOption) {
      setVoteOptions([...voteOptions, newOption]);
      setNewOption('');
    }
  };

  const handleCreateProposalSubmit = async () => {
    if (!proposalDescription || voteOptions.length === 0 || !votingDuration) {
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Proposal</DialogTitle>
        </DialogHeader>
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-1">Description:</label>
            <textarea
              value={proposalDescription}
              onChange={(e) => setProposalDescription(e.target.value)}
              placeholder="Proposal description"
              className="w-full p-2 border rounded-md"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Vote Options:</label>
            <div className="flex flex-col space-y-2 mb-4">
              {voteOptions.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="bg-gray-700 p-2 rounded-md text-white">{option}</span>
                </div>
              ))}
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  placeholder="Add new option"
                  className="w-full p-2 border rounded-md"
                />
                <Button onClick={handleAddOption} className="bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500">
                  Add
                </Button>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Voting Duration (in days):</label>
            <Input
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