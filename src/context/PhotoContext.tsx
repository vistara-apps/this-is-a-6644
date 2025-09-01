import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Photo {
  id: string;
  file: File;
  url: string;
  tags: string[];
  damageType: string;
  location: string;
  isDuplicate: boolean;
  qualityScore: number;
  reportIncluded: boolean;
  processed: boolean;
}

export interface Claim {
  id: string;
  name: string;
  dateCreated: Date;
  photos: Photo[];
  status: 'processing' | 'completed' | 'draft';
}

interface PhotoContextType {
  claims: Claim[];
  currentClaim: Claim | null;
  addClaim: (name: string) => void;
  addPhotos: (claimId: string, files: File[]) => Promise<void>;
  updatePhoto: (claimId: string, photoId: string, updates: Partial<Photo>) => void;
  setCurrentClaim: (claim: Claim | null) => void;
  processPhotos: (claimId: string) => Promise<void>;
}

const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

export function PhotoProvider({ children }: { children: ReactNode }) {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [currentClaim, setCurrentClaim] = useState<Claim | null>(null);

  const addClaim = (name: string) => {
    const newClaim: Claim = {
      id: Date.now().toString(),
      name,
      dateCreated: new Date(),
      photos: [],
      status: 'draft'
    };
    setClaims(prev => [...prev, newClaim]);
    setCurrentClaim(newClaim);
  };

  const addPhotos = async (claimId: string, files: File[]) => {
    const newPhotos: Photo[] = files.map(file => ({
      id: Date.now().toString() + Math.random(),
      file,
      url: URL.createObjectURL(file),
      tags: [],
      damageType: '',
      location: '',
      isDuplicate: false,
      qualityScore: 0,
      reportIncluded: true,
      processed: false
    }));

    setClaims(prev => prev.map(claim => 
      claim.id === claimId 
        ? { ...claim, photos: [...claim.photos, ...newPhotos] }
        : claim
    ));

    // Update current claim if it's the one being modified
    if (currentClaim?.id === claimId) {
      setCurrentClaim(prev => prev ? { ...prev, photos: [...prev.photos, ...newPhotos] } : null);
    }
  };

  const updatePhoto = (claimId: string, photoId: string, updates: Partial<Photo>) => {
    setClaims(prev => prev.map(claim => 
      claim.id === claimId 
        ? {
            ...claim,
            photos: claim.photos.map(photo => 
              photo.id === photoId ? { ...photo, ...updates } : photo
            )
          }
        : claim
    ));

    if (currentClaim?.id === claimId) {
      setCurrentClaim(prev => prev ? {
        ...prev,
        photos: prev.photos.map(photo => 
          photo.id === photoId ? { ...photo, ...updates } : photo
        )
      } : null);
    }
  };

  // Simulate AI processing
  const processPhotos = async (claimId: string) => {
    const claim = claims.find(c => c.id === claimId);
    if (!claim) return;

    setClaims(prev => prev.map(c => 
      c.id === claimId ? { ...c, status: 'processing' as const } : c
    ));

    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const damageTypes = ['Roof Damage', 'Water Damage', 'Fire Damage', 'Storm Damage', 'Structural'];
    const locations = ['Exterior', 'Interior', 'Kitchen', 'Bathroom', 'Living Room', 'Bedroom'];
    const tags = ['Severe', 'Moderate', 'Minor', 'Before', 'After', 'Close-up', 'Wide Shot'];

    setClaims(prev => prev.map(c => {
      if (c.id === claimId) {
        const processedPhotos = c.photos.map(photo => ({
          ...photo,
          damageType: damageTypes[Math.floor(Math.random() * damageTypes.length)],
          location: locations[Math.floor(Math.random() * locations.length)],
          tags: tags.slice(0, Math.floor(Math.random() * 3) + 1),
          qualityScore: Math.floor(Math.random() * 40) + 60, // 60-100
          isDuplicate: Math.random() < 0.1, // 10% chance
          processed: true
        }));

        return { ...c, photos: processedPhotos, status: 'completed' as const };
      }
      return c;
    }));

    if (currentClaim?.id === claimId) {
      const updatedClaim = claims.find(c => c.id === claimId);
      if (updatedClaim) {
        setCurrentClaim(updatedClaim);
      }
    }
  };

  return (
    <PhotoContext.Provider value={{
      claims,
      currentClaim,
      addClaim,
      addPhotos,
      updatePhoto,
      setCurrentClaim,
      processPhotos
    }}>
      {children}
    </PhotoContext.Provider>
  );
}

export function usePhoto() {
  const context = useContext(PhotoContext);
  if (context === undefined) {
    throw new Error('usePhoto must be used within a PhotoProvider');
  }
  return context;
}