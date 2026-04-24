import { useState, useMemo, useEffect, useRef } from 'react'
import useMainStore, { InventoryItem } from '@/stores/main'
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
import { Plus, Trash2, Briefcase } from 'lucide-react'
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
import { supabase } from '@/lib/supabase/client'

export default function Assets() {
  const { inventory, updateInventoryItem } = useMainStore()
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [selectedModel, setSelectedModel] = useState<string>('all')

  const models = useMemo(() => {
    const uniqueItems = Array.from(new Map(inventory.map((item) => [item.name, item])).values())
    return uniqueItems.sort((a, b) => (a.code || '').localeCompare(b.code || ''))
  }, [inventory])

  // Flag/Ref para evitar múltiplas chamadas e dependência correta []
  const fetchedAllRef = useRef(false)
  const [allPatrimonios, setAllPatrimonios] = useState<
    { id: string; inventory_id: string; numero_patrimonio: string }[]
  >([])

  useEffect(() => {
    if (fetchedAllRef.current) return
    fetchedAllRef.current = true

    const fetchAll = async () => {
      const { data } = await supabase
        .from('patrimonio')
        .select('id, inventory_id, numero_patrimonio')
      if (data) {
        setAllPatrimonios(data)
      }
    }
    fetchAll()
  }, [])

  const patrimonioCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    allPatrimonios.forEach((p) => {
      counts[p.inventory_id] = (counts[p.inventory_id] || 0) + 1
    })
    return counts
  }, [allPatrimonios])

  // Estado local para o lazy load da aba Gerenciar
  const [patrimonios, setPatrimonios] = useState<any[]>([])
  const [loadingAssets, setLoadingAssets] = useState(false)
  const loadedIdRef = useRef<string | null>(null)

  // UseEffect com dependência correta [selectedItem?.id] e validação (evita loop infinito)
  useEffect(() => {
    if (selectedItem?.id && loadedIdRef.current !== selectedItem.id) {
      loadedIdRef.current = selectedItem.id
      setLoadingAssets(true)

      const fetchPatrimonios = async () => {
        const { data, error } = await supabase
          .from('patrimonio')
          .select('*')
          .eq('inventory_id', selectedItem.id)
          .order('created_at', { ascending: true })

        if (!error && data) {
          setPatrimonios(data)
        }
        setLoadingAssets(false)
      }

      fetchPatrimonios()
    } else if (!selectedItem) {
      loadedIdRef.current = null
      setPatrimonios([])
    }
  }, [selectedItem?.id])

  const addAsset = async () => {
    if (!selectedItem) return
    const novoNumero = `PAT-${Math.floor(Math.random() * 10000)}`

    const { data, error } = await supabase
      .from('patrimonio')
      .insert({
        inventory_id: selectedItem.id,
        numero_patrimonio: novoNumero,
        estado: 'novo',
        data_aquisicao: new Date().toISOString().split('T')[0],
      })
      .select()
      .single()

    if (!error && data) {
      setPatrimonios([...patrimonios, data])
      setAllPatrimonios([
        ...allPatrimonios,
        { id: data.id, inventory_id: data.inventory_id, numero_patrimonio: data.numero_patrimonio },
      ])

      const newTotal = selectedItem.totalQty + 1
      const newAvail = selectedItem.availableQty + 1

      updateInventoryItem(selectedItem.id, {
        totalQty: newTotal,
        availableQty: newAvail,
      })

      setSelectedItem({
        ...selectedItem,
        totalQty: newTotal,
        availableQty: newAvail,
      })
    }
  }

  const removeAsset = async (id: string) => {
    if (!selectedItem) return
    const { error } = await supabase.from('patrimonio').delete().eq('id', id)

    if (!error) {
      setPatrimonios(patrimonios.filter((p) => p.id !== id))
      setAllPatrimonios(allPatrimonios.filter((p) => p.id !== id))

      const newTotal = Math.max(0, selectedItem.totalQty - 1)
      const newAvail = Math.max(0, selectedItem.availableQty - 1)

      updateInventoryItem(selectedItem.id, {
        totalQty: newTotal,
        availableQty: newAvail,
      })

      setSelectedItem({
        ...selectedItem,
        totalQty: newTotal,
        availableQty: newAvail,
      })
    }
  }

  const updateAssetStatus = async (id: string, status: string) => {
    setPatrimonios(patrimonios.map((p) => (p.id === id ? { ...p, estado: status } : p)))
    await supabase.from('patrimonio').update({ estado: status }).eq('id', id)
  }

  const handleAssetNumberChange = (id: string, number: string) => {
    setPatrimonios(patrimonios.map((p) => (p.id === id ? { ...p, numero_patrimonio: number } : p)))
  }

  const handleAssetNumberBlur = async (id: string, number: string) => {
    await supabase.from('patrimonio').update({ numero_patrimonio: number }).eq('id', id)
    setAllPatrimonios(
      allPatrimonios.map((p) => (p.id === id ? { ...p, numero_patrimonio: number } : p)),
    )
  }

  const updateAssetAcquisitionDate = async (id: string, date: string) => {
    setPatrimonios(patrimonios.map((p) => (p.id === id ? { ...p, data_aquisicao: date } : p)))
    await supabase.from('patrimonio').update({ data_aquisicao: date }).eq('id', id)
  }

  const handleLocationChange = (id: string, loc: string) => {
    setPatrimonios(patrimonios.map((p) => (p.id === id ? { ...p, localizacao: loc } : p)))
  }

  const handleLocationBlur = async (id: string, loc: string) => {
    await supabase.from('patrimonio').update({ localizacao: loc }).eq('id', id)
  }

  const [assetSearch, setAssetSearch] = useState('')

  const filteredInventory = inventory.filter((item) => {
    const matchesModel = selectedModel === 'all' || item.name === selectedModel
    if (assetSearch) {
      const searchLower = assetSearch.toLowerCase()
      const itemPatrimonios = allPatrimonios.filter((p) => p.inventory_id === item.id)
      return (
        matchesModel &&
        itemPatrimonios.some((p) => (p.numero_patrimonio || '').toLowerCase().includes(searchLower))
      )
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
                  {model.code ? `[${model.code}] - ` : ''}
                  {model.name}
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
                  <TableCell className="text-center">{patrimonioCounts[item.id] || 0}</TableCell>
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
                              <div className="flex items-center gap-2"></div>
                              <Button size="sm" onClick={addAsset}>
                                <Plus className="w-4 h-4 mr-2" /> Adicionar Unidade
                              </Button>
                            </div>
                            <ScrollArea className="h-[400px] border rounded-md">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Nº Patrimônio</TableHead>
                                    <TableHead>Data Aquisição</TableHead>
                                    <TableHead>Localização</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="text-right">Ação</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {loadingAssets ? (
                                    <TableRow>
                                      <TableCell
                                        colSpan={5}
                                        className="text-center py-8 text-muted-foreground"
                                      >
                                        Carregando patrimônios...
                                      </TableCell>
                                    </TableRow>
                                  ) : patrimonios.length === 0 ? (
                                    <TableRow>
                                      <TableCell
                                        colSpan={5}
                                        className="text-center py-8 text-muted-foreground"
                                      >
                                        Nenhum patrimônio cadastrado.
                                      </TableCell>
                                    </TableRow>
                                  ) : (
                                    patrimonios.map((asset) => (
                                      <TableRow key={asset.id}>
                                        <TableCell>
                                          <Input
                                            value={asset.numero_patrimonio || ''}
                                            onChange={(e) =>
                                              handleAssetNumberChange(asset.id, e.target.value)
                                            }
                                            onBlur={(e) =>
                                              handleAssetNumberBlur(asset.id, e.target.value)
                                            }
                                            className="h-8"
                                          />
                                        </TableCell>
                                        <TableCell>
                                          <Input
                                            type="date"
                                            value={asset.data_aquisicao || ''}
                                            onChange={(e) =>
                                              updateAssetAcquisitionDate(asset.id, e.target.value)
                                            }
                                            className="h-8 text-xs"
                                          />
                                        </TableCell>
                                        <TableCell>
                                          <Input
                                            value={asset.localizacao || ''}
                                            onChange={(e) =>
                                              handleLocationChange(asset.id, e.target.value)
                                            }
                                            onBlur={(e) =>
                                              handleLocationBlur(asset.id, e.target.value)
                                            }
                                            className="h-8 text-xs"
                                            placeholder="Ex: Prateleira A"
                                          />
                                        </TableCell>
                                        <TableCell>
                                          <Select
                                            value={asset.estado || 'novo'}
                                            onValueChange={(v) => updateAssetStatus(asset.id, v)}
                                          >
                                            <SelectTrigger className="h-8 w-[130px]">
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="novo">Novo</SelectItem>
                                              <SelectItem value="bom">Bom</SelectItem>
                                              <SelectItem value="regular">Regular</SelectItem>
                                              <SelectItem value="ruim">Ruim</SelectItem>
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
