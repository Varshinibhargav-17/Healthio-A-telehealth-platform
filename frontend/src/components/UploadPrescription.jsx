import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function UploadPrescription({ patientId, providerId, appointmentId }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/provider/auth/patients', { credentials: 'include' })
      .then(res => res.json())
      .then(setPatients)
      .catch(console.error);
  }, []);

  const handleUpload = async () => {
    if (!providerId) {
      setMessage('Provider ID is missing!');
      setMessageType('error');
      return;
    }

    if (!file) {
      setMessage('Please select a file to upload');
      setMessageType('error');
      return;
    }

    if (!selectedPatientId && !patientId) {
      setMessage('Please select a patient');
      setMessageType('error');
      return;
    }

    setIsUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('patientId', selectedPatientId || patientId);

    if (providerId) formData.append('providerId', providerId);
    if (appointmentId) formData.append('appointmentId', appointmentId);

    try {
      const res = await axios.post('http://localhost:5000/api/prescriptions/upload', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage(res.data.message);
      setMessageType('success');
      setFile(null);
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      setMessage(err.response?.data?.message || 'Upload failed');
      setMessageType('error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const getPatientDisplayName = (patient) => {
    return `${patient.first_name} ${patient.last_name} (${patient.email})`;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="card bg-base-100 shadow-lg max-w-2xl mx-auto" data-theme="corporate">
      <div className="card-body">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-primary/10 rounded-full">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="card-title text-2xl">Upload E-Prescription</h3>
            <p className="text-base-content/60">Upload prescription files for your patients</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Patient Selection */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Select Patient
              </span>
              <span className="label-text-alt text-error">*Required</span>
            </label>
            <select
              required
              value={selectedPatientId}
              onChange={e => setSelectedPatientId(e.target.value)}
              className="select select-bordered select-primary w-full"
            >
              <option value="">Choose a patient...</option>
              {patients.map(p => (
                <option key={p._id} value={p._id}>
                  {getPatientDisplayName(p)}
                </option>
              ))}
            </select>
          </div>

          {/* File Upload */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Prescription File
              </span>
              <span className="label-text-alt text-error">*Required</span>
            </label>
            
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                isDragOver 
                  ? 'border-primary bg-primary/5 scale-105' 
                  : 'border-base-300 hover:border-primary/50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="space-y-4">
                  <div className="p-4 bg-base-200 rounded-lg">
                    <div className="flex items-center gap-3 justify-center">
                      <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="text-left">
                        <p className="font-medium text-base-content">{file.name}</p>
                        <p className="text-sm text-base-content/60">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      const fileInput = document.querySelector('input[type="file"]');
                      if (fileInput) fileInput.value = '';
                    }}
                    className="btn btn-outline btn-sm"
                  >
                    Remove File
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-6xl text-base-content/20">📄</div>
                  <div>
                    <p className="text-lg font-medium mb-2">Drop your prescription file here</p>
                    <p className="text-base-content/60 mb-4">or click to browse files</p>
                    <input
                      type="file"
                      onChange={(e) => setFile(e.target.files[0])}
                      className="file-input file-input-bordered file-input-primary w-full max-w-xs"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    />
                  </div>
                  <div className="text-xs text-base-content/50">
                    Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB)
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Upload Button */}
          <div className="flex justify-center">
            <button
              onClick={handleUpload}
              disabled={isUploading || !file || (!selectedPatientId && !patientId)}
              className="btn btn-primary btn-lg gap-2 min-w-[200px]"
            >
              {isUploading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Uploading...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 12l3 3m0 0l3-3m-3 3V9" />
                  </svg>
                  Upload Prescription
                </>
              )}
            </button>
          </div>

          {/* Status Message */}
          {message && (
            <div className={`alert ${
              messageType === 'success' ? 'alert-success' : 
              messageType === 'error' ? 'alert-error' : 
              'alert-info'
            }`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {messageType === 'success' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                ) : messageType === 'error' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                )}
              </svg>
              <span>{message}</span>
            </div>
          )}

          {/* Info Section */}
          <div className="bg-info/10 p-4 rounded-lg border border-info/20">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-info flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm">
                <p className="font-semibold text-info mb-1">Upload Guidelines:</p>
                <ul className="list-disc list-inside space-y-1 text-base-content/70">
                  <li>Ensure prescription is clearly legible and complete</li>
                  <li>Include all relevant patient and medication information</li>
                  <li>File size should not exceed 10MB</li>
                  <li>Supported formats: PDF, JPG, PNG, DOC, DOCX</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}