import { useState } from 'react'
import useMainStore, { Rental } from '@/stores/main'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, Eye, ArrowDownToLine } from 'lucide-react'
import { CreateRentalDialog } from '@/components/rentals/CreateRentalDialog'
import { ContractPreviewDialog } from '@/components/rentals/ContractPreviewDialog'
import { ReturnDialog } from '@/components/rentals/ReturnDialog'

export default function Rentals() {
  const { rentals, customers } = useMainStore()
  const [search, setSearch] = useState('')

  const [selectedRental, setSelectedRental] = useState<Rental | null>(null)
  const [contractOpen, setContractOpen] = useState(false)
  const [returnOpen, setReturnOpen] = useState(false)

  const filtered = rentals.filter((r) => {
    const c = customers.find((cust) => cust.id === r.customerId)
    return (
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      (c && c.name.toLowerCase().includes(search.toLowerCase()))
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Locações</h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe contratos ativos, atrasos e devoluções.
          </p>
        </div>
        <CreateRentalDialog />
      </div>

      <Card>
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4 bg-muted/20">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por ID ou Cliente..."
              className="pl-9 bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Retirada</TableHead>
                <TableHead>Previsão</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    Nenhuma locação encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((rental) => {
                  const customer = customers.find((c) => c.id === rental.customerId)
                  return (
                    <TableRow key={rental.id} className="group">
                      <TableCell className="font-medium">{rental.id}</TableCell>
                      <TableCell>{customer?.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(rental.startDate).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(rental.expectedReturnDate).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        R$ {rental.total.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              setSelectedRental(rental)
                              setContractOpen(true)
                            }}
                            title="Ver Contrato"
                          >
                            <Eye className="h-4 w-4 text-primary" />
                          </Button>
                          {rental.status !== 'Devolvido' && (
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                              onClick={() => {
                                setSelectedRental(rental)
                                setReturnOpen(true)
                              }}
                              title="Devolver"
                            >
                              <ArrowDownToLine className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ContractPreviewDialog
        rental={selectedRental}
        open={contractOpen}
        onOpenChange={setContractOpen}
      />
      <ReturnDialog rental={selectedRental} open={returnOpen} onOpenChange={setReturnOpen} />
    </div>
  )
}
