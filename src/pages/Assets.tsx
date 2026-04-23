import { useState, useMemo } from 'react'
import useMainStore, { Asset, InventoryItem } from '@/stores/main'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Upload, Briefcase } from 'lucide-react'
import { ShareAssetLinkDialog } from '@/components/assets/ShareAssetLinkDialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function Assets() {
  const { inventory, updateInventoryItem } = useMainStore()
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [selectedModel, setSelectedModel] = useState<string>('all')

  const models = useMemo(() => {
    const uniqueItems = Array.from(new Map(inventory.map((item) => [item.name, item])).values())
    return uniqueItems.sort((a, b) => (a.code || '').localeCompare(b.code || ''))
  }, [inventory])

  const handleAssetImageUpload = (e: React.ChangeEvent<HTMLInputElement>, assetId: string) => {
    if (!selectedItem) return
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const newAssets = (selectedItem.assets || []).map((a) =>
          a.id === assetId ? { ...a, image: reader.result as string } : a,
        )
        updateInventoryItem(selectedItem.id, { assets: newAssets })
        setSelectedItem({ ...selectedItem, assets: newAssets })
      }
      reader.readAsDataURL(file)
    }
  }

  const addAsset = () => {
    if (!selectedItem) return
    const newAsset: any = {
      id: Math.random().toString(),
      assetNumber: `PAT-${Math.floor(Math.random() * 10000)}`,
      conditionStatus: 'Disponível',
      acquisitionDate: new Date().toISOString().split('T')[0],
    }
    const newAssets = [...(selectedItem.assets || []), newAsset]
    updateInventoryItem(selectedItem.id, {
      assets: newAssets,
      totalQty: selectedItem.totalQty + 1,
      availableQty: selectedItem.availableQty + 1,
    })
    setSelectedItem({
      ...selectedItem,
      assets: newAssets,
      totalQty: selectedItem.totalQty + 1,
      availableQty: selectedItem.availableQty + 1,
    })
  }

  const removeAsset = (id: string) => {
    if (!selectedItem) return
    const newAssets = (selectedItem.assets || []).filter((a) => a.id !== id)
    updateInventoryItem(selectedItem.id, {
      assets: newAssets,
      totalQty: Math.max(0, selectedItem.totalQty - 1),
      availableQty: Math.max(0, selectedItem.availableQty - 1),
    })
    setSelectedItem({
      ...selectedItem,
      assets: newAssets,
      totalQty: Math.max(0, selectedItem.totalQty - 1),
      availableQty: Math.max(0, selectedItem.availableQty - 1),
    })
  }

  const updateAssetStatus = (id: string, status: any) => {
    if (!selectedItem) return
    const newAssets = (selectedItem.assets || []).map((a) =>
      a.id === id ? { ...a, conditionStatus: status } : a,
    )
    updateInventoryItem(selectedItem.id, { assets: newAssets })
    setSelectedItem({ ...selectedItem, assets: newAssets })
  }

  const updateAssetNumber = (id: string, number: string) => {
    if (!selectedItem) return
    const newAssets = (selectedItem.assets || []).map((a) =>
      a.id === id ? { ...a, assetNumber: number } : a,
    )
    updateInventoryItem(selectedItem.id, { assets: newAssets })
    setSelectedItem({ ...selectedItem, assets: newAssets })
  }

  const updateAssetAcquisitionDate = (id: string, date: string) => {
    if (!selectedItem) return
    const newAssets = (selectedItem.assets || []).map((a: any) =>
      a.id === id ? { ...a, acquisitionDate: date } : a,
    )
    updateInventoryItem(selectedItem.id, { assets: newAssets })
    setSelectedItem({ ...selectedItem, assets: newAssets })
  }

  const [assetSearch, setAssetSearch] = useState('')

  const filteredInventory = inventory.filter((item) => {
    const matchesModel = selectedModel === 'all' || item.name === selectedModel
    if (assetSearch) {
      const searchLower = assetSearch.toLowerCase()
      return item.assets?.some((a) => (a.assetNumber || '').toLowerCase().includes(searchLower))
    }
    return matchesModel
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Patrimônio</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as unidades individuais de cada modelo do estoque.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto mt-2 sm:mt-0">
          <ShareAssetLinkDialog />
          <Input
            placeholder="Busca por Patrimônio (Nº)..."
            value={assetSearch}
            onChange={(e) => setAssetSearch(e.target.value)}
            className="w-full md:w-64"
          />
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-full md:w-64">
              <SelectValue placeholder="Selecione um modelo..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os modelos</SelectItem>
              {models.map((model) => (
                <SelectItem key={model.name} value={model.name}>
                  ({model.code}) {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Modelo</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-center">Total de Unidades</TableHead>
                <TableHead className="text-center">Patrimônios Cadastrados</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className="text-center">{item.totalQty}</TableCell>
                  <TableCell className="text-center">{item.assets?.length || 0}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Dialog
                        onOpenChange={(o) => {
                          if (o) setSelectedItem(item)
                          else setSelectedItem(null)
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8">
                            <Briefcase className="w-4 h-4 mr-2" /> Gerenciar
                          </Button>
                        </DialogTrigger>
                        {selectedItem?.id === item.id && (
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>Patrimônios: {selectedItem.name}</DialogTitle>
                            </DialogHeader>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 mt-2 gap-4">
                              <div className="flex items-center gap-2">
                                {/* Links movidos para a tabela principal */}
                              </div>
                              <Button size="sm" onClick={addAsset}>
                                <Plus className="w-4 h-4 mr-2" /> Adicionar Unidade
                              </Button>
                            </div>
                            <ScrollArea className="h-[400px] border rounded-md">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="w-16">Foto</TableHead>
                                    <TableHead>Nº Patrimônio</TableHead>
                                    <TableHead>Data Aquisição</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="text-right">Ação</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {!selectedItem.assets || selectedItem.assets.length === 0 ? (
                                    <TableRow>
                                      <TableCell
                                        colSpan={5}
                                        className="text-center py-8 text-muted-foreground"
                                      >
                                        Nenhum patrimônio cadastrado.
                                      </TableCell>
                                    </TableRow>
                                  ) : (
                                    selectedItem.assets.map((asset) => (
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
                                            onChange={(e) =>
                                              updateAssetNumber(asset.id, e.target.value)
                                            }
                                            className="h-8"
                                          />
                                        </TableCell>
                                        <TableCell>
                                          <Input
                                            type="date"
                                            value={(asset as any).acquisitionDate || ''}
                                            onChange={(e) =>
                                              updateAssetAcquisitionDate(asset.id, e.target.value)
                                            }
                                            className="h-8 text-xs"
                                          />
                                        </TableCell>
                                        <TableCell>
                                          <Select
                                            value={asset.conditionStatus}
                                            onValueChange={(v) => updateAssetStatus(asset.id, v)}
                                          >
                                            <SelectTrigger className="h-8 w-[130px]">
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="Disponível">Disponível</SelectItem>
                                              <SelectItem value="Manutenção">
                                                Em Manutenção
                                              </SelectItem>
                                              <SelectItem value="Indisponível">
                                                Indisponível
                                              </SelectItem>
                                              <SelectItem value="Vendido">Vendido</SelectItem>
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
                            </ScrollArea>
                          </DialogContent>
                        )}
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredInventory.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Nenhum item encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
