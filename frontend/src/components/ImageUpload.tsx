import React, { useState, useRef } from 'react';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { validateImageFile, createImagePreview, formatFileSize } from '../utils/imageUtils';

interface ImageUploadProps {
  onImageSelect: (file: File | null, removeImage?: boolean) => void;
  currentImage?: string;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImageSelect, 
  currentImage, 
  className = '' 
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [showCurrentImage, setShowCurrentImage] = useState(true);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    setError(null);
    
    // Validate the file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setSelectedFile(file);
    setShowCurrentImage(false); // Hide current image when new file is selected
    setRemoveExistingImage(false); // Reset removal flag when new file is selected
    
    // Create preview
    try {
      const preview = await createImagePreview(file);
      setPreviewUrl(preview);
      onImageSelect(file, false);
    } catch (err) {
      setError('Failed to create image preview');
      console.error('Error creating image preview:', err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    setRemoveExistingImage(true); // Mark that existing image should be removed
    setShowCurrentImage(false); // Hide current image
    onImageSelect(null, true); // Signal to parent that existing image should be removed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const restoreExistingImage = () => {
    setRemoveExistingImage(false);
    setShowCurrentImage(true);
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    onImageSelect(null, false); // Signal to parent to keep existing image
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        
        {previewUrl || (currentImage && showCurrentImage && !removeExistingImage) ? (
          <div className="space-y-4">
            <div className="relative inline-block">
              <img
                src={previewUrl || (currentImage ? `http://localhost:3000/uploads/${currentImage}` : '')}
                alt="Preview"
                className="max-h-48 max-w-full rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
            
            {selectedFile && (
              <div className="text-sm text-gray-600">
                <p>File: {selectedFile.name}</p>
                <p>Size: {formatFileSize(selectedFile.size)}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <button
                  type="button"
                  onClick={openFileDialog}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Click to upload
                </button>{' '}
                or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF, WebP up to 5MB
              </p>
            </div>
            
            {/* Show restore option if existing image was removed */}
            {currentImage && removeExistingImage && (
              <div className="pt-2 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Original image removed</p>
                <button
                  type="button"
                  onClick={restoreExistingImage}
                  className="text-sm text-green-600 hover:text-green-500 font-medium"
                >
                  Restore original image
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
          {error}
        </div>
      )}

      {/* File Info */}
      {selectedFile && !error && (
        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
          <p><strong>Selected:</strong> {selectedFile.name}</p>
          <p><strong>Size:</strong> {formatFileSize(selectedFile.size)}</p>
          <p><strong>Type:</strong> {selectedFile.type}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
