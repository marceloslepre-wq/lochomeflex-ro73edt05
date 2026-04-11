import { useState } from 'react'
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
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Edit } from 'lucide-react'
import useMainStore, { Customer, Address } from '@/stores/main'
import { useToast } from '@/hooks/use-toast'
import { ScrollArea } from '@/components/ui/scroll-area'

const emptyAddress: Address = {
  street: '',
  number: '',
  neighborhood: '',
  city: '',
  state: '',
  zipCode: '',
}

export function CustomerFormDialog({ customer }: { customer?: Customer }) {
  const { addCustomer, updateCustomer } = useMainStore()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)

  const [formData, setFormData] = useState({
    name: customer?.name || '',
    document: customer?.document || '',
    phone: customer?.phone || '',
    email: customer?.email || '',
    address: { ...emptyAddress, ...(customer?.address || {}) },
    hasDifferentDeliveryAddress: customer?.hasDifferentDeliveryAddress || false,
    deliveryAddress: { ...emptyAddress, ...(customer?.deliveryAddress || {}) },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.document) return

    if (customer) {
      updateCustomer(customer.id, formData)
      toast({ title: 'Cliente Atualizado', description: 'Dados salvos com sucesso.' })
    } else {
      addCustomer({
        id: Math.random().toString(),
        ...formData,
      })
      toast({ title: 'Cliente Cadastrado', description: `${formData.name} adicionado.` })
    }
    setOpen(false)
    if (!customer) {
      setFormData({
        name: '',
        document: '',
        phone: '',
        email: '',
        address: { ...emptyAddress },
        hasDifferentDeliveryAddress: false,
        deliveryAddress: { ...emptyAddress },
      })
    }
  }

  const updateAddress = (field: keyof Address, value: string, isDelivery: boolean = false) => {
    setFormData((prev) => {
      if (isDelivery) {
        return { ...prev, deliveryAddress: { ...prev.deliveryAddress, [field]: value } }
      }
      return { ...prev, address: { ...prev.address, [field]: value } }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {customer ? (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-primary">
            <Edit className="w-4 h-4" />
          </Button>
        ) : (
          <Button>
            <Plus className="w-4 h-4 mr-2" /> Novo Cliente
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{customer ? 'Editar Cliente' : 'Cadastrar Novo Cliente'}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4 -mr-4">
          <form id="customer-form" onSubmit={handleSubmit} className="space-y-6 pt-4 pb-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Dados Principais</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2 col-span-2">
                  <Label>Nome / Razão Social</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Documento (CPF/CNPJ)</Label>
                  <Input
                    value={formData.document}
                    onChange={(e) => setFormData((f) => ({ ...f, document: e.target.value }))}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Telefone</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData((f) => ({ ...f, phone: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2 col-span-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 bg-muted/20 p-4 rounded-lg border">
              <h3 className="text-lg font-semibold border-b pb-2 text-primary">
                Endereço de Cadastro
              </h3>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="grid gap-2 col-span-2">
                  <Label htmlFor="street">Rua / Avenida</Label>
                  <Input
                    id="street"
                    placeholder="Ex: Av. Paulista"
                    value={formData.address?.street || ''}
                    onChange={(e) => updateAddress('street', e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="number">Número</Label>
                  <Input
                    id="number"
                    placeholder="Ex: 1000"
                    value={formData.address?.number || ''}
                    onChange={(e) => updateAddress('number', e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="neighborhood">Bairro</Label>
                  <Input
                    id="neighborhood"
                    placeholder="Ex: Bela Vista"
                    value={formData.address?.neighborhood || ''}
                    onChange={(e) => updateAddress('neighborhood', e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    placeholder="Ex: São Paulo"
                    value={formData.address?.city || ''}
                    onChange={(e) => updateAddress('city', e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    id="state"
                    placeholder="Ex: SP"
                    value={formData.address?.state || ''}
                    onChange={(e) => updateAddress('state', e.target.value)}
                  />
                </div>
                <div className="grid gap-2 col-span-2">
                  <Label htmlFor="zipCode">CEP</Label>
                  <Input
                    id="zipCode"
                    placeholder="Ex: 01310-100"
                    value={formData.address?.zipCode || ''}
                    onChange={(e) => updateAddress('zipCode', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2 border-b pb-2">
                <Checkbox
                  id="different-delivery"
                  checked={formData.hasDifferentDeliveryAddress}
                  onCheckedChange={(c) =>
                    setFormData((f) => ({ ...f, hasDifferentDeliveryAddress: !!c }))
                  }
                />
                <Label htmlFor="different-delivery" className="text-lg font-medium cursor-pointer">
                  Endereço de entrega diferente do cadastro
                </Label>
              </div>

              {formData.hasDifferentDeliveryAddress && (
                <div className="grid grid-cols-2 gap-4 pt-4 mt-4 border-t border-dashed">
                  <div className="grid gap-2 col-span-2">
                    <Label htmlFor="delivery-street">Rua / Avenida (Entrega)</Label>
                    <Input
                      id="delivery-street"
                      placeholder="Ex: Rua Direita"
                      value={formData.deliveryAddress?.street || ''}
                      onChange={(e) => updateAddress('street', e.target.value, true)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="delivery-number">Número (Entrega)</Label>
                    <Input
                      id="delivery-number"
                      placeholder="Ex: 200"
                      value={formData.deliveryAddress?.number || ''}
                      onChange={(e) => updateAddress('number', e.target.value, true)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="delivery-neighborhood">Bairro (Entrega)</Label>
                    <Input
                      id="delivery-neighborhood"
                      placeholder="Ex: Centro"
                      value={formData.deliveryAddress?.neighborhood || ''}
                      onChange={(e) => updateAddress('neighborhood', e.target.value, true)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="delivery-city">Cidade (Entrega)</Label>
                    <Input
                      id="delivery-city"
                      placeholder="Ex: São Paulo"
                      value={formData.deliveryAddress?.city || ''}
                      onChange={(e) => updateAddress('city', e.target.value, true)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="delivery-state">Estado (Entrega)</Label>
                    <Input
                      id="delivery-state"
                      placeholder="Ex: SP"
                      value={formData.deliveryAddress?.state || ''}
                      onChange={(e) => updateAddress('state', e.target.value, true)}
                    />
                  </div>
                  <div className="grid gap-2 col-span-2">
                    <Label htmlFor="delivery-zipCode">CEP (Entrega)</Label>
                    <Input
                      id="delivery-zipCode"
                      placeholder="Ex: 01002-000"
                      value={formData.deliveryAddress?.zipCode || ''}
                      onChange={(e) => updateAddress('zipCode', e.target.value, true)}
                    />
                  </div>
                </div>
              )}
            </div>
          </form>
        </ScrollArea>
        <DialogFooter className="pt-4 border-t mt-2">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button type="submit" form="customer-form">
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
