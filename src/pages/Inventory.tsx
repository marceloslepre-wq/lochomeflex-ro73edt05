import { useState } from 'react'
import { Link } from 'react-router-dom'
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
import { Button } from '@/components/ui/button'
import { Search, Download, ExternalLink } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { CreateItemDialog } from '@/components/inventory/CreateItemDialog'
import { handleExport } from '@/lib/export'

export default function Inventory() {
  const { inventory } = useMainStore()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('Todas')
  const [statusFilter, setStatusFilter] = useState('Todos')

  const categories = Array.from(new Set(inventory.map((i) => i.category)))

  const filtered = inventory.filter((i) => {
    const matchesSearch =
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.code.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = categoryFilter === 'Todas' || i.category === categoryFilter

    let matchesStatus = true
    if (statusFilter === 'Disponíveis') matchesStatus = i.availableQty > 0
    else if (statusFilter === 'Esgotados') matchesStatus = i.availableQty === 0
    else if (statusFilter === 'Em Manutenção') matchesStatus = i.conditionStatus === 'Manutenção'

    return matchesSearch && matchesCategory && matchesStatus
  })

  const exportData = () => {
    const headers = [
      'Ref',
      'Modelo',
      'Categoria',
      'Estoque Total',
      'Locados',
      'Disponível',
      'Status',
    ]
    const data = filtered.map((i) => [
      i.code,
      i.name,
      i.category,
      i.totalQty,
      i.rentedQty,
      i.availableQty,
      i.conditionStatus || 'Disponível',
    ])
    return { headers, data }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Estoque</h1>
          <p className="text-muted-foreground mt-1">Controle seus modelos e disponibilidades.</p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" /> Exportar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => {
                  const { headers, data } = exportData()
                  handleExport('csv', 'estoque', headers, data)
                }}
              >
                Exportar CSV
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  handleExport('pdf', 'estoque', [], [])
                }}
              >
                Exportar PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <CreateItemDialog />
        </div>
      </div>

      <Card>
        <div className="p-4 border-b flex flex-wrap items-center gap-4 bg-muted/20 print:hidden">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou referência..."
              className="pl-9 bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px] bg-background">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todas">Todas as Categorias</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-background">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos os Status</SelectItem>
              <SelectItem value="Disponíveis">Disponíveis</SelectItem>
              <SelectItem value="Esgotados">Esgotados</SelectItem>
              <SelectItem value="Em Manutenção">Em Manutenção</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[80px]">Foto</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Locados</TableHead>
                <TableHead className="text-right">Livres</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center print:hidden">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                    Nenhum item encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/30">
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
                      <p className="font-medium text-base">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Ref: {item.code}</p>
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className="text-right font-medium">{item.totalQty}</TableCell>
                    <TableCell className="text-right text-amber-600 font-medium">
                      {item.rentedQty}
                    </TableCell>
                    <TableCell className="text-right font-bold text-emerald-600">
                      {item.availableQty}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.conditionStatus === 'Manutenção' ? (
                        <Badge
                          variant="secondary"
                          className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-none"
                        >
                          Manutenção
                        </Badge>
                      ) : item.availableQty > 0 ? (
                        <Badge className="bg-emerald-500 hover:bg-emerald-600 border-none">
                          Disponível
                        </Badge>
                      ) : (
                        <Badge variant="destructive">Esgotado</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center print:hidden">
                      <Button variant="ghost" size="sm" className="h-8" asChild>
                        <Link to={`/inventory/${item.id}`}>
                          <ExternalLink className="w-4 h-4 mr-1" /> Ver
                        </Link>
                      </Button>
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
