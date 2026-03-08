import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import type { Measurement, MeasurementInput } from '../lib/types'
import { PAGE_SIZE } from '../lib/constants'

export function useMeasurements() {
  const { user } = useAuth()
  const [measurements, setMeasurements] = useState<Measurement[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)

  const fetchMeasurements = useCallback(
    async (pageNum: number, append = false) => {
      if (!user) return
      setLoading(true)
      const { data, error } = await supabase
        .from('measurements')
        .select('*')
        .eq('user_id', user.id)
        .order('measured_at', { ascending: false })
        .range(pageNum * PAGE_SIZE, (pageNum + 1) * PAGE_SIZE - 1)

      if (!error && data) {
        setMeasurements((prev) => (append ? [...prev, ...data] : data))
        setHasMore(data.length === PAGE_SIZE)
      }
      setLoading(false)
    },
    [user]
  )

  useEffect(() => {
    fetchMeasurements(0)
  }, [fetchMeasurements])

  // Realtime subscription
  useEffect(() => {
    if (!user) return
    const channel = supabase
      .channel('measurements-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'measurements', filter: `user_id=eq.${user.id}` },
        () => {
          fetchMeasurements(0)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, fetchMeasurements])

  const loadMore = useCallback(() => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchMeasurements(nextPage, true)
  }, [page, fetchMeasurements])

  const addMeasurement = async (input: MeasurementInput): Promise<{ error: Error | null }> => {
    if (!user) return { error: new Error('Not authenticated') }

    let photo_url: string | null = null

    if (input.photo) {
      const ext = input.photo.name.split('.').pop() || 'jpg'
      const path = `${user.id}/photo_${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage.from('bp-photos').upload(path, input.photo)
      if (uploadError) return { error: uploadError as unknown as Error }
      const {
        data: { publicUrl },
      } = supabase.storage.from('bp-photos').getPublicUrl(path)
      photo_url = publicUrl
    }

    const { error } = await supabase.from('measurements').insert({
      user_id: user.id,
      systolic: input.systolic!,
      diastolic: input.diastolic!,
      pulse: input.pulse!,
      activity: input.activity,
      measured_at: input.measured_at,
      notes: input.notes || null,
      photo_url,
    })

    return { error: error as Error | null }
  }

  const updateMeasurement = async (
    id: string,
    updates: Partial<Pick<Measurement, 'systolic' | 'diastolic' | 'pulse' | 'activity' | 'notes' | 'measured_at'>>
  ): Promise<{ error: Error | null }> => {
    const { error } = await supabase.from('measurements').update(updates).eq('id', id)
    return { error: error as Error | null }
  }

  const deleteMeasurement = async (id: string): Promise<{ error: Error | null }> => {
    const { error } = await supabase.from('measurements').delete().eq('id', id)
    if (!error) {
      setMeasurements((prev) => prev.filter((m) => m.id !== id))
    }
    return { error: error as Error | null }
  }

  const getAllMeasurements = async (): Promise<Measurement[]> => {
    if (!user) return []
    const { data } = await supabase
      .from('measurements')
      .select('*')
      .eq('user_id', user.id)
      .order('measured_at', { ascending: false })
    return data || []
  }

  return {
    measurements,
    loading,
    hasMore,
    loadMore,
    addMeasurement,
    updateMeasurement,
    deleteMeasurement,
    getAllMeasurements,
    refresh: () => fetchMeasurements(0),
  }
}
