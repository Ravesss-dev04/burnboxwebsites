"use client"
import React, { useState } from 'react'

const SettingsAdmin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [position, setPosition] = useState('')
  const [role, setRole] = useState<'ADMIN' | 'STAFF'>('STAFF')
  const [status, setStatus] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [updateRoleEmail, setUpdateRoleEmail] = useState('')
  const [updateRoleValue, setUpdateRoleValue] = useState<'ADMIN' | 'STAFF'>('STAFF')

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus('')
    try {
      const res = await fetch('/api/auth/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, position, role })
      })
      const data = await res.json()
      if (res.ok) {
        setStatus(`User created: ${data.user.email} (${data.user.role})`)
        setEmail(''); setPassword(''); setPosition(''); setRole('STAFF')
      } else {
        setStatus(data.error || 'Failed to create user')
      }
    } catch (err: any) {
      setStatus(err.message || 'Error creating user')
    } finally {
      setLoading(false)
    }
  }

  const changeRole = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus('')
    try {
      const res = await fetch('/api/auth/admin/update-role', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: updateRoleEmail, role: updateRoleValue })
      })
      const data = await res.json()
      if (res.ok) {
        setStatus(`Role updated: ${data.user.email} -> ${data.user.role}`)
        setUpdateRoleEmail(''); setUpdateRoleValue('STAFF')
      } else {
        setStatus(data.error || 'Failed to update role')
      }
    } catch (err: any) {
      setStatus(err.message || 'Error updating role')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-zinc-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-2">Admin Settings</h2>
        <p className="text-zinc-400">Manage access and permissions for the admin dashboard.</p>
      </div>

      {/* Create Account Section */}
      <div className="bg-zinc-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-8 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-pink-500 to-purple-600 opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-pink-500"></span>
          Create New Account
        </h3>
        
        <form onSubmit={createUser} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Email Address</label>
            <input 
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all duration-200" 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="name@example.com"
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Password</label>
            <input 
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all duration-200" 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="••••••••"
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Position / Title</label>
            <input 
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all duration-200" 
              type="text" 
              value={position} 
              onChange={e => setPosition(e.target.value)} 
              placeholder="e.g. Operations Manager" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Access Role</label>
            <div className="relative">
              <select 
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all duration-200 appearance-none cursor-pointer" 
                value={role} 
                onChange={e => setRole(e.target.value as 'ADMIN' | 'STAFF')}
              >
                <option value="STAFF">Staff (Limited Access)</option>
                <option value="ADMIN">Admin (Full Access)</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>
          <div className="md:col-span-2 mt-2">
            <button 
              disabled={loading} 
              className="w-full bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 text-white rounded-xl py-3.5 font-semibold shadow-lg shadow-pink-500/20 hover:shadow-pink-500/30 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : 'Create Account'}
            </button>
          </div>
        </form>
      </div>

      {/* Manage Roles Section */}
      <div className="bg-zinc-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-8 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-600 to-blue-600 opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>

        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-500"></span>
          Manage User Roles
        </h3>

        <form onSubmit={changeRole} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">User Email</label>
            <input 
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all duration-200" 
              type="email" 
              value={updateRoleEmail} 
              onChange={e => setUpdateRoleEmail(e.target.value)} 
              placeholder="Search user by email..."
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">New Role Assignment</label>
            <div className="relative">
              <select 
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all duration-200 appearance-none cursor-pointer" 
                value={updateRoleValue} 
                onChange={e => setUpdateRoleValue(e.target.value as 'ADMIN' | 'STAFF')}
              >
                <option value="STAFF">Staff</option>
                <option value="ADMIN">Admin</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>
          <div className="md:col-span-2 mt-2">
            <button 
              disabled={loading} 
              className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white rounded-xl py-3.5 font-semibold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating Role...
                </span>
              ) : 'Update User Role'}
            </button>
          </div>
        </form>
      </div>

      {status && (
        <div className={`p-4 rounded-xl border ${status.includes('Failed') || status.includes('Error') ? 'bg-red-500/10 border-red-500/20 text-red-200' : 'bg-green-500/10 border-green-500/20 text-green-200'} flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2`}>
          {status.includes('Failed') || status.includes('Error') ? (
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          ) : (
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          )}
          {status}
        </div>
      )}
    </div>
  )
}

export default SettingsAdmin
