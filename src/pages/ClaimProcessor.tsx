import React, { useState, useEffect } from 'react';
import { PhotoUploader } from '../components/PhotoUploader';
import { PhotoGrid } from '../components/PhotoGrid';
import { usePhoto } from '../context/PhotoContext';
import { Plus, Play, Download, Filter, ArrowLeft, Trash2, Edit, CheckCircle } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { DamageTypeFilter, LocationFilter, QualityFilter } from '../components/ui/FilterDropdown';
import { SkeletonPhotoGrid } from '../components/ui/Skeleton';
import { ToastProvider, useToast } from '../components/ui/Toast';

// Wrap the component with ToastProvider in the parent component

function ClaimProcessorContent() {
  const { claims, currentClaim, addClaim, processPhotos } = usePhoto();
  const { showToast } = useToast();
  
  // State
  const [showNewClaimModal, setShowNewClaimModal] = useState(false);
  const [newClaimName, setNewClaimName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filters
  const [damageTypeFilters, setDamageTypeFilters] = useState<string[]>([]);
  const [locationFilters, setLocationFilters] = useState<string[]>([]);
  const [qualityFilters, setQualityFilters] = useState<string[]>([]);
  const [filteredPhotos, setFilteredPhotos] = useState(currentClaim?.photos || []);
  
  // Update filtered photos when filters or photos change
  useEffect(() => {
    if (!currentClaim) {
      setFilteredPhotos([]);
      return;
    }
    
    let photos = [...currentClaim.photos];
    
    // Apply damage type filter
    if (damageTypeFilters.length > 0) {
      photos = photos.filter(photo => 
        photo.damageType && damageTypeFilters.includes(photo.damageType)
      );
    }
    
    // Apply location filter
    if (locationFilters.length > 0) {
      photos = photos.filter(photo => 
        photo.location && locationFilters.includes(photo.location)
      );
    }
    
    // Apply quality filter
    if (qualityFilters.length > 0) {
      photos = photos.filter(photo => {
        if (qualityFilters.includes('high') && photo.qualityScore >= 80) return true;
        if (qualityFilters.includes('medium') && photo.qualityScore >= 60 && photo.qualityScore < 80) return true;
        if (qualityFilters.includes('low') && photo.qualityScore < 60) return true;
        return false;
      });
    }
    
    setFilteredPhotos(photos);
  }, [currentClaim, damageTypeFilters, locationFilters, qualityFilters]);
  
  // Handlers
  const handleCreateClaim = () => {
    if (newClaimName.trim()) {
      addClaim(newClaimName.trim());
      setNewClaimName('');
      setShowNewClaimModal(false);
      showToast('success', `Claim "${newClaimName.trim()}" created successfully`);
    }
  };

  const handleProcessClaim = async () => {
    if (currentClaim) {
      setIsProcessing(true);
      try {
        await processPhotos(currentClaim.id);
        showToast('success', 'Photos processed successfully');
      } catch (error) {
        showToast('error', 'Failed to process photos. Please try again.');
        console.error(error);
      } finally {
        setIsProcessing(false);
      }
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateClaim();
    }
  };
  
  const clearAllFilters = () => {
    setDamageTypeFilters([]);
    setLocationFilters([]);
    setQualityFilters([]);
  };
  
  const hasActiveFilters = damageTypeFilters.length > 0 || locationFilters.length > 0 || qualityFilters.length > 0;
  
  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto mobile-pb">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Process Claims</h1>
          <p className="text-text-secondary">Upload and organize property damage photos</p>
        </div>
        <button
          onClick={() => setShowNewClaimModal(true)}
          className="btn-primary flex items-center justify-center gap-2 sm:w-auto w-full"
          aria-label="Create new claim"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          New Claim
        </button>
      </div>

      {currentClaim ? (
        <div className="space-y-6">
          {/* Claim Header */}
          <div className="card fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-text-primary">{currentClaim.name}</h2>
                <p className="text-text-secondary">
                  {currentClaim.photos.length} photos • Created {currentClaim.dateCreated.toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`px-3 py-1 text-sm rounded-full ${
                  currentClaim.status === 'completed' ? 'bg-green-100 text-green-800' :
                  currentClaim.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {currentClaim.status}
                </span>
                {currentClaim.photos.length > 0 && currentClaim.status !== 'processing' && (
                  <button
                    onClick={handleProcessClaim}
                    disabled={isProcessing}
                    className="btn-primary flex items-center gap-2"
                    aria-label="Process photos with AI"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" aria-hidden="true" />
                        Process with AI
                      </>
                    )}
                  </button>
                )}
                {currentClaim.status === 'completed' && (
                  <button 
                    className="btn-secondary flex items-center gap-2"
                    aria-label="Export report"
                  >
                    <Download className="w-4 h-4" aria-hidden="true" />
                    Export Report
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Photo Upload */}
          <PhotoUploader claimId={currentClaim.id} />

          {/* Photo Grid */}
          {currentClaim.photos.length > 0 && (
            <div className="card fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-text-primary">Photos ({filteredPhotos.length})</h3>
                  {hasActiveFilters && (
                    <span className="text-sm text-text-secondary">
                      (filtered from {currentClaim.photos.length})
                    </span>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <button 
                    className={`btn-secondary flex items-center gap-2 ${showFilters ? 'bg-primary/10 border-primary text-primary' : ''}`}
                    onClick={() => setShowFilters(!showFilters)}
                    aria-expanded={showFilters}
                    aria-controls="filter-panel"
                  >
                    <Filter className="w-4 h-4" aria-hidden="true" />
                    {hasActiveFilters ? `Filters (${damageTypeFilters.length + locationFilters.length + qualityFilters.length})` : 'Filter'}
                  </button>
                  
                  {hasActiveFilters && (
                    <button 
                      className="btn-secondary text-sm"
                      onClick={clearAllFilters}
                      aria-label="Clear all filters"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>
              
              {/* Filter Panel */}
              {showFilters && (
                <div id="filter-panel" className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200 slide-up">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <DamageTypeFilter 
                      selectedValues={damageTypeFilters} 
                      onChange={setDamageTypeFilters} 
                    />
                    <LocationFilter 
                      selectedValues={locationFilters} 
                      onChange={setLocationFilters} 
                    />
                    <QualityFilter 
                      selectedValues={qualityFilters} 
                      onChange={setQualityFilters} 
                    />
                  </div>
                </div>
              )}
              
              {isProcessing ? (
                <SkeletonPhotoGrid count={currentClaim.photos.length} />
              ) : (
                <PhotoGrid photos={filteredPhotos} claimId={currentClaim.id} />
              )}
              
              {filteredPhotos.length === 0 && !isProcessing && (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                  <Filter className="w-12 h-12 text-gray-300 mx-auto mb-3" aria-hidden="true" />
                  <p className="text-text-secondary">No photos match the selected filters.</p>
                  <button 
                    className="mt-3 text-primary hover:underline"
                    onClick={clearAllFilters}
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16 fade-in">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">No Active Claim</h3>
            <p className="text-text-secondary mb-6">Create a new claim to start organizing photos</p>
            <button
              onClick={() => setShowNewClaimModal(true)}
              className="btn-primary"
              aria-label="Create new claim"
            >
              Create New Claim
            </button>
          </div>
        </div>
      )}

      {/* New Claim Modal */}
      <Modal 
        isOpen={showNewClaimModal} 
        onClose={() => setShowNewClaimModal(false)}
        title="Create New Claim"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="claim-name" className="block text-sm font-medium text-text-primary mb-1">
              Claim Name
            </label>
            <input
              id="claim-name"
              type="text"
              placeholder="e.g., Storm Damage - 123 Main St"
              value={newClaimName}
              onChange={(e) => setNewClaimName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
          </div>
          
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setShowNewClaimModal(false)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateClaim}
              disabled={!newClaimName.trim()}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create
            </button>
          </div>
        </div>
      </Modal>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={() => {
          // Handle delete claim logic here
          setShowConfirmDialog(false);
          showToast('success', 'Claim deleted successfully');
        }}
        title="Delete Claim"
        message="Are you sure you want to delete this claim? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
}

// Wrap with ToastProvider
export function ClaimProcessor() {
  return (
    <ToastProvider>
      <ClaimProcessorContent />
    </ToastProvider>
  );
}
