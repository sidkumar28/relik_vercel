'use client';
import React from 'react';
import CreateProposalForm from '@/components/shared/CreateProposalForm';

const CreateProposalPage = () => {
  const handleFormSubmit = (data: any) => {
    // Handle the form submission here
    console.log('Submitted Data:', data);
  };

  return (
    <div className="p-6">
      <CreateProposalForm onSubmit={handleFormSubmit} />
    </div>
  );
};

export default CreateProposalPage;
