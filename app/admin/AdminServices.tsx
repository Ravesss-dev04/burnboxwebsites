import { ArrowLeft, ArrowRight, Edit, Eye, Plus, Upload, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'

interface DarkModeServices {
  darkMode?: boolean
}

interface Service {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description?: string;
}

const AdminServices: React.FC<DarkModeServices> = ({darkMode = false}) => {
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [services, setServices] = useState<Service[]>([])
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowAddModal] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    price: '',
    description: '',
    image: null as File | null
  });
  const [uploading, setUploading] = useState(false);

  const itemsPerPage = 8;

  
   // Add edit function
  const handleEditService = (service: Service) => {
    setEditingService(service);
    setNewService({
      name: service.name,
      price: service.price.toString(),
      description: service.description || '',
      image: null
    });
    setShowAddModal(true);
  };

  // Fetch services from API
  const fetchServices = async () => {
    try {
      const response = await fetch('/api/sservices');
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const totalPages = Math.ceil(services.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = services.slice(startIndex, startIndex + itemsPerPage);

  const nextPage = () => {
    if(currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  }

  const prevPage = () => {
    if(currentPage > 1) setCurrentPage((prev) => prev - 1 );
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewService(prev => ({
        ...prev,
        image: e.target.files![0]
      }));
    }
  };

  // Upload image
  const uploadImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const base64 = e.target?.result as string;
          const base64Content = base64.split(',')[1];

          const response = await fetch('/api/uploadimages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              images: [{
                name: file.name,
                content: base64Content
              }]
            }),
          });

          const result = await response.json();
          
          if (result.success && result.urls.length > 0) {
            resolve(result.urls[0]);
          } else {
            reject(new Error(result.message || 'Upload failed'));
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Add new service
   const handleAddService = async () => {
    if (!newService.name || !newService.price) {
      alert('Please fill all required fields');
      return;
    }

    setUploading(true);
    try {
      let imageUrl = editingService?.imageUrl;

      // Upload new image if provided
      if (newService.image) {
        imageUrl = await uploadImage(newService.image);
      } else if (editingService) {
        // Keep existing image if not uploading new one
        imageUrl = editingService.imageUrl;
      }

      const url = editingService 
        ? `/api/sservices/${editingService.id}`
        : '/api/sservices';
      
      const method = editingService ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newService.name,
          price: parseFloat(newService.price),
          imageUrl: imageUrl,
          description: newService.description
        }),
      });

      if (response.ok) {
        const resultService = await response.json();
        
        if (editingService) {
          // Update existing service in state
          setServices(prev => prev.map(s => s.id === editingService.id ? resultService : s));
        } else {
          // Add new service to state
          setServices(prev => [resultService, ...prev]);
        }
        
        // Reset form and close modal
        setShowAddModal(false);
        setNewService({
          name: '',
          price: '',
          description: '',
          image: null
        });
        setEditingService(null);
        
        alert(editingService ? 'Service updated successfully!' : 'Service added successfully!');
      } else {
        throw new Error('Failed to save service');
      }
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Failed to save service: ' + (error as Error).message);
    } finally {
      setUploading(false);
    }
  };

  // Update modal closing to reset edit state
  const closeModal = () => {
    setShowAddModal(false);
    setEditingService(null);
    setNewService({
      name: '',
      price: '',
      description: '',
      image: null
    });
  };
  // Delete service
  const handleDeleteService = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const response = await fetch(`/api/sservices/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setServices(prev => prev.filter(service => service.id !== id));
        alert('Service deleted successfully!');
      } else {
        throw new Error('Failed to delete service');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Failed to delete service');
    }
  };
  
  if(loading) {
    return <div className='flex flex-col items-center justify-center p-6 text-white'>Loading Services</div>
  }
  return (
    <div className='flex flex-col items-center justify-center p-6 '>
      <h2 className={`text-2xl sm:text-3xl font-bold mb-8 uppercase tracking-wide text-center ${darkMode ? "text-white" : "text-whik"}`}>Services Customization</h2>
      
      {/* Add Services Button */}
      <div className='w-full max-w-6xl flex justify-end mb-4'>
        <button 
          onClick={() => setShowAddModal(true)}
          className='flex items-center gap-2 bg-gray-200 text-black px-4 py-2 rounded-mb hover:bg-gray-300 transition'
        >
          <Plus size={16} /> <span className='text-sm font-semibold'>Add Services</span>
        </button>
      </div>    
      {/* Services Grid */}
      <div className='max-w-7xl bg-gradient-to-b from-[#1b2337] to-[#2c3550] p-6 rounded-2xl shadow-lg'>
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4   gap-6'>
        {currentItems.map((service) => (
          <div
            key={service.id}
            className='relative bg-gray-300 rounded-md aspect-square flex items-center justify-center group overflow-hidden'
          >
            <img 
              src={service.imageUrl.split(',')[0]} // Show first image
              alt={service.name}
              className="w-full h-full object-contain"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="text-center text-white p-2">
                <h3 className="font-semibold text-[20px] mb-1">{service.name}</h3>
                <p className="text-[16px]">₱{service.price.toLocaleString('en-US' , {minimumFractionDigits:2, maximumFractionDigits:2})}</p>
              </div>
            </div>
            <div className='absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditService(service);
                }}
                className='bg-blue-500 text-white p-1 rounded hover:bg-blue-600 transition'
              >
                <Edit size={14} />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteService(service.id);
                }}
                className='bg-red-500 text-white p-1 rounded hover:bg-red-600 transition'
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>


        {/* Pagination */}
        <div className='flex justify-between items-center mt-8'>
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className='text-pink-400 hover:text-pink-500 disabled:opacity-40 disabled:cursor-not-allowed'
          >  
            <ArrowLeft size={22}/>
          </button>
          <span className='text-sm text-gray-400'>
            Page {currentPage} of {totalPages}
          </span>
          <button 
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className='text-pink-400 hover:text-pink-500 disabled:opacity-40 disabled:cursor-not-allowed'
          >
            <ArrowRight size={22} /> 
          </button>
        </div>
      </div>

      {/* Add Service Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gradient-to-b from-[#1b2337] to-[#2c3550] p-6 rounded-2xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Service Name *</label>
                <input
                  type="text"
                  value={newService.name}
                  onChange={(e) => setNewService(prev => ({...prev, name: e.target.value}))}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  placeholder="Enter service name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price *</label>
                <input
                  type="number"
                  value={newService.price}
                  onChange={(e) => setNewService(prev => ({...prev, price: e.target.value}))}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  placeholder="Enter price"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={newService.description}
                  onChange={(e) => setNewService(prev => ({...prev, description: e.target.value}))}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  placeholder="Enter description"
                  rows={3}
                />
              </div>
              <div>
              <label className="block text-sm font-medium mb-1">
                Image {!editingService && '*'}
              </label>
              <div className="border-2 border-dashed border-gray-600 rounded p-4 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="service-image"
                />
                <label htmlFor="service-image" className="cursor-pointer">
                  <Upload size={24} className="mx-auto mb-2" />
                  <span className="text-sm">
                    {newService.image 
                      ? newService.image.name 
                      : editingService 
                        ? 'Click to change image (optional)'
                        : 'Click to upload image *'
                    }
                  </span>
                  {editingService && (
                    <p className="text-xs text-gray-400 mt-1">
                      Current image will be kept if no new image is selected
                    </p>
                  )}
                </label>
              </div>
            </div>
             <div className="flex gap-3 pt-4">
            <button
              onClick={closeModal}
              className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleAddService}
              disabled={uploading || !newService.name || !newService.price || (!newService.image && !editingService)}
              className="flex-1 bg-pink-500 text-white py-2 rounded hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {uploading ? (
                editingService ? 'Saving...' : 'Adding...'
              ) : editingService ? (
                'Save Changes'
              ) : (
                'Add Service'
              )}
            </button>
          </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminServices