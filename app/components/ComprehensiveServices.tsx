import React from 'react';
import { Printer, Signpost, Megaphone } from 'lucide-react';

const ComprehensiveServices = () => {

  const services = [
    {
      title: "Large Format Printing",
      description: "Eye-catching banners, billboards, and tarpaulins for maximum impact - perfect for events, storefronts, promotions.",
      icon: <Printer size={40} />
    },
    {
      title: "Custom Signage",
      description: "Indoor and outdoor signs, lightbox, and 3D letters- tailored to your brand and built to last in any environment.",
      icon: <Signpost size={40} />
    },
    {
      title: "Promotional Materials",
      description: "Brochures, flyers, stickers, and more-high quality prints that help you connect with customers and grow your business",
      icon: <Megaphone size={40} />
    }
  ];
  
  return (
    <section className="w-full py-20 md:py-32 px-4 md:px-8 lg:px-16 bg-transparent relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#ff0060]/30 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 md:mb-16 text-white">
          Comprehensive Printing & Signage Services
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-zinc-900/40 backdrop-blur-sm border border-white/5 p-8 md:p-10 flex flex-col items-center text-center hover:bg-zinc-900/60 hover:shadow-[0_0_30px_rgba(255,0,96,0.1)] hover:border-pink-500/20 transition-all duration-300 group rounded-2xl"
            >
              {/* Icon */}
              <div className="text-[#ff0060] mb-6 transform group-hover:scale-110 transition-transform duration-300 bg-pink-500/10 p-4 rounded-full">
                {service.icon}
              </div>
              
              <h3 className="text-xl md:text-2xl font-bold text-white mb-6">
                {service.title}
              </h3>
              
              <p className="text-gray-300 leading-relaxed text-sm md:text-base font-medium">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ComprehensiveServices;
