import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all visitors
export async function GET(req: NextRequest) {
  try {
    const visitors = await (prisma as any).visitor.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100 // Limit to most recent 100 visitors
    });
    
    return NextResponse.json(visitors);
  } catch (error: any) {
    console.error("Error fetching visitors:", error);
    return NextResponse.json(
      { error: "Failed to fetch visitors" },
      { status: 500 }
    );
  }
}

// POST - Track a new visitor (called when inquiry is submitted or page visited)
export async function POST(req: NextRequest) {
  try {
    const { ipAddress, inquiryId, trackVisit, pagePath } = await req.json();
    
    // Get IP from request if not provided (for page visits)
    // Try multiple headers in order of reliability
    let clientIp = ipAddress;
    if (!clientIp) {
      const forwardedFor = req.headers.get('x-forwarded-for');
      const realIp = req.headers.get('x-real-ip');
      const cfConnectingIp = req.headers.get('cf-connecting-ip'); // Cloudflare
      const xClientIp = req.headers.get('x-client-ip');
      const trueClientIp = req.headers.get('true-client-ip');
      
      // Extract first IP from x-forwarded-for (can contain multiple IPs)
      const firstForwardedIp = forwardedFor?.split(',')[0]?.trim();
      
      clientIp = firstForwardedIp || 
                 cfConnectingIp || 
                 realIp || 
                 xClientIp || 
                 trueClientIp || 
                 'unknown';
    }
    
    // Clean up IP address (remove port if present, handle IPv6)
    if (clientIp && clientIp !== 'unknown') {
      // Remove port number if present (e.g., "192.168.1.1:8080" -> "192.168.1.1")
      clientIp = clientIp.split(':')[0];
      // Remove brackets from IPv6 (e.g., "[::1]" -> "::1")
      clientIp = clientIp.replace(/^\[|\]$/g, '');
    }
    
    // Skip localhost IPs in production - they are not real visitors
    const isLocalhost = clientIp === '::1' || 
                       clientIp === '127.0.0.1' || 
                       clientIp === 'localhost' || 
                       clientIp?.startsWith('192.168.') ||
                       clientIp?.startsWith('10.') ||
                       clientIp?.startsWith('172.16.') ||
                       clientIp === 'unknown';
    
    if (isLocalhost && process.env.NODE_ENV === 'production') {
      // In production, skip tracking localhost/internal IPs
      console.log('Skipping localhost/internal IP tracking in production:', clientIp);
      return NextResponse.json({ 
        message: 'Localhost IP skipped in production',
        skipped: true 
      });
    }
    
    // For development, use a test IP for geolocation lookup
    const geoLookupIp = (isLocalhost && process.env.NODE_ENV === 'development') 
      ? '8.8.8.8' // Use Google DNS for testing in development
      : clientIp;

    // Check if visitor with this IP already exists (within last 24 hours)
    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);
    
    const existingVisitor = await (prisma as any).visitor.findFirst({
      where: {
        ipAddress: clientIp,
        createdAt: {
          gte: oneDayAgo
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Get location from IP address with multiple fallback APIs
    let location = "Unknown";
    let city = null;
    let latitude = null;
    let longitude = null;

    // For localhost in development, use a test location
    if (isLocalhost && process.env.NODE_ENV === 'development') {
      location = "United States, California";
      city = "Mountain View";
      latitude = 37.4056;
      longitude = -122.0775;
    } else if (!isLocalhost || process.env.NODE_ENV === 'production') {
      // Try multiple geolocation APIs for better reliability and accuracy
      // Order matters - most accurate/reliable first
      // We'll try multiple APIs and cross-reference results for accuracy
      const geoApis = [
        {
          name: 'ip-api.com',
          url: `http://ip-api.com/json/${geoLookupIp}?fields=status,message,country,regionName,city,lat,lon,countryCode,timezone,isp,org,as`,
          parser: (data: any) => {
            if (data.status === 'fail' || data.message) return null;
            // Check if this is a cloud provider/datacenter IP
            const isp = (data.isp || '').toLowerCase();
            const org = (data.org || '').toLowerCase();
            const isCloudProvider = isp.includes('amazon') || isp.includes('aws') || 
                                  isp.includes('google') || isp.includes('microsoft') ||
                                  isp.includes('azure') || isp.includes('cloud') ||
                                  org.includes('amazon') || org.includes('aws') ||
                                  org.includes('google') || org.includes('microsoft');
            
            const country = data.country || '';
            const region = data.regionName || '';
            
            return {
              location: country ? 
                (region ? `${country}, ${region}` : country) : 
                "Unknown",
              city: data.city || null,
              latitude: data.lat || null,
              longitude: data.lon || null,
              country: country,
              region: region,
              isp: data.isp || null,
              isCloudProvider: isCloudProvider
            };
          }
        },
        {
          name: 'ipapi.co',
          url: `https://ipapi.co/${geoLookupIp}/json/`,
          parser: (data: any) => {
            if (data.error || data.reserved) return null;
            const country = data.country_name || data.country || '';
            const region = data.region || data.region_code || '';
            const state = data.region || '';
            
            return {
              location: country ? 
                (state ? `${country}, ${state}` : country) : 
                "Unknown",
              city: data.city || null,
              latitude: data.latitude || null,
              longitude: data.longitude || null,
              country: country,
              region: state,
              isp: data.org || null,
              isCloudProvider: false
            };
          }
        },
        {
          name: 'ip-api.com (https)',
          url: `https://ip-api.com/json/${geoLookupIp}?fields=status,message,country,regionName,city,lat,lon,isp,org`,
          parser: (data: any) => {
            if (data.status === 'fail' || data.message) return null;
            const isp = (data.isp || '').toLowerCase();
            const org = (data.org || '').toLowerCase();
            const isCloudProvider = isp.includes('amazon') || isp.includes('aws') || 
                                  isp.includes('google') || isp.includes('microsoft') ||
                                  isp.includes('azure') || isp.includes('cloud') ||
                                  org.includes('amazon') || org.includes('aws') ||
                                  org.includes('google') || org.includes('microsoft');
            
            const country = data.country || '';
            const region = data.regionName || '';
            
            return {
              location: country ? 
                (region ? `${country}, ${region}` : country) : 
                "Unknown",
              city: data.city || null,
              latitude: data.lat || null,
              longitude: data.lon || null,
              country: country,
              region: region,
              isp: data.isp || null,
              isCloudProvider: isCloudProvider
            };
          }
        },
        {
          name: 'ipwho.is',
          url: `http://ipwho.is/${geoLookupIp}`,
          parser: (data: any) => {
            if (data.success === false) return null;
            const country = data.country || '';
            const region = data.region || data.region_code || '';
            
            return {
              location: country ? 
                (region ? `${country}, ${region}` : country) : 
                "Unknown",
              city: data.city || null,
              latitude: data.latitude || null,
              longitude: data.longitude || null,
              country: country,
              region: region,
              isp: data.connection?.isp || null,
              isCloudProvider: false
            };
          }
        }
      ];
      
      // Store results from multiple APIs for cross-validation
      const apiResults: any[] = [];

      // Try each API and collect results for cross-validation
      for (const api of geoApis) {
        try {
          // Create timeout controller
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 8000); // Increased timeout
          
          const geoResponse = await fetch(api.url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept': 'application/json',
              'Accept-Language': 'en-US,en;q=0.9'
            },
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          if (geoResponse.ok) {
            const geoData = await geoResponse.json();
            const parsed = api.parser(geoData);
            
            // Validate parsed data
            if (parsed && parsed.location && parsed.location !== "Unknown") {
              // Validate coordinates
              if (parsed.latitude && parsed.longitude) {
                const lat = parseFloat(parsed.latitude);
                const lon = parseFloat(parsed.longitude);
                
                // Check if coordinates are valid
                if (!isNaN(lat) && !isNaN(lon) && 
                    lat >= -90 && lat <= 90 && 
                    lon >= -180 && lon <= 180) {
                  apiResults.push({
                    ...parsed,
                    apiName: api.name,
                    latitude: lat,
                    longitude: lon
                  });
                }
              } else if (parsed.location && parsed.location !== "Unknown") {
                // Store even without coordinates for cross-validation
                apiResults.push({
                  ...parsed,
                  apiName: api.name
                });
              }
            }
          }
        } catch (geoError) {
          // Only log in development
          if (process.env.NODE_ENV === 'development') {
            console.error(`Error with ${api.name}:`, geoError);
          }
          continue; // Try next API
        }
      }
      
      // Cross-validate results from multiple APIs
      if (apiResults.length > 0) {
        // Prefer results that are NOT from cloud providers
        const nonCloudResults = apiResults.filter(r => !r.isCloudProvider);
        const resultsToUse = nonCloudResults.length > 0 ? nonCloudResults : apiResults;
        
        // Group by country to find consensus
        const countryCounts: { [key: string]: any[] } = {};
        resultsToUse.forEach(result => {
          const country = result.country || 'Unknown';
          if (!countryCounts[country]) {
            countryCounts[country] = [];
          }
          countryCounts[country].push(result);
        });
        
        // Find the most common country (consensus)
        let bestResult = null;
        let maxCount = 0;
        for (const country in countryCounts) {
          if (countryCounts[country].length > maxCount && country !== 'Unknown') {
            maxCount = countryCounts[country].length;
            bestResult = countryCounts[country][0]; // Use first result from most common country
          }
        }
        
        // If no consensus, use first non-cloud result, or first result
        if (!bestResult) {
          bestResult = resultsToUse[0] || apiResults[0];
        }
        
        if (bestResult) {
          location = bestResult.location;
          city = bestResult.city || null;
          latitude = bestResult.latitude || null;
          longitude = bestResult.longitude || null;
          
          if (process.env.NODE_ENV === 'development') {
            console.log(`Location determined from ${bestResult.apiName}:`, { 
              location, 
              city, 
              latitude, 
              longitude,
              isCloudProvider: bestResult.isCloudProvider,
              consensus: maxCount > 1 ? `${maxCount} APIs agree` : 'single result'
            });
          }
        }
      }
      
      // If still unknown, log for debugging
      if (location === "Unknown") {
        console.warn(`Could not determine location for IP: ${geoLookupIp}`);
      }
    }

    // If visitor exists and is recent, update it with latest location and status
    if (existingVisitor) {
      // Always update status to Active when visitor visits (even if just browsing)
      const updated = await (prisma as any).visitor.update({
        where: { id: existingVisitor.id },
        data: {
          status: "Active", // Mark as active on any visit
          inquiryId: inquiryId || existingVisitor.inquiryId, // Only update if inquiryId provided
          // Update location if we got better data
          location: location !== "Unknown" ? location : existingVisitor.location,
          city: city || existingVisitor.city,
          latitude: latitude !== null ? latitude : existingVisitor.latitude,
          longitude: longitude !== null ? longitude : existingVisitor.longitude,
          updatedAt: new Date()
        }
      });
      
      // Log successful tracking in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`Updated existing visitor: ${clientIp} - ${location}, ${city} (Page: ${pagePath || 'N/A'})`);
      }
      
      return NextResponse.json(updated);
    }

    // Create new visitor record
    const visitor = await (prisma as any).visitor.create({
      data: {
        ipAddress: clientIp,
        location,
        city,
        latitude,
        longitude,
        status: "Active", // All visitors are marked as Active
        inquiryId: inquiryId || null // Only set if this is from an inquiry submission
      }
    });

    // Log successful tracking in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Created new visitor: ${clientIp} - ${location}, ${city} (Page: ${pagePath || 'N/A'})`);
    }

    return NextResponse.json(visitor);
  } catch (error: any) {
    console.error("Error creating visitor:", error);
    return NextResponse.json(
      { error: "Failed to track visitor" },
      { status: 500 }
    );
  }
}

