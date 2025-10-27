'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { AnimatePresence, motion } from 'framer-motion';

interface GalleryImage {
  id: number;
  imageUrl: string;
  title: string;
  altText: string;
  createdAt: string;
}

const GalleryPhotos: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadImages = async () => {
    try {
      const res = await fetch('https://bburnboxsites.vercel.app/api/gallery');
      if (!res.ok) {
        throw new Error('Failed to fetch gallery images');
      }
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setImages(data);
      } else {
        setError('Invalid data format');
      }
    } catch (err) {
      console.error('Error loading gallery images:', err);
      setError('Failed to load gallery images');
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
    // Optional: Refresh every 5 minutes to get new images
    const interval = setInterval(loadImages, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p className="text-center">Loading gallery...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (images.length === 0) return <p className="text-center">No images found in gallery.</p>;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        exit={{ opacity: 0 }}
        viewport={{ once: false, amount: 0.4 }}
      >
        <section id='gallery' className="relative min-h-screen custom-gallery-bg w-full px-4 py-20 flex flex-col items-center overflow-hidden">
          <img 
            className='absolute opacity-10 items-center ml-350 mt-30' 
            src="/burnboxlogo.png" 
            alt="Background Logo" 
          />
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-center text-pink mb-12">
            Gallery
          </h1>

          <Swiper
            modules={[Pagination, A11y]}
            spaceBetween={20}
            slidesPerView={5}
            pagination={{ clickable: true }}
            className="w-full max-w-[1840px]"
            breakpoints={{
              0: { slidesPerView: 1 },
              480: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
              1280: { slidesPerView: 5 },
            }}
          >
            {images.map((image) => (
              <SwiperSlide key={image.id} className="flex justify-center">
                <div className="w-[350px] h-[400px] border p-2 rounded shadow bg-white overflow-hidden gap-2">
                  <Image
                    src={image.imageUrl}
                    alt={image.altText || image.title || 'Gallery image'}
                    width={300}
                    height={340}
                    className="w-full h-full object-cover rounded"
                    unoptimized
                  />
                  {(image.title || image.altText) && (
                    <div className="mt-2 p-2 text-center">
                      <p className="text-sm text-gray-700 truncate">
                        {image.title || image.altText}
                      </p>
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      </motion.div>
    </AnimatePresence>
  );
};

export default GalleryPhotos;