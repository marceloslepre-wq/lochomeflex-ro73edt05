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
import { Plus, Edit, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Address } from '@/stores/main'
import { customerService, Customer } from '@/services/customers'

const emptyAddress: Address = {
  street: '',
  number: '',
  neighborhood: '',
  city: '',
  state: '',
  zipCode: '',
}

export function CustomerFormDialog({
  customer,
  onSuccess,
}: {
  customer?: Customer
  onSuccess?: () => void
}) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    matricula: customer?.matricula || '',
    name: customer?.name || '',
    document: customer?.document || '',
    phoneRes: customer?.phoneRes || '',
    phoneCell: customer?.phoneCell || customer?.phone || '',
    phoneCom: customer?.phoneCom || '',
    email: customer?.email || '',
    address: { ...emptyAddress, ...(customer?.address || {}) },
    hasDifferentDeliveryAddress: customer?.hasDifferentDeliveryAddress || false,
    deliveryAddress: { ...emptyAddress, ...(customer?.deliveryAddress || {}) },
    observations: customer?.observations || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.document) return

    try {
      setLoading(true)
      if (customer) {
        await customerService.updateCustomer(customer.id, {
          ...formData,
          phone: formData.phoneCell,
        })
        toast({ title: 'Cliente Atualizado', description: 'Dados salvos com sucesso.' })
      } else {
        const nextMatricula = await customerService.getNextMatricula()
        await customerService.createCustomer({
          ...formData,
          matricula: nextMatricula,
          phone: formData.phoneCell,
        })
        toast({ title: 'Cliente Cadastrado', description: `${formData.name} adicionado.` })
      }
      setOpen(false)
      if (onSuccess) onSuccess()
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
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao salvar o cliente.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
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
          <DialogTitle className="text-xl font-bold">Cadastro de Cliente</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto pr-4 -mr-4">
          <form id="customer-form" onSubmit={handleSubmit} className="space-y-6 pt-4 pb-4">
            <div className="grid gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <Label className="text-muted-foreground font-medium">Matrícula:</Label>
                <Input
                  disabled
                  value={customer ? formData.matricula : ''}
                  className="bg-muted w-full sm:w-32 font-mono h-8"
                  placeholder={customer ? '' : 'Gerado após salvar'}
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
                  <Label>CPF / CNPJ:</Label>
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
                  <Label>CEP:</Label>
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
                        <Label>CEP:</Label>
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
        </div>
        <DialogFooter className="pt-4 border-t mt-2">
          <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" form="customer-form" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
