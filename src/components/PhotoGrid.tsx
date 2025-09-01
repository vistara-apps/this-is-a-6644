import React from 'react';
import { Eye, Tag, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { Photo } from '../context/PhotoContext';
import { usePhoto } from '../context/PhotoContext';

interface PhotoGridProps {
  photos: Photo[];
  claimId: string;
}

export function PhotoGrid({ photos, claimId }: PhotoGridProps) {
  const { updatePhoto } = usePhoto();

  const toggleReportIncluded = (photoId: string, currentValue: boolean) => {
    updatePhoto(claimId, photoId, { reportIncluded: !currentValue });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {photos.map((photo) => (
        <div key={photo.id} className="group relative bg-surface rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
          {/* Image */}
          <div className="aspect-square relative overflow-hidden">
            <img
              src={photo.url}
              alt={photo.file.name}
              className="w-full h-full object-cover"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
              <button className="opacity-0 group-hover:opacity-100 bg-white rounded-full p-2 transition-opacity">
                <Eye className="w-4 h-4" />
              </button>
            </div>

            {/* Status Indicators */}
            <div className="absolute top-2 left-2 flex gap-1">
              {photo.isDuplicate && (
                <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                  Duplicate
                </div>
              )}
              {photo.qualityScore > 0 && photo.qualityScore < 70 && (
                <div className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                  Low Quality
                </div>
              )}
            </div>

            {/* Report Toggle */}
            <button
              onClick={() => toggleReportIncluded(photo.id, photo.reportIncluded)}
              className={`absolute top-2 right-2 p-1 rounded-full transition-colors ${
                photo.reportIncluded
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-500 text-white'
              }`}
            >
              {photo.reportIncluded ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <X className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Info */}
          <div className="p-3">
            <p className="font-medium text-text-primary text-sm truncate mb-1">
              {photo.file.name}
            </p>
            
            {photo.processed && (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {photo.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
                
                {photo.damageType && (
                  <p className="text-xs text-text-secondary">
                    <strong>Type:</strong> {photo.damageType}
                  </p>
                )}
                
                {photo.location && (
                  <p className="text-xs text-text-secondary">
                    <strong>Location:</strong> {photo.location}
                  </p>
                )}
                
                {photo.qualityScore > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-text-secondary">Quality:</span>
                    <div className={`text-xs font-medium ${
                      photo.qualityScore >= 80 ? 'text-green-600' :
                      photo.qualityScore >= 60 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {photo.qualityScore}%
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {!photo.processed && (
              <p className="text-xs text-text-secondary">Waiting to be processed...</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}