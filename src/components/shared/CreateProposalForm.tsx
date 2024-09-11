'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

interface CreateProposalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateProposalDialog: React.FC<CreateProposalDialogProps> = ({ open, onOpenChange }) => {
  const [proposalTitle, setProposalTitle] = useState('');
  const [proposalDescription, setProposalDescription] = useState('');
  const [selectedVoteOption, setSelectedVoteOption] = useState<string | null>(null);
  const [votingDuration, setVotingDuration] = useState('');
  const [voteOptions] = useState(['Option 1', 'Option 2', 'Option 3', 'Option 4']);

  const handleCreateProposalSubmit = () => {
    if (!proposalTitle || !proposalDescription || !selectedVoteOption || !votingDuration) {
      alert('Please fill all fields before submitting.');
      return;
    }
  
    console.log('New Proposal Created:', {
      title: proposalTitle,
      description: proposalDescription,
      voteOption: selectedVoteOption,
      duration: votingDuration,
    });
    onOpenChange(false); 
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Proposal</DialogTitle>
        </DialogHeader>
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-1">Title:</label>
            <Input
              type="text"
              value={proposalTitle}
              onChange={(e) => setProposalTitle(e.target.value)}
              placeholder="Proposal title"
              className="w-full p-2 border rounded-md"
            />
          </div>
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
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button className="w-full">{selectedVoteOption || 'Select Vote Option'}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {voteOptions.map((option, index) => (
                  <DropdownMenuItem key={index} onClick={() => setSelectedVoteOption(option)}>
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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
