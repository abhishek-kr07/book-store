import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';

const AdminPanel = () => {
  const { userRole } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  
  // Fetch data based on active tab
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        if (activeTab === 'users') {
          await fetchUsers();
        } else if (activeTab === 'categories') {
          await fetchCategories();
        }
      } catch (error) {
        console.error(`Error fetching ${activeTab}:`, error);
        setError(`Failed to load ${activeTab}. Please try again.`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [activeTab]);
  
  // Fetch users
  const fetchUsers = async () => {
    const usersQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(usersQuery);
    
    const usersData = [];
    querySnapshot.forEach((doc) => {
      usersData.push({ id: doc.id, ...doc.data() });
    });
    
    setUsers(usersData);
  };
  
  // Fetch categories
  const fetchCategories = async () => {
    // In a real app, categories would be fetched from Firestore
    // For now, we'll use hardcoded categories
    setCategories([
      { id: '1', name: 'Technical Issue', ticketCount: 12 },
      { id: '2', name: 'Account Problem', ticketCount: 8 },
      { id: '3', name: 'Billing Question', ticketCount: 5 },
      { id: '4', name: 'Feature Request', ticketCount: 3 },
      { id: '5', name: 'General Inquiry', ticketCount: 7 }
    ]);
  };
  
  // Update user role
  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      setActionLoading(true);
      
      // Update in Firestore
      await updateDoc(doc(db, 'users', userId), {
        role: newRole
      });
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      alert(`User role updated to ${newRole}`);
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role');
    } finally {
      setActionLoading(false);
    }
  };
  
  // Add new category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    
    if (!newCategory.trim()) return;
    
    try {
      setActionLoading(true);
      
      // In a real app, this would add to Firestore
      // For now, we'll just update the local state
      const newCategoryObj = {
        id: Date.now().toString(),
        name: newCategory.trim(),
        ticketCount: 0
      };
      
      setCategories([...categories, newCategoryObj]);
      setNewCategory('');
      
      alert('Category added successfully');
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Failed to add category');
    } finally {
      setActionLoading(false);
    }
  };
  
  // Delete category
  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }
    
    try {
      setActionLoading(true);
      
      // In a real app, this would delete from Firestore
      // For now, we'll just update the local state
      setCategories(categories.filter(category => category.id !== categoryId));
      
      alert('Category deleted successfully');
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    } finally {
      setActionLoading(false);
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  return (
    <div className="admin-panel">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <h2 className="admin-sidebar-title">Admin Panel</h2>
        <ul className="admin-menu">
          <li className="admin-menu-item">
            <button 
              className={`admin-menu-link ${activeTab === 'users' ? 'active' : ''}`} 
              onClick={() => setActiveTab('users')}
              style={{ width: '100%', textAlign: 'left' }}
            >
              User Management
            </button>
          </li>
          <li className="admin-menu-item">
            <button 
              className={`admin-menu-link ${activeTab === 'categories' ? 'active' : ''}`} 
              onClick={() => setActiveTab('categories')}
              style={{ width: '100%', textAlign: 'left' }}
            >
              Category Management
            </button>
          </li>
        </ul>
      </div>
      
      {/* Content */}
      <div className="admin-content">
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
        
        {/* Loading state */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '30px' }}>
            Loading...
          </div>
        ) : (
          <>
            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <h2 style={{ marginBottom: '20px' }}>User Management</h2>
                
                {users.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    No users found
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th style={tableHeaderStyle}>Name</th>
                          <th style={tableHeaderStyle}>Email</th>
                          <th style={tableHeaderStyle}>Role</th>
                          <th style={tableHeaderStyle}>Joined</th>
                          <th style={tableHeaderStyle}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} style={tableRowStyle}>
                            <td style={tableCellStyle}>{user.displayName}</td>
                            <td style={tableCellStyle}>{user.email}</td>
                            <td style={tableCellStyle}>
                              <span style={{
                                display: 'inline-block',
                                padding: '3px 8px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: '500',
                                backgroundColor: 
                                  user.role === 'admin' ? '#e74c3c' : 
                                  user.role === 'agent' ? '#3498db' : 
                                  '#7f8c8d',
                                color: 'white'
                              }}>
                                {user.role.toUpperCase()}
                              </span>
                            </td>
                            <td style={tableCellStyle}>{formatDate(user.createdAt)}</td>
                            <td style={tableCellStyle}>
                              <select 
                                value={user.role} 
                                onChange={(e) => handleUpdateUserRole(user.id, e.target.value)} 
                                disabled={actionLoading}
                                style={{ padding: '5px', borderRadius: '4px' }}
                              >
                                <option value="user">User</option>
                                <option value="agent">Agent</option>
                                <option value="admin">Admin</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
            
            {/* Categories Tab */}
            {activeTab === 'categories' && (
              <div>
                <h2 style={{ marginBottom: '20px' }}>Category Management</h2>
                
                {/* Add Category Form */}
                <div style={{ 
                  marginBottom: '30px', 
                  padding: '20px', 
                  backgroundColor: '#f9f9f9', 
                  borderRadius: '8px' 
                }}>
                  <h3 style={{ marginBottom: '15px' }}>Add New Category</h3>
                  <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '10px' }}>
                    <input 
                      type="text" 
                      value={newCategory} 
                      onChange={(e) => setNewCategory(e.target.value)} 
                      placeholder="Category name" 
                      required 
                      style={{ 
                        flex: 1, 
                        padding: '8px 12px', 
                        borderRadius: '4px', 
                        border: '1px solid #ddd' 
                      }} 
                    />
                    <button 
                      type="submit" 
                      className="btn" 
                      disabled={actionLoading || !newCategory.trim()}
                    >
                      Add Category
                    </button>
                  </form>
                </div>
                
                {/* Categories List */}
                {categories.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    No categories found
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th style={tableHeaderStyle}>Category Name</th>
                          <th style={tableHeaderStyle}>Ticket Count</th>
                          <th style={tableHeaderStyle}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.map((category) => (
                          <tr key={category.id} style={tableRowStyle}>
                            <td style={tableCellStyle}>{category.name}</td>
                            <td style={tableCellStyle}>{category.ticketCount}</td>
                            <td style={tableCellStyle}>
                              <button 
                                onClick={() => handleDeleteCategory(category.id)} 
                                disabled={actionLoading || category.ticketCount > 0}
                                style={{ 
                                  padding: '5px 10px', 
                                  backgroundColor: '#f44336', 
                                  color: 'white', 
                                  border: 'none', 
                                  borderRadius: '4px', 
                                  cursor: category.ticketCount > 0 ? 'not-allowed' : 'pointer', 
                                  opacity: category.ticketCount > 0 ? 0.5 : 1 
                                }}
                              >
                                Delete
                              </button>
                              {category.ticketCount > 0 && (
                                <div style={{ fontSize: '12px', marginTop: '5px', color: '#721c24' }}>
                                  Cannot delete category with tickets
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Table styles
const tableHeaderStyle = {
  textAlign: 'left',
  padding: '12px 15px',
  backgroundColor: '#f1f1f1',
  borderBottom: '1px solid #ddd'
};

const tableRowStyle = {
  borderBottom: '1px solid #eee'
};

const tableCellStyle = {
  padding: '12px 15px'
};

export default AdminPanel;