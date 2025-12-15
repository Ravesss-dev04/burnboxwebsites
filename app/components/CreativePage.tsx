import React from 'react'

const CreativePage = () => {
  return (
    <section className='w-full py-20 md:py-32 bg-transparent relative overflow-hidden'>
        {/* Subtle Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center' >
                <div className='flex flex-col justify-center order-1 lg:order-1'>
                    <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white mb-6'>
                        Your Visibility Challenge <br className='hidden lg:block'/>
                        Our Creative Solution
                    </h1>
                    <h3 className='text-2xl md:text-3xl text-[#ff0060] font-bold mb-4'>Struggling to Stand Out?</h3>

                    <p className='text-base md:text-lg text-gray-300 mb-8 max-w-xl leading-relaxed font-medium'>
                    In a crowded market, your brand can easily get lost.
                    Burnbox Printing delivers innovative signage and 
                    print solutions that make your business impossible
                    to miss. We help you capture attention and drive real results fast.
                    </p>
                </div>
            {/* image */}
            <div className='relative w-full h-full min-h-[300px] lg:min-h-[500px] order-2 lg:order-2'>
                <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                    <img src="/aboutusimage.png" alt="Creative Solutions" 
                    className='w-full h-full object-cover hover:scale-105 transition-transform duration-700'
                    />    
                </div>
            </div>
             </div>
        </div>
    </section>
  )
}

export default CreativePage
