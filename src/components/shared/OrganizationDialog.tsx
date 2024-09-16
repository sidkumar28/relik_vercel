'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import Web3 from 'web3';
import { contractABI, contractAddress } from '@/contracts/contract';

interface OrganizationActionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  daoId: number;
}

const OrganizationActionsDialog: React.FC<OrganizationActionsDialogProps> = ({ isOpen, onClose, daoId }) => {
  const [memberAddress, setMemberAddress] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAddMember = async () => {
    try {
      const { ethereum } = window as any;
      if (!ethereum) {
        alert('MetaMask not found!');
        return;
      }

      const web3 = new Web3(ethereum);
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(contractABI, contractAddress);

      await contract.methods.addMember(daoId, memberAddress).send({ from: accounts[0] });
      alert('Member added successfully');
      onClose(); // Close the dialog after the action
    } catch (err) {
      console.error(err);
      setError('Failed to add member');
    }
  };

  const handleRemoveMember = async () => {
    try {
      const { ethereum } = window as any;
      if (!ethereum) {
        alert('MetaMask not found!');
        return;
      }

      const web3 = new Web3(ethereum);
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(contractABI, contractAddress);

      await contract.methods.removeMember(daoId, memberAddress).send({ from: accounts[0] });
      alert('Member removed successfully');
      onClose(); 
    } catch (err) {
      console.error(err);
      setError('Failed to remove member');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg mx-auto p-6 bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Organization Actions</DialogTitle>
        </DialogHeader>
        <div>
          <Label htmlFor="memberAddress">Member Address</Label>
          <Input
            id="memberAddress"
            value={memberAddress}
            onChange={(e) => setMemberAddress(e.target.value)}
            placeholder="Enter member address"
            className="mt-2"
          />
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
        <DialogFooter>
          <Button onClick={handleAddMember} className="bg-green-500 text-white">
            Add Member
          </Button>
          <Button onClick={handleRemoveMember} className="bg-red-500 text-white">
            Remove Member
          </Button>
          {/* <Button variant="ghost" onClick={onClose} className="bg-gray-500 text-white">
            Close
          </Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrganizationActionsDialog;
