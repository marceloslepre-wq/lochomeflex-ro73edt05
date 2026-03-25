import { useParams, useNavigate } from 'react-router-dom'
import useMainStore from '@/stores/main'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Save, Edit2, FileText, Printer } from 'lucide-react'
import { useState, useMemo } from 'react'
import { useToast } from '@/hooks/use-toast'
import { usePermissions } from '@/hooks/use-permissions'

export default function RentalDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { rentals, customers, inventory, settings, updateRental } = useMainStore()
  const { toast } = useToast()
  const { can } = usePermissions()
  const [isEditing, setIsEditing] = useState(false)

  const rental = rentals.find((r) => r.id === id)
  const customer = customers.find((c) => c?.id === rental?.customerId)

  const defaultContractText = useMemo(() => {
    if (!rental || !customer) return ''
    let text = `LOCADOR: ${settings.companyName}\n`
    text += `CNPJ: ${settings.companyDocument}\n`
    text += `ENDEREÇO: ${settings.companyAddress}\n\n`
    text += `LOCATÁRIO: ${customer.name}\n`
    text += `CPF/CNPJ: ${customer.document}\n\n`

    text += `OBJETO DO CONTRATO\n`
    text += `A LOCADORA cede em locação ao LOCATÁRIO os seguintes equipamentos:\n\n`
    rental.items.forEach((ri) => {
      const item = inventory.find((i) => i.id === ri.itemId)
      text += `• ${ri.qty}x - ${item?.name} (Ref: ${item?.code})\n`
    })

    text += `\nPRAZO E CONDIÇÕES\n`
    text += `O período de locação tem início em ${new Date(rental.startDate).toLocaleDateString('pt-BR')} com devolução estipulada para ${new Date(rental.expectedReturnDate).toLocaleDateString('pt-BR')}.\n\n`

    text += `O valor total pactuado para o período acordado é de R$ ${rental.total.toFixed(2)}.\n\n`

    text += `TERMO DE RESPONSABILIDADE\n`
    text += `O LOCATÁRIO declara ter recebido os equipamentos acima descritos em perfeitas condições de uso e conservação, assumindo total responsabilidade pela sua guarda e integridade. Em caso de atraso na devolução, será aplicada multa conforme política vigente (${settings.lateFeeType === 'daily' ? settings.lateFeeValue + '% ao dia' : 'R$ ' + settings.lateFeeValue + ' ao dia'}). Eventuais danos ou extravios ensejarão cobrança de reposição.`

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Locação {rental.id}</h1>
            <p className="text-muted-foreground mt-1">Cliente: {customer?.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge
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
          {!isEditing ? (
            <>
              <Button onClick={() => window.print()}>
                <Printer className="w-4 h-4 mr-2" /> Imprimir Contrato
              </Button>
              {can('rentals:manage') && (
                <Button variant="secondary" onClick={() => setIsEditing(true)}>
                  <Edit2 className="w-4 h-4 mr-2" /> Editar
                </Button>
              )}
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" /> Salvar
              </Button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="print:hidden">
          <Textarea
            className="min-h-[500px] font-mono text-sm leading-relaxed whitespace-pre-wrap resize-y"
            value={contractText}
            onChange={(e) => setContractText(e.target.value)}
          />
        </div>
      ) : (
        <div className="print-contract-container w-full max-w-[210mm] mx-auto bg-white sm:p-12 p-6 sm:shadow-lg sm:border rounded-sm text-black relative">
          <div className="text-center border-b pb-6 mb-6">
            {settings.logoUrl && (
              <img src={settings.logoUrl} className="h-16 mx-auto mb-4 object-contain" alt="Logo" />
            )}
            <h1 className="text-2xl font-bold uppercase tracking-widest">Contrato de Locação</h1>
            <p className="text-sm text-gray-500 mt-1">Contrato nº {rental.id}</p>
          </div>

          <div className="font-serif text-[15px] leading-loose whitespace-pre-wrap">
            {rental.customContractText || defaultContractText}
          </div>

          <div className="mt-24 grid grid-cols-2 gap-12 text-center pt-8">
            <div>
              <div className="border-t border-black w-4/5 mx-auto pt-2">
                <p className="font-bold text-sm">{settings.companyName}</p>
                <p className="text-xs text-gray-600">LOCADORA</p>
              </div>
            </div>
            <div>
              <div className="border-t border-black w-4/5 mx-auto pt-2">
                <p className="font-bold text-sm">{customer?.name}</p>
                <p className="text-xs text-gray-600">LOCATÁRIO</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
