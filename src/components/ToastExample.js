import React from 'react';
import { useToast } from '../context/ToastContext';

const ToastExample = () => {
  const { showSuccess, showError, showWarning, showInfo } = useToast();

  const handleShowSuccess = () => {
    showSuccess('This is a success message!');
  };

  const handleShowError = () => {
    showError('This is an error message!');
  };

  const handleShowWarning = () => {
    showWarning('This is a warning message!');
  };

  const handleShowInfo = () => {
    showInfo('This is an info message!');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Toast Notification Examples</h2>
      <p>Click the buttons below to see different types of toast notifications:</p>
      
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
        <button 
          onClick={handleShowSuccess}
          style={{ 
            padding: '10px 15px', 
            backgroundColor: '#2ecc71', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Show Success Toast
        </button>
        
        <button 
          onClick={handleShowError}
          style={{ 
            padding: '10px 15px', 
            backgroundColor: '#e74c3c', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Show Error Toast
        </button>
        
        <button 
          onClick={handleShowWarning}
          style={{ 
            padding: '10px 15px', 
            backgroundColor: '#f39c12', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Show Warning Toast
        </button>
        
        <button 
          onClick={handleShowInfo}
          style={{ 
            padding: '10px 15px', 
            backgroundColor: '#3498db', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Show Info Toast
        </button>
      </div>
    </div>
  );
};

export default ToastExample;