'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
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

const createOrganizationSchema = z.object({
  name: z.string().min(2, { message: 'Organization name must be at least 2 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  website: z.string().url({ message: 'Invalid URL.' }).optional(),
  logo: z.instanceof(File).optional(),
});

type CreateOrganizationFormValues = z.infer<typeof createOrganizationSchema>;

const CreateOrganizationForm: React.FC = () => {
  const [logoPreview, setLogoPreview] = useState<string | ArrayBuffer | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CreateOrganizationFormValues>({
    resolver: zodResolver(createOrganizationSchema),
  });

  const onSubmit: SubmitHandler<CreateOrganizationFormValues> = (data) => {
    console.log('Form Data:', data);
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) { 
      setValue('logo', file);
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="max-w-lg mx-auto mt-10 p-6">
      <CardHeader>
        <CardTitle>Create an Organization</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="name">Organization Name <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              placeholder="Enter organization name"
              {...register('name')}
              className="mt-2"
            />
            {errors.name && <p className="text-red-500 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
            <Input
              id="description"
              placeholder="Enter a brief description"
              {...register('description')}
              className="mt-2"
            />
            {errors.description && <p className="text-red-500 mt-1">{errors.description.message}</p>}
          </div>
          <div>
            <Label htmlFor="email">Contact Email <span className="text-red-500">*</span></Label>
            <Input
              id="email"
              placeholder="Enter contact email"
              {...register('email')}
              className="mt-2"
            />
            {errors.email && <p className="text-red-500 mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              placeholder="Enter organization website"
              {...register('website')}
              className="mt-2"
            />
            {errors.website && <p className="text-red-500 mt-1">{errors.website.message}</p>}
          </div>
          <div>
            <Label htmlFor="logo">Organization Logo</Label>
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
          <Button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-yellow-500 text-black font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform">
            Create Organization
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateOrganizationForm;
