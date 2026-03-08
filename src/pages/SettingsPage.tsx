import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Bell, Download, LogOut, Trash2, Info, Lock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useReminders } from '../hooks/useReminders'
import { useToast } from '../context/ToastContext'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { ExportModal } from '../components/export/ExportModal'
import { supabase } from '../lib/supabase'

export function SettingsPage() {
  const { user, signOut } = useAuth()
  const { settings: reminderSettings, updateSettings } = useReminders()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [showExport, setShowExport] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error')
      return
    }
    setPasswordLoading(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setPasswordLoading(false)
    if (error) {
      showToast(error.message, 'error')
    } else {
      showToast('Password updated!', 'success')
      setShowPassword(false)
      setNewPassword('')
    }
  }

  const handleDeleteAccount = async () => {
    showToast('Please contact support to delete your account', 'info')
    setShowDeleteConfirm(false)
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
      {/* Profile */}
      <Card>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center">
            <User size={24} className="text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Signed in as</p>
            <p className="text-white font-medium">{user?.email}</p>
          </div>
        </div>
      </Card>

      {/* Change Password */}
      <Card onClick={() => setShowPassword(true)} className="cursor-pointer">
        <div className="flex items-center gap-3">
          <Lock size={20} className="text-slate-400" />
          <span className="text-slate-200">Change Password</span>
        </div>
      </Card>

      {/* Reminders */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell size={20} className="text-slate-400" />
            <span className="text-slate-200">Daily Reminder</span>
          </div>
          <label className="relative inline-flex cursor-pointer">
            <input
              type="checkbox"
              checked={reminderSettings.enabled}
              onChange={(e) => updateSettings({ enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
          </label>
        </div>
        {reminderSettings.enabled && (
          <div className="mt-3 pt-3 border-t border-slate-700/50">
            <label className="block text-sm text-slate-400 mb-1">Reminder Time</label>
            <input
              type="time"
              value={reminderSettings.time}
              onChange={(e) => updateSettings({ time: e.target.value })}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </Card>

      {/* Export */}
      <Card onClick={() => setShowExport(true)} className="cursor-pointer">
        <div className="flex items-center gap-3">
          <Download size={20} className="text-slate-400" />
          <span className="text-slate-200">Export Data</span>
        </div>
      </Card>

      {/* About */}
      <Card>
        <div className="flex items-center gap-3">
          <Info size={20} className="text-slate-400" />
          <div>
            <span className="text-slate-200">BP Tracker</span>
            <p className="text-xs text-slate-500">Version 1.0.0</p>
          </div>
        </div>
      </Card>

      {/* Sign Out */}
      <Button variant="secondary" onClick={handleSignOut} className="w-full">
        <LogOut size={18} className="mr-2" />
        Sign Out
      </Button>

      {/* Delete Account */}
      <button
        onClick={() => setShowDeleteConfirm(true)}
        className="w-full text-center text-sm text-red-400 hover:text-red-300 py-2"
      >
        <Trash2 size={14} className="inline mr-1" />
        Delete Account
      </button>

      {/* Export Modal */}
      <ExportModal open={showExport} onClose={() => setShowExport(false)} />

      {/* Change Password Modal */}
      <Modal open={showPassword} onClose={() => setShowPassword(false)} title="Change Password">
        <div className="space-y-4">
          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 6 characters"
          />
          <Button onClick={handleChangePassword} loading={passwordLoading} className="w-full">
            Update Password
          </Button>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Delete Account">
        <div className="space-y-4">
          <p className="text-sm text-slate-400">
            This action is permanent and cannot be undone. All your data will be deleted.
          </p>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteAccount} className="flex-1">
              Delete Account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
