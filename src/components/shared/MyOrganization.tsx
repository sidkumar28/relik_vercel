'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Web3 from 'web3';
import { contractABI, contractAddress } from '@/contracts/contract';
import CreateOrganizationDialog from '@/components/shared/CreateOrganizationForm';

interface Organization {
  id: number;
  name: string;
  imageUrl: string;
}

const MyOrganizations: React.FC = () => {
  const [adminOrganizations, setAdminOrganizations] = useState<Organization[]>([]);
  const [memberOrganizations, setMemberOrganizations] = useState<Organization[]>([]);
  const router = useRouter();

  const fetchOrganizations = useCallback(async () => {
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
          const imageUrl = await contract.methods.getDAOImageUrl(id).call();
          return { 
            id, 
            name: name || 'Unknown DAO', 
            imageUrl: imageUrl || '' 
          } as Organization;
        })
      );

      const memberOrgs = await Promise.all(
        memberOrgIds.map(async (id: number) => {
          const name = await contract.methods.returnDaoName(id).call();
          const imageUrl = await contract.methods.getDAOImageUrl(id).call();
          return { 
            id, 
            name: name || 'Unknown DAO', 
            imageUrl: imageUrl || '' 
          } as Organization;
        })
      );

      setAdminOrganizations(adminOrgs);
      setMemberOrganizations(memberOrgs);
    } catch (error) {
      console.error('Error fetching DAOs:', error);
    }
  }, []);

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  const handleOrgClick = (org: Organization, isAdmin: boolean) => {
    router.push(`/Proposals/${org.id}?isAdmin=${isAdmin}`);
  };

  const renderImage = (imageUrl: string, name: string) => {
    return (
      <img
        src={imageUrl}
        alt={name}
        className="w-full h-48 object-cover"
        onError={(e) => {
          e.currentTarget.onerror = null; // prevents looping
          e.currentTarget.src = '/path/to/fallback-image.jpg'; // Replace with your fallback image path
        }}
      />
    );
  };

  return (
    <div className="p-4 sm:p-8 text-white max-w-screen-xl mx-auto">
      <div className="mb-6 flex justify-center">
        <CreateOrganizationDialog onOrganizationCreated={fetchOrganizations} />
      </div>

      <div
        className="mb-10 p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-transparent bg-clip-text bg-white text-center">
          Organizations You Admin
        </h2>
        <div className="flex flex-wrap justify-center gap-8">
          {adminOrganizations.map((org) => (
            <div
              key={org.id}
              className="relative flex flex-col items-center shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl group"
              style={{
                width: '320px',
                height: '300px',
                background: '#2f323b',
              }}
              onClick={() => handleOrgClick(org, true)}
            >
              <img
                src={org.imageUrl}
                alt={org.name}
                className="w-full h-48 object-fill"
              />
              <div className="p-4 text-center">
                <h2 className="text-lg font-semibold text-white">{org.name}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="p-4 sm:p-6 rounded-lg border-2"
        style={{
        }}
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-transparent bg-clip-text bg-white text-center">
          Organizations You're a Member Of
        </h2>
        <div className="flex flex-wrap justify-center gap-8">
          {memberOrganizations.map((org) => (
            <div
              key={org.id}
              className="relative flex flex-col items-center shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl group"
              style={{
                width: '320px',
                height: '300px',
                background: 'linear-gradient(to bottom, #004d70, #008793)',
              }}
              onClick={() => handleOrgClick(org, false)}
            >
              <img
                src={org.imageUrl}
                alt={org.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 text-center">
                <h2 className="text-lg font-semibold text-white">{org.name}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyOrganizations;