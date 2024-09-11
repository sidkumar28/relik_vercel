'use client';

import React, { useState } from 'react';
import CreateProposalDialog from '@/components/shared/CreateProposalForm'; 
import ProposalDrawer from '@/components/shared/ProposalDrawer'; 

interface Proposal {
  id: number;
  title: string;
  description: string;
  date: string;
}

const organization = {
  id: 1,
  name: 'Accelchain',
  logo: '/images/accelchain.jpeg',
};

const proposals: Proposal[] = [
  { id: 1, title: 'Proposal 1', description: 'Description for proposal 1', date: '2024-08-15' },
  { id: 2, title: 'Proposal 2', description: 'Description for proposal 2', date: '2024-09-01' },
  { id: 3, title: 'Proposal 3', description: 'Description for proposal 3', date: '2024-09-07' },
];

const ProposalPage: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

  const handleProposalClick = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setDrawerOpen(true);
  };

  const handleCreateProposalClick = () => {
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen p-8 text-white max-w-screen-xl mx-auto">
      <div className="mb-6">
        <button
          className="bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 text-white text-xl px-4 py-2 rounded-3xl flex items-center justify-center w-52 h-16 text-center overflow-hidden"
          onClick={handleCreateProposalClick}
        >
          Create Proposal
        </button>
      </div>

      
      <div className="flex items-start justify-between p-8 border-2 border-orange-400 rounded-lg bg-gradient-to-r from-[#001f3f] via-[#003366] to-[#00274d]">
        <div className="w-1/2 pr-8">
          <img src="/images/concept.png" alt="Tech illustration" className="w-full h-auto rounded-lg shadow-lg" />
        </div>
        <div className="border-l-2 border-[#00aaff]"></div>
        <div className="w-1/2">
          <div className="flex items-center space-x-4 mb-8">
            <img src={organization.logo} alt={organization.name} className="w-24 h-24 rounded-full shadow-lg" />
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600">
              {organization.name}
            </h1>
          </div>
          <div className="p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600">
              Proposals
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {proposals.map((proposal) => (
                <div
                  key={proposal.id}
                  className="relative bg-gradient-to-r from-[#004466] to-[#006699] p-4 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
                  onClick={() => handleProposalClick(proposal)}
                  >
                  <h3 className="text-xl font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                    {proposal.title}
                  </h3>
                  <p className="text-sm text-gray-300 mb-4">{proposal.description}</p>
                  <p className="text-xs text-gray-400">Date: {proposal.date}</p>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-transparent opacity-0 hover:opacity-30 transition-opacity duration-500"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      
      {selectedProposal && (
        <ProposalDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          proposal={selectedProposal}
        />
      )}

      
      <CreateProposalDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};

export default ProposalPage;
  
