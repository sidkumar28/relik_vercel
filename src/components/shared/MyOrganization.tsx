'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Web3 from 'web3';
import { contractABI, contractAddress } from '@/contracts/contract';
import CreateOrganizationDialog from '@/components/shared/CreateOrganizationForm';
import OrganizationDialog from '@/components/shared/OrganizationDialog'; // Import the new dialog component

interface Organization {
  id: number;
  name: string;
}

const MyOrganizations: React.FC = () => {
  const [adminOrganizations, setAdminOrganizations] = useState<Organization[]>([]);
  const [memberOrganizations, setMemberOrganizations] = useState<Organization[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // For controlling dialog visibility
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null); // To track selected org
  const router = useRouter();

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const { ethereum } = window as any;
        if (!ethereum) {
          alert('MetaMask not found!');
          return;
        }

        const web3 = new Web3(ethereum);
        const accounts = await web3.eth.getAccounts();
        const contract = new web3.eth.Contract(contractABI, contractAddress);

        if (accounts.length === 0) {
          alert('No accounts found');
          return;
        }

        const adminOrgIds: number[] = await contract.methods.getDAOsForSender_admin().call({ from: accounts[0] });
        const memberOrgIds: number[] = await contract.methods.getDAOsForSender_member().call({ from: accounts[0] });

        const adminOrgs = await Promise.all(
          adminOrgIds.map(async (id: number) => {
            const name = await contract.methods.returnDaoName(id).call();
            return { id, name: name || 'Unknown DAO' };
          })
        );

        const memberOrgs = await Promise.all(
          memberOrgIds.map(async (id: number) => {
            const name = await contract.methods.returnDaoName(id).call();
            return { id, name: name || 'Unknown DAO' };
          })
        );

        setAdminOrganizations(adminOrgs as Organization[]);
        setMemberOrganizations(memberOrgs as Organization[]);
      } catch (error) {
        console.error('Error fetching DAOs:', error);
      }
    };

    fetchOrganizations();
  }, []);

  const handleOrgClick = (org: Organization) => {
    setSelectedOrganization(org);
    setIsDialogOpen(true); // Open the dialog when org is clicked
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedOrganization(null);
  };

  return (
    <div className="p-12 text-white max-w-screen-xl mx-auto">
      {/* Add Create Organization Button */}
      <div className="mb-6 flex justify-center">
        <CreateOrganizationDialog />
      </div>

      <div
        className="mb-10 p-6 rounded-lg border-2"
        style={{
          background: 'linear-gradient(to bottom, #002d4d, #003d6b, #00557d)',
          borderColor: '#00557d',
        }}
      >
        <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-center">
          Organizations You Admin
        </h2>
        <div className="flex flex-wrap justify-center gap-8">
          {adminOrganizations.length > 0 ? (
            adminOrganizations.map((org) => (
              <div
                key={org.id}
                className="relative flex flex-col items-center shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl group"
                style={{
                  width: '320px',
                  height: '300px',
                  background: 'linear-gradient(to bottom, #003d6b, #00557d)',
                }}
                onClick={() => handleOrgClick(org)}
              >
                <div className="p-4 text-center">
                  <h2 className="text-lg font-semibold text-white">{org.name}</h2>
                </div>
              </div>
            ))
          ) : (
            <p>No admin organizations found.</p>
          )}
        </div>
      </div>

      <div
        className="p-6 rounded-lg border-2"
        style={{
          background: 'linear-gradient(to bottom, #004d70, #008793)',
          borderColor: '#00557d',
        }}
      >
        <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-center">
          Organizations You’re a Member Of
        </h2>
        <div className="flex flex-wrap justify-center gap-8">
          {memberOrganizations.length > 0 ? (
            memberOrganizations.map((org) => (
              <div
                key={org.id}
                className="relative flex flex-col items-center shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl group"
                style={{
                  width: '320px',
                  height: '300px',
                  background: 'linear-gradient(to bottom, #004d70, #008793)',
                }}
                onClick={() => handleOrgClick(org)}
              >
                <div className="p-4 text-center">
                  <h2 className="text-lg font-semibold text-white">{org.name}</h2>
                </div>
              </div>
            ))
          ) : (
            <p>No member organizations found.</p>
          )}
        </div>
      </div>

      {/* Organization Actions Dialog */}
      {selectedOrganization && (
        <OrganizationDialog
          isOpen={isDialogOpen}
          onClose={handleDialogClose}
          daoId={selectedOrganization.id}
        />
      )}
    </div>
  );
};

export default MyOrganizations;
