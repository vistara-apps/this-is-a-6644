import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  animate?: boolean;
}

export function Skeleton({
  className = '',
  width,
  height,
  rounded = 'md',
  animate = true,
}: SkeletonProps) {
  const getRoundedClass = () => {
    switch (rounded) {
      case 'none': return 'rounded-none';
      case 'sm': return 'rounded-sm';
      case 'md': return 'rounded-md';
      case 'lg': return 'rounded-lg';
      case 'full': return 'rounded-full';
    }
  };
  
  const style: React.CSSProperties = {
    width: width,
    height: height,
  };
  
  return (
    <div
      className={`bg-gray-200 ${getRoundedClass()} ${animate ? 'animate-pulse' : ''} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

// Specialized skeleton components
export function SkeletonText({ lines = 1, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className="w-full h-4" 
          rounded="sm"
        />
      ))}
    </div>
  );
}

export function SkeletonAvatar({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const getSize = () => {
    switch (size) {
      case 'sm': return 'w-8 h-8';
      case 'md': return 'w-10 h-10';
      case 'lg': return 'w-12 h-12';
    }
  };
  
  return (
    <Skeleton 
      className={`${getSize()} ${className}`} 
      rounded="full"
    />
  );
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`p-4 border border-gray-200 rounded-lg ${className}`}>
      <Skeleton className="w-full h-32 mb-4" />
      <SkeletonText lines={3} />
    </div>
  );
}

export function SkeletonPhotoGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="responsive-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-surface rounded-lg border border-gray-200 overflow-hidden">
          <Skeleton className="aspect-square w-full" />
          <div className="p-3">
            <Skeleton className="w-3/4 h-4 mb-3" rounded="sm" />
            <SkeletonText lines={2} />
          </div>
        </div>
      ))}
    </div>
  );
}

