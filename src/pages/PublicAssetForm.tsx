import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Upload, CheckCircle2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import logoImg from '@/assets/logo_hospital_home_final-f2434.jpg'

export default function PublicAssetForm() {
  const [searchParams] = useSearchParams()
  const itemId = searchParams.get('itemId')
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [item, setItem] = useState<any>(null)

  const [formData, setFormData] = useState({
    assetNumber: '',
    acquisitionDate: new Date().toISOString().split('T')[0],
    conditionStatus: 'Disponível',
    image: '',
  })

  useEffect(() => {
    if (itemId) {
      supabase
        .from('inventory')
        .select('name, code')
        .eq('id', itemId)
        .single()
        .then(({ data }) => {
          if (data) setItem(data)
        })
    }
  }, [itemId])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!itemId) return
    setLoading(true)

    const newAsset = {
      id: Math.random().toString(),
      assetNumber: formData.assetNumber,
      acquisitionDate: formData.acquisitionDate,
      conditionStatus: formData.conditionStatus,
      image: formData.image,
    }

    const { error } = await supabase.rpc('public_add_asset', {
      p_item_id: itemId,
      p_asset: newAsset,
    })

    setLoading(false)

    if (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o patrimônio.',
        variant: 'destructive',
      })
      console.error(error)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-lg text-center p-6">
          <div className="mb-6 flex justify-center">
            <img src={logoImg} alt="Logo" className="h-16 object-contain" />
          </div>
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Patrimônio Cadastrado</h2>
          <p className="text-muted-foreground mb-6">
            O novo patrimônio foi adicionado com sucesso ao sistema.
          </p>
          <Button onClick={() => setSuccess(false)} variant="outline">
            Cadastrar Outro
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4">
      <div className="mb-8">
        <img src={logoImg} alt="Logo" className="h-20 object-contain drop-shadow-sm" />
      </div>

      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl">Cadastro de Patrimônio</CardTitle>
          {item ? (
            <CardDescription className="text-base mt-2">
              Adicionando unidade para:
              <br />
              <strong className="text-foreground">{item.name}</strong> (Ref: {item.code})
            </CardDescription>
          ) : (
            <CardDescription>Carregando informações do produto...</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label>Número do Patrimônio</Label>
              <Input
                required
                value={formData.assetNumber}
                onChange={(e) => setFormData((f) => ({ ...f, assetNumber: e.target.value }))}
                placeholder="Ex: PAT-00123"
              />
            </div>

            <div className="space-y-2">
              <Label>Data de Aquisição</Label>
              <Input
                type="date"
                required
                value={formData.acquisitionDate}
                onChange={(e) => setFormData((f) => ({ ...f, acquisitionDate: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Estado / Condição</Label>
              <Select
                value={formData.conditionStatus}
                onValueChange={(v) => setFormData((f) => ({ ...f, conditionStatus: v }))}
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

            <div className="space-y-2">
              <Label>Foto da Unidade</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors relative">
                {formData.image ? (
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="h-32 object-contain rounded"
                    />
                    <span className="text-xs text-muted-foreground">Clique para alterar</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Upload className="w-8 h-8" />
                    <span className="text-sm">Clique ou arraste uma foto</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading || !itemId}>
              {loading ? 'Salvando...' : 'Salvar Patrimônio'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
