'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FaChevronDown } from 'react-icons/fa';

interface Organization {
  id: number;
  name: string;
  logo: string;
}

interface Proposal {
  id: number;
  title: string;
  logo: string;
}

const organizations: Organization[] = [
  { id: 1, name: 'Accelchain', logo: '/images/accelchain.jpeg' },
  { id: 2, name: 'Microsoft', logo: '/images/microsoft.png' },
  { id: 3, name: 'Apple', logo: '/images/apple.png' },
  { id: 4, name: 'Reliance', logo: '/images/reliance.png' },
  { id: 5, name: 'Tata', logo: '/images/tata.png' },
  { id: 6, name: 'MitAdt', logo: '/images/mitadt.jpeg' },
];

const proposalsData: Proposal[] = [
  { id: 1, title: 'Proposal 1', logo: '/images/tata.png' },
  { id: 2, title: 'Proposal 2', logo: '/images/reliance.png' },
  { id: 3, title: 'Proposal 3', logo: '/images/microsoft.png' },
];

const MyOrganizations: React.FC = () => {
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const handleOrgClick = (org: Organization) => {
    setSelectedOrg(org);
    setIsPopupOpen(true);
  };

  const handleProposalClick = (proposal: Proposal) => {
    router.push(`/ProposalDetails/${proposal.id}`);
  };

  const handleCreateProposalClick = () => {
    if (selectedOrg) {
      router.push(`/CreateProposalForm?organization=${selectedOrg.name}`);
    }
  };

  return (
    <div className="p-12 text-white max-w-screen-xl mx-auto">
      <h1 className="text-3xl font-semibold mb-10 text-center bg-gradient-to-r from-pink-400 to-yellow-500 bg-clip-text text-transparent">
        My Organizations
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {organizations.map((org) => (
          <div
            key={org.id}
            className="relative flex flex-col items-center bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl group"
            style={{ width: '320px', height: '300px' }}
            onClick={() => handleOrgClick(org)}
          >
            <div className="relative w-full h-52 overflow-hidden">
              <img
                src={org.logo}
                alt={org.name}
                className="w-fit h-fit object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-transparent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
            </div>
            <div className="p-4 text-center">
              <h2 className="text-lg font-semibold text-purple-900">{org.name}</h2>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isPopupOpen} onOpenChange={setIsPopupOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Proposals for {selectedOrg?.name}</DialogTitle>
          </DialogHeader>
          <div>
            <button
              className="flex items-center justify-between w-full p-4 bg-gray-100 rounded"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>Proposals</span>
              <span className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                <FaChevronDown />
              </span>
            </button>
            {isDropdownOpen && (
              <div className="max-h-64 overflow-y-auto mt-2">
                {proposalsData.map((proposal) => (
                  <div
                    key={proposal.id}
                    className="flex items-center space-x-4 mb-4 cursor-pointer"
                    onClick={() => handleProposalClick(proposal)}
                  >
                    <img src={proposal.logo} alt={proposal.title} className="w-8 h-8" />
                    <p>{proposal.title}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mt-4 flex justify-end">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleCreateProposalClick}
            >
              Create Proposal
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyOrganizations;
