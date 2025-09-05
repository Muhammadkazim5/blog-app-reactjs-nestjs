import React, { useState } from 'react';
import { PhotoIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { getImageUrl } from '../utils/imageUtils';

interface ImageDisplayProps {
  imagePath: string;
  alt: string;
  className?: string;
  fallbackIcon?: React.ReactNode;
  onError?: () => void;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({
  imagePath,
  alt,
  className = '',
  fallbackIcon,
  onError
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
    onError?.();
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  if (imageError) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-md ${className}`}>
        <div className="text-center text-gray-500">
          {fallbackIcon || <ExclamationTriangleIcon className="h-12 w-12 mx-auto mb-2" />}
          <p className="text-sm">Failed to load image</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {imageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-md">
          <div className="text-center text-gray-500">
            <PhotoIcon className="h-8 w-8 mx-auto mb-2 animate-pulse" />
            <p className="text-sm">Loading...</p>
          </div>
        </div>
      )}
      
      <img
        src={getImageUrl(imagePath)}
        alt={alt}
        className={`w-full h-full object-cover rounded-md transition-opacity duration-300 ${
          imageLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        loading="lazy"
      />
    </div>
  );
};

export default ImageDisplay;
