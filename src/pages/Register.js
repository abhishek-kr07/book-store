import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: ''
  });
  const { register, currentUser } = useAuth();
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();
  
  // Check if user is already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);
  
  // Check password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength({ score: 0, message: '' });
      return;
    }
    
    let score = 0;
    let message = '';
    
    // Length check
    if (password.length >= 8) score += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    // Set message based on score
    if (score < 2) {
      message = 'Weak';
    } else if (score < 4) {
      message = 'Medium';
    } else {
      message = 'Strong';
    }
    
    setPasswordStrength({ score, message });
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!termsAccepted) {
      showError('You must accept the Terms and Conditions');
      return;
    }
    
    if (password !== confirmPassword) {
      showError('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      showError('Password must be at least 8 characters');
      return;
    }
    
    if (passwordStrength.score < 3) {
      showError('Please use a stronger password with uppercase, lowercase, numbers, and special characters');
      return;
    }
    
    try {
      setLoading(true);
      await register(email, password, name);
      showSuccess('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        showError('Email is already in use');
      } else if (error.code === 'auth/invalid-email') {
        showError('Invalid email address');
      } else if (error.code === 'auth/weak-password') {
        showError('Password is too weak');
      } else {
        showError('Failed to create an account');
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Register for QuickDesk</h2>
      

      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input 
            type="text" 
            id="name" 
            className="form-control" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            className="form-control" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <small className="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            className="form-control" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            minLength="8"
          />
          {password && (
            <div className="password-strength mt-2">
              <div className="progress" style={{ height: '5px' }}>
                <div 
                  className={`progress-bar bg-${passwordStrength.score < 2 ? 'danger' : passwordStrength.score < 4 ? 'warning' : 'success'}`} 
                  role="progressbar" 
                  style={{ width: `${(passwordStrength.score / 5) * 100}%` }} 
                  aria-valuenow={passwordStrength.score} 
                  aria-valuemin="0" 
                  aria-valuemax="5"
                ></div>
              </div>
              <small className={`text-${passwordStrength.score < 2 ? 'danger' : passwordStrength.score < 4 ? 'warning' : 'success'}`}>
                {passwordStrength.message}
              </small>
              <small className="form-text text-muted d-block">
                Use at least 8 characters with uppercase, lowercase, numbers, and special characters.
              </small>
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input 
            type="password" 
            id="confirmPassword" 
            className="form-control" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
          />
          {confirmPassword && password !== confirmPassword && (
            <small className="text-danger">Passwords do not match</small>
          )}
        </div>
        
        <div className="form-group form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="termsAccepted"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            required
          />
          <label className="form-check-label" htmlFor="termsAccepted">
            I accept the <Link to="/terms" target="_blank">Terms and Conditions</Link>
          </label>
        </div>
        
        <button 
          type="submit" 
          className="btn btn-block" 
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>
      
      <div className="text-center mt-3">
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
};

export default Register;