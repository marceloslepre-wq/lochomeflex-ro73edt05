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
import { Plus, Edit } from 'lucide-react'
import useMainStore, { Customer } from '@/stores/main'
import { useToast } from '@/hooks/use-toast'

export function CustomerFormDialog({ customer }: { customer?: Customer }) {
  const { addCustomer, updateCustomer } = useMainStore()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)

  const [formData, setFormData] = useState({
    name: customer?.name || '',
    document: customer?.document || '',
    phone: customer?.phone || '',
    email: customer?.email || '',
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
      setFormData({ name: '', document: '', phone: '', email: '' })
    }
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{customer ? 'Editar Cliente' : 'Cadastrar Novo Cliente'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid gap-2">
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
          <div className="grid gap-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
            />
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
