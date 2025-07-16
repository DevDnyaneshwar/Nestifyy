import React from 'react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-xl">
        <h1 className="text-6xl font-extrabold text-gray-800 mb-4">404</h1>
        <p className="text-2xl text-gray-600 mb-6">Page Not Found</p>
        <p className="text-lg text-gray-700 mb-8">Sorry, the page you are looking for does not exist.</p>
        <a 
          href="/" 
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          Go to Homepage
        </a>
      </div>
    </div>
  );
};

export default NotFoundPage;
