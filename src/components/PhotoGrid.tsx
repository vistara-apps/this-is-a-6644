import React, { useState } from 'react';
import { Eye, Tag, AlertTriangle, CheckCircle, X, ZoomIn } from 'lucide-react';
import { Photo } from '../context/PhotoContext';
import { usePhoto } from '../context/PhotoContext';

interface PhotoGridProps {
  photos: Photo[];
  claimId: string;
}

export function PhotoGrid({ photos, claimId }: PhotoGridProps) {
  const { updatePhoto } = usePhoto();
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const toggleReportIncluded = (photoId: string, currentValue: boolean, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the photo modal
    updatePhoto(claimId, photoId, { reportIncluded: !currentValue });
  };

  const openPhotoDetail = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  const closePhotoDetail = () => {
    setSelectedPhoto(null);
  };

  return (
    <>
      <div className="responsive-grid fade-in">
        {photos.map((photo) => (
          <div 
            key={photo.id} 
            className="group relative bg-surface rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
            onClick={() => openPhotoDetail(photo)}
            tabIndex={0}
            role="button"
            aria-label={`View photo: ${photo.file.name}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                openPhotoDetail(photo);
              }
            }}
          >
            {/* Image */}
            <div className="aspect-square relative overflow-hidden">
              <img
                src={photo.url}
                alt={photo.file.name}
                className="w-full h-full object-cover"
                loading="lazy" // Lazy load images for better performance
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                <button 
                  className="opacity-0 group-hover:opacity-100 bg-white rounded-full p-2 transition-opacity shadow-md"
                  aria-label="View photo details"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              {/* Status Indicators */}
              <div className="absolute top-2 left-2 flex flex-wrap gap-1 max-w-[70%]">
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
                onClick={(e) => toggleReportIncluded(photo.id, photo.reportIncluded, e)}
                className={`absolute top-2 right-2 p-1.5 rounded-full transition-colors shadow-sm ${
                  photo.reportIncluded
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-500 text-white'
                }`}
                aria-label={photo.reportIncluded ? "Remove from report" : "Add to report"}
                aria-pressed={photo.reportIncluded}
              >
                {photo.reportIncluded ? (
                  <CheckCircle className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <X className="w-4 h-4" aria-hidden="true" />
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
                        <Tag className="w-3 h-3" aria-hidden="true" />
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
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>
                  <p className="text-xs text-text-secondary">Waiting to be processed...</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Photo Detail Modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={closePhotoDetail}
        >
          <div 
            className="bg-surface rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-bold text-lg text-text-primary">{selectedPhoto.file.name}</h3>
              <button 
                onClick={closePhotoDetail}
                className="p-1 rounded-full hover:bg-gray-100"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="flex flex-col md:flex-row overflow-auto">
              {/* Image */}
              <div className="md:w-2/3 bg-gray-900 flex items-center justify-center">
                <img 
                  src={selectedPhoto.url} 
                  alt={selectedPhoto.file.name}
                  className="max-w-full max-h-[60vh] object-contain"
                />
              </div>
              
              {/* Details */}
              <div className="md:w-1/3 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {/* Status */}
                  <div className="flex flex-wrap gap-2">
                    {selectedPhoto.isDuplicate && (
                      <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                        Duplicate
                      </div>
                    )}
                    {selectedPhoto.qualityScore > 0 && (
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        selectedPhoto.qualityScore >= 80 ? 'bg-green-100 text-green-800' :
                        selectedPhoto.qualityScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        Quality: {selectedPhoto.qualityScore}%
                      </div>
                    )}
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      selectedPhoto.reportIncluded 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedPhoto.reportIncluded ? 'In Report' : 'Not in Report'}
                    </div>
                  </div>
                  
                  {/* Metadata */}
                  {selectedPhoto.processed ? (
                    <>
                      <div>
                        <h4 className="font-medium text-sm mb-1">Damage Type</h4>
                        <p className="text-text-primary">{selectedPhoto.damageType || 'Not specified'}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm mb-1">Location</h4>
                        <p className="text-text-primary">{selectedPhoto.location || 'Not specified'}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm mb-1">Tags</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedPhoto.tags.length > 0 ? (
                            selectedPhoto.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                              >
                                <Tag className="w-3 h-3" />
                                {tag}
                              </span>
                            ))
                          ) : (
                            <p className="text-text-secondary text-sm">No tags</p>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 py-4">
                      <div className="w-4 h-4 rounded-full bg-yellow-500 animate-pulse"></div>
                      <p className="text-text-secondary">This photo is waiting to be processed...</p>
                    </div>
                  )}
                </div>
                
                {/* Actions */}
                <div className="mt-6 space-y-3">
                  <button
                    onClick={(e) => toggleReportIncluded(selectedPhoto.id, selectedPhoto.reportIncluded, e)}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors ${
                      selectedPhoto.reportIncluded
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {selectedPhoto.reportIncluded ? (
                      <>
                        <X className="w-4 h-4" />
                        Remove from Report
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Add to Report
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
