// src/components/shared/AboutUs.tsx
'use client';
import React, { useState } from 'react';

const About: React.FC = () => {
  // Accordion state management
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="flex justify-between items-center py-4"></header>

      <main className="container mx-auto px-4 py-10">
        {/* Intro Section */}
        <section className="mb-8 bg-gray-800 p-6 rounded-lg shadow-lg">
          <h1 className="text-5xl font-extrabold mb-6 text-center text-indigo-400">
            About Us
          </h1>
          <p className="text-lg leading-relaxed text-gray-300 text-center">
            Welcome to our platform where we aim to revolutionize the decision-making process through 
            <span className="text-indigo-500 font-semibold">
              decentralized voting systems
            </span>. Our mission is to provide secure, transparent, and accessible voting mechanisms 
            for <span className="text-indigo-500 font-semibold">DAOs</span> and collaborative communities.
          </p>
        </section>
        {/* FAQ Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Learn About Decentralized Autonomous Organizations (DAOs)</h2>

          {/* First Question */}
          <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <button
              className="w-full text-left font-semibold text-xl"
              onClick={() => toggleAccordion(0)}
            >
              {activeIndex === 0 ? '▼ ' : '► '} What is a DAO?
            </button>
            {activeIndex === 0 && (
              <p className="mt-2 text-lg">
                A DAO is a decentralized autonomous organization, run by its members. It enables a collaborative, transparent decision-making process without the need for a central authority.
              </p>
            )}
          </div>

          {/* Second Question */}
          <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <button
              className="w-full text-left font-semibold text-xl"
              onClick={() => toggleAccordion(1)}
            >
              {activeIndex === 1 ? '▼ ' : '► '} How do I create an organization?
            </button>
            {activeIndex === 1 && (
              <p className="mt-2 text-lg">
                Simply sign up, and start building your dream team! You can customize your organization based on your community's needs and preferences.
              </p>
            )}
          </div>

          {/* Third Question */}
          <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <button
              className="w-full text-left font-semibold text-xl"
              onClick={() => toggleAccordion(2)}
            >
              {activeIndex === 2 ? '▼ ' : '► '} How does decentralized voting work?
            </button>
            {activeIndex === 2 && (
              <div className="mt-2 text-lg">
                <p>
                  In decentralized voting, each vote is securely cast and recorded on a blockchain. The process ensures transparency, immutability, and public verifiability without compromising the anonymity of voters.
                </p>
                <ul className="list-disc list-inside mt-2">
                  <li>Voters use cryptographic keys to cast their vote securely.</li>
                  <li>Votes are recorded and encrypted on a blockchain.</li>
                  <li>Results can be verified by the public, ensuring transparency.</li>
                </ul>
              </div>
            )}
          </div>

          {/* Fourth Question */}
          <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <button
              className="w-full text-left font-semibold text-xl"
              onClick={() => toggleAccordion(3)}
            >
              {activeIndex === 3 ? '▼ ' : '► '} What are the key features of a DAO?
            </button>
            {activeIndex === 3 && (
              <div className="mt-2 text-lg">
                <p>DAOs enable a transparent and secure decision-making process. Key features include:</p>
                <ul className="list-disc list-inside mt-2">
                  <li><strong>Transparency:</strong> Every vote is recorded on a blockchain.</li>
                  <li><strong>Security:</strong> Cryptographic techniques ensure votes are tamper-proof.</li>
                  <li><strong>Anonymity:</strong> Voters' identities are protected.</li>
                  <li><strong>Inclusivity:</strong> Anyone can participate in the process.</li>
                </ul>
              </div>
            )}
          </div>

        </section>
      </main>
    </div>
  );
};

export default About;