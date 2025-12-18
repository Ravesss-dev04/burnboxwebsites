import React, { useState, useEffect } from 'react'
import Home from '../page'
import { SiteConfigProvider, useSiteConfig } from '../context/SiteConfigContext'
import { Save, Type, Palette, Image as ImageIcon, Layout, Move } from 'lucide-react'

interface CustomizeDarkmodeOpen {
  darkmode?: boolean;
}

const CustomizeContent = () => {
  const { config, updateConfig, saveConfig, setEditing, editKey, setEditKey } = useSiteConfig();
  const [activeTab, setActiveTab] = useState<'text' | 'colors' | 'images' | 'layout'>('text');

  // Enable editing mode when component mounts
  useEffect(() => {
    setEditing(true);
    return () => setEditing(false);
  }, [setEditing]);

  // Switch tab if editKey changes (e.g. clicked an image)
  useEffect(() => {
    if (editKey) {
      if (editKey.includes('Image') || editKey === 'logo') {
        setActiveTab('images');
      }
    }
  }, [editKey]);

  return (
    <div className='flex h-full gap-4'>
      {/* Sidebar Controls */}
      <div className='w-80 bg-gray-900 text-white rounded-xl p-4 flex flex-col gap-4 h-full overflow-y-auto shrink-0 border-r border-white/10'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-xl font-bold'>Customize</h2>
          <button 
            onClick={saveConfig}
            className='flex items-center gap-2 bg-pink-600 hover:bg-pink-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors'
          >
            <Save size={16} /> Save
          </button>
        </div>

        {/* Tabs */}
        <div className='flex gap-2 bg-gray-800 p-1 rounded-lg mb-4 overflow-x-auto'>
          <button 
            onClick={() => setActiveTab('text')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-2 rounded-md text-xs transition-colors ${activeTab === 'text' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <Type size={14} /> Text
          </button>
          <button 
            onClick={() => setActiveTab('colors')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-2 rounded-md text-xs transition-colors ${activeTab === 'colors' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <Palette size={14} /> Colors
          </button>
          <button 
            onClick={() => setActiveTab('images')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-2 rounded-md text-xs transition-colors ${activeTab === 'images' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <ImageIcon size={14} /> Images
          </button>
          <button 
            onClick={() => setActiveTab('layout')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-2 rounded-md text-xs transition-colors ${activeTab === 'layout' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <Move size={14} /> Layout
          </button>
        </div>

        {/* Controls Content */}
        <div className='space-y-4'>
          {activeTab === 'text' && (
            <div className='space-y-4'>
              <div className='space-y-2'>
                <label className='text-xs text-gray-400 uppercase font-bold'>Hero Title</label>
                <input 
                  type="text" 
                  value={config.heroTitle || "Welcome to BurnBox"}
                  onChange={(e) => updateConfig('heroTitle', e.target.value)}
                  className='w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500'
                />
              </div>
              <div className='space-y-2'>
                <label className='text-xs text-gray-400 uppercase font-bold'>Hero Subtitle</label>
                <textarea 
                  value={config.heroSubtitle || "Your one-stop shop for customized merchandise."}
                  onChange={(e) => updateConfig('heroSubtitle', e.target.value)}
                  className='w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 h-24 resize-none'
                />
              </div>
              
              <div className='pt-4 border-t border-gray-800'>
                <h3 className='text-sm font-bold mb-2 text-pink-500'>Creative Section</h3>
                <div className='space-y-2'>
                  <label className='text-xs text-gray-400 uppercase font-bold'>Creative Title</label>
                  <input 
                    type="text" 
                    value={config.creativeTitle || "Your Visibility Challenge\nOur Creative Solution"}
                    onChange={(e) => updateConfig('creativeTitle', e.target.value)}
                    className='w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500'
                  />
                </div>
                <div className='space-y-2 mt-2'>
                  <label className='text-xs text-gray-400 uppercase font-bold'>Creative Highlight</label>
                  <input 
                    type="text" 
                    value={config.creativeHighlight || "Struggling to Stand Out?"}
                    onChange={(e) => updateConfig('creativeHighlight', e.target.value)}
                    className='w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500'
                  />
                </div>
                <div className='space-y-2 mt-2'>
                  <label className='text-xs text-gray-400 uppercase font-bold'>Creative Subtitle</label>
                  <textarea 
                    value={config.creativeSubtitle || "In a crowded market, your brand can easily get lost..."}
                    onChange={(e) => updateConfig('creativeSubtitle', e.target.value)}
                    className='w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 h-24 resize-none'
                  />
                </div>
              </div>

              <div className='pt-4 border-t border-gray-800'>
                <h3 className='text-sm font-bold mb-2 text-pink-500'>Contact Section</h3>
                <div className='space-y-2'>
                  <label className='text-xs text-gray-400 uppercase font-bold'>Contact Title</label>
                  <input 
                    type="text" 
                    value={config.contactTitle || "Contact Burnbox for\nYour Next Project"}
                    onChange={(e) => updateConfig('contactTitle', e.target.value)}
                    className='w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500'
                  />
                </div>
                <div className='space-y-2 mt-2'>
                  <label className='text-xs text-gray-400 uppercase font-bold'>Contact Subtitle</label>
                  <textarea 
                    value={config.contactSubtitle || "Let's bring your vision to life..."}
                    onChange={(e) => updateConfig('contactSubtitle', e.target.value)}
                    className='w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 h-24 resize-none'
                  />
                </div>
                <div className='space-y-2 mt-2'>
                  <label className='text-xs text-gray-400 uppercase font-bold'>Button Text</label>
                  <input 
                    type="text" 
                    value={config.contactButtonText || "Contact Us Now"}
                    onChange={(e) => updateConfig('contactButtonText', e.target.value)}
                    className='w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500'
                  />
                </div>
              </div>

              <div className='pt-4 border-t border-gray-800'>
                <h3 className='text-sm font-bold mb-2 text-pink-500'>Footer & Socials</h3>
                <div className='space-y-2'>
                  <label className='text-xs text-gray-400 uppercase font-bold'>Contact Email</label>
                <input 
                  type="text" 
                  value={config.contactEmail || "info@burnbox.com"}
                  onChange={(e) => updateConfig('contactEmail', e.target.value)}
                  className='w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500'
                />
              </div>
              <div className='space-y-2'>
                <label className='text-xs text-gray-400 uppercase font-bold'>Footer Text</label>
                <input 
                  type="text" 
                  value={config.footerText || "@ 2025 burnbox Printing company"}
                  onChange={(e) => updateConfig('footerText', e.target.value)}
                  className='w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500'
                />
              </div>
              <div className='space-y-2'>
                <label className='text-xs text-gray-400 uppercase font-bold'>Facebook URL</label>
                <input 
                  type="text" 
                  value={config.facebookUrl || ""}
                  onChange={(e) => updateConfig('facebookUrl', e.target.value)}
                  className='w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500'
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div className='space-y-2'>
                <label className='text-xs text-gray-400 uppercase font-bold'>Instagram URL</label>
                <input 
                  type="text" 
                  value={config.instagramUrl || ""}
                  onChange={(e) => updateConfig('instagramUrl', e.target.value)}
                  className='w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500'
                  placeholder="https://instagram.com/..."
                />
              </div>
             </div>
            </div>
          )}

          {activeTab === 'colors' && (
            <div className='space-y-4'>
              <div className='space-y-2'>
                <label className='text-xs text-gray-400 uppercase font-bold'>Primary Color</label>
                <div className='flex gap-2'>
                  <input 
                    type="color" 
                    value={config.primaryColor || "#ec4899"}
                    onChange={(e) => updateConfig('primaryColor', e.target.value)}
                    className='h-10 w-10 rounded cursor-pointer bg-transparent border-0'
                  />
                  <input 
                    type="text" 
                    value={config.primaryColor || "#ec4899"}
                    onChange={(e) => updateConfig('primaryColor', e.target.value)}
                    className='flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500'
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'images' && (
            <div className='space-y-4'>
              <div className='space-y-2'>
                <label className='text-xs text-gray-400 uppercase font-bold'>Logo URL</label>
                <input 
                  type="text" 
                  value={config.logo || "/burnboxlogo.png"}
                  onChange={(e) => updateConfig('logo', e.target.value)}
                  className='w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500'
                />
              </div>
              <div className='space-y-2'>
                <label className='text-xs text-gray-400 uppercase font-bold'>Hero Image</label>
                <input 
                  type="text" 
                  value={config.heroImage || "/onetwo.jpg"}
                  onChange={(e) => updateConfig('heroImage', e.target.value)}
                  className={`w-full bg-gray-800 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 ${editKey === 'heroImage' ? 'border-pink-500 ring-1 ring-pink-500' : 'border-gray-700'}`}
                />
              </div>
              <div className='space-y-2'>
                <label className='text-xs text-gray-400 uppercase font-bold'>Creative Image</label>
                <input 
                  type="text" 
                  value={config.creativeImage || "/onetree.jpg"}
                  onChange={(e) => updateConfig('creativeImage', e.target.value)}
                  className={`w-full bg-gray-800 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 ${editKey === 'creativeImage' ? 'border-pink-500 ring-1 ring-pink-500' : 'border-gray-700'}`}
                />
              </div>
              <div className='space-y-2'>
                <label className='text-xs text-gray-400 uppercase font-bold'>Contact Image</label>
                <input 
                  type="text" 
                  value={config.contactImage || "/aboutusimage.png"}
                  onChange={(e) => updateConfig('contactImage', e.target.value)}
                  className={`w-full bg-gray-800 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 ${editKey === 'contactImage' ? 'border-pink-500 ring-1 ring-pink-500' : 'border-gray-700'}`}
                />
              </div>
            </div>
          )}

          {activeTab === 'layout' && (
            <div className='space-y-4'>
              <div className='space-y-2'>
                <label className='text-xs text-gray-400 uppercase font-bold'>Section Transitions</label>
                <select 
                  value={config.transitionType || 'up'}
                  onChange={(e) => updateConfig('transitionType', e.target.value)}
                  className='w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500'
                >
                  <option value="up">Fade Up</option>
                  <option value="down">Fade Down</option>
                  <option value="left">Slide Left</option>
                  <option value="right">Slide Right</option>
                  <option value="zoom">Zoom In</option>
                  <option value="fade">Simple Fade</option>
                  <option value="flipUp">Flip Up</option>
                </select>
                <p className='text-xs text-gray-500'>Animation style when scrolling to new sections.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Area */}
      <div className='flex-1 bg-black rounded-xl overflow-hidden border border-gray-800 relative'>
        <div className='absolute top-4 left-4 z-50 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white border border-white/10'>
          Live Preview
        </div>
        <div className='w-full h-full overflow-y-auto'>
           {/* We wrap Home in a div to isolate styles if needed, but for now direct render */}
           <div className="w-full h-full">
             <Home />
           </div>
        </div>
      </div>
    </div>
  )
}

const Customize = ({darkmode =  false}: CustomizeDarkmodeOpen) => {
  return (
    <SiteConfigProvider>
      <div className='bg-gray-950 shadow-md rounded-xl p-4 w-full h-full'>
        <CustomizeContent />
      </div>
    </SiteConfigProvider>
  )
}

export default Customize
