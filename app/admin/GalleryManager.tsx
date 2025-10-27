'use client';

import { useState, useEffect, useRef } from 'react';

interface GalleryImage {
  id: number;
  imageUrl: string;
  title: string;
  altText: string;
  createdAt: string;
}

interface GalleryManagerProps {
    darkMode?: boolean
}

export default function GalleryManager({darkMode = false}: GalleryManagerProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Fetch gallery images
  const fetchImages = async () => {
    try {
      const response = await fetch('https://bburnboxsites.vercel.app/api/gallery');
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  // Upload images
  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    try {
      // Convert files to base64
      const imagePromises = selectedFiles.map(file => {
        return new Promise<{ name: string; content: string }>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const base64 = e.target?.result as string;
            const base64Content = base64.split(',')[1];
            resolve({
              name: file.name,
              content: base64Content
            });
          };
          reader.readAsDataURL(file);
        });
      });

      const imagesData = await Promise.all(imagePromises);

      // Upload to GitHub
      const uploadResponse = await fetch('https://bburnboxsites.vercel.app/api/uploadimages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ images: imagesData }),
      });

      const uploadResult = await uploadResponse.json();

      if (uploadResult.success) {
        // Save to database
        for (const url of uploadResult.urls) {
          await fetch('https://bburnboxsites.vercel.app/api/gallery', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              imageUrl: url,
              title: '',
              altText: ''
            }),
          });
        }
        // Refresh gallery
        await fetchImages();
        setSelectedFiles([]);
        
        // Clear file input
        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
        // Show success popup
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        
      } else {
        throw new Error(uploadResult.message);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  // Delete image
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const response = await fetch(`https://bburnboxsites.vercel.app/api/gallery/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setImages(images.filter(img => img.id !== id));
        alert('Image deleted successfully!');
      } else {
        throw new Error('Failed to delete image');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete image');
    }
  };

  // Setup horizontal scroll with mouse/touch
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    const handleMouseDown = (e: MouseEvent) => {
      isDown = true;
      scrollContainer.classList.add("active");
      startX = e.pageX - scrollContainer.offsetLeft;
      scrollLeft = scrollContainer.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
      scrollContainer.classList.remove("active");
    };

    const handleMouseUp = () => {
      isDown = false;
      scrollContainer.classList.remove("active");
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - scrollContainer.offsetLeft;
      const walk = (x - startX) * 1.2;
      scrollContainer.scrollLeft = scrollLeft - walk;
    };

    // Mobile touch support
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      startX = touch.pageX - scrollContainer.offsetLeft;
      scrollLeft = scrollContainer.scrollLeft;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches.length) return;
      const touch = e.touches[0];
      const x = touch.pageX - scrollContainer.offsetLeft;
      const walk = (x - startX) * 1.2;
      scrollContainer.scrollLeft = scrollLeft - walk;
    };

    // Add event listeners
    scrollContainer.addEventListener('mousedown', handleMouseDown);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);
    scrollContainer.addEventListener('mouseup', handleMouseUp);
    scrollContainer.addEventListener('mousemove', handleMouseMove);
    scrollContainer.addEventListener('touchstart', handleTouchStart);
    scrollContainer.addEventListener('touchmove', handleTouchMove);

    // Cleanup
    return () => {
      scrollContainer.removeEventListener('mousedown', handleMouseDown);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
      scrollContainer.removeEventListener('mouseup', handleMouseUp);
      scrollContainer.removeEventListener('mousemove', handleMouseMove);
      scrollContainer.removeEventListener('touchstart', handleTouchStart);
      scrollContainer.removeEventListener('touchmove', handleTouchMove);
    };
  }, [images]);

  if (loading) {
    return (
      <div className={`min-h-screen bg-gray-50 flex items-center justify-center ${darkMode ?  'bg-gray-700' : ""}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} p-4 md:p-6 transition-colors duration-300`}>
      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-top duration-500">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Images uploaded successfully!</span>
          </div>
        </div>
      )}
      <div className={`max-w-7xl  mx-auto ${darkMode ? "bg-gray-900" : "bg-white"}`}>
        {/* Header */}
        <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 ${darkMode ? "bg-gray-900 shadow-white" : ""}`}>
          <div>
            <h1 className={`text-3xl font-bold text-gray-900 ${darkMode ? 'text-white' : 'text-gray-700'}`}>Gallery Management</h1>
            <p className="text-gray-600 mt-2">Manage your gallery images</p>
          </div>
          {/* Upload Button */}
          <div className="mt-4 sm:mt-0">
            <label htmlFor="file-input" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg cursor-pointer transition-colors inline-flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Images</span>
            </label>
            <input
              id="file-input"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>
        {/* Upload Section */}
        {selectedFiles.length > 0 && (
          <div className={` bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Ready to Upload ({selectedFiles.length} files)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedFiles.map((file, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {file.name}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-3 mt-4 sm:mt-0">
                <button
                  onClick={() => setSelectedFiles([])}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Upload Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Gallery Section */}
        <div className={`rounded-xl shadow-sm border border-gray-200 p-6 ${darkMode ? "bg-gray-900 border-none shadow-white" : ""}`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-xl font-semibold text-gray-900 ${darkMode ? "text-white" : ""}`}>
              Current Gallery <span className="text-blue-600">({images.length})</span>
            </h2>
          </div>
          {images.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 text-lg">No images in gallery yet</p>
              <p className="text-gray-400 mt-2">Upload some images to get started</p>
            </div>
          ) : (
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto space-x-6 pb-6 cursor-grab active:cursor-grabbing select-none scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {images.map((image) => (
                <div
                  key={image.id}
                  className="flex-none w-72 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <div className="relative group">
                    <img
                      src={image.imageUrl}
                      alt={image.altText || image.title}
                      className="w-full h-48 object-cover"
                      draggable="false"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `data:image/svg+xml;base64,${btoa(`
                          <svg width="288" height="192" xmlns="http://www.w3.org/2000/svg">
                            <rect width="100%" height="100%" fill="#f3f4f6"/>
                            <text x="50%" y="50%" font-family="Arial" font-size="14" fill="#9ca3af" text-anchor="middle" dy=".3em">Image not found</text>
                          </svg>
                        `)}`;
                      }}
                    />
                    
                    {/* Delete Button - Top Right */}
                    <button
                      onClick={() => handleDelete(image.id)}
                      className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                      title="Delete image"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0">
                        {image.title && (
                          <p className="font-medium text-gray-900 truncate">{image.title}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(image.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    {image.altText && (
                      <p className="text-sm text-gray-600 truncate" title={image.altText}>
                        {image.altText}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Custom scrollbar hide styles */}
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </div>
  );
}