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
import { CheckCircle2 } from 'lucide-react'
import useMainStore, { Address } from '@/stores/main'

const emptyAddress: Address = {
  street: '',
  number: '',
  neighborhood: '',
  city: '',
  state: '',
  zipCode: '',
}

export default function PublicCustomerForm() {
  const { addCustomer, customers } = useMainStore()
  const [submitted, setSubmitted] = useState(false)

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
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.document) return

    const nextMatricula = (customers?.length || 0) + 1
    const generatedMatricula = String(nextMatricula).padStart(4, '0')

    addCustomer({
      id: Math.random().toString(),
      ...formData,
      matricula: generatedMatricula,
      phone: formData.phoneCell || formData.phoneRes || formData.phoneCom,
    })

    setSubmitted(true)
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
                    onChange={(e) => setFormData((f) => ({ ...f, document: e.target.value }))}
                    required
                    placeholder="Digite seu CPF ou CNPJ"
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

                <div className="grid gap-2">
                  <Label>CEP:</Label>
                  <Input
                    value={formData.address?.zipCode || ''}
                    onChange={(e) => updateAddress('zipCode', e.target.value)}
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
            <Button type="submit" form="public-customer-form" className="w-full sm:w-auto">
              Enviar Cadastro
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
