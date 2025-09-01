import React, { useState } from 'react';
import { PhotoUploader } from '../components/PhotoUploader';
import { PhotoGrid } from '../components/PhotoGrid';
import { usePhoto } from '../context/PhotoContext';
import { Plus, Play, Download, Filter } from 'lucide-react';

export function ClaimProcessor() {
  const { claims, currentClaim, addClaim, processPhotos } = usePhoto();
  const [showNewClaimModal, setShowNewClaimModal] = useState(false);
  const [newClaimName, setNewClaimName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCreateClaim = () => {
    if (newClaimName.trim()) {
      addClaim(newClaimName.trim());
      setNewClaimName('');
      setShowNewClaimModal(false);
    }
  };

  const handleProcessClaim = async () => {
    if (currentClaim) {
      setIsProcessing(true);
      await processPhotos(currentClaim.id);
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Process Claims</h1>
          <p className="text-text-secondary">Upload and organize property damage photos</p>
        </div>
        <button
          onClick={() => setShowNewClaimModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Claim
        </button>
      </div>

      {currentClaim ? (
        <div className="space-y-6">
          {/* Claim Header */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-text-primary">{currentClaim.name}</h2>
                <p className="text-text-secondary">
                  {currentClaim.photos.length} photos • Created {currentClaim.dateCreated.toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
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
                  >
                    <Play className="w-4 h-4" />
                    {isProcessing ? 'Processing...' : 'Process with AI'}
                  </button>
                )}
                {currentClaim.status === 'completed' && (
                  <button className="btn-secondary flex items-center gap-2">
                    <Download className="w-4 h-4" />
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
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-text-primary">Photos ({currentClaim.photos.length})</h3>
                <button className="btn-secondary flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>
              <PhotoGrid photos={currentClaim.photos} claimId={currentClaim.id} />
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">No Active Claim</h3>
            <p className="text-text-secondary mb-6">Create a new claim to start organizing photos</p>
            <button
              onClick={() => setShowNewClaimModal(true)}
              className="btn-primary"
            >
              Create New Claim
            </button>
          </div>
        </div>
      )}

      {/* New Claim Modal */}
      {showNewClaimModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-text-primary mb-4">Create New Claim</h3>
            <input
              type="text"
              placeholder="Claim name (e.g., Storm Damage - 123 Main St)"
              value={newClaimName}
              onChange={(e) => setNewClaimName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:border-primary"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowNewClaimModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateClaim}
                disabled={!newClaimName.trim()}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}