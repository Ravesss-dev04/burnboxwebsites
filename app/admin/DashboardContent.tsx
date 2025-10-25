"use client"
import { BarChart as BarChartIcon, Mail, Users } from 'lucide-react';
import React, { useState } from 'react'
import { BarChart, Bar, ResponsiveContainer, XAxis } from 'recharts';

const DashboardContent = () => {
    const [inquiries] = useState([
    { name: "John Doe", product: "Decal Sticker cut-out", date: "Oct 25, 2025", status: "New" },
    { name: "Jane Smith", product: "Tarp Printing", date: "Oct 24, 2025", status: "Contacted" },
  ]);

  const [visitors] = useState([
    { ip: "203.177.xxx.xxx", location: "Philippines", status: "Active" },
    { ip: "110.92.xxx.xxx", location: "Singapore", status: "Active" },
  ]);

  const [productData] = useState([
    { name: "Decal Sticker", inquiries: 25 },
    { name: "Tarp Printing", inquiries: 18 },
    { name: "Vinyl Sticker", inquiries: 12 },
  ]);


  return (
    <div>
            <h2 className='text-2xl font-semibold mb-4 text-gray-800'>Dashboard</h2>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 pb-15'>
              {/* cards */}
             
              <div className='bg-white shadow-md rounded-xl p-6 flex items-center justify-between'>


               <div>
                 <h3 className='text-3xl font-semibold text-gray-700'>Total Inquiries</h3> 
                 <p className='text-3xl font-bold'>{inquiries.length}</p>
                 </div>
                 <Mail size={35} className='text-pink-400'/>
              </div>
           
             <div className='bg-white shadow-md rounded-xl p-6 flex justify-between'>
                  <div>
                     <h3 className='text-lg font-semibold'>Active Visitors</h3>
                     <p className='text-3xl font-bold text-pink-500'>{visitors.length}</p>
                  </div>
                  <Users size={35} className='text-pink-400'/>
               </div>  

            <div className='bg-white shadow-md rounded-xl p-6 flex items-center justify-between'>
               <div>
                  <h3 className='text-lg font-semibold'>Top Products</h3>
                  <p className='text-xl text-pink-400'>{productData[0].name}</p>
               </div>
               <BarChartIcon size={32} className='text-pink-400'/>
            </div>
         </div>

         {/* Middle Section: Inquiries + chart */}
         <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 '>
            {/* recent Inquires */}
            <div className='bg-white shadow-md rounded-2xl p-5'>
               <h3 className='text-[25px] font-bold mb-4'>Recent Inquiries</h3>
               <div className='space-y-3'>
                  {inquiries.map((inquriy, index) => (
                     <div
                        key={index}
                        className='flex justify-between items-center border-b border-gray-700 pb-2'
                     >  
                        <div>
                           <p className='font-medium'>{inquriy.name}</p>
                           <p className='text-sm text-gray-400'>{inquriy.product}</p>
                        </div>
                        <span
                           className={`text-xs px-2 py-1 rounded-full ${
                              inquriy.status === "New"
                              ? "bg-pink-500/30 text-gray-900"
                              : "bg-gray-700 text-gray-300"
                           }`}
                        >
                           {inquriy.status}
                        </span>
                     </div>
                  ))}
               </div>
            </div>

            {/* product Interest chart */}
            <div className='bg-white shadow-md p-5 rounded-2xl'>
                  <h3 className='text-[25px] font-bold mb-4'>Product Interest</h3>
                  <ResponsiveContainer width="100%" height={250}>
                     <BarChart  data={productData}>
                        <XAxis dataKey="name" stroke='#f472b6' />
                        <Bar dataKey="inquiries" fill="#ec4899" radius={[10, 10, 0, 0]} />
                     </BarChart>
                  </ResponsiveContainer>
            </div>
         </div>

         {/* visitors tracking table */}
         <div className='mt-8 bg-white shadow-md rounded-2xl p-5'>
                  <h3 className='text-[25px] font-semibold'>Who's Connected</h3>
                  <div className='overflow-x-auto'>
                     <table className='w-full text-left border-collapse'>
                        <thead>
                           <tr className='text-pink-400 border-b border-gray-700'>
                              <th className='pb-2'>IP Address</th>
                              <th className='pb-2'>Location</th>
                              <th className='pb-2'>Status</th>
                           </tr>
                        </thead>
                        <tbody>
                           {visitors.map((v, i) => (
                              <tr
                                 key={i}
                                 className='border-b gray-700'
                              >
                                 <td className='py-2'>{v.ip}</td>
                                 <td className='py-2'>{v.location}</td>
                                 <td className='py-2'>{v.status}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
         </div>

         <div>
            
         </div>
   </div>
  )
}

export default DashboardContent
