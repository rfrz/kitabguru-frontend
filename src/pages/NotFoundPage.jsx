import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 animate-in">
        <h1 className="text-8xl font-extrabold text-blue-600 dark:text-blue-500 mb-2">404</h1>
        <h2 className="text-2xl font-bold text-gray-950 dark:text-white mb-2">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>

        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md font-medium text-sm transition-colors w-full justify-center"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
