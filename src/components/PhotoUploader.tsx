import React, { useCallback, useState, useRef } from 'react';
import { Upload, Camera, X, Image, AlertCircle } from 'lucide-react';
import { usePhoto } from '../context/PhotoContext';

interface PhotoUploaderProps {
  claimId: string;
}

export function PhotoUploader({ claimId }: PhotoUploaderProps) {
  const { addPhotos } = usePhoto();
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (files: FileList) => {
    try {
      setError(null);
      const validFiles = Array.from(files).filter(file => 
        file.type.startsWith('image/')
      );
      
      if (validFiles.length === 0) {
        setError('No valid image files selected. Please select JPG, PNG, or WebP files.');
        return;
      }
      
      // Check file sizes
      const oversizedFiles = validFiles.filter(file => file.size > 10 * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        setError(`${oversizedFiles.length} file(s) exceed the 10MB limit. Please resize and try again.`);
        return;
      }
      
      setSelectedFiles(validFiles);
      setIsUploading(true);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 15;
          return newProgress >= 90 ? 90 : newProgress;
        });
      }, 300);
      
      await addPhotos(claimId, validFiles);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Reset after completion
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setSelectedFiles([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 1000);
    } catch (err) {
      setError('An error occurred while uploading. Please try again.');
      setIsUploading(false);
      setUploadProgress(0);
      console.error('Upload error:', err);
    }
  }, [claimId, addPhotos]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const clearError = () => {
    setError(null);
  };

  return (
    <div className="card fade-in">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-4 md:p-8 text-center transition-colors ${
          isDragOver
            ? 'border-primary bg-primary/5'
            : 'border-gray-300 hover:border-gray-400'
        } ${isUploading ? 'opacity-90 pointer-events-none' : ''}`}
        aria-disabled={isUploading}
      >
        <div className="max-w-sm mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {isUploading ? (
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" 
                   aria-label="Uploading photos" 
                   role="status" />
            ) : (
              <Upload className="w-8 h-8 text-gray-400" aria-hidden="true" />
            )}
          </div>
          
          <h3 className="text-lg font-medium text-text-primary mb-2">
            {isUploading ? 'Uploading photos...' : 'Upload Property Damage Photos'}
          </h3>
          
          {isUploading ? (
            <div className="space-y-3">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                  role="progressbar"
                  aria-valuenow={uploadProgress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                ></div>
              </div>
              <p className="text-text-secondary">
                Uploading {selectedFiles.length} photo{selectedFiles.length !== 1 ? 's' : ''}...
              </p>
            </div>
          ) : (
            <>
              <p className="text-text-secondary mb-4">
                Drag and drop your photos here, or click to select files
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <label className="btn-primary cursor-pointer flex items-center justify-center">
                  <Camera className="w-4 h-4 mr-2" aria-hidden="true" />
                  Choose Files
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                    disabled={isUploading}
                    aria-label="Upload photos"
                  />
                </label>
                <button 
                  className="btn-secondary flex items-center justify-center mt-2 sm:mt-0"
                  onClick={() => {
                    // This would open the device camera in a real implementation
                    alert('Camera functionality would open here in a production app');
                  }}
                >
                  <Image className="w-4 h-4 mr-2" aria-hidden="true" />
                  Take Photo
                </button>
              </div>
              
              <p className="text-xs text-text-secondary mt-3">
                Supports JPG, PNG, WebP files up to 10MB each
              </p>
            </>
          )}
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-3 flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
          <div className="ml-3 flex-1">
            <p className="text-sm text-red-700">{error}</p>
          </div>
          <button 
            onClick={clearError}
            className="ml-auto flex-shrink-0 text-red-500 hover:text-red-700"
            aria-label="Dismiss error"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
