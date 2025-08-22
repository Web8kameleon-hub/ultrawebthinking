import React from 'react';
import styles from './LoadingSpinner.module.css';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <span className="ml-4 text-blue-500">Loading EuroWeb Platform...</span>
    </div>
  );
};

export default LoadingSpinner;
export { LoadingSpinner };
