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
import { ScrollArea } from '@/components/ui/scroll-area'

export function EditItemDialog({ item }: { item: InventoryItem }) {
  const { updateInventoryItem, settings } = useMainStore()
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
    monthlyPrice: item.monthlyPrice?.toString() || '',
    dailyPrice: item.dailyPrice?.toString() || '',
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
      monthlyPrice: parseFloat(formData.monthlyPrice) || 0,
      dailyPrice: parseFloat(formData.dailyPrice) || 0,
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
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Editar Item: {item.name}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[450px] mt-4 pr-4">
          <form id="edit-item-form" onSubmit={handleSubmit} className="space-y-4">
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
                <Select
                  value={formData.category}
                  onValueChange={(v) => setFormData((f) => ({ ...f, category: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {settings.categories?.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Valor Mensal (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.monthlyPrice}
                  onChange={(e) => setFormData((f) => ({ ...f, monthlyPrice: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
              <div className="grid gap-2">
                <Label>Valor Diário (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.dailyPrice}
                  onChange={(e) => setFormData((f) => ({ ...f, dailyPrice: e.target.value }))}
                  placeholder="0.00"
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
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setFormData((f) => ({
                        ...f,
                        qty: Math.max(item.rentedQty, parseInt(f.qty) - 1).toString(),
                      }))
                    }
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    min={item.rentedQty}
                    value={formData.qty}
                    onChange={(e) => setFormData((f) => ({ ...f, qty: e.target.value }))}
                    required
                    className="text-center"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setFormData((f) => ({ ...f, qty: (parseInt(f.qty) + 1).toString() }))
                    }
                  >
                    +
                  </Button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Status Geral</Label>
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
          </form>
        </ScrollArea>

        <DialogFooter className="pt-4 border-t mt-4">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button type="submit" form="edit-item-form">
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
