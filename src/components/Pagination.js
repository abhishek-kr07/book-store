import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Generate page numbers array
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Show at most 5 page numbers
    
    if (totalPages <= maxPagesToShow) {
      // If total pages is less than or equal to maxPagesToShow, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);
      
      // Calculate start and end of page numbers to show
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if we're at the beginning or end
      if (currentPage <= 2) {
        end = Math.min(totalPages - 1, maxPagesToShow - 1);
      } else if (currentPage >= totalPages - 1) {
        start = Math.max(2, totalPages - maxPagesToShow + 2);
      }
      
      // Add ellipsis if needed before middle pages
      if (start > 2) {
        pageNumbers.push('...');
      }
      
      // Add middle pages
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis if needed after middle pages
      if (end < totalPages - 1) {
        pageNumbers.push('...');
      }
      
      // Always show last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };
  
  // Handle page click
  const handlePageClick = (page) => {
    if (page !== '...' && page !== currentPage) {
      onPageChange(page);
    }
  };
  
  // Handle previous page
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };
  
  // Handle next page
  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };
  
  // If there's only 1 page, don't show pagination
  if (totalPages <= 1) return null;
  
  return (
    <div className="pagination">
      <button 
        className="pagination-button" 
        onClick={handlePrevious} 
        disabled={currentPage === 1}
        style={{
          padding: '5px 10px',
          margin: '0 5px',
          backgroundColor: currentPage === 1 ? '#f1f1f1' : '#fff',
          border: '1px solid #ddd',
          borderRadius: '4px',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          opacity: currentPage === 1 ? 0.6 : 1
        }}
      >
        Previous
      </button>
      
      {getPageNumbers().map((page, index) => (
        <button 
          key={index} 
          className={`pagination-button ${page === currentPage ? 'active' : ''}`} 
          onClick={() => handlePageClick(page)}
          disabled={page === '...'}
          style={{
            padding: '5px 10px',
            margin: '0 5px',
            backgroundColor: page === currentPage ? '#3498db' : '#fff',
            color: page === currentPage ? '#fff' : '#333',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: page === '...' ? 'default' : 'pointer'
          }}
        >
          {page}
        </button>
      ))}
      
      <button 
        className="pagination-button" 
        onClick={handleNext} 
        disabled={currentPage === totalPages}
        style={{
          padding: '5px 10px',
          margin: '0 5px',
          backgroundColor: currentPage === totalPages ? '#f1f1f1' : '#fff',
          border: '1px solid #ddd',
          borderRadius: '4px',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          opacity: currentPage === totalPages ? 0.6 : 1
        }}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;