'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { AnimatePresence, motion } from 'framer-motion';

interface FbPost {
  id: string;
  message?: string;
  created_time: string;
  full_picture?: string;
  attachments?: {
    media?: { image?: { src?: string } };
    subattachments?: Array<{
      media?: { image?: { src?: string } };
    }>;
  };
}


const GalleryPhotos: React.FC = () => {
  const [posts, setPosts] = useState<FbPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadPosts = async () => {
    try {
      const res = await fetch('/api/fbphoto');
      const data = await res.json();
      if (Array.isArray(data)) {
        setPosts(data);
      } else if (Array.isArray(data?.data)) {
        setPosts(data.data);
      } else {
        setError('Invalid data format');
      }
    } catch (err) {
      console.error('Error loading posts:', err);
      setError('Failed to load posts');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    loadPosts();
    const interval = setInterval(loadPosts, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (posts.length === 0) return <p className="text-center">No posts with images found.</p>;

  return (
    <AnimatePresence>
    <motion.div
      initial={{opacity: 0, scale: 0.8}}
      whileInView={{opacity: 1, scale: 1}}
      transition={{duration: 0.7, ease: "easeOut"}}
      exit={{opacity:0}}
      viewport={{once: false, amount: 0.4}}
    >
    <section id='gallery' className="relative min-h-screen custom-gallery-bg w-full  px-4 py-20 flex flex-col items-center overflow-hidden ">
      <img className='absolute opacity-10 items-center ml-350 mt-30' src="/burnboxlogo.png" alt="Background Logo" />
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-center text-pink mb-12">Gallery</h1>

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
        {posts.map(post => {
          const [pageId, postId] = post.id.split('_');
          const fbPostUrl = `https://www.facebook.com/${pageId}/posts/${postId}`;
          const images: string[] = [];
          
          if (post.full_picture) images.push(post.full_picture);
          if (post.attachments?.subattachments?.length) {
            post.attachments.subattachments.slice(0, 2).forEach(sub => {
              const subImage = sub.media?.image?.src;
              if (subImage) images.push(subImage);
            });
          } else {
            const mainImage = post.attachments?.media?.image?.src;
            if (mainImage) images.push(mainImage);
          }
          return images.slice(0, 2).map((img, index) => (
            <SwiperSlide key={`${post.id}_${index}`} className="flex justify-center">
             <div className="w-[350px] h-[400px] border  p-2 rounded shadow bg-white overflow-hidden gap-2">
              <a href={fbPostUrl} target="_blank" rel="noopener noreferrer">
             
                <Image
                  src={img}
                  alt={post.message || 'Facebook Image'}
                  width={300}
                  height={340}
                  className="w-full h-full object-cover rounded"
                  unoptimized
                
                />
             
              </a>
            </div>
            </SwiperSlide>
          ));
        })}
      </Swiper>
    </section>
    </motion.div>
    </AnimatePresence>
  );
};

export default GalleryPhotos;
