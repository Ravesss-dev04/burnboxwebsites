"use client";

import { useEffect } from 'react';

/**
 * Client-side component to track all page visits
 * This runs on every page load to track visitors
 */
export default function VisitorTracker() {
  useEffect(() => {
    // Track visitor on page load
    const trackVisit = async () => {
      try {
        // Call the API to track this visitor
        await fetch('/api/visitors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            trackVisit: true // Flag to indicate this is a page visit, not an inquiry
          }),
        });
      } catch (error) {
        // Silently fail - don't interrupt user experience
        console.error('Error tracking visitor:', error);
      }
    };

    // Small delay to ensure page is loaded
    const timeout = setTimeout(trackVisit, 1000);
    
    return () => clearTimeout(timeout);
  }, []);

  return null; // This component doesn't render anything
}


