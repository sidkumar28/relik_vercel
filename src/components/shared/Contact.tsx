'use client';
import React, { useState, useEffect } from 'react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [formSubmitted, setFormSubmitted] = useState(false); // State to handle form submission status

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:3000/Contact', { // Correct endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'db/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        console.log('Form Data Submitted:', formData);
        setFormSubmitted(true);  // Show success message
        setFormData({ name: '', email: '', message: '' }); // Reset the form
      } else {
        console.error('Error submitting form');
      }
    } catch (error) {
      console.error('Error submitting form', error);
    }
  };
  

  // Automatically hide the success message after 20 seconds
  useEffect(() => {
    if (formSubmitted) {
      const timer = setTimeout(() => {
        setFormSubmitted(false);
      }, 20000); // 20 seconds = 20000 milliseconds

      // Cleanup the timer when the component unmounts or when formSubmitted changes
      return () => clearTimeout(timer);
    }
  }, [formSubmitted]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-r">
      <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg w-full max-w-xs">
        <h1 className="text-2xl font-extrabold mb-4 text-center text-indigo-400">
          Contact Us
        </h1>
        
        {/* Show a success message after form is submitted */}
        {formSubmitted && (
          <p className="text-green-500 font-semibold text-center mb-4">
            Your queries have been sent!
          </p>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-400">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 p-2 block w-full rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300"
              placeholder="Your Name"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 p-2 block w-full rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300"
              placeholder="Your Email"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-400">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              className="mt-1 p-2 block w-full h-20 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300"
              placeholder="Your Message"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
