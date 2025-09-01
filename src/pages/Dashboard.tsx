import React from 'react';
import { Camera, FileText, TrendingUp, Clock, Plus, Eye } from 'lucide-react';
import { usePhoto } from '../context/PhotoContext';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { claims } = usePhoto();

  const stats = [
    {
      label: 'Total Claims',
      value: claims.length,
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      label: 'Photos Processed',
      value: claims.reduce((sum, claim) => sum + claim.photos.length, 0),
      icon: Camera,
      color: 'text-green-600'
    },
    {
      label: 'Avg. Processing Time',
      value: '3.2 min',
      icon: Clock,
      color: 'text-orange-600'
    },
    {
      label: 'Success Rate',
      value: '98.5%',
      icon: TrendingUp,
      color: 'text-purple-600'
    }
  ];

  const recentClaims = claims.slice(-5).reverse();

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-semibold text-text-primary mb-2">Dashboard</h1>
        <p className="text-text-secondary">Welcome back! Here's your claims overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-text-primary mt-1">{stat.value}</p>
                </div>
                <Icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <h3 className="text-lg font-bold text-text-primary mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => onNavigate('claims')}
              className="w-full flex items-center gap-3 p-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Claim
            </button>
            <button
              onClick={() => onNavigate('reports')}
              className="w-full flex items-center gap-3 p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <FileText className="w-5 h-5" />
              Generate Report
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-text-primary">Recent Claims</h3>
            <button
              onClick={() => onNavigate('claims')}
              className="text-primary hover:text-primary/80 text-sm font-medium"
            >
              View All
            </button>
          </div>
          {recentClaims.length > 0 ? (
            <div className="space-y-3">
              {recentClaims.map((claim) => (
                <div key={claim.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <p className="font-medium text-text-primary">{claim.name}</p>
                    <p className="text-sm text-text-secondary">
                      {claim.photos.length} photos • {claim.dateCreated.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      claim.status === 'completed' ? 'bg-green-100 text-green-800' :
                      claim.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {claim.status}
                    </span>
                    <button className="text-text-secondary hover:text-text-primary">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Camera className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-text-secondary">No claims yet. Create your first claim to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}