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
    attachment: (customer as any)?.attachment || '',
  })

  const [docError, setDocError] = useState('')

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((f) => ({ ...f, attachment: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const validateDocument = (doc: string) => {
    const cleanDoc = doc.replace(/\D/g, '')
    if (cleanDoc.length === 11) {
      if (/^(\d)\1+$/.test(cleanDoc)) return false
      let sum = 0,
        rest
      for (let i = 1; i <= 9; i++) sum += parseInt(cleanDoc.substring(i - 1, i)) * (11 - i)
      rest = (sum * 10) % 11
      if (rest === 10 || rest === 11) rest = 0
      if (rest !== parseInt(cleanDoc.substring(9, 10))) return false
      sum = 0
      for (let i = 1; i <= 10; i++) sum += parseInt(cleanDoc.substring(i - 1, i)) * (12 - i)
      rest = (sum * 10) % 11
      if (rest === 10 || rest === 11) rest = 0
      if (rest !== parseInt(cleanDoc.substring(10, 11))) return false
      return true
    } else if (cleanDoc.length === 14) {
      if (/^(\d)\1+$/.test(cleanDoc)) return false
      let size = cleanDoc.length - 2
      let numbers = cleanDoc.substring(0, size)
      const digits = cleanDoc.substring(size)
      let sum = 0,
        pos = size - 7
      for (let i = size; i >= 1; i--) {
        sum += parseInt(numbers.charAt(size - i)) * pos--
        if (pos < 2) pos = 9
      }
      let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
      if (result !== parseInt(digits.charAt(0))) return false
      size = size + 1
      numbers = cleanDoc.substring(0, size)
      sum = 0
      pos = size - 7
      for (let i = size; i >= 1; i--) {
        sum += parseInt(numbers.charAt(size - i)) * pos--
        if (pos < 2) pos = 9
      }
      result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
      if (result !== parseInt(digits.charAt(1))) return false
      return true
    }
    return false
  }

  const handleDocBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const isValid = validateDocument(e.target.value)
    if (!isValid && e.target.value.length > 0) {
      setDocError('CPF/CNPJ inválido')
    } else {
      setDocError('')
    }
  }

  const fetchCep = async (cep: string, isDelivery = false) => {
    const cleanCep = cep.replace(/\D/g, '')
    if (cleanCep.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
        const data = await res.json()
        if (!data.erro) {
          updateAddress('street', data.logradouro, isDelivery)
          updateAddress('neighborhood', data.bairro, isDelivery)
          updateAddress('city', data.localidade, isDelivery)
          updateAddress('state', data.uf, isDelivery)
        }
      } catch (e) {
        console.error(e)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.document) return
    if (!validateDocument(formData.document)) {
      toast({ title: 'Erro', description: 'CPF/CNPJ inválido', variant: 'destructive' })
      return
    }

    try {
      setLoading(true)
      const payload: any = { ...formData }
      delete payload.phone
      payload.phone_cell = formData.phoneCell || formData.phoneRes || formData.phoneCom

      if (customer) {
        await customerService.updateCustomer(customer.id, payload)
        toast({ title: 'Cliente Atualizado', description: 'Dados salvos com sucesso.' })
      } else {
        const nextMatricula = await customerService.getNextMatricula()
        payload.matricula = nextMatricula
        await customerService.createCustomer(payload)
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
                    onChange={(e) => {
                      setFormData((f) => ({ ...f, document: e.target.value }))
                      setDocError('')
                    }}
                    onBlur={handleDocBlur}
                    required
                    className={docError ? 'border-destructive' : ''}
                  />
                  {docError && <p className="text-xs text-destructive">{docError}</p>}
                </div>

                <div className="grid gap-2">
                  <Label>CEP:</Label>
                  <Input
                    value={formData.address?.zipCode || ''}
                    onChange={(e) => updateAddress('zipCode', e.target.value)}
                    onBlur={(e) => fetchCep(e.target.value)}
                    placeholder="Apenas números"
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
                  <Label>Documento / Foto (Opcional):</Label>
                  <div className="flex items-center gap-4">
                    {formData.attachment ? (
                      <div className="relative w-20 h-20 rounded border overflow-hidden">
                        {formData.attachment.startsWith('data:image') ? (
                          <img
                            src={formData.attachment}
                            alt="Anexo"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full bg-muted text-xs text-center p-1 break-words">
                            Arquivo
                          </div>
                        )}
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-0 right-0 h-6 w-6 rounded-none opacity-80 hover:opacity-100"
                          onClick={() => setFormData((f) => ({ ...f, attachment: '' }))}
                        >
                          <span className="sr-only">Remover</span>
                          &times;
                        </Button>
                      </div>
                    ) : (
                      <Input
                        type="file"
                        accept="image/*,.pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="w-full cursor-pointer"
                      />
                    )}
                  </div>
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
