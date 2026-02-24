"use client";

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';

// --- Types ---
type ResourceType = "FIRE" | "AMBULANCE" | "POLICE" | "BOAT" | "NDRF";

// --- Configuration ---
// Holds the display details and Tailwind classes for each card
const RESOURCE_CONFIG: Record<ResourceType, { label: string; icon: string; bg: string; border: string; text: string }> = {
  FIRE: { label: 'Fire Truck', icon: '🚒', bg: 'bg-red-50 hover:bg-red-100', border: 'border-red-200', text: 'text-red-700' },
  AMBULANCE: { label: 'Ambulance', icon: '🚑', bg: 'bg-emerald-50 hover:bg-emerald-100', border: 'border-emerald-200', text: 'text-emerald-700' },
  POLICE: { label: 'Police', icon: '🚓', bg: 'bg-blue-50 hover:bg-blue-100', border: 'border-blue-200', text: 'text-blue-700' },
  BOAT: { label: 'Rescue Boat', icon: '🚤', bg: 'bg-cyan-50 hover:bg-cyan-100', border: 'border-cyan-200', text: 'text-cyan-700' },
  NDRF: { label: 'NDRF Team', icon: '🚁', bg: 'bg-orange-50 hover:bg-orange-100', border: 'border-orange-200', text: 'text-orange-700' }
};

const ResourceSelectionPage = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleCardClick = (type: ResourceType) => {
    // Convert "FIRE_TRUCK" to "fire_truck" for cleaner URLs
    const urlSafeType = type.toLowerCase();
    
    // Append the selected type to the current URL path
    router.push(`${pathname}/${urlSafeType}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        <h1 className="text-2xl font-bold mb-8 text-gray-900 border-b pb-4">
          Select Resource Category
        </h1>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {(Object.keys(RESOURCE_CONFIG) as ResourceType[]).map((type) => {
            const config = RESOURCE_CONFIG[type];
            
            return (
              <button
                key={type}
                onClick={() => handleCardClick(type)}
                className={`flex flex-col items-center justify-center p-6 border rounded-xl transition-all duration-200 transform hover:-translate-y-1 hover:shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${config.text.split('-')[1]}-500 ${config.bg} ${config.border}`}
              >
                <span className="text-4xl mb-3 drop-shadow-sm">{config.icon}</span>
                <span className={`font-bold text-sm tracking-wide ${config.text}`}>
                  {config.label}
                </span>
              </button>
            );
          })}
        </div>
        
      </div>
    </div>
  );
};

export default ResourceSelectionPage;