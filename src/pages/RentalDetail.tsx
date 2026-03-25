import { useParams, useNavigate } from 'react-router-dom'
import useMainStore from '@/stores/main'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Save, Edit2, FileText, Printer } from 'lucide-react'
import { useState, useMemo } from 'react'
import { useToast } from '@/hooks/use-toast'

export default function RentalDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { rentals, customers, inventory, settings, updateRental } = useMainStore()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)

  const rental = rentals.find((r) => r.id === id)
  const customer = customers.find((c) => c?.id === rental?.customerId)

  const defaultContractText = useMemo(() => {
    if (!rental || !customer) return ''
    let text = `CONTRATO DE LOCAÇÃO DE EQUIPAMENTOS\n\n`
    if (settings.contractFileName) {
      text += `[Template Base: ${settings.contractFileName}]\n\n`
    }
    text += `LOCADOR: ${settings.companyName}, doravante denominada LOCADORA.\n`
    text += `LOCATÁRIO: ${customer.name}, inscrito no CPF/CNPJ sob o nº ${customer.document}, doravante denominado LOCATÁRIO.\n\n`
    text += `OBJETO: A LOCADORA dá em locação ao LOCATÁRIO os seguintes equipamentos:\n`
    rental.items.forEach((ri) => {
      const item = inventory.find((i) => i.id === ri.itemId)
      text += `- ${ri.qty}x ${item?.name} (${item?.code})\n`
    })
    text += `\nPRAZO: Início em ${new Date(rental.startDate).toLocaleDateString('pt-BR')} com previsão de devolução em ${new Date(rental.expectedReturnDate).toLocaleDateString('pt-BR')}.\n\n`
    text += `VALOR: O valor total acordado para o período é de R$ ${rental.total.toFixed(2)}.\n\n`
    text += `Declaro ter recebido os equipamentos descritos em perfeito estado de conservação e funcionamento. Me comprometo a devolvê-os nas mesmas condições, sob pena de multas por atraso ou danos.`
    return text
  }, [rental, customer, inventory, settings])

  const [contractText, setContractText] = useState(
    rental?.customContractText || defaultContractText,
  )

  if (!rental) return <div className="p-6">Locação não encontrada no sistema.</div>

  const handleSave = () => {
    updateRental(rental.id, { customContractText: contractText })
    setIsEditing(false)
    toast({
      title: 'Contrato Atualizado',
      description: 'O texto do contrato foi salvo para esta locação.',
    })
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="print:hidden">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Locação {rental.id}</h1>
            <p className="text-muted-foreground mt-1">Cliente: {customer?.name}</p>
          </div>
        </div>
        <Badge
          className="print:hidden"
          variant={
            rental.status === 'Ativo'
              ? 'default'
              : rental.status === 'Atrasado'
                ? 'destructive'
                : 'secondary'
          }
        >
          {rental.status}
        </Badge>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 print:hidden">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-muted-foreground" />
            Contrato da Locação
          </CardTitle>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <>
                <Button variant="outline" onClick={() => window.print()}>
                  <Printer className="w-4 h-4 mr-2" /> Imprimir
                </Button>
                <Button variant="secondary" onClick={() => setIsEditing(true)}>
                  <Edit2 className="w-4 h-4 mr-2" /> Editar Contrato
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" /> Salvar Alterações
                </Button>
              </>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Textarea
              className="min-h-[500px] font-mono text-sm leading-relaxed whitespace-pre-wrap resize-y"
              value={contractText}
              onChange={(e) => setContractText(e.target.value)}
            />
          ) : (
            <div className="p-8 border rounded-md bg-muted/10 font-serif text-sm leading-relaxed whitespace-pre-wrap min-h-[500px]">
              {rental.customContractText || defaultContractText}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
