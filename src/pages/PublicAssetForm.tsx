import { useState, useMemo } from 'react'
import useMainStore from '@/stores/main'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Upload, Plus, Search, Building2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function PublicAssetForm() {
  const { inventory, updateInventoryItem } = useMainStore()
  const { toast } = useToast()
  const [selectedItemId, setSelectedItemId] = useState<string>('')
  const [modelSearch, setModelSearch] = useState('')
  const [assetData, setAssetData] = useState({
    assetNumber: '',
    acquisitionDate: new Date().toISOString().split('T')[0],
    conditionStatus: 'Disponível',
    image: '',
  })

  const filteredModels = useMemo(() => {
    return inventory.filter((item) => {
      if (!modelSearch) return true
      const term = modelSearch.toLowerCase()
      return item.name.toLowerCase().includes(term) || item.code.toLowerCase().includes(term)
    })
  }, [inventory, modelSearch])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAssetData({ ...assetData, image: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedItemId) {
      toast({ title: 'Erro', description: 'Selecione um modelo.', variant: 'destructive' })
      return
    }

    if (!assetData.assetNumber) {
      toast({
        title: 'Erro',
        description: 'Informe o número do patrimônio.',
        variant: 'destructive',
      })
      return
    }

    const item = inventory.find((i) => i.id === selectedItemId)
    if (!item) return

    const newAsset = {
      id: Math.random().toString(),
      ...assetData,
    }

    const newAssets = [...(item.assets || []), newAsset]
    updateInventoryItem(item.id, {
      assets: newAssets,
      totalQty: item.totalQty + 1,
      availableQty: item.availableQty + 1,
    })

    toast({ title: 'Sucesso', description: 'Patrimônio cadastrado com sucesso.' })
    setAssetData({
      assetNumber: '',
      acquisitionDate: new Date().toISOString().split('T')[0],
      conditionStatus: 'Disponível',
      image: '',
    })
  }

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-8 flex items-center justify-center">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center space-y-2 pb-6 border-b">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Cadastro de Patrimônio</CardTitle>
          <CardDescription>
            Preencha os dados abaixo para registrar um novo ativo no sistema.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4 bg-muted/50 p-4 rounded-lg border">
              <h3 className="font-semibold text-sm text-muted-foreground flex items-center gap-2">
                1. Seleção do Modelo
              </h3>

              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Filtrar modelos por nome ou código..."
                    value={modelSearch}
                    onChange={(e) => setModelSearch(e.target.value)}
                    className="pl-9 bg-background"
                  />
                </div>
                <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Selecione um modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredModels.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground text-center">
                        Nenhum modelo encontrado
                      </div>
                    ) : (
                      filteredModels.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name} ({item.code}) - {item.category}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4 bg-muted/50 p-4 rounded-lg border">
              <h3 className="font-semibold text-sm text-muted-foreground flex items-center gap-2">
                2. Dados do Patrimônio
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nº do Patrimônio *</label>
                  <Input
                    required
                    value={assetData.assetNumber}
                    onChange={(e) => setAssetData({ ...assetData, assetNumber: e.target.value })}
                    placeholder="Ex: PAT-001"
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Data de Aquisição</label>
                  <Input
                    type="date"
                    value={assetData.acquisitionDate}
                    onChange={(e) =>
                      setAssetData({ ...assetData, acquisitionDate: e.target.value })
                    }
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Estado de Conservação</label>
                  <Select
                    value={assetData.conditionStatus}
                    onValueChange={(v) => setAssetData({ ...assetData, conditionStatus: v })}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Disponível">Disponível</SelectItem>
                      <SelectItem value="Manutenção">Em Manutenção</SelectItem>
                      <SelectItem value="Indisponível">Indisponível</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Foto do Patrimônio</label>
                <div className="flex items-center gap-4">
                  <div className="relative w-24 h-24 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center overflow-hidden bg-background">
                    {assetData.image ? (
                      <img
                        src={assetData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Upload className="w-8 h-8 text-muted-foreground/50" />
                    )}
                    <input
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Clique ou arraste uma foto</p>
                    <p className="text-xs">JPG, PNG até 5MB</p>
                  </div>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-lg">
              <Plus className="w-5 h-5 mr-2" />
              Cadastrar Patrimônio
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
