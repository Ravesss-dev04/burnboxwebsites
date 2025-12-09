"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';


export default function VisitorTracker() {
  const pathname = usePathname();
  useEffect(() => {
    const trackVisit = async () => {
      try {
        // Get current page path for better tracking
        const currentPath = pathname || window.location.pathname;
        // Call the API to track this visitor
        const response = await fetch('/api/visitors', {
          method: 'POST',
          headers: {  
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            trackVisit: true, // Flag to indicate this is a page visit, not an inquiry
            pagePath: currentPath // Track which page was visited
          }),
        });
        if (response.ok) {
          const data = await response.json();
          // Only log in development to avoid cluttering production logs
          if (process.env.NODE_ENV === 'development') {
            console.log('Visitor tracked successfully:', {
              ip: data.ipAddress,
              location: data.location,
              city: data.city,
              page: currentPath
            });
          }
        }
      } catch (error) {
    
        if (process.env.NODE_ENV === 'development') {
          console.error('Error tracking visitor:', error);
        }
      }
    };
    // Small delay to ensure page is fully loaded and IP detection works
    const timeout = setTimeout(trackVisit, 500);
    return () => clearTimeout(timeout);
  }, [pathname]); // Re-run when pathname changes (route navigation)
  return null; // This component doesn't render anything
}

