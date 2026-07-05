import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

export interface LocationItem {
  id: string
  nome: string
}

export function useLocations() {
  const [locations, setLocations] = useState<LocationItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLocations = async () => {
      const { data, error } = await supabase
        .from('locais')
        .select('id, nome')
        .eq('ativo', true)
        .order('nome')

      if (!error && data) {
        setLocations(data)
      }
      setLoading(false)
    }
    fetchLocations()
  }, [])

  return { locations, loading }
}
