import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const CreateTicket = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [fileError, setFileError] = useState('');
  
  // Fetch categories from Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // In a real app, categories would be fetched from Firestore
        // For now, we'll use hardcoded categories
        setCategories([
          'Technical Issue',
          'Account Problem',
          'Billing Question',
          'Feature Request',
          'General Inquiry'
        ]);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      setAttachment(null);
      setFileError('');
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFileError('File size exceeds 5MB limit');
      setAttachment(null);
      return;
    }
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      setFileError('File type not supported. Please upload an image, PDF, or text file.');
      setAttachment(null);
      return;
    }
    
    setFileError('');
    setAttachment(file);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!subject.trim() || !description.trim() || !category) {
      showError('Please fill in all required fields');
      return;
    }
    
    try {
      setLoading(true);

      
      // Create ticket data
      const ticketData = {
        subject: subject.trim(),
        description: description.trim(),
        category,
        status: 'open',
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userName: currentUser.displayName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        commentCount: 0,
        assignedTo: null
      };
      
      // Upload attachment if exists
      if (attachment) {
        const storageRef = ref(storage, `attachments/${currentUser.uid}/${Date.now()}_${attachment.name}`);
        await uploadBytes(storageRef, attachment);
        const downloadURL = await getDownloadURL(storageRef);
        ticketData.attachmentURL = downloadURL;
        ticketData.attachmentName = attachment.name;
      }
      
      // Add ticket to Firestore
      const docRef = await addDoc(collection(db, 'tickets'), ticketData);
      
      // Show success message
      showSuccess('Ticket created successfully!');
      
      // Navigate to the new ticket
      navigate(`/ticket/${docRef.id}`);
    } catch (error) {
      console.error('Error creating ticket:', error);
      showError('Failed to create ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="create-ticket-container" style={{ maxWidth: '800px', margin: '30px auto' }}>
      <div className="create-ticket-form">
        <h1 className="form-title">Create New Support Ticket</h1>
        

        
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="subject">Subject *</label>
            <input 
              type="text" 
              id="subject" 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)} 
              placeholder="Brief summary of your issue" 
              required 
            />
          </div>
          
          <div className="form-row">
            <label htmlFor="category">Category *</label>
            <select 
              id="category" 
              value={category} 
              onChange={(e) => setCategory(e.target.value)} 
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div className="form-row">
            <label htmlFor="description">Description *</label>
            <textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Please provide detailed information about your issue" 
              required 
            />
          </div>
          
          <div className="form-row">
            <label htmlFor="attachment">Attachment (Optional)</label>
            <input 
              type="file" 
              id="attachment" 
              onChange={handleFileChange} 
            />
            <div className="file-input-container">
              <small>Max file size: 5MB. Supported formats: JPG, PNG, GIF, PDF, TXT</small>
              {fileError && (
                <div style={{ color: '#dc3545', marginTop: '5px' }}>{fileError}</div>
              )}
              {attachment && (
                <div style={{ marginTop: '5px' }}>Selected file: {attachment.name}</div>
              )}
            </div>
          </div>
          
          <div className="form-row" style={{ marginTop: '20px' }}>
            <button 
              type="submit" 
              className="btn btn-block" 
              disabled={loading}
            >
              {loading ? 'Creating Ticket...' : 'Submit Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicket;