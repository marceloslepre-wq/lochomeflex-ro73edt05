import { useState } from 'react'
import useMainStore from '@/stores/main'
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
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { CheckCircle, FileText, Plus, Upload } from 'lucide-react'

export default function Settings() {
  const { settings, users, updateSettings, addUser, updateUser } = useMainStore()
  const { toast } = useToast()

  const [newUserOpen, setNewUserOpen] = useState(false)
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Operador', password: '' })

  const handleContractUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      updateSettings({ contractFileName: file.name })
      toast({
        title: 'Template de Contrato Salvo',
        description: `O arquivo ${file.name} será usado como padrão.`,
      })
    }
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      updateSettings({ logoUrl: url })
      toast({ title: 'Logo Atualizado', description: 'A identidade visual da loja foi alterada.' })
    }
  }

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault()
    addUser({
      id: Math.random().toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      active: true,
    })
    toast({ title: 'Usuário Criado', description: `${newUser.name} agora tem acesso ao sistema.` })
    setNewUserOpen(false)
    setNewUser({ name: '', email: '', role: 'Operador', password: '' })
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
        <TabsList className="grid w-full grid-cols-4 h-12 items-center mb-6">
          <TabsTrigger value="geral" className="text-base h-full">
            Geral
          </TabsTrigger>
          <TabsTrigger value="contrato" className="text-base h-full">
            Contratos
          </TabsTrigger>
          <TabsTrigger value="equipe" className="text-base h-full">
            Equipe
          </TabsTrigger>
          <TabsTrigger value="aparencia" className="text-base h-full">
            Aparência
          </TabsTrigger>
        </TabsList>

        {/* Tab Geral */}
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
                  <Select defaultValue={settings.lateFeeType}>
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
                  <Input type="number" defaultValue={settings.lateFeeValue} />
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
                  <Input defaultValue={settings.companyName} />
                </div>
                <div className="space-y-2">
                  <Label>CNPJ</Label>
                  <Input defaultValue={settings.companyDocument} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Endereço Completo</Label>
                  <Input defaultValue={settings.companyAddress} />
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
        </TabsContent>

        {/* Tab Contrato */}
        <TabsContent value="contrato" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Template de Contrato Personalizado</CardTitle>
              <CardDescription>
                Faça upload de um arquivo (PDF ou DOCX) para substituir o contrato padrão do
                sistema.
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
                    Clique para selecionar um arquivo
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">Suporta .pdf, .docx até 10MB</p>
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
                      O arquivo <strong>{settings.contractFileName}</strong> está sendo usado nas
                      novas locações.
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto"
                    onClick={() => updateSettings({ contractFileName: null })}
                  >
                    Remover
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Equipe */}
        <TabsContent value="equipe" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold">Gerenciamento de Equipe</h3>
              <p className="text-sm text-muted-foreground">
                Cadastre operadores e administradores que acessarão a loja.
              </p>
            </div>
            <Dialog open={newUserOpen} onOpenChange={setNewUserOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" /> Novo Usuário
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cadastrar Novo Usuário</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateUser} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Nome Completo</Label>
                    <Input
                      required
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      required
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Senha</Label>
                      <Input
                        type="password"
                        required
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Papel</Label>
                      <Select
                        value={newUser.role}
                        onValueChange={(v) => setNewUser({ ...newUser, role: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Operador">Operador (Acesso Restrito)</SelectItem>
                          <SelectItem value="Administrador">Administrador (Total)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter className="pt-4">
                    <Button type="button" variant="outline" onClick={() => setNewUserOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">Salvar Usuário</Button>
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
                  <TableRow key={u.id}>
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateUser(u.id, { active: !u.active })}
                      >
                        {u.active ? 'Desativar Acesso' : 'Ativar Acesso'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Tab Aparência */}
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
                    Adicione a marca que aparecerá no menu principal.
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
