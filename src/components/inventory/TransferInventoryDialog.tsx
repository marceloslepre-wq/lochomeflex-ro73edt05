import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ArrowRightLeft } from 'lucide-react'
import { TransferInventoryForm } from './TransferInventoryForm'

interface TransferInventoryDialogProps {
  onSuccess?: () => void
}

export function TransferInventoryDialog({ onSuccess }: TransferInventoryDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <ArrowRightLeft className="w-4 h-4 mr-2" /> Transferir Estoque
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Transferir Estoque em Lote</DialogTitle>
          <DialogDescription>
            Mova múltiplos produtos entre os locais disponíveis.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <TransferInventoryForm
            isDialog
            onSuccess={() => {
              setOpen(false)
              onSuccess?.()
            }}
            onCancel={() => setOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
