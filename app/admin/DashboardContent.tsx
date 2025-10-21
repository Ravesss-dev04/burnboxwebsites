import React from 'react'

const DashboardContent = () => {
  return (
    <div>
            <h2 className='text-2xl font-semibold mb-4 text-gray-800'>Dashboard</h2>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {/* cards */}
              <div className='bg-white shadow-md rounded-xl p-6 '>
                 <h3 className='text-3xl font-semibold text-gray-700'>Inquiries</h3> 
                 <p>P 120</p>
              </div>
              <div className='bg-white shadow-md rounded-xl p-6'>
                 <h3>Inquiries</h3> 
              </div>
              <div className='bg-white shadow-md rounded-xl p-6'>
                 <h3>Inquiries</h3> 
              </div>
             
               <div className='bg-white shadow-md rounded-xl p-6'>
                 <h3>Inquiries</h3> 
              </div>
               <div className='bg-white shadow-md rounded-xl p-6'>
                 <h3>Inquiries</h3> 
              </div>
            </div>
   </div>
  )
}

export default DashboardContent
