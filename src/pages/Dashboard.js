import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import Stats from '../components/Stats';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';

const Dashboard = () => {
  const { currentUser, userRole } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0
  });
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [ticketsPerPage] = useState(10);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Categories (would normally come from Firestore)
  const categories = [
    'Technical Issue',
    'Account Problem',
    'Billing Question',
    'Feature Request',
    'General Inquiry'
  ];

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        
        let ticketsQuery;
        
        // Base query depends on user role
        if (userRole === 'admin' || userRole === 'agent') {
          // Admins and agents can see all tickets
          ticketsQuery = collection(db, 'tickets');
        } else {
          // Regular users can only see their own tickets
          ticketsQuery = query(
            collection(db, 'tickets'),
            where('userId', '==', currentUser.uid)
          );
        }
        
        // Apply status filter if not 'all'
        if (statusFilter !== 'all') {
          ticketsQuery = query(ticketsQuery, where('status', '==', statusFilter));
        }
        
        // Apply category filter if not 'all'
        if (categoryFilter !== 'all') {
          ticketsQuery = query(ticketsQuery, where('category', '==', categoryFilter));
        }
        
        // Apply sorting
        switch (sortBy) {
          case 'newest':
            ticketsQuery = query(ticketsQuery, orderBy('createdAt', 'desc'));
            break;
          case 'oldest':
            ticketsQuery = query(ticketsQuery, orderBy('createdAt', 'asc'));
            break;
          case 'updated':
            ticketsQuery = query(ticketsQuery, orderBy('updatedAt', 'desc'));
            break;
          case 'most-comments':
            ticketsQuery = query(ticketsQuery, orderBy('commentCount', 'desc'));
            break;
          default:
            ticketsQuery = query(ticketsQuery, orderBy('createdAt', 'desc'));
        }
        
        const querySnapshot = await getDocs(ticketsQuery);
        
        let fetchedTickets = [];
        querySnapshot.forEach((doc) => {
          fetchedTickets.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        // Apply search filter (client-side)
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          fetchedTickets = fetchedTickets.filter(ticket => 
            ticket.subject.toLowerCase().includes(term) || 
            ticket.description.toLowerCase().includes(term)
          );
        }
        
        setTickets(fetchedTickets);
        setFilteredTickets(fetchedTickets);
        setCurrentPage(1); // Reset to first page when filters change
        
        // Calculate stats
        const totalTickets = fetchedTickets.length;
        const openTickets = fetchedTickets.filter(ticket => ticket.status === 'open').length;
        const inProgressTickets = fetchedTickets.filter(ticket => ticket.status === 'in-progress').length;
        const resolvedTickets = fetchedTickets.filter(ticket => ticket.status === 'resolved').length;
        
        setStats({
          totalTickets,
          openTickets,
          inProgressTickets,
          resolvedTickets
        });
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setError('Failed to load tickets. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [currentUser, userRole, statusFilter, categoryFilter, sortBy, searchTerm]);
  
  // Get current tickets for pagination
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);
  
  // Change page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of ticket list
    window.scrollTo({
      top: document.querySelector('.ticket-list')?.offsetTop - 20 || 0,
      behavior: 'smooth'
    });
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'open':
        return 'status-open';
      case 'in-progress':
        return 'status-in-progress';
      case 'resolved':
        return 'status-resolved';
      case 'closed':
        return 'status-closed';
      default:
        return '';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Tickets Dashboard</h1>
        <Link to="/create-ticket" className="btn">Create New Ticket</Link>
      </div>
      
      {/* Filters */}
      <div className="filters-container">
        <h2 className="filters-title">Filters</h2>
        <div className="filters-form">
          <div className="filter-group">
            <label htmlFor="status">Status</label>
            <select 
              id="status" 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="category">Category</label>
            <select 
              id="category" 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="sort">Sort By</label>
            <select 
              id="sort" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="updated">Recently Updated</option>
              <option value="most-comments">Most Comments</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="search">Search</label>
            <input 
              type="text" 
              id="search" 
              placeholder="Search tickets..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div style={{ 
          backgroundColor: '#f8d7da', 
          color: '#721c24', 
          padding: '10px', 
          borderRadius: '4px', 
          marginBottom: '20px' 
        }}>
          {error}
        </div>
      )}
      
      {/* Stats Section */}
      {!loading && <Stats stats={stats} />}
      
      {/* Loading state */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '30px' }}>
          <LoadingSpinner text="Loading tickets..." />
        </div>
      ) : filteredTickets.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '30px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <p>No tickets found. {statusFilter !== 'all' || categoryFilter !== 'all' || searchTerm ? 'Try changing your filters.' : ''}</p>
          <Link to="/create-ticket" className="btn" style={{ marginTop: '15px' }}>Create Your First Ticket</Link>
        </div>
      ) : (
        <div className="ticket-list">
          <div className="ticket-list-header">
            <div>ID</div>
            <div>Subject</div>
            <div>Status</div>
            <div>Category</div>
            <div>Created</div>
          </div>
          
          {currentTickets.map((ticket) => (
            <Link 
              to={`/ticket/${ticket.id}`} 
              key={ticket.id} 
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="ticket-item">
                <div className="ticket-id">{ticket.id.substring(0, 8)}...</div>
                <div>{ticket.subject}</div>
                <div>
                  <span className={`ticket-status ${getStatusBadgeClass(ticket.status)}`}>
                    {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1).replace('-', ' ')}
                  </span>
                </div>
                <div>{ticket.category}</div>
                <div>{formatDate(ticket.createdAt)}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
      
      {/* Pagination */}
      {!loading && filteredTickets.length > 0 && (
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;