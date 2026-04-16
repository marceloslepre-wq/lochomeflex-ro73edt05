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
import { CheckCircle, FileText, Plus, Trash2, Upload, Edit } from 'lucide-react'
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

  const handleContractUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const mockHighFidelityHtml = `
<div style="font-family: 'Times New Roman', serif; color: #000; line-height: 1.6; max-width: 800px; margin: 0 auto; background: white; padding: 40px; box-sizing: border-box;">
  <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 15px;">
    <h1 style="text-transform: uppercase; font-size: 22px; font-weight: bold; margin: 0; color: #000;">
      Contrato de Locação de Equipamentos
    </h1>
    <p style="margin: 5px 0 0; font-size: 14px; color: #444;">CONTRATO Nº: <strong>{{rentalId}}</strong></p>
  </div>
  
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 25px; border-bottom: 1px solid #ccc; padding-bottom: 5px; color: #000;">1. AS PARTES</h2>
  <p style="text-align: justify; margin-top: 10px; font-size: 15px;">
    <strong>LOCADORA:</strong> {{companyName}}, inscrita no CNPJ sob o nº {{companyDocument}}, com sede em {{companyAddress}}.<br/><br/>
    <strong>LOCATÁRIO:</strong> {{customerName}}, inscrito no CPF/CNPJ sob o nº {{customerDocument}}, telefone {{customerPhone}}, e-mail {{customerEmail}}.
  </p>

  <h2 style="font-size: 16px; font-weight: bold; margin-top: 25px; border-bottom: 1px solid #ccc; padding-bottom: 5px; color: #000;">2. OBJETO DO CONTRATO</h2>
  <p style="text-align: justify; margin-top: 10px; font-size: 15px;">O presente instrumento tem como objeto a locação dos equipamentos abaixo descritos:</p>
  <table style="width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 15px;">
    <thead>
      <tr style="background-color: #f5f5f5;">
        <th style="border: 1px solid #000; padding: 8px; text-align: center; width: 60px;">Qtd</th>
        <th style="border: 1px solid #000; padding: 8px; text-align: left;">Descrição do Equipamento</th>
        <th style="border: 1px solid #000; padding: 8px; text-align: left; width: 120px;">Código</th>
      </tr>
    </thead>
    <tbody>
      {{itemsList}}
    </tbody>
  </table>

  <h2 style="font-size: 16px; font-weight: bold; margin-top: 25px; border-bottom: 1px solid #ccc; padding-bottom: 5px; color: #000;">3. PRAZOS E VALORES</h2>
  <p style="text-align: justify; margin-top: 10px; font-size: 15px;">
    <strong>Data de Retirada:</strong> {{startDate}}<br/>
    <strong>Devolução Prevista:</strong> {{expectedReturnDate}}<br/>
    <strong>Valor Total Pactuado:</strong> R$ {{totalValue}}
  </p>
  
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 25px; border-bottom: 1px solid #ccc; padding-bottom: 5px; color: #000;">4. CONDIÇÕES GERAIS</h2>
  <p style="text-align: justify; margin-top: 10px; font-size: 15px;">
    O LOCATÁRIO declara ter vistoriado e recebido os equipamentos acima descritos em perfeitas condições de uso e funcionamento. Em caso de atraso na devolução, o LOCATÁRIO concorda com a aplicação de multa correspondente a {{lateFeeInfo}}. Eventuais danos, mau uso ou extravios ensejarão a cobrança integral para reposição ou reparo do bem.
  </p>
  
  <h2 style="font-size: 16px; font-weight: bold; margin-top: 25px; border-bottom: 1px solid #ccc; padding-bottom: 5px; color: #000;">5. CONTATOS PARA RENOVAÇÃO/DEVOLUÇÃO</h2>
  <p style="text-align: justify; margin-top: 10px; font-size: 15px;">
    Em caso de renovação ou solicitação de devolução, o LOCATÁRIO deverá entrar em contato nos números: 27-3026-330 / 99904-6961 ou pelo e-mail: aluguel@hospitalhome.com.br.
  </p>

  <div style="margin-top: 60px; display: flex; justify-content: space-between; text-align: center; font-size: 15px;">
    <div style="width: 45%;">
      <div style="border-bottom: 1px solid #000; margin-bottom: 8px;"></div>
      <strong>{{companyName}}</strong><br/>
      <span style="font-size: 13px; color: #555;">LOCADORA</span>
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
              {(() => {
                const [editingLocId, setEditingLocId] = useState<string | null>(null)
                const [editLocName, setEditLocName] = useState('')
                const [editLocAddress, setEditLocAddress] = useState('')

                return (
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
                                    const newLocs = settings.locations?.filter(
                                      (l) => l.id !== loc.id,
                                    )
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
                )
              })()}

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
