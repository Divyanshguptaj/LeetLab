import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className='w-screen h-screen flex justify-center items-center'>
      <div className="flex justify-center items-center min-h-[200px]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
