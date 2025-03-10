import React, { useState } from "react";
import { uploadDocument } from '../services/documentService';

interface DocumentUploadProps {
  onUploadSuccess?: () => void;
}

export default function DocumentUpload({ onUploadSuccess }: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      await uploadDocument(file, description);
      setSuccess(true);
      setFile(null);
      setDescription('');
      
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err: unknown) {

      if (err instanceof Error) {
        setError(err.message || 'Failed to upload document');
      } else {
        setError('Failed to upload document');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
      <div className="text-2xl font-semibold text-center mb-6">Upload Document</div>
      
      {error && (
        <div className="alert alert-error mb-4 bg-red-50 text-red-800 border border-red-200 p-4 rounded-lg">
          <span className="text-lg font-medium">Error:</span> {error}
        </div>
      )}
      
      {success && (
        <div className="alert alert-success mb-4 bg-green-50 text-green-800 border border-green-200 p-4 rounded-lg">
          Document uploaded successfully!
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="file" className="block text-sm font-medium text-gray-700">Select Document</label>
          <input 
            id="file" 
            type="file" 
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {file && (
            <p className="text-sm text-gray-500 mt-2">
              Selected file: {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description (Optional)</label>
          <textarea 
            id="description" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter a description for this document"
            className="w-full p-2 border border-gray-300 rounded-md min-h-[100px]"
          />
        </div>

        <button 
          type="submit" 
          onClick={handleSubmit}
          disabled={loading || !file}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400"
        >
          {loading ? (
            <>Uploading...</>
          ) : (
            <>
              <span className="mr-2">📤</span>
              Upload Document
            </>
          )}
        </button>
      </form>
    </div>
  );
}
