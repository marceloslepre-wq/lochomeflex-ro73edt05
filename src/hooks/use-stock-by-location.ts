import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

export interface StockByLocationMap {
  [inventoryId: string]: number
}

let cachedStock: { [locationId: string]: StockByLocationMap } = {}

export function refreshStockCache(locationId?: string) {
  if (locationId) {
    delete cachedStock[locationId]
  } else {
    cachedStock = {}
  }
}

export function useStockByLocation(locationId: string | null) {
  const [stockMap, setStockMap] = useState<StockByLocationMap>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!locationId) {
      setStockMap({})
      return
    }

    if (cachedStock[locationId]) {
      setStockMap(cachedStock[locationId])
      return
    }

    setLoading(true)

    const fetchStock = async () => {
      const { data, error } = await supabase
        .from('estoque_por_local')
        .select('inventory_id, quantidade_total, quantidade_locada')
        .eq('local_id', locationId)

      if (!error && data) {
        const map: StockByLocationMap = {}
        for (const row of data) {
          const available = (row.quantidade_total || 0) - (row.quantidade_locada || 0)
          map[row.inventory_id] = available
        }
        cachedStock[locationId] = map
        setStockMap(map)
      }
      setLoading(false)
    }

    fetchStock()
  }, [locationId])

  const getAvailableQty = (inventoryId: string): number => {
    return stockMap[inventoryId] ?? 0
  }

  return { stockMap, loading, getAvailableQty }
}
