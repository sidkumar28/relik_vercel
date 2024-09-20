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
  imageUrl: z.string().min(1, { message: 'Image URL is required.' }),
});

type CreateOrganizationFormValues = z.infer<typeof createOrganizationSchema>;

interface CreateOrganizationDialogProps {
  onOrganizationCreated: () => void;
}

const CreateOrganizationDialog: React.FC<CreateOrganizationDialogProps> = ({ onOrganizationCreated }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateOrganizationFormValues>({
    resolver: zodResolver(createOrganizationSchema),
  });

  const onSubmit: SubmitHandler<CreateOrganizationFormValues> = async (data) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const { ethereum } = window as any;
      if (!ethereum) {
        throw new Error('MetaMask not found!');
      }
  
      const web3 = new Web3(ethereum);
      const accounts = await web3.eth.getAccounts();
      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }
  
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      const response = await contract.methods.createDAO(data.title, data.imageUrl).send({ from: accounts[0] });
  
      const daoCreatedEvent = response.events?.DAOCreated;
      if (daoCreatedEvent) {
        alert('DAO created successfully!');
        onOrganizationCreated();
        setIsDialogOpen(false);
        reset();
      } else {
        throw new Error('DAO creation failed.');
      }
    } catch (err) {
      console.error(err);
      setError((err as Error).message || 'Failed to create DAO');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
    reset();
    setError(null);
  };

  const handleCloseDialog = () => {
    if (!isSubmitting) {
      setIsDialogOpen(false);
      reset();
      setError(null);
    }
  };

  return (
    <>
      <Button
        onClick={handleOpenDialog}
        className="bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 text-white text-xl mb-6 px-4 py-2 rounded-3xl flex items-center justify-items-start w-64 h-16 text-center overflow-hidden"
      >
        Create Organization
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
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
                disabled={isSubmitting}
              />
              {errors.title && <p className="text-red-500 mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <Label htmlFor="imageUrl">Image URL <span className="text-red-500">*</span></Label>
              <Input
                id="imageUrl"
                placeholder="Enter organization image URL"
                {...register('imageUrl')}
                className="mt-2"
                disabled={isSubmitting}
              />
              {errors.imageUrl && <p className="text-red-500 mt-1">{errors.imageUrl.message}</p>}
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-gradient-to-r from-pink-500 to-yellow-500 text-black font-semibold rounded-lg shadow-lg" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
              <Button type="button" variant="ghost" onClick={handleCloseDialog} disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogFooter>
          </form>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateOrganizationDialog;