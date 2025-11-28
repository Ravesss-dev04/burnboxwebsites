"use client"

import { BarChart as BarChartIcon, Mail, Users, Trash2, Eye, Image as ImageIcon, MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react'
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface DashboardDarkMod {
   darkMode?: boolean
}

interface Inquiry {
  id: number;
  name: string;
  email: string;
  product: string;
  price: string;
  message: string;
  imageUrl?: string;
  status: string;
  createdAt: string;
}


interface Visitors {
  id: number;
  ipAddress: string;
  location: string;
  city?: string | null;
  status: string;
  latitude?: number | null;
  longitude?: number | null;
  createdAt: string;
  updatedAt: string;
}


const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

let L: any;
if (typeof window !== "undefined") {
  // dynamically import leaflet only in browser
  import("leaflet").then((leaflet) => {
    L = leaflet.default;
  });
}



const DashboardContent = ({darkMode = false}: DashboardDarkMod) => {
 
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [visitors, setVisitors] = useState<Visitors[]>([]);
  const [visitorsLoading, setVisitorsLoading] = useState(true);

  // Calculate product data for chart from actual inquiries
  const productData = inquiries.reduce((acc, inquiry) => {
    const existing = acc.find(item => item.name === inquiry.product);
    if (existing) {
      existing.inquiries++;
    } else {
      acc.push({ name: inquiry.product, inquiries: 1 });
    }
    return acc;
  }, [] as { name: string; inquiries: number }[]);

  // Calculate top product
  const topProduct = productData.length > 0 
    ? productData.reduce((prev, current) => 
        (prev.inquiries > current.inquiries) ? prev : current
      ).name 
    : 'No inquiries';

  // Fetch inquiries from API
  const fetchInquiries = async () => {
    try {
      const res = await fetch('/api/inquiries');
      const data = await res.json();
      setInquiries(data);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch visitors from API
  const fetchVisitors = async () => {
    try {
      const res = await fetch('/api/visitors');
      if (res.ok) {
        const data = await res.json();
        setVisitors(data);
      }
    } catch (error) {
      console.error('Error fetching visitors:', error);
    } finally {
      setVisitorsLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
    fetchVisitors();
    
    // Poll for new visitors every 10 seconds (real-time updates)
    const visitorsInterval = setInterval(() => {
      fetchVisitors();
    }, 10000);
    
    return () => clearInterval(visitorsInterval);
  }, []);
  // simple map component using SVG
 const SimpleWorldMap = () => {
  // Filter visitors with valid coordinates and active status
  const mapPoints = visitors.filter(v => {
    const hasCoords = v.latitude !== null && v.longitude !== null && 
                      !isNaN(v.latitude!) && !isNaN(v.longitude!) &&
                      v.latitude! >= -90 && v.latitude! <= 90 &&
                      v.longitude! >= -180 && v.longitude! <= 180;
    return hasCoords && v.status === "Active";
  });

  // pink dot icon for visitors
  let pinkIcon: any = null;
  if (typeof window !== "undefined" && L) {
    pinkIcon = L.divIcon({
      html: `<div style="background:#ec4899;width:12px;height:12px;border-radius:50%;border:2px solid white;box-shadow:0 0 5px #ec4899;"></div>`,
      className: "",
      iconSize: [12, 12],
    });
  }

  if (!L || typeof window === "undefined") {
    return (
      <div className={`relative w-full h-64 rounded-lg overflow-hidden z-10 flex items-center justify-center ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          {visitorsLoading ? "Loading map..." : "Initializing map..."}
        </p>
      </div>
    );
  }

  if (mapPoints.length === 0) {
    return (
      <div className={`relative w-full h-64 rounded-lg overflow-hidden z-10 flex items-center justify-center ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
        <div className="text-center">
          <p className={`text-sm mb-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            No visitor locations available
          </p>
          <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
            {visitors.length > 0 
              ? `${visitors.length} visitor(s) tracked, but no location data yet`
              : "No visitors tracked yet"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-64 rounded-lg overflow-hidden z-10">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
        attributionControl={false}
        className={darkMode ? "bg-gray-900" : "bg-gray-100"}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url={
            darkMode
              ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
        />
        {mapPoints.map((v) => (
          <Marker
            key={v.id}
            position={[v.latitude!, v.longitude!]}
            icon={pinkIcon}
          >
            <Popup>
              <strong>{v.location}</strong>
              {v.city && <><br />City: {v.city}</>}
              <br />
              IP: {v.ipAddress}
              <br />
              Status: {v.status}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend */}
      <div
        className={`absolute top-2 right-2 p-2 rounded-lg ${
          darkMode ? "bg-gray-800/80" : "bg-white/80"
        }`}
      >
        <div className="relative flex items-center space-x-2 z-9999999">
          <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
          <span
            className={`text-xs font-medium${
              darkMode ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Active Visitors ({mapPoints.length})
          </span>
        </div>
      </div>
    </div>
  );
};

const EnhancedMapCard = () => {
  return (
    <div
      className={`shadow-md rounded-2xl p-5 ${
        darkMode ? "bg-gray-900 shadow-white/10" : "bg-white"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3
          className={`text-[20px] font-bold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Visitor Locations
        </h3>
        <MapPin
          size={20}
          className={darkMode ? "text-pink-400" : "text-pink-500"}
        />
      </div>

      <div className="mb-4">
        <SimpleWorldMap />
      </div>

      <div
        className={`text-sm ${
          darkMode ? "text-gray-300" : "text-gray-600"
        } flex justify-between items-center`}
      >
        <span>Total locations tracked:</span>
        <span className="font-semibold text-pink-500">
          {visitors.filter(v => v.latitude && v.longitude && v.status === "Active").length}
        </span>
      </div>
    </div>
  );
};


  // Delete inquiry
  const deleteInquiry = async (id: number) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;

    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setInquiries(inquiries.filter(inq => inq.id !== id));
        if (selectedInquiry?.id === id) {
          setSelectedInquiry(null);
        }
      } else {
        throw new Error('Failed to delete inquiry');
      }
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      alert('Failed to delete inquiry');
    }
  };

  // Update inquiry status
  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setInquiries(inquiries.map(inq => 
          inq.id === id ? { ...inq, status } : inq
        ));
        if (selectedInquiry?.id === id) {
          setSelectedInquiry({ ...selectedInquiry, status });
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };
  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }
  return (
    <div className="relative w-full h-full overflow-x-hidden">
      <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>Dashboard</h2>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 pb-15'>
        {/* cards */}
       
        <div className={`shadow-md rounded-xl p-6 flex items-center justify-between ${darkMode ? "bg-gray-900 shadow-white/10" : "bg-white"}`}>
         <div>
           <h3 className='text-2xl font-semibold text-gray-white'>Total Inquiries</h3> 
           <p className={`text-3xl font-bold ${darkMode ? "text-pink" : "text-black"}`}>{inquiries.length}</p>
           </div>
           <Mail size={35} className={`${darkMode ? "text-pink" : "text-black"}`}/>
        </div>
       <div className={`shadow-md rounded-xl p-6 flex justify-between ${darkMode ? "bg-gray-900 shadow-white/10" : "bg-white"}`}>
            <div>
               <h3 className={`text-2xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Active Visitors</h3>
               <p className={`text-3xl font-bold ${darkMode ? " text-pink-500" : "text-gray-900"}`}>
                 {visitorsLoading ? "..." : visitors.filter(v => v.status === "Active").length}
               </p>
            </div>
            <Users size={35} className={`${darkMode ? "text-pink-400": "text-gray-900"}`}/>
         </div>  
      <div className={` shadow-md rounded-xl p-6 flex items-center justify-between ${darkMode ? "bg-gray-900 shadow-white/10" : "bg-white"}`}>

         <div>
            <h3 className={`text-2xl font-semibold ${darkMode ? "text-white " : "text-gray-900"}`}>Top Products</h3>
            <p className={`text-xl font-bold ${darkMode ? " text-pink-500" : "text-gray-900"}`}>{topProduct}</p>
         </div>
         <BarChartIcon size={32} className={`${darkMode ? "text-pink-400" : "text-gray-900"}`}/>
      </div>
   </div>

   {/* Middle Section: Inquiries + chart */}
   <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
      {/* Recent Inquiries Table */}
      <div className={`shadow-md rounded-2xl p-5 ${darkMode ? "bg-gray-900 shadow-white/10" : "bg-white"}`}>
         <h3 className={`text-[25px] font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>Recent Inquiries</h3>
         
         {inquiries.length === 0 ? (
            <p className={`text-center py-8 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
               No inquiries yet
            </p>
         ) : (
            <div className="overflow-x-auto">
               <table className="w-full ">
                  <thead className={`${darkMode ? "bg-gray-700" : "bg-gray-700"}`}>
                     <tr className={`border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                        <th className={`text-left py-3 px-4 font-semibold ${darkMode ? "text-gray-300" : "text-white"}`}>Name</th>
                        <th className={`text-left py-3 px-4 font-semibold ${darkMode ? "text-gray-300" : "text-white"}`}>Email</th>
                        <th className={`text-left py-3 px-4 font-semibold ${darkMode ? "text-gray-300" : "text-white"}`}>Product</th>
                        <th className={`text-left py-3 px-4 font-semibold ${darkMode ? "text-gray-300" : "text-white"}`}>Price</th>
                        <th className={`text-left py-3 px-4 font-semibold ${darkMode ? "text-gray-300" : "text-white"}`}>Message</th>
                        <th className={`text-left py-3 px-4 font-semibold ${darkMode ? "text-gray-300" : "text-white"}`}>Image</th>
                        <th className={`text-left py-3 px-4 font-semibold ${darkMode ? "text-gray-300" : "text-white"}`}>Action</th>
                     </tr>
                  </thead>
                  <tbody>
                     {inquiries.slice(0, 5).map((inquiry) => (
                        <tr key={inquiry.id} className={`border-b ${darkMode ? "border-gray-700 hover:bg-gray-800" : "border-gray-200 hover:bg-gray-50"}`}>
                           <td className="py-3 px-4">
                              <div>
                                 <p className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>{inquiry.name}</p>
                                 <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                                    {new Date(inquiry.createdAt).toLocaleDateString()}
                                 </p>
                              </div>
                           </td>
                           <td className="py-3 px-4">
                              <p className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>{inquiry.email}</p>
                           </td>
                           <td className="py-3 px-4">
                              <p className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>{inquiry.product}</p>
                           </td>
                           <td className="py-3 px-4">
                              <p className={`font-medium ${darkMode ? "text-green-400" : "text-green-600"}`}>{inquiry.price}</p>
                           </td>
                           <td className="py-3 px-4 max-w-xs">
                              <p className={`text-sm truncate ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                 {inquiry.message}
                              </p>
                           </td>
                           <td className="py-3 px-4">
                              {inquiry.imageUrl ? (
                                 <div className="flex items-center justify-center">
                                    <img 
                                       src={inquiry.imageUrl} 
                                       alt="Sample layout" 
                                       className="w-12 h-12 object-cover rounded border"
                                    />
                                 </div>
                              ) : (
                                 <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>No Image</span>
                              )}
                           </td>
                           <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                 <button
                                    onClick={() => setSelectedInquiry(inquiry)}
                                    className={`p-2 rounded ${
                                       darkMode 
                                         ? "text-blue-400 hover:text-blue-300 hover:bg-gray-700" 
                                         : "text-blue-600 hover:text-blue-800 hover:bg-gray-100"
                                    }`}
                                    title="View Details"
                                 >
                                    <Eye size={16} />
                                 </button>
                                 <button
                                    onClick={() => deleteInquiry(inquiry.id)}
                                    className={`p-2 rounded ${
                                       darkMode 
                                         ? "text-red-400 hover:text-red-300 hover:bg-gray-700" 
                                         : "text-red-600 hover:text-red-800 hover:bg-gray-100"
                                    }`}
                                    title="Delete"
                                 >
                                    <Trash2 size={16} />
                                 </button>
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         )}
      </div>

      {/* Product Interest Chart - Now using real data */}
      <div className={`shadow-md p-5 rounded-2xl ${darkMode ? "bg-gray-900 shadow-white/10" : "bg-white "}`}>
            <h3 className='text-[25px] font-bold mb-4'>Product Interest</h3>
            {productData.length > 0 ? (
               <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={productData}>
                     <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
                     <XAxis 
                        dataKey="name" 
                        stroke={darkMode ? '#f472b6' : '#ec4899'} 
                        fontSize={12}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                     />
                     <YAxis stroke={darkMode ? '#f472b6' : '#ec4899'} fontSize={12} />
                     <Tooltip 
                        contentStyle={darkMode ? 
                           { backgroundColor: '#1f2937', borderColor: '#374151', color: 'white' } : 
                           { backgroundColor: 'white', borderColor: '#e5e7eb' }
                        }
                     />
                     <Bar 
                        dataKey="inquiries" 
                        fill={darkMode ? "#ec4899" : "#f472b6"} 
                        radius={[10, 10, 0, 0]} 
                        name="Inquiries"
                     />
                  </BarChart>
               </ResponsiveContainer>
            ) : (
               <div className="h-64 flex items-center justify-center">
                  <p className={`text-center ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                     No product data available yet
                  </p>
               </div>
            )}
      </div>
   </div>
   {/* visitors tracking table */}
            
           <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
        {/* Map Card */}
        <EnhancedMapCard />

        {/* Visitors tracking table */}
        <div className={`shadow-md rounded-2xl p-5 ${darkMode ? "bg-gray-900 shadow-white/10 text-white " : "bg-white text text-black"}`}>
          <h3 className='text-[20px] font-bold mb-4'>Who's Connected</h3>
          {visitorsLoading ? (
            <div className="text-center py-8">
              <p className={darkMode ? "text-gray-400" : "text-gray-600"}>Loading visitors...</p>
            </div>
          ) : visitors.length === 0 ? (
            <div className="text-center py-8">
              <p className={darkMode ? "text-gray-400" : "text-gray-600"}>No visitors tracked yet</p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full text-left border-collapse'>
                <thead>
                  <tr className='text-pink-400 border-b border-gray-700'>
                    <th className='pb-2 px-4'>IP Address</th>
                    <th className='pb-2 px-4'>Location</th>
                    <th className='pb-2 px-4'>City</th>
                    <th className='pb-2 px-4'>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {visitors.slice(0, 10).map((v) => (
                    <tr
                      key={v.id}
                      className='border-b border-gray-700 hover:bg-gray-800/50'
                    >
                      <td className='py-3 px-4 text-sm'>{v.ipAddress}</td>
                      <td className='py-3 px-4'>{v.location}</td>
                      <td className='py-3 px-4'>{v.city || "N/A"}</td>
                      <td className='py-3 px-4'>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          v.status === 'Active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                          {v.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {visitors.length > 10 && (
                <p className={`text-xs mt-2 text-center ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Showing 10 of {visitors.length} visitors
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* map */}

    
      {/* Inquiry Details Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                Inquiry Details
              </h3>
              <button
                onClick={() => setSelectedInquiry(null)}
                className={`p-2 rounded-full ${
                  darkMode ? "text-gray-400 hover:text-white hover:bg-gray-700" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Name</label>
                  <p className={`mt-1 p-3 rounded-lg ${darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"}`}>
                    {selectedInquiry.name}
                  </p>
                </div>

                <div>
                  <label className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Email</label>
                  <p className={`mt-1 p-3 rounded-lg ${darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"}`}>
                    {selectedInquiry.email}
                  </p>
                </div>
                <div>
                  <label className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Product</label>
                  <p className={`mt-1 p-3 rounded-lg ${darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"}`}>
                    {selectedInquiry.product}
                  </p>
                </div>

                <div>
                  <label className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Price</label>
                  <p className={`mt-1 p-3 rounded-lg ${darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"}`}>
                    {selectedInquiry.price}
                  </p>
                </div>

                <div>
                  <label className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Status</label>
                  <select
                    value={selectedInquiry.status}
                    onChange={(e) => updateStatus(selectedInquiry.id, e.target.value)}
                    className={`mt-1 w-full p-3 rounded-lg border ${
                      darkMode 
                        ? "bg-gray-700 border-gray-600 text-white" 
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Message</label>
                  <p className={`mt-1 p-3 rounded-lg min-h-[120px] ${
                    darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"
                  }`}>
                    {selectedInquiry.message}
                  </p>
                </div>

                {selectedInquiry.imageUrl && (
                  <div>
                    <label className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Sample Layout</label>
                    <div className="mt-2 border rounded-lg overflow-hidden">
                      <img
                        src={selectedInquiry.imageUrl}
                        alt="Sample layout"
                        className="w-full h-64 object-contain bg-gray-100"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-700">
              <button
                onClick={() => deleteInquiry(selectedInquiry.id)}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 flex items-center space-x-2"
              >
                <Trash2 size={16} />
                <span>Delete Inquiry</span>
              </button>
            </div>
          </div>
        </div>
      )}
   </div>
  )
}

export default DashboardContent