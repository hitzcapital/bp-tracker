import { useState, useEffect, useCallback } from 'react'

interface ReminderSettings {
  enabled: boolean
  time: string // HH:mm format
}

const STORAGE_KEY = 'bp-reminder-settings'

export function useReminders() {
  const [settings, setSettings] = useState<ReminderSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : { enabled: false, time: '08:00' }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    if (!settings.enabled) return
    if (!('Notification' in window)) return
    if (Notification.permission === 'default') {
      Notification.requestPermission()
    }

    const checkReminder = () => {
      if (Notification.permission !== 'granted') return
      const now = new Date()
      const [hours, minutes] = settings.time.split(':').map(Number)
      if (now.getHours() === hours && now.getMinutes() === minutes) {
        new Notification('BP Tracker', {
          body: 'Time to measure your blood pressure!',
          icon: '/icon-192.png',
        })
      }
    }

    const interval = setInterval(checkReminder, 60000)
    return () => clearInterval(interval)
  }, [settings])

  const updateSettings = useCallback((updates: Partial<ReminderSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }))
  }, [])

  return { settings, updateSettings }
}
