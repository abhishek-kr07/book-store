import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const TicketCard = ({ ticket }) => {
  // Get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'open':
        return '#3498db'; // Blue
      case 'in progress':
        return '#f39c12'; // Orange
      case 'resolved':
        return '#2ecc71'; // Green
      case 'closed':
        return '#7f8c8d'; // Gray
      default:
        return '#95a5a6'; // Light Gray
    }
  };

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  return (
    <div className="ticket-card">
      <div className="ticket-header">
        <h3 className="ticket-title">
          <Link to={`/ticket/${ticket.id}`}>{ticket.subject}</Link>
        </h3>
        <span 
          className="ticket-status" 
          style={{
            backgroundColor: getStatusColor(ticket.status),
            color: 'white',
            padding: '3px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '500'
          }}
        >
          {ticket.status.toUpperCase()}
        </span>
      </div>
      
      <div className="ticket-category">
        <span style={{
          backgroundColor: '#f1f1f1',
          padding: '2px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          color: '#333'
        }}>
          {ticket.category}
        </span>
      </div>
      
      <p className="ticket-description">
        {ticket.description.length > 150 
          ? `${ticket.description.substring(0, 150)}...` 
          : ticket.description}
      </p>
      
      <div className="ticket-footer">
        <div className="ticket-meta">
          <span className="ticket-created">
            Created: {formatDate(ticket.createdAt)}
          </span>
          {ticket.updatedAt && ticket.updatedAt !== ticket.createdAt && (
            <span className="ticket-updated">
              Updated: {formatDate(ticket.updatedAt)}
            </span>
          )}
        </div>
        
        <div className="ticket-comments-count">
          <span>
            {ticket.commentCount || 0} {ticket.commentCount === 1 ? 'comment' : 'comments'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;