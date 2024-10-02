// pages/about.tsx
'use client';
import React from 'react';
// pages/about.tsx // Correct path to Header component



const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="flex justify-between items-center py-4"></header>
      
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-8">About Us</h1>
        
        <section className="space-y-6">
          <p>
            Welcome to our platform where we aim to revolutionize the decision-making process through decentralized voting systems. We are committed to providing secure, transparent, and accessible voting mechanisms for decentralized autonomous organizations (DAOs) and other collaborative communities.
          </p>
          
          <h2 className="text-2xl font-semibold">What is a Decentralized Voting System?</h2>
          <p>
            A decentralized voting system allows individuals to vote without the need for a central authority. Unlike traditional voting, it ensures the votes are immutable, verifiable, and publicly auditable, making it a vital tool for DAOs and other organizations seeking transparent governance.
          </p>

          <h3 className="text-xl font-semibold">Key Features of Decentralized Voting</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Transparency:</strong> Every vote is recorded on a blockchain, providing an immutable record.
            </li>
            <li>
              <strong>Security:</strong> Cryptographic techniques ensure that votes are tamper-proof and secure.
            </li>
            <li>
              <strong>Anonymity:</strong> Voters can cast their votes anonymously, preserving privacy while ensuring integrity.
            </li>
            <li>
              <strong>Inclusivity:</strong> Anyone with access to the system can participate, ensuring that the voting process is open and fair.
            </li>
          </ul>

          <h3 className="text-xl font-semibold">How Does It Work?</h3>
          <p>
            In a decentralized voting system, each vote is treated as a transaction on the blockchain. The process is secure and verifiable through the following steps:
          </p>
          <ol className="list-decimal list-inside space-y-2">
            <li>Voters are provided with unique cryptographic keys to cast their votes securely.</li>
            <li>Votes are recorded and encrypted on a blockchain, ensuring transparency and immutability.</li>
            <li>After the voting period ends, results are tallied and can be publicly verified without revealing the identity of individual voters.</li>
          </ol>

          <h2 className="text-2xl font-semibold">Benefits of Decentralized Voting</h2>
          <p>
            Decentralized voting provides a modern solution for transparent, fair, and secure elections, especially in environments like DAOs where trust and openness are essential.
          </p>

          <p>
            By integrating blockchain technology, we ensure that every vote is secure and publicly verifiable. Our system promotes inclusivity and aims to provide a fair platform for decision-making, free from external interference or central authority control.
          </p>
        </section>
      </main>
    </div>
  );
};

export default About;