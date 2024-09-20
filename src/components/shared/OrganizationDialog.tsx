'use client';

import React, { useState, useEffect } from 'react';
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setMemberAddress('');
    setError(null);
  };

  const handleAction = async (action: 'add' | 'remove') => {
    setIsSubmitting(true);
    setError(null);

    try {
      const { ethereum } = window as any;
      if (!ethereum) {
        throw new Error('MetaMask not found!');
      }

      const web3 = new Web3(ethereum);
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(contractABI, contractAddress);

      if (action === 'add') {
        await contract.methods.addMember(daoId, memberAddress).send({ from: accounts[0] });
        alert('Member added successfully');
      } else {
        await contract.methods.removeMember(daoId, memberAddress).send({ from: accounts[0] });
        alert('Member removed successfully');
      }

      onClose();
      resetForm();
    } catch (err) {
      console.error(err);
      setError(`Failed to ${action} member: ${(err as Error).message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(newOpen) => !isSubmitting && onClose()}>
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
            disabled={isSubmitting}
          />
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
        <DialogFooter>
          <Button 
            onClick={() => handleAction('add')} 
            className="bg-green-500 text-white"
            disabled={isSubmitting || !memberAddress}
          >
            {isSubmitting ? 'Add Member' : 'Add Member'}
          </Button>
          <Button 
            onClick={() => handleAction('remove')} 
            className="bg-red-500 text-white"
            disabled={isSubmitting || !memberAddress}
          >
            {isSubmitting ? 'Remove Member' : 'Remove Member'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrganizationActionsDialog;