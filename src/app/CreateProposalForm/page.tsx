'use client';
import React from 'react';
import CreateProposalForm from '@/components/shared/CreateProposalForm';

interface ProposalData {
  title: string;
  description: string;
  // Add any other fields you expect in your form data
}

const CreateProposalPage: React.FC = () => {
  const handleFormSubmit = (data: ProposalData) => {
    console.log('Submitted Data:', data);
    // Add your logic for handling form data submission here
  };

  return (
    <div className="p-6">
      <CreateProposalForm onSubmit={handleFormSubmit} />
    </div>
  );
};

export default CreateProposalPage;
