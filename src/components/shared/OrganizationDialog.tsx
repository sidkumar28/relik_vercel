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
      <DialogContent className="max-w-full sm:max-w-lg mx-auto p-4 sm:p-6 bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">Organization Actions</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <Label htmlFor="memberAddress" className="text-sm sm:text-base">Member Address</Label>
          <Input
            id="memberAddress"
            value={memberAddress}
            onChange={(e) => setMemberAddress(e.target.value)}
            placeholder="Enter member address"
            className="mt-2 w-full text-sm sm:text-base"
            disabled={isSubmitting}
          />
          {error && <p className="text-red-500 text-xs sm:text-sm mt-2">{error}</p>}
        </div>
        <DialogFooter className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={() => handleAction('add')} 
            className="w-full sm:w-auto bg-green-500 text-white text-sm sm:text-base"
            disabled={isSubmitting || !memberAddress}
          >
            {isSubmitting ? 'Add Member' : 'Add Member'}
          </Button>
          <Button 
            onClick={() => handleAction('remove')} 
            className="w-full sm:w-auto bg-red-500 text-white text-sm sm:text-base"
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