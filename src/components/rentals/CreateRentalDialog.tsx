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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Trash2, Check, ChevronsUpDown } from 'lucide-react'
import useMainStore, { Rental, RentalItem } from '@/stores/main'
import { useToast } from '@/hooks/use-toast'
import { usePermissions } from '@/hooks/use-permissions'
import { cn } from '@/lib/utils'

export function CreateRentalDialog({ onCreated }: { onCreated?: (rental: Rental) => void }) {
  const { customers, inventory, addRental, settings } = useMainStore()
  const { toast } = useToast()
  const { can } = usePermissions()
  const [open, setOpen] = useState(false)

  const [customerId, setCustomerId] = useState('')
  const [selectedItemId, setSelectedItemId] = useState('')
  const [qty, setQty] = useState('1')
  const [items, setItems] = useState<RentalItem[]>([])
  const [pickupLocationId, setPickupLocationId] = useState('')
  const [defaultDuration, setDefaultDuration] = useState<number | null>(null)

  const [customerOpen, setCustomerOpen] = useState(false)
  const [itemOpen, setItemOpen] = useState(false)

  const applyDuration = (days: number) => {
    setDefaultDuration(days)
    const start = new Date(todayStr)
    const end = new Date(todayStr)
    end.setDate(end.getDate() + days)
    const endStr = end.toISOString().split('T')[0]

    setItems((prev) =>
      prev.map((p) => {
        const dailyPrice = p.dailyPrice || 0
        const diffTime = end.getTime() - start.getTime()
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        if (diffDays <= 0) diffDays = 1

        return {
          ...p,
          startDate: todayStr,
          endDate: endStr,
          totalPrice: dailyPrice * p.qty * diffDays,
        }
      }),
    )
  }

  const availableItems = useMemo(
    () => inventory.filter((i) => i.availableQty > 0 && i.conditionStatus === 'Disponível'),
    [inventory],
  )

  const todayStr = new Date().toISOString().split('T')[0]

  const finalTotal = useMemo(() => {
    const rawTotal = items.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0)
    return Math.round(rawTotal)
  }, [items])

  if (!can('rentals:manage')) return null

  const handleAddItem = () => {
    if (!selectedItemId) return
    const item = inventory.find((i) => i.id === selectedItemId)
    const numQty = parseInt(qty)
    if (!item || isNaN(numQty) || numQty <= 0) return

    if (numQty > item.availableQty) {
      toast({
        title: 'Erro',
        description: `Apenas ${item.availableQty} unidades disponíveis.`,
        variant: 'destructive',
      })
      return
    }

    const start = new Date(todayStr)
    const end = new Date(todayStr)
    if (defaultDuration) {
      end.setDate(end.getDate() + defaultDuration)
    }
    const endStr = end.toISOString().split('T')[0]
    const diffTime = end.getTime() - start.getTime()
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    if (diffDays <= 0) diffDays = 1

    setItems((prev) => {
      const newItemId = Math.random().toString()
      return [
        ...prev,
        {
          id: newItemId,
          itemId: selectedItemId,
          qty: numQty,
          startDate: todayStr,
          endDate: endStr,
          dailyPrice: item.dailyPrice || 0,
          totalPrice: (item.dailyPrice || 0) * numQty * diffDays,
        },
      ]
    })
    setQty('1')
    setSelectedItemId('')
  }

  const updateItem = (id: string, field: keyof RentalItem, value: any) => {
    setItems((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p
        const updated = { ...p, [field]: value }

        if (
          field === 'startDate' ||
          field === 'endDate' ||
          field === 'dailyPrice' ||
          field === 'qty'
        ) {
          const start = new Date(updated.startDate || todayStr)
          const end = new Date(updated.endDate || todayStr)
          const diffTime = end.getTime() - start.getTime()
          let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
          if (diffDays <= 0) diffDays = 1

          updated.totalPrice = (updated.dailyPrice || 0) * updated.qty * diffDays
        }
        return updated
      }),
    )
  }

  const handleRemoveItem = (id: string) => setItems((prev) => prev.filter((p) => p.id !== id))

  const generateContractHtml = (total: number) => {
    const customer = customers.find((c) => c.id === customerId)
    if (!customer) return ''

    let html = settings.contractTemplateHtml || ''
    if (!html) return ''

    const cAddr = (customer.address as any) || {}
    const addressStr = cAddr.street
      ? `${cAddr.street}, ${cAddr.number || 'S/N'}${cAddr.complement ? ' - ' + cAddr.complement : ''} - ${cAddr.neighborhood || ''} - ${cAddr.city || ''}/${cAddr.state || ''} - CEP: ${cAddr.zipCode || ''}`
      : 'Não informado'
    const phoneStr =
      [customer?.phone_cell, customer?.phone_res, customer?.phone_com]
        .filter(Boolean)
        .join(' / ') || 'Não informado'

    let locationName = 'Não informado'
    if (pickupLocationId === 'delivery') locationName = 'Entrega no Endereço do Cliente'
    else if (pickupLocationId) {
      const loc = (settings.locations as any[])?.find((l: any) => l.id === pickupLocationId)
      if (loc) {
        locationName = `${loc.name} - ${loc.address || ''}`
      }
    }
    locationName = locationName
      .replace(/ - CEP: Sem CEP/gi, '')
      .replace(/CEP: Sem CEP/gi, '')
      .trim()

    const startDates = items.map((i) => i.startDate || todayStr).sort()

    html = html.replace(/{{rentalId}}/g, 'Gerado ao salvar')
    html = html.replace(/{{companyName}}/g, settings.companyName || 'Lojas Hospital Home')
    html = html.replace(/{{companyDocument}}/g, settings.companyDocument || '10.893.738/0006-93')
    html = html.replace(
      /{{companyAddress}}/g,
      settings.companyAddress ||
        'rua Manoel Vivacqua, n. 616, Jabuor, Vitória – ES. CEP: 29072-045',
    )

    html = html.replace(/{{customerName}}/g, customer?.name || '')
    html = html.replace(/{{customerDocument}}/g, customer?.document || '')
    html = html.replace(/{{customerAddress}}/g, addressStr)
    html = html.replace(/{{customerRg}}/g, (customer as any)?.rg || 'Não informado')
    html = html.replace(/{{customerPhone}}/g, phoneStr)
    html = html.replace(/{{pickupLocation}}/g, locationName)
    html = html.replace(
      /{{currentDate}}/g,
      new Date(startDates[0] || todayStr).toLocaleDateString('pt-BR'),
    )

    const itemsHtml = items
      .map((ri) => {
        const item = inventory.find((i) => i.id === ri.itemId)
        const start = new Date(ri.startDate || todayStr).toLocaleDateString('pt-BR')
        const end = new Date(ri.endDate || todayStr).toLocaleDateString('pt-BR')
        const totalValue = (ri.totalPrice || 0).toFixed(2)

        return `<tr>
        <td style="border: 1px solid #000; padding: 8px; text-align: center;">${ri.qty}</td>
        <td style="border: 1px solid #000; padding: 8px;">${item?.name || 'Item Removido'}</td>
        <td style="border: 1px solid #000; padding: 8px;">${item?.code || '-'}</td>
        <td style="border: 1px solid #000; padding: 8px; text-align: center;">${start}</td>
        <td style="border: 1px solid #000; padding: 8px; text-align: center;">${end}</td>
        <td style="border: 1px solid #000; padding: 8px; text-align: right;">${totalValue}</td>
      </tr>`
      })
      .join('')

    html = html.replace(/{{itemsList}}/g, itemsHtml)
    return html
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerId || items.length === 0) {
      toast({
        title: 'Erro',
        description: 'Selecione um cliente e adicione itens.',
        variant: 'destructive',
      })
      return
    }

    const startDates = items.map((i) => i.startDate || todayStr).sort()
    const endDates = items.map((i) => i.endDate || todayStr).sort()

    const newId = `LOC-${Math.floor(1000 + Math.random() * 9000)}`

    const customHtml = generateContractHtml(finalTotal)

    const createdRental = await addRental({
      id: newId,
      customerId,
      pickupLocationId,
      items: items.map((i) => ({
        itemId: i.itemId,
        qty: i.qty,
        startDate: i.startDate,
        endDate: i.endDate,
        dailyPrice: i.dailyPrice,
        totalPrice: i.totalPrice,
      })),
      startDate: startDates[0],
      expectedReturnDate: endDates[endDates.length - 1],
      status: 'Ativo',
      total: finalTotal,
      customContractHtml: customHtml,
    } as any)

    if (createdRental) {
      toast({
        title: 'Locação Criada',
        description: `Contrato ${createdRental.contractNumber || newId} gerado com sucesso.`,
      })
      if (onCreated) {
        onCreated(createdRental)
      }
    }

    setOpen(false)
    setCustomerId('')
    setItems([])
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> Nova Locação
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Nova Locação</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="grid gap-2">
            <Label>Cliente</Label>
            <Popover open={customerOpen} onOpenChange={setCustomerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={customerOpen}
                  className="w-full justify-between"
                >
                  {customerId
                    ? customers.find((c) => c.id === customerId)?.name
                    : 'Selecione o cliente...'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Buscar cliente por nome ou CPF/CNPJ..." />
                  <CommandList>
                    <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
                    <CommandGroup>
                      {customers.map((c) => (
                        <CommandItem
                          key={c.id}
                          value={`${c.name} ${c.document}`}
                          onSelect={() => {
                            setCustomerId(c.id)
                            setCustomerOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              customerId === c.id ? 'opacity-100' : 'opacity-0',
                            )}
                          />
                          {c.name} ({c.document})
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <Label>Local de Retirada / Entrega</Label>
            <Select value={pickupLocationId} onValueChange={setPickupLocationId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o local..." />
              </SelectTrigger>
              <SelectContent>
                {(settings.locations as any[])?.map((loc) => (
                  <SelectItem key={loc.id} value={loc.id}>
                    {loc.name}
                  </SelectItem>
                ))}
                <SelectItem value="delivery">Entrega no Endereço do Cliente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-md p-4 bg-muted/30 space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base">Adicionar Itens</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={defaultDuration === 15 ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => applyDuration(15)}
                >
                  15 Dias
                </Button>
                <Button
                  type="button"
                  variant={defaultDuration === 30 ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => applyDuration(30)}
                >
                  30 Dias
                </Button>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <Popover open={itemOpen} onOpenChange={setItemOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={itemOpen}
                      className="w-full justify-between"
                    >
                      {selectedItemId
                        ? inventory.find((i) => i.id === selectedItemId)?.name
                        : 'Selecione o modelo...'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Buscar item (nome ou referência)..." />
                      <CommandList>
                        <CommandEmpty>Nenhum modelo disponível.</CommandEmpty>
                        <CommandGroup>
                          {availableItems.map((i) => (
                            <CommandItem
                              key={i.id}
                              value={`${i.name} ${i.code}`}
                              onSelect={() => {
                                setSelectedItemId(i.id)
                                setItemOpen(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  selectedItemId === i.id ? 'opacity-100' : 'opacity-0',
                                )}
                              />
                              {i.name} (Ref: {i.code}) - Disp: {i.availableQty}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
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
              <div className="mt-4 border rounded-md bg-background overflow-x-auto">
                <table className="w-full text-sm min-w-[700px]">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-2 text-left">Item</th>
                      <th className="p-2 text-left w-36">Retirada</th>
                      <th className="p-2 text-left w-36">Devolução</th>
                      <th className="p-2 text-right w-28">Diária (R$)</th>
                      <th className="p-2 text-right w-28">Total (R$)</th>
                      <th className="p-2 text-center w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((ri) => {
                      const item = inventory.find((i) => i.id === ri.itemId)
                      return (
                        <tr key={ri.id} className="border-b last:border-0">
                          <td className="p-2">
                            {ri.qty}x {item?.name}
                          </td>
                          <td className="p-2">
                            <Input
                              type="date"
                              className="h-8 text-xs"
                              value={ri.startDate}
                              onChange={(e) => updateItem(ri.id!, 'startDate', e.target.value)}
                            />
                          </td>
                          <td className="p-2">
                            <Input
                              type="date"
                              className="h-8 text-xs"
                              value={ri.endDate}
                              onChange={(e) => updateItem(ri.id!, 'endDate', e.target.value)}
                            />
                          </td>
                          <td className="p-2">
                            <Input
                              type="number"
                              className="h-8 text-xs text-right"
                              value={ri.dailyPrice}
                              onChange={(e) =>
                                updateItem(ri.id!, 'dailyPrice', parseFloat(e.target.value) || 0)
                              }
                            />
                          </td>
                          <td className="p-2 font-medium text-right">
                            {ri.totalPrice?.toFixed(2)}
                          </td>
                          <td className="p-2 text-center">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-destructive"
                              onClick={() => handleRemoveItem(ri.id!)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="flex justify-end items-center mt-4 border-t pt-4">
            <div className="text-right">
              <span className="text-sm text-muted-foreground mr-4">Total Arredondado:</span>
              <span className="text-2xl font-bold">R$ {finalTotal.toFixed(2)}</span>
            </div>
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
