'use client';

import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { contractABI, contractAddress } from '@/contracts/contract';
import CreateProposalDialog from '@/components/shared/CreateProposalForm'; 
import ProposalDrawer from '@/components/shared/ProposalDrawer'; 
import { useParams } from 'next/navigation'; 

const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
const contract = new web3.eth.Contract(contractABI, contractAddress);

interface Proposal {
  id: number;
  description: string;
  options: string[];
  optionVoteCounts: number[];
  executed: boolean;
  deadline: number;
  totalVotes: number;
}

const ProposalPage: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [organization, setOrganization] = useState<{ id: number; name: string; logo: string } | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const { daoId } = useParams();
  const resolvedDaoId = Array.isArray(daoId) ? daoId[0] : daoId;

  useEffect(() => {
    const fetchDAOAndProposals = async () => {
      try {
        const accounts = await web3.eth.getAccounts();
        if (accounts.length === 0) {
          throw new Error('No accounts found');
        }

        if (resolvedDaoId) {
          console.log("Fetching DAO Name for daoId:", resolvedDaoId);

          // Fetch DAO name
          const daoName = await contract.methods.returnDaoName(resolvedDaoId).call();

          if (typeof daoName !== 'string' || !daoName) {
            throw new Error('Invalid DAO name returned from contract');
          }

          console.log("Fetched DAO Name:", daoName);

          setOrganization({
            id: parseInt(resolvedDaoId), 
            name: daoName,
            logo: '/images/concept.png',
          });

          // Fetch total proposals
          const dao = await contract.methods.daos(resolvedDaoId).call();
          const totalProposals = web3.utils.toBN(dao.proposalCount).toNumber(); // Convert BN to number

          if (isNaN(totalProposals) || totalProposals < 0) {
            throw new Error('Invalid totalProposals value');
          }

          // Fetch proposals details
          const proposalsData = await Promise.all(
            Array.from({ length: totalProposals }, (_, index) =>
              contract.methods.getProposal(resolvedDaoId, index).call()
            )
          );

          // Format proposal data
          const formattedProposals = proposalsData.map((proposalData: any, index: number) => ({
            id: index,
            description: proposalData[0],
            options: proposalData[1],
            optionVoteCounts: proposalData[2].map((voteCount: string) => web3.utils.toBN(voteCount).toNumber()), // Convert from BigNumber to number
            executed: proposalData[3],
            deadline: web3.utils.toBN(proposalData[4]).toNumber(), // Convert from BigNumber to number
            totalVotes: web3.utils.toBN(proposalData[5]).toNumber() // Convert from BigNumber to number
          }));

          setProposals(formattedProposals);
        }
      } catch (error) {
        console.error('Error fetching DAO and proposals:', error);
        setError('Failed to fetch DAO and proposals. Please check your connection and try again.');
      }
    };

    fetchDAOAndProposals();
  }, [resolvedDaoId]);

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
            <img src={organization?.logo || '/images/dao_logo.png'} alt={organization?.name || 'Default'} className="w-24 h-24 rounded-full shadow-lg" />
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600">
              {organization?.name || 'Org Name'}
            </h1>
          </div>
          <div className="mt-6">
            <h2 className="text-2xl font-bold mb-4">Proposals</h2>
            <div className="space-y-4">
              {error ? (
                <p className="text-red-500">{error}</p>
              ) : proposals.length > 0 ? (
                proposals.map(proposal => (
                  <div key={proposal.id} className="p-4 border rounded-lg bg-gray-800 shadow-lg">
                    <h3 className="text-xl font-semibold">{proposal.description}</h3>
                    <button
                      onClick={() => handleProposalClick(proposal)}
                      className="mt-2 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 text-white px-4 py-2 rounded-lg"
                    >
                      View Details
                    </button>
                  </div>
                ))
              ) : (
                <p>No proposals found.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedProposal && organization?.id !== undefined && (
        <ProposalDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          daoId={organization.id}
          proposalId={selectedProposal.id}
        />
      )}

      <CreateProposalDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        daoId={organization?.id ?? 0}
      />
    </div>
  );
};

export default ProposalPage;
