import React, { useCallback, useState } from 'react';
import { Upload, Camera, X } from 'lucide-react';
import { usePhoto } from '../context/PhotoContext';

interface PhotoUploaderProps {
  claimId: string;
}

export function PhotoUploader({ claimId }: PhotoUploaderProps) {
  const { addPhotos } = usePhoto();
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFiles = useCallback(async (files: FileList) => {
    const validFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/')
    );

    if (validFiles.length > 0) {
      setIsUploading(true);
      await addPhotos(claimId, validFiles);
      setIsUploading(false);
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

  return (
    <div className="card">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver
            ? 'border-primary bg-primary/5'
            : 'border-gray-300 hover:border-gray-400'
        } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <div className="max-w-sm mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {isUploading ? (
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-gray-400" />
            )}
          </div>
          
          <h3 className="text-lg font-medium text-text-primary mb-2">
            {isUploading ? 'Uploading photos...' : 'Upload Property Damage Photos'}
          </h3>
          
          <p className="text-text-secondary mb-4">
            Drag and drop your photos here, or click to select files
          </p>
          
          <div className="flex gap-3 justify-center">
            <label className="btn-primary cursor-pointer">
              <Camera className="w-4 h-4 mr-2" />
              Choose Files
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
                disabled={isUploading}
              />
            </label>
          </div>
          
          <p className="text-xs text-text-secondary mt-3">
            Supports JPG, PNG, WebP files up to 10MB each
          </p>
        </div>
      </div>
    </div>
  );
}