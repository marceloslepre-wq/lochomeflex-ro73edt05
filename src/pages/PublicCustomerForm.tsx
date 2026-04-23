import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { Address } from '@/stores/main'
import { customerService } from '@/services/customers'
import { useToast } from '@/hooks/use-toast'

const emptyAddress: Address = {
  street: '',
  number: '',
  neighborhood: '',
  city: '',
  state: '',
  zipCode: '',
}

export default function PublicCustomerForm() {
  const { toast } = useToast()
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
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
    attachment: '',
  })

  const [docError, setDocError] = useState('')

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (file.type.startsWith('image/')) {
          const img = new Image()
          img.onload = () => {
            const canvas = document.createElement('canvas')
            const MAX_WIDTH = 1024
            const MAX_HEIGHT = 1024
            let width = img.width
            let height = img.height

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width
                width = MAX_WIDTH
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height
                height = MAX_HEIGHT
              }
            }

            canvas.width = width
            canvas.height = height
            const ctx = canvas.getContext('2d')
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height)
              const dataUrl = canvas.toDataURL('image/jpeg', 0.6)
              setFormData((f) => ({ ...f, attachment: dataUrl }))
            } else {
              setFormData((f) => ({ ...f, attachment: reader.result as string }))
            }
          }
          img.src = reader.result as string
        } else {
          setFormData((f) => ({ ...f, attachment: reader.result as string }))
        }
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

      const payload: any = { ...formData, matricula: 'AUTO' }
      delete payload.phone
      payload.phone_cell = formData.phoneCell || formData.phoneRes || formData.phoneCom

      await customerService.createCustomer(payload)

      setSubmitted(true)
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar o formulário.',
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

  if (submitted) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center py-8">
          <CardContent className="space-y-4 flex flex-col items-center pt-6">
            <CheckCircle2 className="w-16 h-16 text-primary" />
            <h2 className="text-2xl font-bold">Cadastro Concluído!</h2>
            <p className="text-muted-foreground">
              Seus dados foram enviados com sucesso. Nossa equipe já recebeu as informações.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Cadastro de Cliente</CardTitle>
            <CardDescription>
              Por favor, preencha os dados abaixo para realizar o seu cadastro.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="public-customer-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Nome Completo / Razão Social:</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                    required
                    placeholder="Digite seu nome completo ou razão social"
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
                    placeholder="Digite seu CPF ou CNPJ"
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
                    placeholder="Rua, Avenida, etc."
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
                    <Label>Telefone Residencial:</Label>
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
                      required
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
                    required
                  />
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="different-delivery"
                      checked={formData.hasDifferentDeliveryAddress}
                      onCheckedChange={(c) =>
                        setFormData((f) => ({ ...f, hasDifferentDeliveryAddress: !!c }))
                      }
                    />
                    <Label htmlFor="different-delivery" className="font-semibold cursor-pointer">
                      Utilizar endereço diferente para entrega
                    </Label>
                  </div>

                  {formData.hasDifferentDeliveryAddress && (
                    <div className="grid gap-4 pl-6 border-l-2 border-primary/20 mt-4">
                      <div className="grid gap-2">
                        <Label>CEP:</Label>
                        <Input
                          value={formData.deliveryAddress?.zipCode || ''}
                          onChange={(e) => updateAddress('zipCode', e.target.value, true)}
                          onBlur={(e) => fetchCep(e.target.value, true)}
                          placeholder="Apenas números"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Endereço de Entrega:</Label>
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
                    </div>
                  )}
                </div>

                <div className="grid gap-2 pt-4 border-t">
                  <Label>Documento de Identificação / Comprovante (Opcional):</Label>
                  <div className="flex flex-col gap-2">
                    {formData.attachment ? (
                      <div className="relative w-24 h-24 rounded border overflow-hidden">
                        {formData.attachment.startsWith('data:image') ? (
                          <img
                            src={formData.attachment}
                            alt="Anexo"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full bg-muted text-xs text-center p-1 break-words">
                            Arquivo Anexado
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
                        className="w-full cursor-pointer bg-background"
                      />
                    )}
                    <p className="text-xs text-muted-foreground">
                      Tire uma foto do seu documento ou anexe um arquivo.
                    </p>
                  </div>
                </div>

                <div className="grid gap-2 pt-4 border-t">
                  <Label>Observações Adicionais:</Label>
                  <Textarea
                    rows={3}
                    value={formData.observations}
                    onChange={(e) => setFormData((f) => ({ ...f, observations: e.target.value }))}
                    placeholder="Alguma informação adicional que gostaria de compartilhar?"
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-end gap-4 border-t p-6">
            <Button
              type="submit"
              form="public-customer-form"
              className="w-full sm:w-auto"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Enviar Cadastro
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
