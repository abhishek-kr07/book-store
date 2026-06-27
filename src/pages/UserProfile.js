import React, { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const UserProfile = () => {
  const { currentUser, userRole } = useAuth();
  const { showSuccess, showError } = useToast();
  
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [department, setDepartment] = useState('');
  const [notificationPreferences, setNotificationPreferences] = useState({
    emailNotifications: true,
    ticketUpdates: true,
    statusChanges: true,
    commentNotifications: true
  });
  
  const [loading, setLoading] = useState(false);
  
  // Load user data
  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || '');
      setEmail(currentUser.email || '');
      
      // Fetch additional user data from Firestore
      const fetchUserData = async () => {
        try {
          const userDoc = doc(db, 'users', currentUser.uid);
          const userData = await userDoc.get();
          
          if (userData.exists()) {
            const data = userData.data();
            setPhoneNumber(data.phoneNumber || '');
            setDepartment(data.department || '');
            
            if (data.notificationPreferences) {
              setNotificationPreferences({
                ...notificationPreferences,
                ...data.notificationPreferences
              });
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      
      fetchUserData();
    }
  }, [currentUser]);
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) return;
    
    try {
      setLoading(true);

      
      // Update display name in Firebase Auth
      if (displayName !== currentUser.displayName) {
        await updateProfile(currentUser, { displayName });
      }
      
      // Update user data in Firestore
      const userDoc = doc(db, 'users', currentUser.uid);
      await updateDoc(userDoc, {
        displayName,
        phoneNumber,
        department,
        notificationPreferences,
        updatedAt: new Date()
      });
      
      showSuccess('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      showError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle notification preference change
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationPreferences({
      ...notificationPreferences,
      [name]: checked
    });
  };
  
  return (
    <div className="user-profile-container">
      <div className="user-profile-header">
        <h1>User Profile</h1>
        <p>Manage your account information and preferences</p>
      </div>
      

      
      <div className="user-profile-content">
        <div className="user-profile-card">
          <div className="user-profile-avatar">
            <div className="avatar-placeholder">
              {displayName ? displayName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="user-role-badge">
              {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
            </div>
          </div>
          
          <div className="user-profile-info">
            <h2>{displayName || 'User'}</h2>
            <p>{email}</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="user-profile-form">
          <div className="form-section">
            <h3>Personal Information</h3>
            
            <div className="form-group">
              <label htmlFor="displayName">Display Name</label>
              <input
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="form-control"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                className="form-control"
                disabled
              />
              <small className="form-text text-muted">
                Email address cannot be changed
              </small>
            </div>
            
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number (Optional)</label>
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="form-control"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="department">Department (Optional)</label>
              <input
                type="text"
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="form-control"
              />
            </div>
          </div>
          
          <div className="form-section">
            <h3>Notification Preferences</h3>
            
            <div className="form-check">
              <input
                type="checkbox"
                id="emailNotifications"
                name="emailNotifications"
                checked={notificationPreferences.emailNotifications}
                onChange={handleNotificationChange}
                className="form-check-input"
              />
              <label className="form-check-label" htmlFor="emailNotifications">
                Receive email notifications
              </label>
            </div>
            
            <div className="form-check">
              <input
                type="checkbox"
                id="ticketUpdates"
                name="ticketUpdates"
                checked={notificationPreferences.ticketUpdates}
                onChange={handleNotificationChange}
                className="form-check-input"
              />
              <label className="form-check-label" htmlFor="ticketUpdates">
                Ticket updates
              </label>
            </div>
            
            <div className="form-check">
              <input
                type="checkbox"
                id="statusChanges"
                name="statusChanges"
                checked={notificationPreferences.statusChanges}
                onChange={handleNotificationChange}
                className="form-check-input"
              />
              <label className="form-check-label" htmlFor="statusChanges">
                Status changes
              </label>
            </div>
            
            <div className="form-check">
              <input
                type="checkbox"
                id="commentNotifications"
                name="commentNotifications"
                checked={notificationPreferences.commentNotifications}
                onChange={handleNotificationChange}
                className="form-check-input"
              />
              <label className="form-check-label" htmlFor="commentNotifications">
                New comments
              </label>
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;