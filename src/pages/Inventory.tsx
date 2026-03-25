import { useState } from 'react'
import useMainStore from '@/stores/main'
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
import { Search } from 'lucide-react'
import { CreateItemDialog } from '@/components/inventory/CreateItemDialog'

export default function Inventory() {
  const { inventory } = useMainStore()
  const [search, setSearch] = useState('')

  const filtered = inventory.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.code.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Estoque</h1>
          <p className="text-muted-foreground mt-1">Controle seus modelos e disponibilidades.</p>
        </div>
        <CreateItemDialog />
      </div>

      <Card>
        <div className="p-4 border-b flex items-center gap-4 bg-muted/20">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou código..."
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
                <TableHead className="w-[80px]">Foto</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Estoque Total</TableHead>
                <TableHead className="text-right">Locados</TableHead>
                <TableHead className="text-right">Disponível</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    Nenhum item encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="w-12 h-12 rounded-md overflow-hidden bg-muted border">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.code}</p>
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className="text-right font-medium">{item.totalQty}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {item.rentedQty}
                    </TableCell>
                    <TableCell className="text-right font-bold text-primary">
                      {item.availableQty}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.availableQty > 0 ? (
                        <Badge className="bg-emerald-500 hover:bg-emerald-600 border-none">
                          Disponível
                        </Badge>
                      ) : (
                        <Badge variant="destructive">Esgotado</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
