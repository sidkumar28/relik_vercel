'use client';

import React from 'react';
import CreateOrganizationForm from '@/components/shared/CreateOrganizationForm';

const CreateOrganizationPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center ">
      <CreateOrganizationForm onOrganizationCreated={function (): void {
        throw new Error('Function not implemented.');
      } } />
    </div>
  );
};

export default CreateOrganizationPage;
