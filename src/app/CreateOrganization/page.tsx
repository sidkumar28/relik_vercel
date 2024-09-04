'use client';

import React from 'react';
import CreateOrganizationForm from '@/components/shared/CreateOrganizationForm';

const CreateOrganizationPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center ">
      <CreateOrganizationForm />
    </div>
  );
};

export default CreateOrganizationPage;
