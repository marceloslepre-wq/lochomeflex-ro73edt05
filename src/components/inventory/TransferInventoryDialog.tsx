import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import useMainStore from '@/stores/main'
import { ArrowRightLeft, Plus, Trash2 } from 'lucide-react'

const LOCATIONS = [
  'Galpão',
  'Loja Vitória',
  'Loja Cariacica',
  'Loja Vila Velha',
  'Loja Serra',
  'Matriz',
]

interface TransferItem {
  id: string
  productId: string
  quantity: number
}

interface TransferInventoryDialogProps {
  onSuccess?: () => void
}

export function TransferInventoryDialog({ onSuccess }: TransferInventoryDialogProps) {
  const [open, setOpen] = useState(false)
  const { inventory } = useMainStore()
  const { toast } = useToast()

  const [origin, setOrigin] = useState<string>('')
  const [destination, setDestination] = useState<string>('')
  const [items, setItems] = useState<TransferItem[]>([])
  const [stockMap, setStockMap] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) {
      setOrigin('')
      setDestination('')
      setItems([])
      setStockMap({})
    }
  }, [open])

  useEffect(() => {
    if (origin) {
      supabase
        .from('inventory_locations')
        .select('inventory_id, available_qty')
        .eq('location_id', origin)
        .gt('available_qty', 0)
        .then(({ data }) => {
          if (data) {
            setStockMap(
              data.reduce(
                (acc: any, curr) => ({ ...acc, [curr.inventory_id]: curr.available_qty }),
                {},
              ),
            )
          }
        })
      setItems([])
    } else {
      setStockMap({})
      setItems([])
    }
  }, [origin])

  const handleUpdate = (id: string, field: keyof TransferItem, value: any) => {
    setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)))
  }

  const isValid = () => {
    if (!origin || !destination || origin === destination || items.length === 0) return false
    const uniqueProducts = new Set(items.map((i) => i.productId))
    if (uniqueProducts.size !== items.length) return false
    return items.every(
      (i) => i.productId && i.quantity > 0 && i.quantity <= (stockMap[i.productId] || 0),
    )
  }

  const handleTransfer = async () => {
    if (!isValid()) return
    setLoading(true)

    const payload = items.map((i) => ({
      inventory_id: i.productId,
      quantity: i.quantity,
    }))

    const { error } = await (supabase.rpc as any)('transfer_inventory_batch', {
      p_origin_location_id: origin,
      p_destination_location_id: destination,
      p_items: payload,
    })

    setLoading(false)

    if (error) {
      console.error(error)
      toast({ title: 'Erro na transferência', description: error.message, variant: 'destructive' })
    } else {
      toast({
        title: 'Sucesso',
        description: `${items.length} transferência(s) realizada(s) com sucesso.`,
      })
      setOpen(false)
      onSuccess?.()
    }
  }

  const availableProducts = inventory.filter((p) => stockMap[p.id] > 0)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <ArrowRightLeft className="w-4 h-4 mr-2" /> Transferir Estoque
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Transferir Estoque em Lote</DialogTitle>
          <DialogDescription>
            Mova múltiplos produtos entre os locais disponíveis.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Local de Origem</Label>
              <Select value={origin} onValueChange={setOrigin}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a origem" />
                </SelectTrigger>
                <SelectContent>
                  {LOCATIONS.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Local de Destino</Label>
              <Select value={destination} onValueChange={setDestination} disabled={!origin}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o destino" />
                </SelectTrigger>
                <SelectContent>
                  {LOCATIONS.filter((l) => l !== origin).map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {origin && destination && (
            <div className="space-y-4 mt-4">
              <Label>Produtos a Transferir</Label>

              <div className="space-y-3 max-h-[40vh] overflow-y-auto p-1">
                {items.length > 0 && (
                  <div className="grid grid-cols-[1fr_100px_100px_40px] gap-2 mb-2 text-sm font-medium text-muted-foreground px-1">
                    <div>Produto</div>
                    <div className="text-center">Disponível</div>
                    <div className="text-center">Quantidade</div>
                    <div></div>
                  </div>
                )}

                {items.map((item) => {
                  const maxQty = stockMap[item.productId] || 0
                  return (
                    <div
                      key={item.id}
                      className="grid grid-cols-[1fr_100px_100px_40px] gap-2 items-center"
                    >
                      <Select
                        value={item.productId}
                        onValueChange={(val) => handleUpdate(item.id, 'productId', val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o produto" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableProducts.map((p) => (
                            <SelectItem
                              key={p.id}
                              value={p.id}
                              disabled={items.some((i) => i.productId === p.id && i.id !== item.id)}
                            >
                              {p.name} ({p.code})
                            </SelectItem>
                          ))}
                          {availableProducts.length === 0 && (
                            <SelectItem value="none" disabled>
                              Sem produtos no local
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>

                      <div className="flex items-center justify-center bg-muted/50 rounded-md h-10 px-3 text-sm">
                        {maxQty}
                      </div>

                      <Input
                        type="number"
                        min={1}
                        max={maxQty}
                        value={item.quantity || ''}
                        onChange={(e) =>
                          handleUpdate(
                            item.id,
                            'quantity',
                            e.target.value ? Number(e.target.value) : 0,
                          )
                        }
                        disabled={!item.productId}
                        className="text-center"
                      />

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => setItems(items.filter((i) => i.id !== item.id))}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )
                })}
              </div>

              <Button
                variant="outline"
                className="w-full mt-2 border-dashed"
                onClick={() =>
                  setItems([...items, { id: crypto.randomUUID(), productId: '', quantity: 1 }])
                }
              >
                <Plus className="w-4 h-4 mr-2" /> Adicionar Produto
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleTransfer} disabled={loading || !isValid()}>
            {loading ? 'Transferindo...' : 'Confirmar Transferência em Lote'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
