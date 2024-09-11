import React from 'react';
import { useRouter } from 'next/navigation';
import CreateOrganizationDialog from '@/components/shared/CreateOrganizationForm';

interface Organization {
  id: number;
  name: string;
  logo: string;
}

const adminOrganizations: Organization[] = [
  { id: 1, name: 'Accelchain', logo: '/images/accelchain.jpeg' },
  { id: 2, name: 'Microsoft', logo: '/images/microsoft.png' },
  { id: 3, name: 'Apple', logo: '/images/apple.png' },
];

const memberOrganizations: Organization[] = [
  { id: 4, name: 'Reliance', logo: '/images/reliance.png' },
  { id: 5, name: 'Tata', logo: '/images/tata.png' },
  { id: 6, name: 'MitAdt', logo: '/images/mitadt.jpeg' },
];

const MyOrganizations: React.FC = () => {
  const router = useRouter();

  const handleOrgClick = () => {
    router.push('/Proposals'); 
  };

  return (
    <div className="p-12 text-white max-w-screen-xl mx-auto">
      
      <CreateOrganizationDialog />

      
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
          {adminOrganizations.map((org) => (
            <div
              key={org.id}
              className="relative flex flex-col items-center shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl group"
              style={{
                width: '320px',
                height: '300px',
                background: 'linear-gradient(to bottom, #003d6b, #00557d)',
              }}
              onClick={handleOrgClick}
            >
              <div className="relative w-full h-52 overflow-hidden">
                <img src={org.logo} alt={org.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4 text-center">
                <h2 className="text-lg font-semibold text-white">{org.name}</h2>
              </div>
            </div>
          ))}
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
          {memberOrganizations.map((org) => (
            <div
              key={org.id}
              className="relative flex flex-col items-center shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl group"
              style={{
                width: '320px',
                height: '300px',
                background: 'linear-gradient(to bottom, #004d70, #008793)',
              }}
              onClick={handleOrgClick}
            >
              <div className="relative w-full h-52 overflow-hidden">
                <img src={org.logo} alt={org.name} className="w-full h-full object-cover" />
              </div>
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
