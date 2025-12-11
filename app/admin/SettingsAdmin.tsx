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
    <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6 text-white">
      <h2 className="text-xl font-bold mb-4">Admin Settings</h2>
      <p className="text-gray-400 mb-6">Create accounts that can access the admin dashboard.</p>

      <form onSubmit={createUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-400">Email</label>
          <input className="mt-1 w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm text-gray-400">Password</label>
          <input className="mt-1 w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm text-gray-400">Position</label>
          <input className="mt-1 w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2" type="text" value={position} onChange={e => setPosition(e.target.value)} placeholder="e.g., Operations, Marketing" />
        </div>
        <div>
          <label className="text-sm text-gray-400">Role</label>
          <select className="mt-1 w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2" value={role} onChange={e => setRole(e.target.value as 'ADMIN' | 'STAFF')}>
            <option value="STAFF">Staff</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <button disabled={loading} className="w-full bg-pink-600 hover:bg-pink-500 transition-colors rounded-lg py-2 font-semibold disabled:opacity-50">
            {loading ? 'Creating…' : 'Create Account'}
          </button>
        </div>
      </form>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-3">Promote/Demote User</h3>
        <form onSubmit={changeRole} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-400">User Email</label>
            <input className="mt-1 w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2" type="email" value={updateRoleEmail} onChange={e => setUpdateRoleEmail(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm text-gray-400">New Role</label>
            <select className="mt-1 w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2" value={updateRoleValue} onChange={e => setUpdateRoleValue(e.target.value as 'ADMIN' | 'STAFF')}>
              <option value="STAFF">Staff</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <button disabled={loading} className="w-full bg-purple-600 hover:bg-purple-500 transition-colors rounded-lg py-2 font-semibold disabled:opacity-50">
              {loading ? 'Updating…' : 'Update Role'}
            </button>
          </div>
        </form>
      </div>

      {status && <div className="mt-4 text-sm text-gray-300">{status}</div>}
    </div>
  )
}

export default SettingsAdmin
