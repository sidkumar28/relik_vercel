// src/app/ProposalDetails/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Proposal {
  id: number;
  title: string;
  logo: string;
  description: string;
}

const ProposalDetails: React.FC = () => {
  const { id } = useParams();
  const [proposal, setProposal] = useState<Proposal | null>(null);

  useEffect(() => {
    if (id) {
      // Fetch the proposal details based on the ID
      const fetchedProposal = proposalsData.find(p => p.id === Number(id));
      setProposal(fetchedProposal || null);
    }
  }, [id]);

  const handleVoteClick = () => {
    alert('Vote button clicked');
    // Implement the voting logic here
  };

  if (!proposal) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-12 text-white max-w-screen-xl mx-auto">
      <h1 className="text-3xl font-semibold mb-4 text-center bg-gradient-to-r from-pink-400 to-yellow-500 bg-clip-text text-transparent">
        {proposal.title}
      </h1>
      <div className="text-center">
        <img src={proposal.logo} alt={proposal.title} className="w-32 h-32 object-cover mx-auto mb-4" />
        <p className="text-lg mb-4">{proposal.description}</p>
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleVoteClick}
        >
          Vote
        </button>
      </div>
    </div>
  );
};

// Hardcoded proposal data for demonstration
const proposalsData: Proposal[] = [
  { id: 1, title: 'Proposal 1', logo: '/images/tata.png', description: 'Description for Proposal 1' },
  { id: 2, title: 'Proposal 2', logo: '/images/reliance.png', description: 'Description for Proposal 2' },
  { id: 3, title: 'Proposal 3', logo: '/images/microsoft.png', description: 'Description for Proposal 3' },
];

export default ProposalDetails;
