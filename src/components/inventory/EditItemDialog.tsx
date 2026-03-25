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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Edit } from 'lucide-react'
import useMainStore, { InventoryItem } from '@/stores/main'
import { useToast } from '@/hooks/use-toast'
import { usePermissions } from '@/hooks/use-permissions'

export function EditItemDialog({ item }: { item: InventoryItem }) {
  const { updateInventoryItem } = useMainStore()
  const { toast } = useToast()
  const { can } = usePermissions()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: item.name,
    code: item.code,
    category: item.category,
    qty: item.totalQty.toString(),
    description: item.description || '',
    image: item.image,
    conditionStatus: item.conditionStatus,
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

    const diff = qty - item.totalQty
    const newAvailable = Math.max(0, item.availableQty + diff)

    updateInventoryItem(item.id, {
      name: formData.name,
      code: formData.code,
      category: formData.category || 'Geral',
      description: formData.description,
      totalQty: qty,
      availableQty: newAvailable,
      image: formData.image || item.image,
      conditionStatus: formData.conditionStatus,
    })

    toast({ title: 'Item Atualizado', description: `${formData.name} modificado com sucesso.` })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Editar">
          <Edit className="w-4 h-4 text-primary" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Item: {item.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid gap-2">
            <Label>Nome do Modelo</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Código (SKU)</Label>
              <Input
                value={formData.code}
                onChange={(e) => setFormData((f) => ({ ...f, code: e.target.value }))}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>Categoria</Label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData((f) => ({ ...f, category: e.target.value }))}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Descrição</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))}
              className="resize-none h-20"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Estoque Total</Label>
              <Input
                type="number"
                min={item.rentedQty}
                value={formData.qty}
                onChange={(e) => setFormData((f) => ({ ...f, qty: e.target.value }))}
                required
                title={`Não pode ser menor que locados (${item.rentedQty})`}
              />
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select
                value={formData.conditionStatus}
                onValueChange={(v) => setFormData((f) => ({ ...f, conditionStatus: v as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Disponível">Disponível</SelectItem>
                  <SelectItem value="Manutenção">Em Manutenção</SelectItem>
                  <SelectItem value="Indisponível">Indisponível</SelectItem>
                  <SelectItem value="Esgotado">Esgotado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Alterar Imagem</Label>
            <Input
              type="file"
              accept="image/jpeg, image/png, image/webp"
              onChange={handleImageUpload}
            />
          </div>
          {formData.image && (
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
            <Button type="submit">Salvar Alterações</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
