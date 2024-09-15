'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import Web3 from 'web3';
import { contractABI, contractAddress } from '@/contracts/contract';

const createOrganizationSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters.' }),
});

type CreateOrganizationFormValues = z.infer<typeof createOrganizationSchema>;

interface CreateOrganizationDialogProps {
  onOrganizationCreated?: () => void; // Optional callback to trigger re-fetch
}

const CreateOrganizationDialog: React.FC<CreateOrganizationDialogProps> = ({ onOrganizationCreated }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false); 
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateOrganizationFormValues>({
    resolver: zodResolver(createOrganizationSchema),
  });

  const onSubmit: SubmitHandler<CreateOrganizationFormValues> = async (data) => {
    try {
      const { ethereum } = window as any;
      if (!ethereum) {
        alert('MetaMask not found!');
        return;
      }
  
      const web3 = new Web3(ethereum);
      const accounts = await web3.eth.getAccounts();
      if (accounts.length === 0) {
        alert('No accounts found');
        return;
      }
  
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      const response = await contract.methods.createDAO(data.title).send({ from: accounts[0] });
  
      // Use optional chaining to safely access events
      const daoCreatedEvent = response.events?.DAOCreated;
      if (daoCreatedEvent) {
        alert('DAO created successfully!');
        if (onOrganizationCreated) onOrganizationCreated(); // Trigger re-fetch
      } else {
        alert('DAO creation failed.');
      }
      
      setIsDialogOpen(false);
      reset();
    } catch (err) {
      console.error(err);
      setError('Failed to create DAO');
    }
  };
  
  const handleOpenDialog = () => {
    setIsDialogOpen(true); 
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    reset(); 
  };

  return (
    <>
      <Button
        onClick={handleOpenDialog}
        className="bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 text-white text-xl mb-6 px-4 py-2 rounded-3xl flex items-center justify-items-start w-64 h-16 text-center overflow-hidden"
      >
        Create Organization
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg mx-auto p-6">
          <DialogHeader>
            <DialogTitle>Create an Organization</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
              <Input
                id="title"
                placeholder="Enter organization title"
                {...register('title')}
                className="mt-2"
              />
              {errors.title && <p className="text-red-500 mt-1">{errors.title.message}</p>}
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-gradient-to-r from-pink-500 to-yellow-500 text-black font-semibold rounded-lg shadow-lg">
                Submit
              </Button>
              <Button type="button" variant="ghost" onClick={handleCloseDialog}>
                Cancel
              </Button>
            </DialogFooter>
          </form>
          {error && <p className="text-red-500 mt-4">{error}</p>} {/* Display error message if any */}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateOrganizationDialog;
