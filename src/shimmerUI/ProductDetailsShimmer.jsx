import React from 'react';

export default function ProductDetailsShimmer() {
  return (
    <div className=' dark:bg-gray-900 h-[92vh] w-full'>
      
    <div className="container mx-auto py-8">
      <div className="flex flex-col justify-center lg:flex-row mx-auto ">
        <div className="lg:w-1/4 w-3/4 mx-auto flex items-center">
          <img
            className="w-full h-auto mb-4 lg:mb-0 bg-gray-400 dark:bg-gray-800 p-20 pl-0 lg:p-56 animate-pulse rounded-md"
          />
        </div>
        <div className="lg:w-1/2 px-8">
          <h1 className="text-3xl font-bold mb-4 w-1/2 p-5 bg-gray-400 dark:bg-gray-800 animate-pulse rounded-md"></h1>
          <p className="text-gray-700 mb-4 bg-gray-400 dark:bg-gray-800 animate-pulse p-4 w-1/3 rounded-md"></p>
          <p className="text-gray-700 mb-4 bg-gray-400 dark:bg-gray-800 animate-pulse p-4 w-1/3 rounded-md"></p>
          <div className="mb-4 flex">
            <p className="text-gray-700 mb-4 bg-gray-400 dark:bg-gray-800 animate-pulse p-4 w-1/6 rounded-md "></p>
            <p className="text-gray-700 mb-4 bg-gray-400 dark:bg-gray-800 animate-pulse p-4 w-1/6 rounded-md mx-3"></p>
          </div>
          <div className="flex-col lg:flex-row hidden lg:flex">
            <p className="text-gray-700 mb-4 bg-gray-400 dark:bg-gray-800 animate-pulse p-5 w-1/4 rounded-md mr-3 "></p>
            <p className="text-gray-700 mb-4 bg-gray-400 dark:bg-gray-800 animate-pulse p-5 w-1/4 rounded-md"></p>
          </div>
        </div>
      </div>
    </div>
            </div>
  );
}
