// app/components/Maps.tsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import StoreLocation from './StoreLocation';
import StoreDetail from './StoreDetail';
import { FaMap, FaSatellite, FaStreetView, FaCompass, FaTimes, FaExpand, FaCompress } from "react-icons/fa";

const Maps = () => {
  const [target, setTarget] = useState<[number, number] | undefined>(undefined);
  const [isInView, setIsInView] = useState(false);
  const [mapStyle, setMapStyle] = useState<'street' | 'satellite' | 'terrain'>('street');
  const [showStreetView, setShowStreetView] = useState(false);
  const [streetViewMode, setStreetViewMode] = useState<'split' | 'full'>('split');
  const sectionRef = useRef<HTMLElement>(null);

  // Store coordinates
  const storeCoords = {
    lat: 14.428425252312016,
    lng: 120.98849405250161
  };

  // Auto-detect when section comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        
        if (entry.isIntersecting) {
          flyToStore();
        }
      },
      {
        threshold: 0.3,
        rootMargin: '0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const flyToStore = () => {
    setTarget([storeCoords.lat, storeCoords.lng]);
  };

  const handleDirectionClick = () => {
    console.log("Directions clicked - flying to store");
    flyToStore();
  };

  const handleStreetViewClick = () => {
    setShowStreetView(!showStreetView);
  };

  const toggleStreetViewMode = () => {
    setStreetViewMode(streetViewMode === 'split' ? 'full' : 'split');
  };
  const closeStreetView = () => {
    setShowStreetView(false);
    setStreetViewMode('split');
  };
  const handleMapStyleChange = (style: 'street' | 'satellite' | 'terrain') => {
    setMapStyle(style);
  };
  // Map style configurations
  const mapStyles = {
    street: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    terrain: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
  };

  // Direct Google Street View URL (no API key needed for this approach)
  const streetViewUrl = `https://www.google.com/maps/embed?pb=!4v${Date.now()}!6m8!1m7!1s${storeCoords.lat},${storeCoords.lng}!2m2!1d${storeCoords.lat}!2d${storeCoords.lng}!3f0!4f0!5f0.7820865974627469`;

  return (
    <section 
      id='maps' 
      ref={sectionRef}
      className='min-h-screen w-full z-0 relative bg-white overflow-hidden'
    >
      {/* Store Details Card */}
      <div className={`rounded-lg p-4 h-auto absolute top-1/2 -translate-y-1/2 left-1 lg:left-5 z-[99999] bg-black/90 backdrop-blur-sm transition-all duration-300  md:block ${
        showStreetView && streetViewMode === 'split' ? 'sm:w-[280px] md:w-[320px]' : 'sm:w-[300px] md:w-[350px] lg:w-[400px]'
      }`}>
        <StoreDetail onDirectionClick={handleDirectionClick} />
      </div>

      {/* Map Style Controls */}
      <div className='absolute top-4 flex-row right-4 z-[999] flex  gap-2 bg-black/80 backdrop-blur-sm rounded-lg p-2'>
        <button
          onClick={() => handleMapStyleChange('street')}
          className={`p-2 rounded flex items-center gap-2 transition-colors ${
            mapStyle === 'street' ? 'bg-pink-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
          title="Street Map"
        >
          <FaMap className="text-sm" />
        </button>
        <button
          onClick={() => handleMapStyleChange('satellite')}
          className={`p-2 rounded flex items-center gap-2 transition-colors ${
            mapStyle === 'satellite' ? 'bg-pink-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
          title="Satellite View"
        >
          <FaSatellite className="text-sm" />
        </button>
        <button
          onClick={() => handleMapStyleChange('terrain')}
          className={`p-2 rounded flex items-center gap-2 transition-colors ${
            mapStyle === 'terrain' ? 'bg-pink-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
          title="Terrain View"
        >
          <FaCompass className="text-sm" />
        </button>
      </div>

      {/* Street View Controls */}
      <div className='absolute bottom-4 right-4 z-[999] flex flex-row gap-2'>
        <button
          onClick={handleStreetViewClick}
          className={`p-3 rounded-full flex items-center gap-2 transition-colors ${
            showStreetView ? 'bg-pink-500 text-white' : 'bg-black/80 text-white hover:bg-pink-500'
          }`}
          title={showStreetView ? "Hide Street View" : "Show Street View"}
        >
          <FaStreetView className="text-lg" />
          <span className="text-sm hidden sm:block">
            {showStreetView ? 'Hide Street' : 'Street View'}
          </span>
        </button>
        
        {showStreetView && (
          <button
            onClick={toggleStreetViewMode}
            className='bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-colors'
            title={streetViewMode === 'split' ? 'Full Screen Street View' : 'Split View'}
          >
            {streetViewMode === 'split' ? <FaExpand className="text-lg" /> : <FaCompress className="text-lg" />}
          </button>
        )}
        
        <button
          onClick={flyToStore}
          className='bg-black/80 text-white p-3 rounded-full hover:bg-blue-500 transition-colors'
          title="Back to Store"
        >
          <FaCompass className="text-lg" />
        </button>
      </div>
      
      {/* Main Content Area - Split between Map and Street View */}
      <div className={`flex h-screen w-full transition-all duration-500 ${
        showStreetView 
          ? streetViewMode === 'split' 
            ? 'flex-col md:flex-row' 
            : 'flex-col'
          : 'flex'
      }`}>
        
        {/* Regular Map */}
        <div className={`transition-all duration-500 ${
          showStreetView
            ? streetViewMode === 'split'
              ? 'h-1/2 md:h-full md:w-1/2'
              : 'h-0 md:h-0 md:w-0'
            : 'h-full w-full'
        }`}>
          <StoreLocation target={target} mapStyle={mapStyles[mapStyle]} />
        </div>

        {/* Street View */}
        {showStreetView && (
          <div className={`transition-all duration-500 relative ${
            streetViewMode === 'split'
              ? 'h-1/2 md:h-full md:w-1/2'
              : 'h-full w-full'
          }`}>
            {/* Street View Header */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-black/80 text-white p-3 flex justify-between items-center">
            
              
            </div>

            {/* Street View Content */}
            <div className="h-full w-full pt-12">
              <iframe
                src={streetViewUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Street View - Burnbox Printing"
                className="bg-gray-200"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Maps;