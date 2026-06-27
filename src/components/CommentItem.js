import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const CommentItem = ({ comment }) => {
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

  // Determine if the comment is from a support agent or admin
  const isStaffComment = comment.userRole === 'agent' || comment.userRole === 'admin';

  return (
    <div className={`comment-item ${isStaffComment ? 'staff-comment' : 'user-comment'}`}>
      <div className="comment-header">
        <div className="comment-author">
          <span className="author-name">{comment.userName}</span>
          {isStaffComment && (
            <span className="author-role" style={{
              backgroundColor: comment.userRole === 'admin' ? '#e74c3c' : '#3498db',
              color: 'white',
              padding: '2px 6px',
              borderRadius: '10px',
              fontSize: '10px',
              marginLeft: '8px'
            }}>
              {comment.userRole.toUpperCase()}
            </span>
          )}
        </div>
        <div className="comment-time">
          {formatDate(comment.createdAt)}
        </div>
      </div>
      
      <div className="comment-content">
        <p>{comment.text}</p>
        
        {comment.attachment && (
          <div className="comment-attachment">
            <a 
              href={comment.attachment.url} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '5px 10px',
                backgroundColor: '#f1f1f1',
                borderRadius: '4px',
                textDecoration: 'none',
                color: '#333',
                fontSize: '14px',
                marginTop: '10px'
              }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                style={{ marginRight: '5px' }}
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              {comment.attachment.name}
            </a>
          </div>
        )}
      </div>
      
      {comment.systemAction && (
        <div className="system-action" style={{
          backgroundColor: '#f8f9fa',
          padding: '5px 10px',
          borderRadius: '4px',
          marginTop: '10px',
          fontSize: '12px',
          color: '#6c757d',
          fontStyle: 'italic'
        }}>
          {comment.systemAction}
        </div>
      )}
    </div>
  );
};

export default CommentItem;