import React from 'react';
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const NextPreviousPage = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  className = ""
}) => {
  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
    }
  };

  return (
    <div className={`flex justify-between items-center ${className}`}>
      <button
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center px-4 py-2 border rounded-md bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
      >
        <FiChevronLeft className="mr-1" /> Previous
      </button>
      
      <div className="flex space-x-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`px-3 py-1 rounded-md ${currentPage === number ? 'bg-blue-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
          >
            {number}
          </button>
        ))}
      </div>
      
      <button
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === totalPages || totalPages === 0}
        className="flex items-center px-4 py-2 border rounded-md bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
      >
        Next <FiChevronRight className="ml-1" />
      </button>
    </div>
  );
};

export default NextPreviousPage;