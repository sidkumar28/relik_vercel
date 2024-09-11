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

const createOrganizationSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters.' }),
  imageUrl: z.string().url({ message: 'Invalid URL.' }),
});

type CreateOrganizationFormValues = z.infer<typeof createOrganizationSchema>;

const CreateOrganizationDialog: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false); 

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateOrganizationFormValues>({
    resolver: zodResolver(createOrganizationSchema),
  });

  const onSubmit: SubmitHandler<CreateOrganizationFormValues> = (data) => {
    console.log('Form Data:', data);
    setIsDialogOpen(false); 
    reset(); 
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
        className="bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500  text-white text-xl mb-6 px-4 py-2 rounded-3xl flex items-center justify-center w-64 h-16 text-center overflow-hidden"
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
            <div>
              <Label htmlFor="imageUrl">Image URL <span className="text-red-500">*</span></Label>
              <Input
                id="imageUrl"
                placeholder="Enter image URL"
                {...register('imageUrl')}
                className="mt-2"
              />
              {errors.imageUrl && <p className="text-red-500 mt-1">{errors.imageUrl.message}</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" className="text-blue-500">
                Add Members
              </Button>
              <Button type="button" variant="outline" className="text-red-500">
                Remove Members
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-pink-500 to-yellow-500 text-black font-semibold rounded-lg shadow-lg">
                Submit
              </Button>
              <Button type="button" variant="ghost" onClick={handleCloseDialog}>
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateOrganizationDialog;
