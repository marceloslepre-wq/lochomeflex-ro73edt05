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
import { Textarea } from '@/components/ui/textarea'
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
  const { addCustomer, updateCustomer, customers } = useMainStore()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)

  const [formData, setFormData] = useState({
    matricula: (customer as any)?.matricula || '',
    name: customer?.name || '',
    document: customer?.document || '',
    phoneRes: (customer as any)?.phoneRes || '',
    phoneCell: (customer as any)?.phoneCell || customer?.phone || '',
    phoneCom: (customer as any)?.phoneCom || '',
    email: customer?.email || '',
    address: { ...emptyAddress, ...(customer?.address || {}) },
    hasDifferentDeliveryAddress: customer?.hasDifferentDeliveryAddress || false,
    deliveryAddress: { ...emptyAddress, ...(customer?.deliveryAddress || {}) },
    observations: (customer as any)?.observations || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.document) return

    if (customer) {
      updateCustomer(customer.id, { ...formData, phone: formData.phoneCell })
      toast({ title: 'Cliente Atualizado', description: 'Dados salvos com sucesso.' })
    } else {
      const nextMatricula = (customers?.length || 0) + 1
      const generatedMatricula = String(nextMatricula).padStart(4, '0')

      addCustomer({
        id: Math.random().toString(),
        ...formData,
        matricula: generatedMatricula,
        phone: formData.phoneCell,
      })
      toast({ title: 'Cliente Cadastrado', description: `${formData.name} adicionado.` })
    }
    setOpen(false)
    if (!customer) {
      setFormData({
        matricula: '',
        name: '',
        document: '',
        phoneRes: '',
        phoneCell: '',
        phoneCom: '',
        email: '',
        address: { ...emptyAddress },
        hasDifferentDeliveryAddress: false,
        deliveryAddress: { ...emptyAddress },
        observations: '',
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
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Formulário 12 Cadastro de clientes
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4 -mr-4">
          <form id="customer-form" onSubmit={handleSubmit} className="space-y-6 pt-4 pb-4">
            <div className="grid gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <Label className="text-muted-foreground font-medium">
                  Matricula: (após a inclusão gerar uma matricula por ordem numérica)
                </Label>
                <Input
                  disabled
                  value={customer ? formData.matricula : 'Gerado após salvar'}
                  className="bg-muted w-full sm:w-32 font-mono h-8"
                />
              </div>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Nome:</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label>CPF:</Label>
                  <Input
                    value={formData.document}
                    onChange={(e) => setFormData((f) => ({ ...f, document: e.target.value }))}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Endereço:</Label>
                  <Input
                    value={formData.address?.street || ''}
                    onChange={(e) => updateAddress('street', e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Bairro:</Label>
                  <Input
                    value={formData.address?.neighborhood || ''}
                    onChange={(e) => updateAddress('neighborhood', e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Cidade:</Label>
                  <Input
                    value={formData.address?.city || ''}
                    onChange={(e) => updateAddress('city', e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Estado:</Label>
                  <Input
                    value={formData.address?.state || ''}
                    onChange={(e) => updateAddress('state', e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Cep:</Label>
                  <Input
                    value={formData.address?.zipCode || ''}
                    onChange={(e) => updateAddress('zipCode', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label>Telefone residencial:</Label>
                    <Input
                      value={formData.phoneRes}
                      onChange={(e) => setFormData((f) => ({ ...f, phoneRes: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Telefone Celular:</Label>
                    <Input
                      value={formData.phoneCell}
                      onChange={(e) => setFormData((f) => ({ ...f, phoneCell: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Telefone Comercial:</Label>
                    <Input
                      value={formData.phoneCom}
                      onChange={(e) => setFormData((f) => ({ ...f, phoneCom: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>E-mail:</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
                  />
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="different-delivery"
                      checked={formData.hasDifferentDeliveryAddress}
                      onCheckedChange={(c) =>
                        setFormData((f) => ({ ...f, hasDifferentDeliveryAddress: !!c }))
                      }
                    />
                    <Label htmlFor="different-delivery" className="font-semibold cursor-pointer">
                      Endereço de entrega
                    </Label>
                  </div>

                  {formData.hasDifferentDeliveryAddress && (
                    <div className="grid gap-4 pl-6 border-l-2 border-muted mt-2">
                      <div className="grid gap-2">
                        <Label>Endereço:</Label>
                        <Input
                          value={formData.deliveryAddress?.street || ''}
                          onChange={(e) => updateAddress('street', e.target.value, true)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Bairro:</Label>
                        <Input
                          value={formData.deliveryAddress?.neighborhood || ''}
                          onChange={(e) => updateAddress('neighborhood', e.target.value, true)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Cidade:</Label>
                        <Input
                          value={formData.deliveryAddress?.city || ''}
                          onChange={(e) => updateAddress('city', e.target.value, true)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Estado:</Label>
                        <Input
                          value={formData.deliveryAddress?.state || ''}
                          onChange={(e) => updateAddress('state', e.target.value, true)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Cep:</Label>
                        <Input
                          value={formData.deliveryAddress?.zipCode || ''}
                          onChange={(e) => updateAddress('zipCode', e.target.value, true)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label>Observações:</Label>
                  <Textarea
                    rows={3}
                    value={formData.observations}
                    onChange={(e) => setFormData((f) => ({ ...f, observations: e.target.value }))}
                  />
                </div>
              </div>
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
