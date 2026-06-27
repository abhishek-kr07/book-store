import React, { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../services/firebase';

const FileUpload = ({ onFileUpload, maxSizeMB = 5 }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  
  // Convert MB to bytes
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
  // Allowed file types
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain'
  ];
  
  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError('');
    
    // Check if file is selected
    if (!selectedFile) {
      setFile(null);
      return;
    }
    
    // Check file size
    if (selectedFile.size > maxSizeBytes) {
      setError(`File size exceeds the maximum limit of ${maxSizeMB}MB`);
      setFile(null);
      return;
    }
    
    // Check file type
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('File type not supported. Please upload an image, PDF, Word, Excel, or text file.');
      setFile(null);
      return;
    }
    
    setFile(selectedFile);
  };
  
  // Handle file upload
  const handleUpload = async () => {
    if (!file) return;
    
    try {
      setUploading(true);
      setUploadProgress(0);
      
      // Create a unique file path in Firebase Storage
      const timestamp = new Date().getTime();
      const fileExtension = file.name.split('.').pop();
      const fileName = `${timestamp}_${Math.random().toString(36).substring(2, 8)}.${fileExtension}`;
      const storageRef = ref(storage, `attachments/${fileName}`);
      
      // Upload file with progress tracking
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      uploadTask.on('state_changed', 
        (snapshot) => {
          // Track upload progress
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setUploadProgress(progress);
        },
        (error) => {
          // Handle upload error
          console.error('Upload error:', error);
          setError('Failed to upload file. Please try again.');
          setUploading(false);
        },
        async () => {
          // Upload completed successfully
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          
          // Pass file info to parent component
          onFileUpload({
            name: file.name,
            type: file.type,
            size: file.size,
            url: downloadURL
          });
          
          // Reset state
          setFile(null);
          setUploading(false);
          setUploadProgress(0);
        }
      );
    } catch (error) {
      console.error('Upload error:', error);
      setError('An unexpected error occurred. Please try again.');
      setUploading(false);
    }
  };
  
  // Handle file removal
  const handleRemoveFile = () => {
    setFile(null);
    setError('');
  };
  
  return (
    <div className="file-upload">
      {/* File input */}
      <div className="file-input-container">
        <input 
          type="file" 
          id="file-upload" 
          onChange={handleFileChange} 
          disabled={uploading}
          style={{ display: 'none' }}
        />
        <label 
          htmlFor="file-upload" 
          className="file-input-label"
          style={{
            display: 'inline-block',
            padding: '8px 16px',
            backgroundColor: '#f1f1f1',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: uploading ? 'not-allowed' : 'pointer',
            opacity: uploading ? 0.7 : 1
          }}
        >
          {uploading ? 'Uploading...' : 'Choose File'}
        </label>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="file-error" style={{ color: '#e74c3c', marginTop: '5px', fontSize: '14px' }}>
          {error}
        </div>
      )}
      
      {/* Selected file info */}
      {file && (
        <div className="file-info" style={{ marginTop: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
              {file.name}
            </div>
            <div>
              <button 
                onClick={handleUpload} 
                disabled={uploading}
                style={{
                  backgroundColor: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '5px 10px',
                  marginRight: '5px',
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  opacity: uploading ? 0.7 : 1
                }}
              >
                Upload
              </button>
              <button 
                onClick={handleRemoveFile} 
                disabled={uploading}
                style={{
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '5px 10px',
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  opacity: uploading ? 0.7 : 1
                }}
              >
                Remove
              </button>
            </div>
          </div>
          
          {/* Upload progress */}
          {uploading && (
            <div style={{ marginTop: '5px' }}>
              <div style={{ height: '5px', width: '100%', backgroundColor: '#f1f1f1', borderRadius: '5px' }}>
                <div 
                  style={{
                    height: '100%',
                    width: `${uploadProgress}%`,
                    backgroundColor: '#3498db',
                    borderRadius: '5px',
                    transition: 'width 0.3s ease'
                  }}
                ></div>
              </div>
              <div style={{ fontSize: '12px', marginTop: '3px' }}>{uploadProgress}% uploaded</div>
            </div>
          )}
        </div>
      )}
      
      {/* File size limit info */}
      <div style={{ fontSize: '12px', color: '#777', marginTop: '5px' }}>
        Max file size: {maxSizeMB}MB. Supported formats: Images, PDF, Word, Excel, Text.
      </div>
    </div>
  );
};

export default FileUpload;