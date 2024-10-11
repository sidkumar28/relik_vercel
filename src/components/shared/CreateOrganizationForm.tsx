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
import axios from 'axios'; 

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;

const createOrganizationSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters.' }),
});

type CreateOrganizationFormValues = z.infer<typeof createOrganizationSchema>;

interface CreateOrganizationDialogProps {
  onOrganizationCreated: () => void;
}

const CreateOrganizationDialog: React.FC<CreateOrganizationDialogProps> = ({ onOrganizationCreated }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateOrganizationFormValues>({
    resolver: zodResolver(createOrganizationSchema),
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setError(null); 
    }
  };

  const uploadImageToIPFS = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
        headers: {
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_API_KEY,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Image uploaded to IPFS:', response.data.IpfsHash); 
      return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`; 
    } catch (err) {
      console.error('Error uploading image to IPFS:', err);
      throw new Error('Failed to upload image to IPFS');
    }
  };

  const onSubmit: SubmitHandler<CreateOrganizationFormValues> = async (data) => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (!imageFile) {
        setError('Please select an image to upload.');
        return;
      }

      const imageUrl = await uploadImageToIPFS(imageFile); 
      console.log('Uploaded Image URL:', imageUrl); 

      const { ethereum } = window as any;
      if (!ethereum) {
        console.error('MetaMask not found!');
        setError('MetaMask not found!');
        return;
      }

      const web3 = new Web3(ethereum);
      const accounts = await web3.eth.getAccounts();
      if (accounts.length === 0) {
        console.error('No accounts found');
        setError('No accounts found');
        return;
      }

      const contract = new web3.eth.Contract(contractABI, contractAddress);
      const response = await contract.methods.createDAO(data.title, imageUrl).send({ from: accounts[0] });
      console.log('Response from createDAO:', response); 

      onOrganizationCreated();
      setIsDialogOpen(false);
      reset();
    } catch (err) {
      console.error('Error during DAO creation:', err); 
      setError((err as Error).message || 'Failed to create DAO');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button onClick={() => setIsDialogOpen(true)} className="bg-[#9911ED] text-white text-lg md:text-xl mb-4 md:mb-6 px-3 md:px-4 py-2 rounded-3xl flex items-center justify-center w-52 md:w-64 h-14 md:h-16 text-center overflow-hidden">
        Create Organization
      </Button>
      <Dialog open={isDialogOpen} onOpenChange={() => setIsDialogOpen(false)}>
        <DialogContent className="max-w-full lg:max-w-lg mx-auto p-4 md:p-6">
          <DialogHeader>
            <DialogTitle className='text-lg md:text-xl'>Create an Organization</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 md:space-y-6">
            <div>
              <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
              <Input
                id="title"
                placeholder="Enter organization title"
                {...register('title')}
                className="mt-1 md:mt-2"
                disabled={isSubmitting}
              />
              {errors.title && <p className="text-red-500 mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <Label htmlFor="imageUpload">Upload Image <span className="text-red-500">*</span></Label>
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={handleImageUpload}
                className="mt-1 md:mt-2"
                disabled={isSubmitting}
              />
              {imageFile && <p className="text-green-500 mt-1">Image selected: {imageFile.name}</p>}
            </div>
            <DialogFooter className='flex flex-col md:flex-row md:justify-end space-y-2 md:space-y-0 md:space-x-4'>
              <Button type="submit" className="bg-[#9911ED] text-white font-semibold rounded-lg shadow-lg w-full md:w-auto" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
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
