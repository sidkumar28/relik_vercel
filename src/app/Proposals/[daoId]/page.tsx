'use client';

import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { contractABI, contractAddress } from '@/contracts/contract';
import CreateProposalDialog from '@/components/shared/CreateProposalForm'; 
import ProposalSidebar from '@/components/shared/ProposalSidebar'; 
import OrganizationActionsDialog from '@/components/shared/OrganizationDialog';
import { useParams, useSearchParams } from 'next/navigation'; 

let web3: Web3;
let contract: any;

interface Proposal {
  id: number;
  description: string;
  optionDescriptions: string[];
  optionVoteCounts: number[];
  executed: boolean;
  deadline: number;
  totalVotes: number;
}

const ProposalPage: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [manageMembersOpen, setManageMembersOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [organization, setOrganization] = useState<{ id: number; name: string; logo: string } | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isWeb3Ready, setIsWeb3Ready] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const { daoId } = useParams();
  const searchParams = useSearchParams();
  const resolvedDaoId = Array.isArray(daoId) ? daoId[0] : daoId;

  useEffect(() => {
    const initWeb3 = async () => {
      if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          web3 = new Web3(window.ethereum);
          contract = new web3.eth.Contract(contractABI, contractAddress);
          setIsWeb3Ready(true);
        } catch (error) {
          console.error("User denied account access or MetaMask is not installed");
          setError("Please install MetaMask and connect your account to use this dApp.");
        }
      } else {
        console.log('No web3 detected. Falling back to http://localhost:8545.');
        const httpProvider = new Web3.providers.HttpProvider('http://localhost:8545');
        web3 = new Web3(httpProvider);
        contract = new web3.eth.Contract(contractABI, contractAddress);
        setIsWeb3Ready(true);
      }
    };

    initWeb3();
    const isAdminParam = searchParams.get('isAdmin');
    setIsAdmin(isAdminParam === 'true');
  }, [searchParams]);

  const fetchDAOAndProposals = async () => {
    if (!isWeb3Ready) {
      console.log("Web3 is not ready yet");
      return;
    }
  
    try {
      const accounts = await web3.eth.getAccounts();
      if (accounts.length === 0) {
        throw new Error('No accounts found. Please connect your MetaMask account.');
      }
  
      if (resolvedDaoId) {
        const daoName = await contract.methods.returnDaoName(resolvedDaoId).call();
        const daoImageUrl = await contract.methods.getDAOImageUrl(resolvedDaoId).call();
        setOrganization({
          id: parseInt(resolvedDaoId), 
          name: daoName,
          logo: daoImageUrl || '/images/dao_logo.png', // Use the fetched image URL or fallback to default
        });
  
        const dao = await contract.methods.daos(resolvedDaoId).call();
        const totalProposals = parseInt(dao.proposalCount);
  
        const proposalsData = await Promise.all(
          Array.from({ length: totalProposals }, (_, index) =>
            contract.methods.getProposal(resolvedDaoId, index).call()
          )
        );
  
        const formattedProposals = proposalsData.map((proposalData: any, index: number) => ({
          id: index,
          description: proposalData.description,
          optionDescriptions: proposalData.optionDescriptions.filter((desc: string) => desc !== ''),
          optionVoteCounts: proposalData.optionVoteCounts
            .slice(0, proposalData.optionDescriptions.filter((desc: string) => desc !== '').length)
            .map((count: string) => parseInt(count)),
          executed: proposalData.executed,
          deadline: parseInt(proposalData.deadline),
          totalVotes: parseInt(proposalData.totalVotes)
        }));
  
        setProposals(formattedProposals);
      }
    } catch (error) {
      console.error('Error fetching DAO and proposals:', error);
      setError((error as Error).message); 
    }
  };

  useEffect(() => {
    if (isWeb3Ready) {
      fetchDAOAndProposals();
    }
  }, [resolvedDaoId, isWeb3Ready]);

  const handleProposalClick = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setDrawerOpen(true);
  };

  const handleCreateProposalClick = () => {
    setDialogOpen(true);
  };

  const handleManageMembersClick = () => {
    setManageMembersOpen(true);
  };

  const handleProposalCreated = () => {
    fetchDAOAndProposals();
    setDialogOpen(false);
  };

  return (
    <div className="min-h-screen p-4 lg:p-8 text-white max-w-screen-xl mx-auto">
      <div className="mb-6 flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
        <button
          className="bg-[#9911ED] text-white text-lg md:text-xl px-4 py-2 rounded-3xl flex items-center justify-center w-full md:w-52 h-12 md:h-16 text-center overflow-hidden"
          onClick={handleCreateProposalClick}
        >
          Create Proposal
        </button>
        {isAdmin && (
          <button
            className="bg-black text-white text-lg md:text-xl px-4 py-2 rounded-3xl flex items-center justify-center w-full md:w-52 h-12 md:h-16 text-center overflow-hidden"
            onClick={handleManageMembersClick}
          >
            Manage Members
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row items-start justify-between p-4 lg:p-8 rounded-lg bg-[#242731]">
        <div className="w-full lg:w-1/2 pr-0 lg:pr-8 mb-4 lg:mb-0">
          <img src="/images/concept.png" alt="Tech illustration" className="w-full h-auto rounded-lg shadow-lg" />
        </div>
        <div className="border-l-2 border-[#00aaff]"></div>
        <div className="w-full lg:w-1/2">
          <div className="flex items-center space-x-4 mb-4 lg:mb-8">
          <img 
            src={organization?.logo || '/images/dao_logo.png'} 
            alt={organization?.name || 'Default'} 
            className="w-24 h-24 rounded-full shadow-lg object-fill"
          />        
            <h1 className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-[#ffffff]">
              {organization?.name || 'Org Name'}
            </h1>
          </div>
          <div className="mt-6">
            <h2 className="text-xl md:text-2xl font-bold mb-4">Proposals</h2>
            <div className="h-64 md:h-80 overflow-y-auto space-y-4 pr-4">
              {error ? (
                <p className="text-red-500">{error}</p>
              ) : proposals.length > 0 ? (
                proposals.map(proposal => (
                  <div key={proposal.id} className="p-4 border rounded-lg bg-gray-800 shadow-lg">
                    <h3 className="text-lg md:text-xl font-semibold">{proposal.description}</h3>
                    <button
                      onClick={() => handleProposalClick(proposal)}
                      className="mt-2 bg-[#3f8cff] text-white px-4 py-2 rounded-lg"
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
        <ProposalSidebar
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
        onProposalCreated={handleProposalCreated}
      />

      {organization?.id !== undefined && (
        <OrganizationActionsDialog
          isOpen={manageMembersOpen}
          onClose={() => setManageMembersOpen(false)}
          daoId={organization.id}
        />
      )}
    </div>
  );
};

export default ProposalPage;