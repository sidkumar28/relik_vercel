'use client';

import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const createProposalSchema = z.object({
  organization: z.string().nonempty(),
  title: z.string().min(2, { message: 'Proposal title must be at least 2 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  reason: z.string().optional(),
  logo: z.instanceof(File).optional(),
});

type CreateProposalFormValues = z.infer<typeof createProposalSchema>;

interface CreateProposalFormProps {
  onSubmit: SubmitHandler<CreateProposalFormValues>;
}

const CreateProposalForm: React.FC<CreateProposalFormProps> = ({ onSubmit }) => {
  const [logoPreview, setLogoPreview] = useState<string | ArrayBuffer | null>(null);
  
  const searchParams = useSearchParams();
  const organization = searchParams.get('organization') || '';

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreateProposalFormValues>({
    resolver: zodResolver(createProposalSchema),
    defaultValues: { organization },
  });

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue('logo', file);
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    setValue('organization', organization);
  }, [organization, setValue]);

  return (
    <Card className="max-w-lg mx-auto mt-10 p-6">
      <CardHeader>
        <CardTitle>Create a Proposal</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="organization">Organization</Label>
            <Input
              id="organization"
              value={organization}
              readOnly
              {...register('organization')}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="title">
              Proposal Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Enter proposal title"
              {...register('title')}
              className="mt-2"
            />
            {errors.title && <p className="text-red-500 mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <Label htmlFor="description">
              Description <span className="text-red-500">*</span>
            </Label>
            <Input
              id="description"
              placeholder="Enter a brief description"
              {...register('description')}
              className="mt-2"
            />
            {errors.description && <p className="text-red-500 mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <Label htmlFor="reason">Reason</Label>
            <Input
              id="reason"
              placeholder="Enter reason for the proposal"
              {...register('reason')}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="logo">Proposal Logo</Label>
            <input
              type="file"
              id="logo"
              accept="image/*"
              onChange={handleLogoChange}
              className="mt-2"
            />
            {logoPreview && <img src={logoPreview as string} alt="Logo preview" className="mt-2 w-32 h-32 object-cover" />}
            {errors.logo && <p className="text-red-500 mt-1">{errors.logo.message}</p>}
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-yellow-500 text-black font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform"
          >
            Submit Proposal
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateProposalForm;
