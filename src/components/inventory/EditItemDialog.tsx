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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Edit, Plus, Trash2, Upload } from 'lucide-react'
import useMainStore, { InventoryItem, Asset } from '@/stores/main'
import { useToast } from '@/hooks/use-toast'
import { usePermissions } from '@/hooks/use-permissions'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

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
    assets: item.assets || [],
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

  const handleAssetImageUpload = (e: React.ChangeEvent<HTMLInputElement>, assetId: string) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((f) => ({
          ...f,
          assets: f.assets.map((a) =>
            a.id === assetId ? { ...a, image: reader.result as string } : a,
          ),
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const addAsset = () => {
    const newAsset: Asset = {
      id: Math.random().toString(),
      assetNumber: `PAT-${Math.floor(Math.random() * 10000)}`,
      conditionStatus: 'Disponível',
    }
    setFormData((f) => ({
      ...f,
      assets: [...f.assets, newAsset],
      qty: (parseInt(f.qty || '0') + 1).toString(),
    }))
  }

  const removeAsset = (id: string) => {
    setFormData((f) => ({
      ...f,
      assets: f.assets.filter((a) => a.id !== id),
      qty: Math.max(0, parseInt(f.qty || '0') - 1).toString(),
    }))
  }

  const updateAssetStatus = (id: string, status: any) => {
    setFormData((f) => ({
      ...f,
      assets: f.assets.map((a) => (a.id === id ? { ...a, conditionStatus: status } : a)),
    }))
  }

  const updateAssetNumber = (id: string, number: string) => {
    setFormData((f) => ({
      ...f,
      assets: f.assets.map((a) => (a.id === id ? { ...a, assetNumber: number } : a)),
    }))
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
      assets: formData.assets,
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
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Editar Item: {item.name}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="geral" className="flex-1 mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="geral">Dados Gerais</TabsTrigger>
            <TabsTrigger value="patrimonio">Unidades e Patrimônio</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[450px] mt-4 pr-4">
            <form id="edit-item-form" onSubmit={handleSubmit}>
              <TabsContent value="geral" className="space-y-4 mt-0">
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
                    <Label>Estoque Total (Geral)</Label>
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
                      onValueChange={(v) =>
                        setFormData((f) => ({ ...f, conditionStatus: v as any }))
                      }
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
                  <Label>Alterar Imagem Principal</Label>
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
              </TabsContent>

              <TabsContent value="patrimonio" className="space-y-4 mt-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Gestão de Unidades</h3>
                    <p className="text-sm text-muted-foreground">
                      Controle detalhado por patrimônio.
                    </p>
                  </div>
                  <Button type="button" size="sm" onClick={addAsset}>
                    <Plus className="w-4 h-4 mr-2" /> Adicionar Unidade
                  </Button>
                </div>

                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">Foto</TableHead>
                        <TableHead>Nº Patrimônio</TableHead>
                        <TableHead>Estado de Uso</TableHead>
                        <TableHead className="text-right">Ação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {formData.assets.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                            Nenhuma unidade individual registrada.
                          </TableCell>
                        </TableRow>
                      ) : (
                        formData.assets.map((asset) => (
                          <TableRow key={asset.id}>
                            <TableCell>
                              <div className="relative group w-10 h-10 rounded border overflow-hidden">
                                {asset.image ? (
                                  <img
                                    src={asset.image}
                                    alt="Asset"
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                                    <Upload className="w-4 h-4" />
                                  </div>
                                )}
                                <input
                                  type="file"
                                  title="Atualizar Foto"
                                  className="absolute inset-0 opacity-0 cursor-pointer"
                                  accept="image/*"
                                  onChange={(e) => handleAssetImageUpload(e, asset.id)}
                                />
                              </div>
                            </TableCell>
                            <TableCell>
                              <Input
                                value={asset.assetNumber}
                                onChange={(e) => updateAssetNumber(asset.id, e.target.value)}
                                className="h-8"
                              />
                            </TableCell>
                            <TableCell>
                              <Select
                                value={asset.conditionStatus}
                                onValueChange={(v) => updateAssetStatus(asset.id, v)}
                              >
                                <SelectTrigger className="h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Disponível">Disponível</SelectItem>
                                  <SelectItem value="Manutenção">Em Manutenção</SelectItem>
                                  <SelectItem value="Indisponível">Indisponível</SelectItem>
                                  <SelectItem value="Esgotado">Esgotado</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-destructive h-8 w-8"
                                onClick={() => removeAsset(asset.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </form>
          </ScrollArea>
        </Tabs>

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
