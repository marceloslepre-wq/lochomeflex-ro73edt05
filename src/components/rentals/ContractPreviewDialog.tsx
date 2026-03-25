import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FileSignature, Printer, FileText } from 'lucide-react'
import type { Rental } from '@/stores/main'
import useMainStore from '@/stores/main'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'

export function ContractPreviewDialog({
  rental,
  open,
  onOpenChange,
}: {
  rental: Rental | null
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const { customers, inventory, settings } = useMainStore()
  const { toast } = useToast()
  const [signed, setSigned] = useState(false)

  if (!rental) return null
  const customer = customers.find((c) => c.id === rental.customerId)

  const handleSign = () => {
    setSigned(true)
    toast({ title: 'Contrato Assinado', description: 'Assinatura digital registrada com sucesso.' })
    setTimeout(() => onOpenChange(false), 1500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSignature className="w-5 h-5 text-primary" />
            Contrato de Locação - {rental.id}
          </DialogTitle>
        </DialogHeader>

        {settings.contractFileName ? (
          <div className="p-12 border rounded-md bg-muted/10 text-center space-y-4 mt-4">
            <FileText className="w-12 h-12 text-primary mx-auto" />
            <h3 className="font-medium text-lg">Template Personalizado Ativo</h3>
            <p className="text-sm text-muted-foreground">
              O sistema utilizou o modelo <strong>{settings.contractFileName}</strong> para mapear
              os dados desta locação ({rental.id}).
            </p>
            <p className="text-xs text-muted-foreground">
              Clique em imprimir para gerar a versão final preenchida ou assine digitalmente abaixo.
            </p>
            <div className="mt-8 pt-4 border-t w-full">
              <div
                className="p-4 border-2 border-dashed bg-background text-center rounded-lg cursor-pointer hover:bg-muted transition-colors"
                onClick={!signed ? handleSign : undefined}
              >
                {signed ? (
                  <div className="text-emerald-600 font-bold italic text-xl py-2">
                    Assinado Digitalmente
                  </div>
                ) : (
                  <div className="text-muted-foreground py-2 flex flex-col items-center gap-2">
                    <FileSignature className="w-6 h-6 opacity-50" />
                    Clique aqui para Assinar Digitalmente
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 border rounded-md bg-muted/10 text-sm font-serif leading-relaxed mt-4 space-y-4">
            <h3 className="text-center font-bold text-lg mb-6 uppercase">
              CONTRATO DE LOCAÇÃO DE EQUIPAMENTOS
            </h3>
            <p>
              <strong>LOCADOR:</strong> {settings.companyName}, doravante denominada LOCADORA.
            </p>
            <p>
              <strong>LOCATÁRIO:</strong> {customer?.name}, inscrito no CPF/CNPJ sob o nº{' '}
              {customer?.document}, doravante denominado LOCATÁRIO.
            </p>
            <p>
              <strong>OBJETO:</strong> A LOCADORA dá em locação ao LOCATÁRIO os seguintes
              equipamentos:
            </p>
            <ul className="list-disc pl-6 space-y-1 my-2">
              {rental.items.map((ri) => {
                const item = inventory.find((i) => i.id === ri.itemId)
                return (
                  <li key={ri.itemId}>
                    {ri.qty}x {item?.name} ({item?.code})
                  </li>
                )
              })}
            </ul>
            <p>
              <strong>PRAZO:</strong> Início em{' '}
              {new Date(rental.startDate).toLocaleDateString('pt-BR')} com previsão de devolução em{' '}
              {new Date(rental.expectedReturnDate).toLocaleDateString('pt-BR')}.
            </p>
            <p>
              <strong>VALOR:</strong> O valor total acordado para o período é de{' '}
              <strong>R$ {rental.total.toFixed(2)}</strong>.
            </p>
            <p className="text-xs text-muted-foreground text-justify mt-6 pt-4 border-t">
              Declaro ter recebido os equipamentos descritos em perfeito estado de conservação e
              funcionamento. Me comprometo a devolvê-os nas mesmas condições, sob pena de multas por
              atraso ou danos.
            </p>

            <div
              className="mt-8 p-4 border-2 border-dashed bg-background text-center rounded-lg cursor-pointer hover:bg-muted transition-colors"
              onClick={!signed ? handleSign : undefined}
            >
              {signed ? (
                <div className="text-emerald-600 font-bold italic text-xl py-2">
                  Assinado Digitalmente
                </div>
              ) : (
                <div className="text-muted-foreground py-2 flex flex-col items-center gap-2">
                  <FileSignature className="w-6 h-6 opacity-50" />
                  Clique aqui para Assinar Digitalmente
                </div>
              )}
            </div>
          </div>
        )}

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="w-4 h-4 mr-2" /> Imprimir
          </Button>
          <Button onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
