import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, collection, addDoc, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const TicketDetail = () => {
  const { id } = useParams();
  const { currentUser, userRole } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [pageError, setPageError] = useState('');
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  
  // Fetch ticket and comments
  useEffect(() => {
    const fetchTicketAndComments = async () => {
      try {
        setLoading(true);
        
        // Get ticket document
        const ticketDoc = await getDoc(doc(db, 'tickets', id));
        
        if (!ticketDoc.exists()) {
          setPageError('Ticket not found');
          setLoading(false);
          return;
        }
        
        const ticketData = { id: ticketDoc.id, ...ticketDoc.data() };
        
        // Check if user has permission to view this ticket
        if (userRole !== 'admin' && userRole !== 'agent' && ticketData.userId !== currentUser.uid) {
          setPageError('You do not have permission to view this ticket');
          setLoading(false);
          return;
        }
        
        setTicket(ticketData);
        
        // Get comments
        const commentsQuery = query(
          collection(db, 'comments'),
          where('ticketId', '==', id),
          orderBy('createdAt', 'asc')
        );
        
        const commentsSnapshot = await getDocs(commentsQuery);
        const commentsData = [];
        
        commentsSnapshot.forEach((doc) => {
          commentsData.push({ id: doc.id, ...doc.data() });
        });
        
        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching ticket:', error);
        setPageError('Failed to load ticket details');
        showError('Failed to load ticket details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTicketAndComments();
  }, [id, currentUser, userRole]);
  
  // Add comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    try {
      setCommentLoading(true);
      
      // Create comment document
      const commentData = {
        ticketId: id,
        userId: currentUser.uid,
        userName: currentUser.displayName,
        userEmail: currentUser.email,
        userRole: userRole,
        content: newComment.trim(),
        createdAt: new Date().toISOString()
      };
      
      // Add to Firestore
      const docRef = await addDoc(collection(db, 'comments'), commentData);
      
      // Update ticket's commentCount and updatedAt
      await updateDoc(doc(db, 'tickets', id), {
        commentCount: (ticket.commentCount || 0) + 1,
        updatedAt: new Date().toISOString()
      });
      
      // Update local state
        setComments([...comments, { id: docRef.id, ...commentData }]);
        setNewComment('');
        showSuccess('Comment added successfully');
      
      // Update ticket in state
      setTicket({
        ...ticket,
        commentCount: (ticket.commentCount || 0) + 1,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      showError('Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
  };
  
  // Update ticket status
  const handleStatusUpdate = async (newStatus) => {
    if (ticket.status === newStatus) return;
    
    try {
      setStatusUpdateLoading(true);
      
      // Update in Firestore
      await updateDoc(doc(db, 'tickets', id), {
        status: newStatus,
        updatedAt: new Date().toISOString(),
        ...(newStatus === 'in-progress' && !ticket.assignedTo ? { assignedTo: currentUser.uid } : {})
      });
      
      // Add status change comment
      const commentData = {
        ticketId: id,
        userId: currentUser.uid,
        userName: currentUser.displayName,
        userEmail: currentUser.email,
        userRole: userRole,
        content: `Status changed from ${ticket.status} to ${newStatus}`,
        createdAt: new Date().toISOString(),
        isSystemComment: true
      };
      
      const docRef = await addDoc(collection(db, 'comments'), commentData);
      
      // Update local state
      setTicket({
        ...ticket,
        status: newStatus,
        updatedAt: new Date().toISOString(),
        ...(newStatus === 'in-progress' && !ticket.assignedTo ? { assignedTo: currentUser.uid } : {})
      });
      
      setComments([...comments, { id: docRef.id, ...commentData }]);
      showSuccess(`Ticket status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      showError('Failed to update ticket status');
    } finally {
      setStatusUpdateLoading(false);
    }
  };
  
  // Assign ticket to self
  const handleAssignToSelf = async () => {
    if (ticket.assignedTo === currentUser.uid) return;
    
    try {
      setStatusUpdateLoading(true);
      
      // Update in Firestore
      await updateDoc(doc(db, 'tickets', id), {
        assignedTo: currentUser.uid,
        updatedAt: new Date().toISOString(),
        ...(ticket.status === 'open' ? { status: 'in-progress' } : {})
      });
      
      // Add assignment comment
      const commentData = {
        ticketId: id,
        userId: currentUser.uid,
        userName: currentUser.displayName,
        userEmail: currentUser.email,
        userRole: userRole,
        content: `Ticket assigned to ${currentUser.displayName}`,
        createdAt: new Date().toISOString(),
        isSystemComment: true
      };
      
      const docRef = await addDoc(collection(db, 'comments'), commentData);
      
      // Update local state
      setTicket({
        ...ticket,
        assignedTo: currentUser.uid,
        updatedAt: new Date().toISOString(),
        ...(ticket.status === 'open' ? { status: 'in-progress' } : {})
      });
      
      setComments([...comments, { id: docRef.id, ...commentData }]);
      showSuccess('Ticket assigned to you successfully');
    } catch (error) {
      console.error('Error assigning ticket:', error);
      showError('Failed to assign ticket');
    } finally {
      setStatusUpdateLoading(false);
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
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
  
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        Loading ticket details...
      </div>
    );
  }
  
  if (pageError) {
    return (
      <div style={{ 
        maxWidth: '800px', 
        margin: '50px auto', 
        padding: '20px', 
        backgroundColor: '#f8d7da', 
        color: '#721c24', 
        borderRadius: '8px', 
        textAlign: 'center' 
      }}>
        <h2>{pageError}</h2>
        <button 
          onClick={() => navigate('/dashboard')} 
          className="btn" 
          style={{ marginTop: '20px' }}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }
  
  if (!ticket) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        Ticket not found
      </div>
    );
  }
  
  return (
    <div className="ticket-detail-container" style={{ maxWidth: '800px', margin: '30px auto' }}>
      {/* Ticket Header */}
      <div className="ticket-detail">
        <div className="ticket-detail-header">
          <h1 className="ticket-detail-title">{ticket.subject}</h1>
          <span className={`ticket-status ${getStatusBadgeClass(ticket.status)}`}>
            {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1).replace('-', ' ')}
          </span>
        </div>
        
        {/* Ticket Info */}
        <div className="ticket-detail-info">
          <div className="ticket-detail-item">
            <div className="ticket-detail-label">Ticket ID</div>
            <div className="ticket-detail-value">{ticket.id}</div>
          </div>
          
          <div className="ticket-detail-item">
            <div className="ticket-detail-label">Category</div>
            <div className="ticket-detail-value">{ticket.category}</div>
          </div>
          
          <div className="ticket-detail-item">
            <div className="ticket-detail-label">Created By</div>
            <div className="ticket-detail-value">{ticket.userName} ({ticket.userEmail})</div>
          </div>
          
          <div className="ticket-detail-item">
            <div className="ticket-detail-label">Created On</div>
            <div className="ticket-detail-value">{formatDate(ticket.createdAt)}</div>
          </div>
          
          <div className="ticket-detail-item">
            <div className="ticket-detail-label">Last Updated</div>
            <div className="ticket-detail-value">{formatDate(ticket.updatedAt)}</div>
          </div>
          
          <div className="ticket-detail-item">
            <div className="ticket-detail-label">Assigned To</div>
            <div className="ticket-detail-value">
              {ticket.assignedTo ? 'Support Agent' : 'Unassigned'}
            </div>
          </div>
        </div>
        
        {/* Ticket Description */}
        <div>
          <h3 style={{ marginBottom: '10px', color: '#2c3e50' }}>Description</h3>
          <div className="ticket-description">{ticket.description}</div>
        </div>
        
        {/* Attachment if any */}
        {ticket.attachmentURL && (
          <div style={{ marginTop: '20px' }}>
            <h3 style={{ marginBottom: '10px', color: '#2c3e50' }}>Attachment</h3>
            <div>
              <a 
                href={ticket.attachmentURL} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  display: 'inline-block', 
                  padding: '8px 15px', 
                  backgroundColor: '#f1f1f1', 
                  borderRadius: '4px', 
                  textDecoration: 'none', 
                  color: '#333' 
                }}
              >
                {ticket.attachmentName || 'View Attachment'}
              </a>
            </div>
          </div>
        )}
        
        {/* Action Buttons - Only for agents and admins */}
        {(userRole === 'admin' || userRole === 'agent') && (
          <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
            {/* Status Update Buttons */}
            <div>
              <h3 style={{ marginBottom: '10px', color: '#2c3e50' }}>Update Status</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => handleStatusUpdate('open')} 
                  className="btn" 
                  style={{ 
                    backgroundColor: '#e74c3c', 
                    opacity: ticket.status === 'open' ? 0.6 : 1 
                  }} 
                  disabled={statusUpdateLoading || ticket.status === 'open'}
                >
                  Open
                </button>
                
                <button 
                  onClick={() => handleStatusUpdate('in-progress')} 
                  className="btn" 
                  style={{ 
                    backgroundColor: '#f39c12', 
                    opacity: ticket.status === 'in-progress' ? 0.6 : 1 
                  }} 
                  disabled={statusUpdateLoading || ticket.status === 'in-progress'}
                >
                  In Progress
                </button>
                
                <button 
                  onClick={() => handleStatusUpdate('resolved')} 
                  className="btn" 
                  style={{ 
                    backgroundColor: '#2ecc71', 
                    opacity: ticket.status === 'resolved' ? 0.6 : 1 
                  }} 
                  disabled={statusUpdateLoading || ticket.status === 'resolved'}
                >
                  Resolved
                </button>
                
                <button 
                  onClick={() => handleStatusUpdate('closed')} 
                  className="btn" 
                  style={{ 
                    backgroundColor: '#7f8c8d', 
                    opacity: ticket.status === 'closed' ? 0.6 : 1 
                  }} 
                  disabled={statusUpdateLoading || ticket.status === 'closed'}
                >
                  Closed
                </button>
              </div>
            </div>
            
            {/* Assign to Self Button */}
            {!ticket.assignedTo && (
              <div style={{ marginLeft: 'auto' }}>
                <h3 style={{ marginBottom: '10px', color: '#2c3e50' }}>Assignment</h3>
                <button 
                  onClick={handleAssignToSelf} 
                  className="btn" 
                  style={{ backgroundColor: '#3498db' }} 
                  disabled={statusUpdateLoading}
                >
                  Assign to Me
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Comments Section */}
      <div className="comments-section">
        <h2 className="comments-title">Comments ({comments.length})</h2>
        
        {comments.length === 0 ? (
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#f9f9f9', 
            borderRadius: '8px', 
            textAlign: 'center' 
          }}>
            No comments yet
          </div>
        ) : (
          <div>
            {comments.map((comment) => (
              <div key={comment.id} className="comment-item" style={{
                backgroundColor: comment.isSystemComment ? '#f0f7ff' : '#f9f9f9'
              }}>
                <div className="comment-header">
                  <div className="comment-author">
                    {comment.userName}
                    {comment.userRole && comment.userRole !== 'user' && (
                      <span style={{ 
                        marginLeft: '8px', 
                        fontSize: '12px', 
                        backgroundColor: comment.userRole === 'admin' ? '#e74c3c' : '#3498db', 
                        color: 'white', 
                        padding: '2px 6px', 
                        borderRadius: '10px' 
                      }}>
                        {comment.userRole.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="comment-date">{formatDate(comment.createdAt)}</div>
                </div>
                <div className="comment-content">{comment.content}</div>
              </div>
            ))}
          </div>
        )}
        
        {/* Add Comment Form */}
        <div className="comment-form">
          <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>Add a Comment</h3>
          <form onSubmit={handleAddComment}>
            <textarea 
              value={newComment} 
              onChange={(e) => setNewComment(e.target.value)} 
              placeholder="Type your comment here..." 
              required 
              disabled={commentLoading || ticket.status === 'closed'}
            />
            <button 
              type="submit" 
              className="btn" 
              disabled={commentLoading || !newComment.trim() || ticket.status === 'closed'}
            >
              {commentLoading ? 'Posting...' : 'Post Comment'}
            </button>
            
            {ticket.status === 'closed' && (
              <div style={{ 
                marginTop: '10px', 
                color: '#721c24', 
                backgroundColor: '#f8d7da', 
                padding: '10px', 
                borderRadius: '4px', 
                textAlign: 'center' 
              }}>
                This ticket is closed. No further comments can be added.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;