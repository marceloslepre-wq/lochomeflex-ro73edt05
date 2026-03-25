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
import { Textarea } from '@/components/ui/textarea'
import { Plus } from 'lucide-react'
import useMainStore from '@/stores/main'
import { useToast } from '@/hooks/use-toast'
import { usePermissions } from '@/hooks/use-permissions'

export function CreateItemDialog() {
  const { addInventoryItem } = useMainStore()
  const { toast } = useToast()
  const { can } = usePermissions()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: '',
    qty: '',
    description: '',
    image: '',
  })

  if (!can('items:write')) return null

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((f) => ({ ...f, image: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const qty = parseInt(formData.qty, 10)
    if (!formData.name || !formData.code || isNaN(qty)) return

    addInventoryItem({
      id: Math.random().toString(),
      name: formData.name,
      code: formData.code,
      category: formData.category || 'Geral',
      description: formData.description,
      totalQty: qty,
      availableQty: qty,
      rentedQty: 0,
      conditionStatus: 'Disponível',
      image:
        formData.image ||
        `https://img.usecurling.com/p/200/200?q=${encodeURIComponent(formData.category || 'tool')}`,
    })

    toast({ title: 'Item Cadastrado', description: `${formData.name} adicionado ao estoque.` })
    setOpen(false)
    setFormData({ name: '', code: '', category: '', qty: '', description: '', image: '' })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> Novo Modelo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Modelo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid gap-2">
            <Label>Nome do Modelo</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
              required
              placeholder="Ex: Furadeira Makita"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Código (SKU)</Label>
              <Input
                value={formData.code}
                onChange={(e) => setFormData((f) => ({ ...f, code: e.target.value }))}
                required
                placeholder="FUR-002"
              />
            </div>
            <div className="grid gap-2">
              <Label>Categoria</Label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData((f) => ({ ...f, category: e.target.value }))}
                placeholder="Ferramentas"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Descrição</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))}
              placeholder="Detalhes adicionais do equipamento..."
              className="resize-none h-20"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Upload de Imagem</Label>
              <Input
                type="file"
                accept="image/jpeg, image/png, image/webp"
                onChange={handleImageUpload}
              />
            </div>
            <div className="grid gap-2">
              <Label>Quantidade Inicial</Label>
              <Input
                type="number"
                min="1"
                value={formData.qty}
                onChange={(e) => setFormData((f) => ({ ...f, qty: e.target.value }))}
                required
              />
            </div>
          </div>
          {formData.image && formData.image.startsWith('data:') && (
            <div className="flex justify-center mt-2">
              <img
                src={formData.image}
                alt="Preview"
                className="h-24 w-24 object-cover rounded shadow-sm border"
              />
            </div>
          )}
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
