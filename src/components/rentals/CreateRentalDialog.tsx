import { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Trash2, Check, ChevronsUpDown } from 'lucide-react'
import useMainStore, { Rental, RentalItem } from '@/stores/main'
import { useToast } from '@/hooks/use-toast'
import { usePermissions } from '@/hooks/use-permissions'
import { cn } from '@/lib/utils'

export function CreateRentalDialog({ onCreated }: { onCreated?: (rental: Rental) => void }) {
  const { customers, inventory, addRental, settings } = useMainStore()
  const { toast } = useToast()
  const { can } = usePermissions()
  const [open, setOpen] = useState(false)

  const [customerId, setCustomerId] = useState('')
  const [selectedItemId, setSelectedItemId] = useState('')
  const [qty, setQty] = useState('1')
  const [items, setItems] = useState<RentalItem[]>([])
  const [pickupLocationId, setPickupLocationId] = useState('')
  const [defaultDuration, setDefaultDuration] = useState<number | null>(null)

  const [customerOpen, setCustomerOpen] = useState(false)
  const [itemOpen, setItemOpen] = useState(false)

  const applyDuration = (days: number) => {
    setDefaultDuration(days)
    const start = new Date(todayStr)
    const end = new Date(todayStr)
    end.setDate(end.getDate() + days)
    const endStr = end.toISOString().split('T')[0]

    setItems((prev) =>
      prev.map((p) => {
        const dailyPrice = p.dailyPrice || 0
        const diffTime = end.getTime() - start.getTime()
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        if (diffDays <= 0) diffDays = 1

        return {
          ...p,
          startDate: todayStr,
          endDate: endStr,
          totalPrice: dailyPrice * p.qty * diffDays,
        }
      }),
    )
  }

  const availableItems = useMemo(
    () => inventory.filter((i) => i.availableQty > 0 && i.conditionStatus === 'Disponível'),
    [inventory],
  )

  const todayStr = new Date().toISOString().split('T')[0]

  const finalTotal = useMemo(() => {
    const rawTotal = items.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0)
    return Math.round(rawTotal)
  }, [items])

  if (!can('rentals:manage')) return null

  const handleAddItem = () => {
    if (!selectedItemId) return
    const item = inventory.find((i) => i.id === selectedItemId)
    const numQty = parseInt(qty)
    if (!item || isNaN(numQty) || numQty <= 0) return

    if (numQty > item.availableQty) {
      toast({
        title: 'Erro',
        description: `Apenas ${item.availableQty} unidades disponíveis.`,
        variant: 'destructive',
      })
      return
    }

    const start = new Date(todayStr)
    const end = new Date(todayStr)
    if (defaultDuration) {
      end.setDate(end.getDate() + defaultDuration)
    }
    const endStr = end.toISOString().split('T')[0]
    const diffTime = end.getTime() - start.getTime()
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    if (diffDays <= 0) diffDays = 1

    setItems((prev) => {
      const newItemId = Math.random().toString()
      return [
        ...prev,
        {
          id: newItemId,
          itemId: selectedItemId,
          qty: numQty,
          startDate: todayStr,
          endDate: endStr,
          dailyPrice: item.dailyPrice || 0,
          totalPrice: (item.dailyPrice || 0) * numQty * diffDays,
        },
      ]
    })
    setQty('1')
    setSelectedItemId('')
  }

  const updateItem = (id: string, field: keyof RentalItem, value: any) => {
    setItems((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p
        const updated = { ...p, [field]: value }

        if (
          field === 'startDate' ||
          field === 'endDate' ||
          field === 'dailyPrice' ||
          field === 'qty'
        ) {
          const start = new Date(updated.startDate || todayStr)
          const end = new Date(updated.endDate || todayStr)
          const diffTime = end.getTime() - start.getTime()
          let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
          if (diffDays <= 0) diffDays = 1

          updated.totalPrice = (updated.dailyPrice || 0) * updated.qty * diffDays
        }
        return updated
      }),
    )
  }

  const handleRemoveItem = (id: string) => setItems((prev) => prev.filter((p) => p.id !== id))

  const generateContractHtml = (total: number) => {
    const customer = customers.find((c) => c.id === customerId)
    if (!customer) return ''

    const addressStr =
      customer.address && typeof customer.address === 'object'
        ? `${(customer.address as any).street || ''}, ${(customer.address as any).number || ''} - ${(customer.address as any).neighborhood || ''} - ${(customer.address as any).city || ''}/${(customer.address as any).state || ''}`
        : ''

    const itemsStr = items
      .map((ri) => {
        const inv = inventory.find((i) => i.id === ri.itemId)
        return `${ri.qty}x ${inv?.name} (Retirada: ${new Date(ri.startDate || todayStr).toLocaleDateString('pt-BR')} | Devolução: ${new Date(ri.endDate || todayStr).toLocaleDateString('pt-BR')}) - Valor: R$ ${ri.totalPrice?.toFixed(2)}`
      })
      .join('<br/>')

    const startDates = items.map((i) => i.startDate || todayStr).sort()
    const endDates = items.map((i) => i.endDate || todayStr).sort()

    let locationName = 'Não informado'
    if (pickupLocationId === 'delivery') locationName = 'Entrega no Endereço do Cliente'
    else if (pickupLocationId) {
      const loc = (settings.locations as any[])?.find((l: any) => l.id === pickupLocationId)
      if (loc) locationName = loc.name
    }

    const template = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.5;">
  <h2 style="text-align: center; font-weight: bold;">TERMOS E CONDIÇÕES DE LOCAÇÃO, GUARDA E USO DE EQUIPAMENTO HOSPITALAR</h2>
  <p>Constitui objeto do presente termo de condições de locação, uso e guarda de equipamento hospitalar de propriedade de HOSPITAL HOME COMERCIO ATACADISTA DE PRODUTOS HOSPITALARES EM GERAL.</p>
  
  <p>
    <strong>LOCATÁRIA:</strong> [NOME_CLIENTE]<br/>
    <strong>Endereço:</strong> [ENDERECO]<br/>
    <strong>CPF/CNPJ:</strong> [CPF_CNPJ]<br/>
    <strong>Telefones:</strong> [TELEFONE]
  </p>

  <p><strong>LOCADOR:</strong> Lojas Hospital Home, localizada na rua Manoel Vivacqua, n. 616, Jabuor, Vitória – ES. CNPJ n. 10.893.738/0006-93.</p>

  <p>1. Pelo presente instrumento o locador aluga à locatária o(s) equipamento(s) abaixo discriminado(s), e se obriga a locá-lo(s) nas condições estabelecidas neste contrato:</p>
  <p>[ITENS_LOCADOS]</p>
  <p><strong>Local de Retirada/Entrega:</strong> [LOCAL_RETIRADA]</p>

  <p><strong>2. PREÇO E PRAZO DE LOCAÇÃO:</strong></p>
  <p>2.1 O locador compromete a manter no endereço informado no momento da locação responsável para receber o equipamento locado, esse deverá assinar o recibo de entrega no momento da entrega pela transportadora ou em loja física se for o caso.</p>
  <p>2.2 Após o cancelamento da locação ou termino da vigência do contrato a locatária deverá entrar em contato com o locador para agendar a retirada do equipamento e disponibilizá-lo para retirada pela transportadora, a mesma tem um prazo de até 03 (três) dias uteis para efetuar a retirada, caso a transportadora não consiga recolher o equipamento na data agendada, o locatário deverá arcar com as despesas da remarcação assim como pagamento do aluguel em pro-rata, pelo período adicional que ficou de posse do equipamento.</p>
  <p>2.3 No primeiro dia após o termino do prazo do contrato de locação a locatária deverá entrar em sua conta no site do locador e solicitar renovação ou cancelamento com recolhimento do(s) produto(s) ora locado(s), ou se preferir entrar em contato nos Telefones: 27-99881-1783 / 99904-6961 ou email: aluguel@hospitalhome.com.br, para efetuar a renovação do aluguel e pagamento do mês seguinte dentro da vigência do contrato.</p>

  <p><strong>3. CONDIÇÕES DE ENTREGA, USO E MANUTENÇÃO:</strong></p>
  <p>3.1 A devolução do equipamento se dará da forma escolhida no momento da locação se foi por transportadora será por transportadora se foi por retirada em loja será por devolução na mesma loja que foi retirada.</p>
  <p>3.2 A manutenção do(s) equipamento(s), objeto(s) do presente contrato é de total responsabilidade do locador; a Locatária cabe manter o(s) equipamento(s) em perfeitas condições de uso e avisar imediatamente à LOCADOR sobre eventuais problemas que impeçam o seu adequado funcionamento; para que esta tome as providências cabíveis, a danificação do equipamento pela Locatária, implicará a compra do produto e seu pagamento ao Locador.</p>
  <p>3.3 Em caso do equipamento locado for “cama hospitalar”, sendo o endereço de entrega PRÉDIO, a entrega de cama hospitalar é realizada até a portaria principal do prédio, sendo de total responsabilidade do locatário e transporte até seu apartamento.</p>
  <p>3.4 A transportadora não realiza a montagem do equipamento, este é feito pelo Locatário.</p>
  <p>3.5 O locatário assinará uma nota promissória no valor de venda do equipamento ora locado a título de em caso de perda ou dano ao equipamento causando sua inoperabilidade para futuras locação o locador seja restituído desse valor.</p>

  <p><strong>4. DISPOSIÇÕES GERAIS:</strong></p>
  <p>4.1 O locatário se compromete a, no tempo e na forma acordada entre as partes, realizar a entrega do bem locado em perfeito estado de conservação aos prepostos da contratada, sob pena de ser responsabilizado por perdas e danos.</p>
  <p>4.2 Em caso de mora na devolução do equipamento sem prévio acordo de renovação contratual e, em caso de inadimplemento do valor correspondente ao aluguel, fica o locatário ciente de que incidirá multa diária de R$ 100,00 (cem reais) até o limite do valor do equipamento, sem prejuízo da obrigação de arcar com os alugueis proporcionais ao tempo em que permanecer na posse do mesmo, sobre os quais incidirão juros de 1% (um por cento ao mês), correção monetária e multa de 2% (dois por cento) do valor devido.</p>
  <p>4.3 Em caso de inadimplemento de quaisquer obrigações acima, fica o locatário ciente de que o locador poderá negativa-lo junto aos órgãos de proteção ao crédito e levar o título a protesto, sem prejuízo do direito de ação, ficando a cargo do locatário o pagamento de custas judiciais e honorários advocatícios em 20% (vinte por cento).</p>
  <p>4.4 Não é fornecido Nota Fiscal para locação de bens móveis, fornecemos recibo conforme o Artigo 1 da Lei 8846 de 1994.</p>
  <p>4.5 Na devolução antes do prazo previsto, não haverá ressarcimento de valores.</p>
  <p>4.6 Após 07 de inadimplência em caso de relocação, o contrato será reincidido automaticamente, devendo ao locatário fazer a devolução do equipamento ora locado imediatamente, caso não ocorra poderá o locador tomar as providencias prevista na cláusula 4.3 do presente contrato.</p>
  <p>4.7 Os equipamentos locados são de relocações continua, então podem conter sinais de uso como arranhões, manchas, desgastes de peças.</p>
  <p>4.8 Todos equipamentos assim que retornam da locação passam por manutenção preventiva e higienização, antes de serem relocados.</p>
  <p>4.9 Podem haver diferença na cor e nos modelos locados, mas todas as características informadas compõem todos produtos locados.</p>
  <p>4.10 Não garantimos marcar e modelos específicos, pois trabalhamos com várias marcas e modelos, as fotos dos produtos são ilustrativas de produto novo.</p>
  
  <p>5. As partes elegem o foro de Vitória/ES para resolução de eventuais disputas relacionadas a este termo.</p>

  <p style="text-align: right; margin-top: 40px;">Vitória ES, [DATA_ATUAL]</p>
  
  <div style="display: flex; justify-content: space-between; margin-top: 60px; text-align: center;">
    <div style="width: 45%; border-top: 1px solid #000; padding-top: 5px;">Locador</div>
    <div style="width: 45%; border-top: 1px solid #000; padding-top: 5px;">Locatário</div>
  </div>
</div>
    `

    let html = template

    const formatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' })

    const replacements: Record<string, string> = {
      '\\[?NOME_CLIENTE\\]?|["\']NOME_CLIENTE["\']': customer.name,
      '\\[?CPF_CNPJ\\]?|["\']CPF_CNPJ["\']': customer.document,
      '\\[?ENDERECO\\]?|["\']ENDERECO["\']': addressStr,
      '\\[?ITENS_LOCADOS\\]?|["\']ITENS_LOCADOS["\']': itemsStr,
      '\\[?LOCAL_RETIRADA\\]?|["\']LOCAL_RETIRADA["\']': locationName,
      '\\[?VALOR_TOTAL\\]?|["\']VALOR_TOTAL["\']': `R$ ${total.toFixed(2)}`,
      '\\[?DATA_INICIO\\]?|["\']DATA_INICIO["\']': new Date(
        startDates[0] || todayStr,
      ).toLocaleDateString('pt-BR'),
      '\\[?DATA_FIM\\]?|["\']DATA_FIM["\']': new Date(
        endDates[endDates.length - 1] || todayStr,
      ).toLocaleDateString('pt-BR'),
      '\\[?DATA_ATUAL\\]?|["\']DATA_ATUAL["\']': formatter.format(new Date()),
      '\\[?TELEFONE\\]?|["\']TELEFONE["\']': customer.phone_cell || customer.phone_res || '',
      '\\[?EMAIL\\]?|["\']EMAIL["\']': customer.email || '',
    }

    for (const [key, value] of Object.entries(replacements)) {
      const regex = new RegExp(key, 'gi')
      html = html.replace(regex, value)
    }

    return html
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerId || items.length === 0) {
      toast({
        title: 'Erro',
        description: 'Selecione um cliente e adicione itens.',
        variant: 'destructive',
      })
      return
    }

    const startDates = items.map((i) => i.startDate || todayStr).sort()
    const endDates = items.map((i) => i.endDate || todayStr).sort()

    const newId = `LOC-${Math.floor(1000 + Math.random() * 9000)}`

    const customHtml = generateContractHtml(finalTotal)

    const createdRental = await addRental({
      id: newId,
      customerId,
      pickupLocationId,
      items: items.map((i) => ({
        itemId: i.itemId,
        qty: i.qty,
        startDate: i.startDate,
        endDate: i.endDate,
        dailyPrice: i.dailyPrice,
        totalPrice: i.totalPrice,
      })),
      startDate: startDates[0],
      expectedReturnDate: endDates[endDates.length - 1],
      status: 'Ativo',
      total: finalTotal,
      customContractHtml: customHtml,
    } as any)

    if (createdRental) {
      toast({
        title: 'Locação Criada',
        description: `Contrato ${createdRental.contractNumber || newId} gerado com sucesso.`,
      })
      if (onCreated) {
        onCreated(createdRental)
      }
    }

    setOpen(false)
    setCustomerId('')
    setItems([])
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> Nova Locação
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Nova Locação</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="grid gap-2">
            <Label>Cliente</Label>
            <Popover open={customerOpen} onOpenChange={setCustomerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={customerOpen}
                  className="w-full justify-between"
                >
                  {customerId
                    ? customers.find((c) => c.id === customerId)?.name
                    : 'Selecione o cliente...'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Buscar cliente por nome ou CPF/CNPJ..." />
                  <CommandList>
                    <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
                    <CommandGroup>
                      {customers.map((c) => (
                        <CommandItem
                          key={c.id}
                          value={`${c.name} ${c.document}`}
                          onSelect={() => {
                            setCustomerId(c.id)
                            setCustomerOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              customerId === c.id ? 'opacity-100' : 'opacity-0',
                            )}
                          />
                          {c.name} ({c.document})
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <Label>Local de Retirada / Entrega</Label>
            <Select value={pickupLocationId} onValueChange={setPickupLocationId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o local..." />
              </SelectTrigger>
              <SelectContent>
                {(settings.locations as any[])?.map((loc) => (
                  <SelectItem key={loc.id} value={loc.id}>
                    {loc.name}
                  </SelectItem>
                ))}
                <SelectItem value="delivery">Entrega no Endereço do Cliente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-md p-4 bg-muted/30 space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base">Adicionar Itens</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={defaultDuration === 15 ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => applyDuration(15)}
                >
                  15 Dias
                </Button>
                <Button
                  type="button"
                  variant={defaultDuration === 30 ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => applyDuration(30)}
                >
                  30 Dias
                </Button>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <Popover open={itemOpen} onOpenChange={setItemOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={itemOpen}
                      className="w-full justify-between"
                    >
                      {selectedItemId
                        ? inventory.find((i) => i.id === selectedItemId)?.name
                        : 'Selecione o modelo...'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Buscar item (nome ou referência)..." />
                      <CommandList>
                        <CommandEmpty>Nenhum modelo disponível.</CommandEmpty>
                        <CommandGroup>
                          {availableItems.map((i) => (
                            <CommandItem
                              key={i.id}
                              value={`${i.name} ${i.code}`}
                              onSelect={() => {
                                setSelectedItemId(i.id)
                                setItemOpen(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  selectedItemId === i.id ? 'opacity-100' : 'opacity-0',
                                )}
                              />
                              {i.name} (Ref: {i.code}) - Disp: {i.availableQty}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <Input
                type="number"
                min="1"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="w-24"
                placeholder="Qtd"
              />
              <Button type="button" variant="secondary" onClick={handleAddItem}>
                Adicionar
              </Button>
            </div>

            {items.length > 0 && (
              <div className="mt-4 border rounded-md bg-background overflow-x-auto">
                <table className="w-full text-sm min-w-[700px]">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-2 text-left">Item</th>
                      <th className="p-2 text-left w-36">Retirada</th>
                      <th className="p-2 text-left w-36">Devolução</th>
                      <th className="p-2 text-right w-28">Diária (R$)</th>
                      <th className="p-2 text-right w-28">Total (R$)</th>
                      <th className="p-2 text-center w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((ri) => {
                      const item = inventory.find((i) => i.id === ri.itemId)
                      return (
                        <tr key={ri.id} className="border-b last:border-0">
                          <td className="p-2">
                            {ri.qty}x {item?.name}
                          </td>
                          <td className="p-2">
                            <Input
                              type="date"
                              className="h-8 text-xs"
                              value={ri.startDate}
                              onChange={(e) => updateItem(ri.id!, 'startDate', e.target.value)}
                            />
                          </td>
                          <td className="p-2">
                            <Input
                              type="date"
                              className="h-8 text-xs"
                              value={ri.endDate}
                              onChange={(e) => updateItem(ri.id!, 'endDate', e.target.value)}
                            />
                          </td>
                          <td className="p-2">
                            <Input
                              type="number"
                              className="h-8 text-xs text-right"
                              value={ri.dailyPrice}
                              onChange={(e) =>
                                updateItem(ri.id!, 'dailyPrice', parseFloat(e.target.value) || 0)
                              }
                            />
                          </td>
                          <td className="p-2 font-medium text-right">
                            {ri.totalPrice?.toFixed(2)}
                          </td>
                          <td className="p-2 text-center">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-destructive"
                              onClick={() => handleRemoveItem(ri.id!)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="flex justify-end items-center mt-4 border-t pt-4">
            <div className="text-right">
              <span className="text-sm text-muted-foreground mr-4">Total Arredondado:</span>
              <span className="text-2xl font-bold">R$ {finalTotal.toFixed(2)}</span>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Gerar Contrato</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
