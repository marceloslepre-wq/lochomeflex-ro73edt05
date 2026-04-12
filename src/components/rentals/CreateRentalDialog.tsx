import { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Trash2 } from 'lucide-react'
import useMainStore, { Rental } from '@/stores/main'
import { useToast } from '@/hooks/use-toast'
import { usePermissions } from '@/hooks/use-permissions'
import { useEffect } from 'react'

export function CreateRentalDialog({ onCreated }: { onCreated?: (rental: Rental) => void }) {
  const { customers, inventory, addRental } = useMainStore()
  const { toast } = useToast()
  const { can } = usePermissions()
  const [open, setOpen] = useState(false)

  const [customerId, setCustomerId] = useState('')
  const [selectedItemId, setSelectedItemId] = useState('')
  const [qty, setQty] = useState('1')
  const [items, setItems] = useState<{ itemId: string; qty: number }[]>([])
  const [dates, setDates] = useState({ start: '', end: '' })
  const [totalStr, setTotalStr] = useState('')

  const availableItems = useMemo(
    () => inventory.filter((i) => i.availableQty > 0 && i.conditionStatus === 'Disponível'),
    [inventory],
  )

  useEffect(() => {
    if (dates.start && dates.end && items.length > 0) {
      const start = new Date(dates.start)
      const end = new Date(dates.end)
      const diffTime = end.getTime() - start.getTime()
      let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      if (diffDays <= 0) diffDays = 1 // Minimum 1 day

      let total = 0
      items.forEach((ri) => {
        const item = inventory.find((i) => i.id === ri.itemId)
        if (item) {
          total += (item.dailyPrice || 0) * ri.qty * diffDays
        }
      })
      setTotalStr(Math.round(total).toFixed(2))
    }
  }, [dates, items, inventory])

  if (!can('rentals:manage')) return null

  const handleAddItem = () => {
    if (!selectedItemId) return
    const item = inventory.find((i) => i.id === selectedItemId)
    const numQty = parseInt(qty)
    if (!item || isNaN(numQty) || numQty <= 0) return

    if (item.conditionStatus !== 'Disponível') {
      toast({
        title: 'Item Indisponível',
        description: 'Este item está marcado como indisponível ou em manutenção.',
        variant: 'destructive',
      })
      return
    }

    if (numQty > item.availableQty) {
      toast({
        title: 'Erro',
        description: `Apenas ${item.availableQty} unidades disponíveis.`,
        variant: 'destructive',
      })
      return
    }

    setItems((prev) => {
      const existing = prev.find((p) => p.itemId === selectedItemId)
      if (existing) {
        if (existing.qty + numQty > item.availableQty) {
          toast({
            title: 'Erro',
            description: 'Quantidade excede o estoque.',
            variant: 'destructive',
          })
          return prev
        }
        return prev.map((p) => (p.itemId === selectedItemId ? { ...p, qty: p.qty + numQty } : p))
      }
      return [...prev, { itemId: selectedItemId, qty: numQty }]
    })
    setQty('1')
    setSelectedItemId('')
  }

  const handleRemoveItem = (id: string) => setItems((prev) => prev.filter((p) => p.itemId !== id))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerId || items.length === 0 || !dates.start || !dates.end || !totalStr) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos e adicione itens.',
        variant: 'destructive',
      })
      return
    }

    const newId = `LOC-${Math.floor(1000 + Math.random() * 9000)}`
    const createdRental = await addRental({
      id: newId,
      customerId,
      items,
      startDate: dates.start,
      expectedReturnDate: dates.end,
      status: 'Ativo',
      total: parseFloat(totalStr),
    })

    if (createdRental) {
      toast({
        title: 'Locação Criada',
        description: `Contrato ${createdRental.contractNumber || newId} gerado com sucesso.`,
      })
      if (onCreated) {
        onCreated(createdRental)
      }
    } else {
      toast({ title: 'Locação Criada localmente', description: `Contrato gerado.` })
    }

    setOpen(false)
    setCustomerId('')
    setItems([])
    setDates({ start: '', end: '' })
    setTotalStr('')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> Nova Locação
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Nova Locação</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="grid gap-2">
            <Label>Cliente</Label>
            <Select value={customerId} onValueChange={setCustomerId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o cliente" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-md p-4 bg-muted/30 space-y-4">
            <Label className="text-base">Adicionar Itens</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableItems.map((i) => (
                      <SelectItem key={i.id} value={i.id}>
                        {i.name} (Disp: {i.availableQty})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Input
                type="number"
                min="1"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="w-24"
                placeholder="Qtd"
              />
              <Button type="button" variant="secondary" onClick={handleAddItem}>
                Adicionar
              </Button>
            </div>

            {items.length > 0 && (
              <ul className="divide-y border rounded-md bg-background mt-4">
                {items.map((ri) => {
                  const item = inventory.find((i) => i.id === ri.itemId)
                  return (
                    <li key={ri.itemId} className="p-3 flex justify-between items-center text-sm">
                      <span>
                        {ri.qty}x {item?.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleRemoveItem(ri.itemId)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Data de Retirada</Label>
              <Input
                type="date"
                value={dates.start}
                onChange={(e) => setDates((d) => ({ ...d, start: e.target.value }))}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>Devolução Prevista</Label>
              <Input
                type="date"
                value={dates.end}
                onChange={(e) => setDates((d) => ({ ...d, end: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid gap-2 w-1/3">
            <Label>Valor Total (R$)</Label>
            <Input
              type="number"
              step="0.01"
              value={totalStr}
              onChange={(e) => setTotalStr(e.target.value)}
              required
              placeholder="0.00"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Gerar Contrato</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
