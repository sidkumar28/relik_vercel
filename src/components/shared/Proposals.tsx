// 'use client';

// import React, { useState, useEffect } from 'react';
// import Web3 from 'web3';
// import { contractABI, contractAddress } from '@/contracts/contract';
// import CreateProposalDialog from '@/components/shared/CreateProposalForm';
// import ProposalDrawer from '@/components/shared/ProposalDrawer';

// interface Proposal {
//   id: number;
//   description: string;
//   optionDescriptions: string[];
//   optionVoteCounts: number[];
//   executed: boolean;
//   deadline: number;
//   totalVotes: number;
// }

// const ProposalPage: React.FC = () => {
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [selectedProposalId, setSelectedProposalId] = useState<number | null>(null);
//   const [proposals, setProposals] = useState<Proposal[]>([]);
//   const [daoId, setDaoId] = useState<number>(0); // You should get this from query parameters or context

//   useEffect(() => {
//     const fetchProposals = async () => {
//       try {
//         const { ethereum } = window as any;
//         if (!ethereum) {
//           alert('MetaMask not found!');
//           return;
//         }

//         const web3 = new Web3(ethereum);
//         const contract = new web3.eth.Contract(contractABI, contractAddress);

//         const proposalCount = await contract.methods.getProposalCount(daoId).call();
//         const fetchedProposals: Proposal[] = [];

//         for (let i = 0; i < Number(proposalCount); i++) {
//           const proposalData = await contract.methods.getProposal(daoId, i).call();
//           fetchedProposals.push({
//             id: i,
//             description: proposalData[0] as string,
//             optionDescriptions: proposalData[1] as string[],
//             optionVoteCounts: proposalData[2] as number[],
//             executed: proposalData[3] as boolean,
//             deadline: proposalData[4] as number,
//             totalVotes: proposalData[5] as number,
//           });
//         }

//         setProposals(fetchedProposals);
//       } catch (error) {
//         console.error('Error fetching proposals:', error);
//       }
//     };

//     fetchProposals();
//   }, [daoId]);

//   const handleProposalClick = (proposalId: number) => {
//     setSelectedProposalId(proposalId);
//     setDrawerOpen(true);
//   };

//   const handleCreateProposalClick = () => {
//     setDialogOpen(true);
//   };

//   return (
//     <div className="min-h-screen p-8 text-white max-w-screen-xl mx-auto">
//       <div className="mb-6">
//         <button
//           className="bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 text-white text-xl px-4 py-2 rounded-3xl flex items-center justify-center w-52 h-16 text-center overflow-hidden"
//           onClick={handleCreateProposalClick}
//         >
//           Create Proposal
//         </button>
//       </div>
      
//       <div className="flex items-start justify-between p-8 border-2 border-orange-400 rounded-lg bg-gradient-to-r from-[#001f3f] via-[#003366] to-[#00274d]">
//         <div className="w-1/2 pr-8">
//           <img src="/images/concept.png" alt="Tech illustration" className="w-full h-auto rounded-lg shadow-lg" />
//         </div>
//         <div className="border-l-2 border-[#00aaff]"></div>
//         <div className="w-1/2">
//           <div className="flex items-center space-x-4 mb-8">
//             <img src="/images/organization-logo.png" alt="Organization Logo" className="w-24 h-24 rounded-full shadow-lg" />
//             <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600">
//               Organization Name
//             </h1>
//           </div>
//           <div className="p-6 rounded-lg">
//             <h2 className="text-2xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600">
//               Proposals
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               {proposals.map((proposal) => (
//                 <div
//                   key={proposal.id}
//                   className="relative bg-gradient-to-r from-[#004466] to-[#006699] p-4 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
//                   onClick={() => handleProposalClick(proposal.id)}
//                 >
//                   <h3 className="text-xl font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
//                     {proposal.description}
//                   </h3>
//                   <p className="text-sm text-gray-300 mb-4">Options: {proposal.optionDescriptions.join(', ')}</p>
//                   <p className="text-xs text-gray-400">Date: {new Date(proposal.deadline * 1000).toLocaleDateString()}</p>
//                   <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-transparent opacity-0 hover:opacity-30 transition-opacity duration-500"></div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
      
//       {selectedProposalId !== null && (
//         <ProposalDrawer
//           open={drawerOpen}
//           onClose={() => setDrawerOpen(false)}
//           daoId={daoId}
//           proposalId={selectedProposalId}
//         />
//       )}

//       <CreateProposalDialog
//         open={dialogOpen}
//         onOpenChange={setDialogOpen}
//         daoId={daoId} // Pass DAO ID to the dialog
//       />
//     </div>
//   );
// };

// export default ProposalPage;
