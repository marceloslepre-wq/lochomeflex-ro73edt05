import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Rental } from '@/stores/main'
import useMainStore from '@/stores/main'
import { Printer, MessageCircle, Mail } from 'lucide-react'
import logoImg from '@/assets/logo_hospital_home_final-f2434.jpg'

interface ReceiptDialogProps {
  rental: Rental | null
  open: boolean
  onOpenChange: (open: boolean) => void
  type?: 'new' | 'renewal' | 'return'
  renewalInfo?: {
    startDate: string
    endDate: string
    addedTotal: number
  } | null
}

export function ReceiptDialog({
  rental,
  open,
  onOpenChange,
  type = 'new',
  renewalInfo,
}: ReceiptDialogProps) {
  const { customers, inventory, settings } = useMainStore()

  if (!rental) return null

  const customer = customers.find((c) => c.id === rental.customerId)

  const generateText = () => {
    let title = 'Recibo de Pagamento'
    if (type === 'renewal') title = 'Recibo de Renovação'
    if (type === 'return') title = 'Recibo de Devolução'

    let text = `*${title}*\n\n`
    text += `*Empresa:* ${settings.companyName || 'Hospital Home'}\n`
    text += `*Locatário:* ${customer?.name || 'Cliente'}\n`
    text += `*Contrato ${type === 'renewal' ? 'Original' : ''}:* ${rental.contractNumber || rental.id}\n\n`

    text += `*Equipamentos:*\n`
    rental.items.forEach((ri) => {
      const item = inventory.find((i) => i.id === ri.itemId)
      text += `- ${ri.qty}x ${item?.name || 'Item'} (SKU: ${item?.code || '-'}) ${ri.startDate && ri.endDate ? `(${new Date(ri.startDate).toLocaleDateString('pt-BR')} a ${new Date(ri.endDate).toLocaleDateString('pt-BR')})` : ''}\n`
    })

    text += `\n*Período Geral:* `
    if (type === 'renewal' && renewalInfo) {
      text += `${new Date(renewalInfo.startDate).toLocaleDateString('pt-BR')} a ${new Date(renewalInfo.endDate).toLocaleDateString('pt-BR')}\n`
      text += `*Valor Adicional:* R$ ${renewalInfo.addedTotal.toFixed(2)}\n`
    } else if (type === 'return') {
      text += `${new Date(rental.startDate).toLocaleDateString('pt-BR')} a ${new Date(rental.expectedReturnDate).toLocaleDateString('pt-BR')}\n`
      text += `*Data da Devolução:* ${rental.actualReturnDate ? new Date(rental.actualReturnDate).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR')}\n`
      text += `*Valor Total do Contrato:* R$ ${rental.total.toFixed(2)}\n`
    } else {
      text += `${new Date(rental.startDate).toLocaleDateString('pt-BR')} a ${new Date(rental.expectedReturnDate).toLocaleDateString('pt-BR')}\n`
      text += `*Valor Total:* R$ ${rental.total.toFixed(2)}\n`
    }

    if (type === 'return') {
      text += `\nDeclaramos para os devidos fins o recebimento dos equipamentos acima descritos, devolvidos pelo locatário nesta data.`
    } else {
      text += `\nNão é fornecido Nota Fiscal para locação de bens móveis, fornecemos recibo conforme o Artigo 1 da Lei 8846 de 1994.`
    }

    return text
  }

  const handlePrint = () => {
    const printContent = document.getElementById('receipt-print-area')
    if (printContent) {
      const printWindow = window.open('', '', 'width=800,height=600')
      if (printWindow) {
        printWindow.document.write('<html><head><title>Recibo</title>')
        printWindow.document.write(`
          <style>
            body { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; font-size: 14px; padding: 20px; color: #000; }
            .text-center { text-align: center; }
            .font-bold { font-weight: bold; }
            .font-semibold { font-weight: 600; }
            .border-b { border-bottom: 1px solid #ccc; }
            .border-t { border-top: 1px solid #ccc; }
            .pb-2 { padding-bottom: 0.5rem; }
            .pt-2 { padding-top: 0.5rem; }
            .pt-4 { padding-top: 1rem; }
            .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
            .mb-2 { margin-bottom: 0.5rem; }
            .mb-4 { margin-bottom: 1rem; }
            .mt-1 { margin-top: 0.25rem; }
            .mt-8 { margin-top: 2rem; }
            .flex { display: flex; }
            .justify-between { justify-content: space-between; }
            .grid { display: grid; }
            .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .gap-2 { gap: 0.5rem; }
            .text-sm { font-size: 0.875rem; }
            .text-xs { font-size: 0.75rem; }
            .text-base { font-size: 1rem; }
            .text-gray-500 { color: #6b7280; }
            .mx-auto { margin-left: auto; margin-right: auto; }
            .h-16 { height: 4rem; }
            .object-contain { object-fit: contain; }
            ul { list-style: none; padding: 0; margin: 0; }
          </style>
        `)
        printWindow.document.write('</head><body>')
        printWindow.document.write(printContent.innerHTML)
        printWindow.document.write('</body></html>')
        printWindow.document.close()
        printWindow.focus()
        setTimeout(() => {
          printWindow.print()
          printWindow.close()
        }, 250)
      }
    }
  }

  const handleWhatsApp = () => {
    const text = generateText()
    const a = document.createElement('a')
    a.href = `https://wa.me/?text=${encodeURIComponent(text)}`
    a.target = '_blank'
    a.rel = 'noopener noreferrer'
    a.click()
  }

  const handleEmail = () => {
    const text = generateText()
    const a = document.createElement('a')
    a.href = `mailto:${customer?.email || ''}?subject=${encodeURIComponent(type === 'renewal' ? 'Recibo de Renovação' : 'Recibo de Pagamento')}&body=${encodeURIComponent(text)}`
    a.target = '_blank'
    a.rel = 'noopener noreferrer'
    a.click()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {type === 'renewal'
              ? 'Recibo de Renovação'
              : type === 'return'
                ? 'Recibo de Devolução'
                : 'Recibo de Pagamento'}
          </DialogTitle>
        </DialogHeader>

        <div
          id="receipt-print-area"
          className="p-6 border rounded-md bg-white text-black font-mono text-sm space-y-4"
        >
          <div className="text-center font-bold text-lg border-b pb-2 mb-4">
            <img src={logoImg} className="h-16 mx-auto mb-2 object-contain" alt="Logo" />
            {settings.companyName || 'Hospital Home'}
            <div className="text-sm font-normal mt-1">
              {type === 'renewal'
                ? 'RECIBO DE RENOVAÇÃO'
                : type === 'return'
                  ? 'RECIBO DE DEVOLUÇÃO'
                  : 'RECIBO DE LOCAÇÃO'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <div>
              <span className="font-semibold">Locatário:</span> {customer?.name}
            </div>
            <div>
              <span className="font-semibold">Contrato:</span> {rental.contractNumber || rental.id}
            </div>
            <div>
              <span className="font-semibold">Documento:</span> {customer?.document}
            </div>
            <div>
              <span className="font-semibold">Emissão:</span>{' '}
              {new Date().toLocaleDateString('pt-BR')}
            </div>
          </div>

          <div className="border-t border-b py-2 mb-4">
            <span className="font-semibold">Equipamentos:</span>
            <ul className="mt-1 space-y-1">
              {rental.items.map((ri, idx) => {
                const item = inventory.find((i) => i.id === ri.itemId)
                return (
                  <li key={idx} className="flex flex-col">
                    <span>
                      {ri.qty}x {item?.name} (SKU: {item?.code || '-'})
                    </span>
                    <span className="text-xs text-gray-500">
                      {ri.startDate && ri.endDate
                        ? `De ${new Date(ri.startDate).toLocaleDateString('pt-BR')} até ${new Date(ri.endDate).toLocaleDateString('pt-BR')}`
                        : ''}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="font-semibold">Período:</span>
              <span>
                {type === 'renewal' && renewalInfo
                  ? `${new Date(renewalInfo.startDate).toLocaleDateString('pt-BR')} a ${new Date(renewalInfo.endDate).toLocaleDateString('pt-BR')}`
                  : `${new Date(rental.startDate).toLocaleDateString('pt-BR')} a ${new Date(rental.expectedReturnDate).toLocaleDateString('pt-BR')}`}
              </span>
            </div>
            {type === 'return' && (
              <div className="flex justify-between">
                <span className="font-semibold">Data da Devolução:</span>
                <span>
                  {rental.actualReturnDate
                    ? new Date(rental.actualReturnDate).toLocaleDateString('pt-BR')
                    : new Date().toLocaleDateString('pt-BR')}
                </span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold pt-2">
              <span>{type === 'renewal' ? 'VALOR ADICIONAL' : 'TOTAL GERAL'}:</span>
              <span>
                R${' '}
                {type === 'renewal' && renewalInfo
                  ? renewalInfo.addedTotal.toFixed(2)
                  : rental.total.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="text-center text-xs mt-8 pt-4 border-t text-gray-500 font-semibold">
            {type === 'return'
              ? 'Declaramos para os devidos fins o recebimento dos equipamentos acima descritos, devolvidos pelo locatário nesta data.'
              : 'Não é fornecido Nota Fiscal para locação de bens móveis, fornecemos recibo conforme o Artigo 1 da Lei 8846 de 1994.'}
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4 print:hidden">
          <Button variant="outline" className="flex-1" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" /> Imprimir / PDF
          </Button>
          <Button
            variant="outline"
            className="flex-1 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
            onClick={handleWhatsApp}
          >
            <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp
          </Button>
          <Button
            variant="outline"
            className="flex-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
            onClick={handleEmail}
          >
            <Mail className="w-4 h-4 mr-2" /> E-mail
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
