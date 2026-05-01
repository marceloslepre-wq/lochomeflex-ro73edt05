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
import { ArrowRightLeft } from 'lucide-react'

const LOCATIONS = [
  'Galpão',
  'Loja Vitória',
  'Loja Cariacica',
  'Loja Vila Velha',
  'Loja Serra',
  'Matriz',
]

interface TransferInventoryDialogProps {
  onSuccess?: () => void
}

export function TransferInventoryDialog({ onSuccess }: TransferInventoryDialogProps) {
  const [open, setOpen] = useState(false)
  const { inventory } = useMainStore()
  const { toast } = useToast()

  const [productId, setProductId] = useState<string>('')
  const [origin, setOrigin] = useState<string>('')
  const [destination, setDestination] = useState<string>('')
  const [quantity, setQuantity] = useState<number>(1)
  const [loading, setLoading] = useState(false)
  const [originLocations, setOriginLocations] = useState<any[]>([])

  useEffect(() => {
    if (!open) {
      setProductId('')
      setOrigin('')
      setDestination('')
      setQuantity(1)
      setOriginLocations([])
    }
  }, [open])

  useEffect(() => {
    if (productId) {
      const fetchOriginLocations = async () => {
        const { data } = await supabase
          .from('inventory_locations')
          .select('location_id, available_qty')
          .eq('inventory_id', productId)
          .gt('available_qty', 0)

        if (data) {
          setOriginLocations(data)
        } else {
          setOriginLocations([])
        }
      }
      fetchOriginLocations()
      setOrigin('')
      setDestination('')
      setQuantity(1)
    }
  }, [productId])

  const maxQty = originLocations.find((l) => l.location_id === origin)?.available_qty || 0

  const handleTransfer = async () => {
    if (!productId || !origin || !destination || !quantity) {
      toast({ title: 'Erro', description: 'Preencha todos os campos.', variant: 'destructive' })
      return
    }
    if (origin === destination) {
      toast({
        title: 'Erro',
        description: 'O local de destino deve ser diferente do local de origem.',
        variant: 'destructive',
      })
      return
    }
    if (quantity <= 0 || quantity > maxQty) {
      toast({ title: 'Erro', description: 'Quantidade inválida.', variant: 'destructive' })
      return
    }

    setLoading(true)
    const { error } = await (supabase.rpc as any)('transfer_inventory', {
      p_inventory_id: productId,
      p_origin_location_id: origin,
      p_destination_location_id: destination,
      p_quantity: quantity,
    })

    setLoading(false)

    if (error) {
      console.error(error)
      toast({ title: 'Erro na transferência', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Transferência Concluída', description: 'Estoque transferido com sucesso.' })
      setOpen(false)
      if (onSuccess) onSuccess()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <ArrowRightLeft className="w-4 h-4 mr-2" /> Transferir Estoque
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transferir Estoque</DialogTitle>
          <DialogDescription>Mova produtos entre os locais disponíveis.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Produto</Label>
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o produto" />
              </SelectTrigger>
              <SelectContent>
                {inventory.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name} ({item.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Local de Origem</Label>
            <Select value={origin} onValueChange={setOrigin} disabled={!productId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o local de origem" />
              </SelectTrigger>
              <SelectContent>
                {originLocations.map((loc) => (
                  <SelectItem key={loc.location_id} value={loc.location_id}>
                    {loc.location_id} (Disponível: {loc.available_qty})
                  </SelectItem>
                ))}
                {originLocations.length === 0 && productId && (
                  <SelectItem value="none" disabled>
                    Nenhum local com estoque disponível
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Local de Destino</Label>
            <Select value={destination} onValueChange={setDestination} disabled={!origin}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o local de destino" />
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

          <div className="space-y-2">
            <Label>Quantidade (Máx: {maxQty})</Label>
            <Input
              type="number"
              min={1}
              max={maxQty}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              disabled={!origin}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={handleTransfer}
            disabled={
              loading || !productId || !origin || !destination || quantity <= 0 || quantity > maxQty
            }
          >
            Confirmar Transferência
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
