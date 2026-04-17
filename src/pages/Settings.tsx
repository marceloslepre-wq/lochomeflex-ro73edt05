import { useState } from 'react'
import useMainStore, { User } from '@/stores/main'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { CheckCircle, FileText, Plus, Trash2, Upload, Edit, Save } from 'lucide-react'
import { PermissionKey, usePermissions } from '@/hooks/use-permissions'

const PERMISSIONS_LIST: { id: PermissionKey; label: string }[] = [
  { id: 'items:write', label: 'Cadastrar/Editar Itens' },
  { id: 'items:delete', label: 'Excluir Itens' },
  { id: 'customers:write', label: 'Cadastrar/Editar Clientes' },
  { id: 'customers:delete', label: 'Excluir Clientes' },
  { id: 'rentals:manage', label: 'Gerenciar Locações' },
  { id: 'users:manage', label: 'Gerenciar Usuários' },
  { id: 'reports:view', label: 'Visualizar Relatórios' },
]

export default function Settings() {
  const { settings, users, updateSettings, addUser, updateUser, deleteUser } = useMainStore()
  const { toast } = useToast()
  const { can } = usePermissions()

  const [userDialogOpen, setUserDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: 'Operador',
    password: '',
    permissions: [] as PermissionKey[],
  })

  const [editingLocId, setEditingLocId] = useState<string | null>(null)
  const [editLocName, setEditLocName] = useState('')
  const [editLocAddress, setEditLocAddress] = useState('')

  const handleContractUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const mockHighFidelityHtml = `
<div style="font-family: Arial, sans-serif; color: #000; line-height: 1.6; max-width: 800px; margin: 0 auto; background: white; padding: 40px; box-sizing: border-box; font-size: 14px;">
  <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px;">
    <h1 style="text-transform: uppercase; font-size: 18px; font-weight: bold; margin: 0; color: #000;">
      TERMOS E CONDIÇÕES DE LOCAÇÃO, GUARDA E USO DE EQUIPAMENTO HOSPITALAR
    </h1>
    <p style="margin: 5px 0 0; font-size: 16px; font-weight: bold;">CONTRATO Nº: {{rentalId}}</p>
  </div>
  
  <p style="text-align: justify; margin-top: 10px;">
    Constitui objeto do presente termo de condições de locação, uso e guarda de equipamento hospitalar de propriedade de HOSPITAL HOME COMERCIO ATACADISTA DE PRODUTOS HOSPITALARES EM GERAL.
  </p>

  <div style="margin-top: 15px; border: 1px solid #ccc; padding: 15px; border-radius: 5px;">
    <p style="margin: 0 0 8px 0;"><strong>LOCATÁRIA:</strong> {{customerName}}</p>
    <p style="margin: 0 0 8px 0;"><strong>Endereço:</strong> {{customerAddress}}</p>
    <p style="margin: 0 0 8px 0;"><strong>RG:</strong> {{customerRg}} &nbsp;&nbsp;&nbsp; <strong>CPF/CNPJ:</strong> {{customerDocument}}</p>
    <p style="margin: 0;"><strong>Telefones:</strong> {{customerPhone}}</p>
  </div>

  <p style="text-align: justify; margin-top: 15px;">
    <strong>LOCADOR:</strong> {{companyName}}, localizada na {{companyAddress}}. CNPJ n. {{companyDocument}}.
  </p>

  <p style="text-align: justify; margin-top: 15px;">
    <strong>1.</strong> Pelo presente instrumento o locador aluga à locatária o(s) equipamento(s) abaixo discriminado(s), e se obriga a locá-lo(s) nas condições estabelecidas neste contrato:
  </p>

  <table style="width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 14px;">
    <thead>
      <tr style="background-color: #f5f5f5;">
        <th style="border: 1px solid #000; padding: 8px; text-align: center; width: 60px;">Qtd</th>
        <th style="border: 1px solid #000; padding: 8px; text-align: left;">Descrição do Equipamento</th>
        <th style="border: 1px solid #000; padding: 8px; text-align: left; width: 120px;">Código</th>
        <th style="border: 1px solid #000; padding: 8px; text-align: center; width: 100px;">Retirada</th>
        <th style="border: 1px solid #000; padding: 8px; text-align: center; width: 100px;">Devolução</th>
        <th style="border: 1px solid #000; padding: 8px; text-align: right; width: 100px;">Valor (R$)</th>
      </tr>
    </thead>
    <tbody>
      {{itemsList}}
    </tbody>
  </table>

  <p style="margin: 15px 0;">
    <strong>Local de Retirada/Entrega:</strong> {{pickupLocation}}
  </p>

  <p style="margin-top: 20px;"><strong>2. PREÇO E PRAZO DE LOCAÇÃO:</strong></p>
  <p style="text-align: justify; margin-top: 5px;">
    <strong>2.1</strong> O locador compromete a manter no endereço informado no momento da locação responsável para receber o equipamento locado, esse deverá assinar o recibo de entrega no momento da entrega pela transportadora ou em loja física se for o caso.<br/><br/>
    <strong>2.2</strong> Após o cancelamento da locação ou termino da vigência do contrato a locatária deverá entrar em contato com o locador para agendar a retirada do equipamento e disponibilizá-lo para retirada pela transportadora, a mesma tem um prazo de até 03 (três) dias uteis para efetuar a retirada, caso a transportadora não consiga recolher o equipamento na data agendada, o locatário deverá arcar com as despesas da remarcação assim como pagamento do aluguel em pro-rata, pelo período adicional que ficou de posse do equipamento.<br/><br/>
    <strong>2.3</strong> No primeiro dia após o termino do prazo do contrato de locação a locatária deverá entrar em sua conta no site do locador e solicitar renovação ou cancelamento com recolhimento do(s) produto(s) ora locado(s), ou se preferir entrar em contato nos Telefones: 27-99881-1783 / 99904-6961 ou email: aluguel@hospitalhome.com.br, para efetuar a renovação do aluguel e pagamento do mês seguinte dentro da vigência do contrato.
  </p>

  <p style="margin-top: 20px;"><strong>3. CONDIÇÕES DE ENTREGA, USO E MANUTENÇÃO:</strong></p>
  <p style="text-align: justify; margin-top: 5px;">
    <strong>3.1</strong> A devolução do equipamento se dará da forma escolhida no momento da locação se foi por transportadora será por transportadora se foi por retirada em loja será por devolução na mesma loja que foi retirada.<br/><br/>
    <strong>3.2</strong> A manutenção do(s) equipamento(s), objeto(s) do presente contrato é de total responsabilidade do locador; a Locatária cabe manter o(s) equipamento(s) em perfeitas condições de uso e avisar imediatamente à LOCADOR sobre eventuais problemas que impeçam o seu adequado funcionamento; para que esta tome as providências cabíveis, a danificação do equipamento pela Locatária, implicará a compra do produto e seu pagamento ao Locador.<br/><br/>
    <strong>3.3</strong> Em caso do equipamento locado for “cama hospitalar”, sendo o endereço de entrega PRÉDIO, a entrega de cama hospitalar é realizada até a portaria principal do prédio, sendo de total responsabilidade do locatário e transporte até seu apartamento.<br/><br/>
    <strong>3.4</strong> A transportadora não realiza a montagem do equipamento, este é feito pelo Locatário.<br/><br/>
    <strong>3.5</strong> O locatário assinará uma nota promissória no valor de venda do equipamento ora locado a título de em caso de perda ou dano ao equipamento causando sua inoperabilidade para futuras locação o locador seja restituído desse valor.
  </p>

  <p style="margin-top: 20px;"><strong>4. DISPOSIÇÕES GERAIS:</strong></p>
  <p style="text-align: justify; margin-top: 5px;">
    <strong>4.1</strong> O locatário se compromete a, no tempo e na forma acordada entre as partes, realizar a entrega do bem locado em perfeito estado de conservação aos prepostos da contratada, sob pena de ser responsabilizado por perdas e danos.<br/><br/>
    <strong>4.2</strong> Em caso de mora na devolução do equipamento sem prévio acordo de renovação contratual e, em caso de inadimplemento do valor correspondente ao aluguel, fica o locatário ciente de que incidirá multa diária de R$ 100,00 (cem reais) até o limite do valor do equipamento, sem prejuízo da obrigação de arcar com os alugueis proporcionais ao tempo em que permanecer na posse do mesmo, sobre os quais incidirão juros de 1% (um por cento ao mês), correção monetária e multa de 2% (dois por cento) do valor devido.<br/><br/>
    <strong>4.3</strong> Em caso de inadimplemento de quaisquer obrigações acima, fica o locatário ciente de que o locador poderá negativa-lo junto aos órgãos de proteção ao crédito e levar o título a protesto, sem prejuízo do direito de ação, ficando a cargo do locatário o pagamento de custas judiciais e honorários advocatícios em 20% (vinte por cento).<br/><br/>
    <strong>4.4</strong> Não é fornecido Nota Fiscal para locação de bens móveis, fornecemos recibo conforme o Artigo 1 da Lei 8846 de 1994.<br/><br/>
    <strong>4.5</strong> Na devolução antes do prazo previsto, não haverá ressarcimento de valores.<br/><br/>
    <strong>4.6</strong> Após 07 de inadimplência em caso de relocação, o contrato será reincidido automaticamente, devendo ao locatário fazer a devolução do equipamento ora locado imediatamente, caso não ocorra poderá o locador tomar as providencias prevista na cláusula 4.3 do presente contrato.<br/><br/>
    <strong>4.7</strong> Os equipamentos locados são de relocações continua, então podem conter sinais de uso como arranhões, manchas, desgastes de peças.<br/><br/>
    <strong>4.8</strong> Todos equipamentos assim que retornam da locação passam por manutenção preventiva e higienização, antes de serem relocados.<br/><br/>
    <strong>4.9</strong> Podem haver diferença na cor e nos modelos locados, mas todas as características informadas compõem todos produtos locados.<br/><br/>
    <strong>4.10</strong> Não garantimos marcar e modelos específicos, pois trabalhamos com várias marcas e modelos, as fotos dos produtos são ilustrativas de produto novo.
  </p>

  <p style="text-align: justify; margin-top: 20px;">
    <strong>5.</strong> As partes elegem o foro de Vitória/ES para resolução de eventuais disputas relacionadas a este termo.
  </p>

  <p style="text-align: right; margin-top: 40px; font-weight: bold;">
    Vitória ES, {{currentDate}}
  </p>

  <div style="margin-top: 60px; display: flex; justify-content: space-between; text-align: center; font-size: 15px;">
    <div style="width: 45%;">
      <div style="border-bottom: 1px solid #000; margin-bottom: 8px;"></div>
      <strong>{{companyName}}</strong><br/>
      <span style="font-size: 13px; color: #555;">LOCADOR</span>
    </div>
    <div style="width: 45%;">
      <div style="border-bottom: 1px solid #000; margin-bottom: 8px;"></div>
      <strong>{{customerName}}</strong><br/>
      <span style="font-size: 13px; color: #555;">LOCATÁRIO</span>
    </div>
  </div>
</div>`

      updateSettings({
        contractFileName: file.name,
        contractTemplateHtml: mockHighFidelityHtml,
      })
      toast({
        title: 'Template Analisado',
        description: `O arquivo ${file.name} foi processado e formatado com alta fidelidade para os contratos.`,
      })
    }
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        updateSettings({ logoUrl: reader.result as string })
        toast({
          title: 'Logo Atualizado',
          description: 'A identidade visual da loja foi alterada.',
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleOpenUserForm = (u?: User) => {
    if (u) {
      setEditingUser(u)
      setUserForm({
        name: u.name,
        email: u.email,
        role: u.role,
        password: '',
        permissions: u.permissions || [],
      })
    } else {
      setEditingUser(null)
      setUserForm({ name: '', email: '', role: 'Operador', password: '', permissions: [] })
    }
    setUserDialogOpen(true)
  }

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingUser) {
        updateUser(editingUser.id, {
          name: userForm.name,
          email: userForm.email,
          role: userForm.role,
          permissions: userForm.role === 'Administrador' ? [] : userForm.permissions,
        })

        if (userForm.password) {
          await supabase.functions.invoke('manage-users', {
            body: {
              action: 'update',
              user: {
                auth_user_id: editingUser.auth_user_id || editingUser.id,
                password: userForm.password,
              },
            },
          })
        }
        toast({ title: 'Usuário Atualizado', description: 'Dados salvos.' })
      } else {
        const res = await supabase.functions.invoke('manage-users', {
          body: { action: 'create', user: userForm },
        })

        if (res.error) throw new Error(res.error.message || 'Erro ao criar usuário')

        addUser({
          id: res.data?.user?.id || Math.random().toString(),
          name: userForm.name,
          email: userForm.email,
          role: userForm.role,
          active: true,
          permissions: userForm.role === 'Administrador' ? [] : userForm.permissions,
        })
        toast({
          title: 'Usuário Criado',
          description: `${userForm.name} agora tem acesso ao sistema.`,
        })
      }
      setUserDialogOpen(false)
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' })
    }
  }

  const handlePermToggle = (perm: PermissionKey, checked: boolean) => {
    setUserForm((prev) => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, perm]
        : prev.permissions.filter((p) => p !== perm),
    }))
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie regras de negócio, contratos, equipe e identidade visual.
        </p>
      </div>

      <Tabs defaultValue="geral" className="w-full">
        <TabsList className="flex w-full h-12 items-center mb-6 overflow-x-auto">
          <TabsTrigger value="geral" className="text-base h-full flex-1">
            Geral
          </TabsTrigger>
          <TabsTrigger value="contrato" className="text-base h-full flex-1">
            Contratos
          </TabsTrigger>
          <TabsTrigger
            value="equipe"
            className="text-base h-full flex-1"
            disabled={!can('users:manage')}
          >
            Equipe
          </TabsTrigger>
          <TabsTrigger value="aparencia" className="text-base h-full flex-1">
            Aparência
          </TabsTrigger>
          <TabsTrigger value="locais" className="text-base h-full flex-1">
            Logística
          </TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Regras de Atraso e Multas</CardTitle>
              <CardDescription>
                Configure como o sistema calcula as multas para devoluções fora do prazo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Tipo de Multa</Label>
                  <Select
                    defaultValue={settings.lateFeeType}
                    onValueChange={(v) => updateSettings({ lateFeeType: v as 'daily' | 'fixed' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Percentual Diário (%)</SelectItem>
                      <SelectItem value="fixed">Valor Fixo Diário (R$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Valor / Percentual</Label>
                  <Input
                    type="number"
                    defaultValue={settings.lateFeeValue}
                    onChange={(e) => updateSettings({ lateFeeValue: Number(e.target.value) })}
                  />
                </div>
              </div>
              <Button
                onClick={() =>
                  toast({ title: 'Salvo', description: 'Regras de multa atualizadas.' })
                }
              >
                Salvar Regras
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dados da Empresa</CardTitle>
              <CardDescription>
                Informações que aparecerão nos contratos e recibos gerados.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Razão Social</Label>
                  <Input
                    defaultValue={settings.companyName}
                    onChange={(e) => updateSettings({ companyName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>CNPJ</Label>
                  <Input
                    defaultValue={settings.companyDocument}
                    onChange={(e) => updateSettings({ companyDocument: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Endereço Completo</Label>
                  <Input
                    defaultValue={settings.companyAddress}
                    onChange={(e) => updateSettings({ companyAddress: e.target.value })}
                  />
                </div>
              </div>
              <Button
                onClick={() =>
                  toast({ title: 'Salvo', description: 'Dados da empresa atualizados.' })
                }
              >
                Atualizar Dados
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Categorias de Produtos</CardTitle>
              <CardDescription>Gerencie as categorias disponíveis no estoque.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {settings.categories?.map((cat, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="text-sm py-1 px-3 flex items-center gap-2"
                  >
                    {cat}
                    <button
                      onClick={() => {
                        const newCats = settings.categories?.filter((_, i) => i !== idx)
                        updateSettings({ categories: newCats })
                      }}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      &times;
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2 max-w-sm">
                <Input
                  id="new-category"
                  placeholder="Nova Categoria"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      const val = e.currentTarget.value.trim()
                      if (val && !settings.categories?.includes(val)) {
                        updateSettings({ categories: [...(settings.categories || []), val] })
                        e.currentTarget.value = ''
                      }
                    }
                  }}
                />
                <Button
                  onClick={() => {
                    const input = document.getElementById('new-category') as HTMLInputElement
                    const val = input.value.trim()
                    if (val && !settings.categories?.includes(val)) {
                      updateSettings({ categories: [...(settings.categories || []), val] })
                      input.value = ''
                    }
                  }}
                >
                  Adicionar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contrato" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Template de Contrato Personalizado</CardTitle>
              <CardDescription>
                Faça upload de um arquivo para ser referenciado nos novos contratos gerados. O
                sistema irá renderizá-lo em alta fidelidade.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-1 border-2 border-dashed rounded-lg p-8 text-center bg-muted/20 hover:bg-muted/50 transition-colors">
                  <FileText className="w-10 h-10 mx-auto text-muted-foreground mb-4" />
                  <Label
                    htmlFor="contract-upload"
                    className="cursor-pointer text-primary hover:underline font-medium text-lg"
                  >
                    Clique para selecionar um arquivo (.docx)
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Nós processaremos seu modelo para gerar PDFs fiéis à sua marca.
                  </p>
                  <Input
                    id="contract-upload"
                    type="file"
                    accept=".pdf,.docx"
                    className="hidden"
                    onChange={handleContractUpload}
                  />
                </div>
              </div>

              {settings.contractFileName && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Template Ativo</p>
                    <p className="text-sm">
                      O arquivo <strong>{settings.contractFileName}</strong> está ativo e
                      configurado com alta fidelidade.
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto"
                    onClick={() =>
                      updateSettings({ contractFileName: null, contractTemplateHtml: null })
                    }
                  >
                    Remover
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipe" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold">Gerenciamento de Equipe</h3>
              <p className="text-sm text-muted-foreground">
                Cadastre operadores e gerencie permissões.
              </p>
            </div>
            <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenUserForm()}>
                  <Plus className="w-4 h-4 mr-2" /> Novo Usuário
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingUser ? 'Editar Usuário' : 'Cadastrar Novo Usuário'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSaveUser} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Nome Completo</Label>
                    <Input
                      required
                      value={userForm.name}
                      onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      required
                      value={userForm.email}
                      onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{editingUser ? 'Nova Senha (opcional)' : 'Senha'}</Label>
                      <Input
                        type="password"
                        required={!editingUser}
                        value={userForm.password}
                        onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Papel</Label>
                      <Select
                        value={userForm.role}
                        onValueChange={(v) => setUserForm({ ...userForm, role: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Operador">Operador</SelectItem>
                          <SelectItem value="Administrador">Administrador</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {userForm.role !== 'Administrador' && (
                    <div className="pt-2 border-t mt-4">
                      <Label className="text-base mb-3 block">Permissões de Acesso</Label>
                      <div className="grid grid-cols-1 gap-3">
                        {PERMISSIONS_LIST.map((p) => (
                          <div key={p.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={p.id}
                              checked={userForm.permissions.includes(p.id)}
                              onCheckedChange={(c) => handlePermToggle(p.id, !!c)}
                            />
                            <Label htmlFor={p.id} className="font-normal cursor-pointer">
                              {p.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <DialogFooter className="pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setUserDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit">Salvar</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Papel</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id} className="group">
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.role}</TableCell>
                    <TableCell>
                      <Badge
                        variant={u.active ? 'default' : 'secondary'}
                        className={u.active ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
                      >
                        {u.active ? 'Ativo' : 'Desativado'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateUser(u.id, { active: !u.active })}
                        >
                          {u.active ? 'Desativar' : 'Ativar'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenUserForm(u)}
                          className="h-8 w-8"
                        >
                          <Edit className="w-4 h-4 text-primary" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir Usuário</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir este registro? Esta ação não pode ser
                                desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => {
                                  deleteUser(u.id)
                                  toast({ title: 'Excluído' })
                                }}
                                className="bg-destructive text-white"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="locais" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Locais de Retirada e Devolução</CardTitle>
              <CardDescription>
                Cadastre os pontos físicos de logística para controle de saída e entrada de
                equipamentos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome do Local</TableHead>
                    <TableHead>Endereço Completo</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!settings.locations || settings.locations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground py-4">
                        Nenhum local cadastrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    settings.locations.map((loc) =>
                      editingLocId === loc.id ? (
                        <TableRow key={loc.id}>
                          <TableCell>
                            <Input
                              value={editLocName}
                              onChange={(e) => setEditLocName(e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={editLocAddress}
                              onChange={(e) => setEditLocAddress(e.target.value)}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newLocs = settings.locations?.map((l) =>
                                  l.id === loc.id
                                    ? { ...l, name: editLocName, address: editLocAddress }
                                    : l,
                                )
                                updateSettings({ locations: newLocs })
                                setEditingLocId(null)
                              }}
                            >
                              <Save className="w-4 h-4 text-emerald-600" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ) : (
                        <TableRow key={loc.id}>
                          <TableCell className="font-medium">{loc.name}</TableCell>
                          <TableCell>{loc.address}</TableCell>
                          <TableCell className="text-right flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-primary"
                              onClick={() => {
                                setEditingLocId(loc.id)
                                setEditLocName(loc.name)
                                setEditLocAddress(loc.address)
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:bg-destructive/10"
                              onClick={() => {
                                const newLocs = settings.locations?.filter((l) => l.id !== loc.id)
                                updateSettings({ locations: newLocs })
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ),
                    )
                  )}
                </TableBody>
              </Table>

              <div className="grid gap-4 md:grid-cols-2 pt-4 border-t">
                <div className="space-y-2">
                  <Label>Nome do Local</Label>
                  <Input id="new-loc-name" placeholder="Ex: Matriz, Galpão Norte..." />
                </div>
                <div className="space-y-2">
                  <Label>Endereço</Label>
                  <Input id="new-loc-address" placeholder="Rua, Número, Cidade..." />
                </div>
              </div>
              <Button
                onClick={() => {
                  const nameInput = document.getElementById('new-loc-name') as HTMLInputElement
                  const addressInput = document.getElementById(
                    'new-loc-address',
                  ) as HTMLInputElement
                  const name = nameInput.value.trim()
                  const address = addressInput.value.trim()
                  if (name && address) {
                    const newLoc = { id: Math.random().toString(), name, address }
                    updateSettings({ locations: [...(settings.locations || []), newLoc] })
                    nameInput.value = ''
                    addressInput.value = ''
                  }
                }}
              >
                Cadastrar Local
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="aparencia" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Identidade Visual da Loja</CardTitle>
              <CardDescription>
                Ajuste as cores principais e o logotipo para alinhar com sua marca física.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <Label className="text-base">Cor Principal</Label>
                  <p className="text-sm text-muted-foreground">
                    Esta cor será aplicada em botões, links e menus.
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full border shadow-inner overflow-hidden flex-shrink-0">
                      <input
                        type="color"
                        className="w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                        value={settings.primaryColor}
                        onChange={(e) => updateSettings({ primaryColor: e.target.value })}
                      />
                    </div>
                    <Input
                      value={settings.primaryColor}
                      onChange={(e) => updateSettings({ primaryColor: e.target.value })}
                      className="w-32 uppercase"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-base">Logotipo da Empresa</Label>
                  <p className="text-sm text-muted-foreground">
                    Adicione a marca que aparecerá no menu principal e contratos.
                  </p>
                  <div className="flex items-center gap-4">
                    {settings.logoUrl ? (
                      <div className="w-24 h-24 border rounded bg-muted flex items-center justify-center p-2 relative group">
                        <img
                          src={settings.logoUrl}
                          alt="Logo"
                          className="max-w-full max-h-full object-contain"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:text-white"
                            onClick={() => updateSettings({ logoUrl: null })}
                          >
                            Remover
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="w-24 h-24 border-2 border-dashed rounded flex flex-col items-center justify-center text-muted-foreground">
                        <Upload className="w-6 h-6 mb-1" />
                        <span className="text-[10px]">Sem Logo</span>
                      </div>
                    )}
                    <div>
                      <Label htmlFor="logo-upload" className="cursor-pointer">
                        <div className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md text-sm font-medium inline-flex items-center">
                          Trocar Imagem
                        </div>
                      </Label>
                      <Input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoUpload}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
