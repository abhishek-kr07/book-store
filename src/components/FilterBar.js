import React from 'react';

const FilterBar = ({ 
  filters, 
  setFilters, 
  categories,
  showMyTicketsFilter = true
}) => {
  // Handle status filter change
  const handleStatusChange = (e) => {
    setFilters({
      ...filters,
      status: e.target.value
    });
  };

  // Handle category filter change
  const handleCategoryChange = (e) => {
    setFilters({
      ...filters,
      category: e.target.value
    });
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setFilters({
      ...filters,
      searchTerm: e.target.value
    });
  };

  // Handle sort change
  const handleSortChange = (e) => {
    setFilters({
      ...filters,
      sortBy: e.target.value
    });
  };

  // Handle my tickets toggle
  const handleMyTicketsChange = (e) => {
    setFilters({
      ...filters,
      myTicketsOnly: e.target.checked
    });
  };

  return (
    <div className="filter-bar">
      <div className="filter-section">
        <div className="filter-group">
          <label htmlFor="status-filter">Status:</label>
          <select 
            id="status-filter" 
            value={filters.status} 
            onChange={handleStatusChange}
            className="filter-select"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="category-filter">Category:</label>
          <select 
            id="category-filter" 
            value={filters.category} 
            onChange={handleCategoryChange}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="sort-by">Sort By:</label>
          <select 
            id="sort-by" 
            value={filters.sortBy} 
            onChange={handleSortChange}
            className="filter-select"
          >
            <option value="createdAt_desc">Newest First</option>
            <option value="createdAt_asc">Oldest First</option>
            <option value="updatedAt_desc">Recently Updated</option>
            <option value="commentCount_desc">Most Comments</option>
          </select>
        </div>
      </div>
      
      <div className="filter-section">
        <div className="filter-group search-group">
          <input 
            type="text" 
            placeholder="Search tickets..." 
            value={filters.searchTerm} 
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
        
        {showMyTicketsFilter && (
          <div className="filter-group checkbox-group">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={filters.myTicketsOnly} 
                onChange={handleMyTicketsChange}
                className="checkbox-input"
              />
              <span>My Tickets Only</span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;