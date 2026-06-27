import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  // Determine spinner size
  const getSpinnerSize = () => {
    switch (size) {
      case 'small':
        return { width: '20px', height: '20px', borderWidth: '3px' };
      case 'large':
        return { width: '40px', height: '40px', borderWidth: '5px' };
      case 'medium':
      default:
        return { width: '30px', height: '30px', borderWidth: '4px' };
    }
  };

  const spinnerSize = getSpinnerSize();

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: '20px'
    }}>
      <div style={{ 
        border: `${spinnerSize.borderWidth} solid #f3f3f3`,
        borderTop: `${spinnerSize.borderWidth} solid #3498db`,
        borderRadius: '50%',
        width: spinnerSize.width,
        height: spinnerSize.height,
        animation: 'spin 1s linear infinite',
        marginBottom: text ? '10px' : '0'
      }}></div>
      
      {text && <p style={{ margin: 0, color: '#666' }}>{text}</p>}
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;