import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Package } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import useMainStore from '@/stores/main'

export default function Index() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { toast } = useToast()
  const { users, currentUser, setCurrentUser } = useMainStore()

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard')
    }
  }, [currentUser, navigate])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast({ title: 'Erro', description: 'Preencha todos os campos.', variant: 'destructive' })
      return
    }

    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.active)

    if (user) {
      setCurrentUser(user)
      toast({ title: 'Sucesso', description: `Bem-vindo, ${user.name}!` })
      navigate('/dashboard')
    } else {
      toast({
        title: 'Acesso Negado',
        description: 'Credenciais inválidas ou usuário inativo.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-float delay-1000" />

      <Card className="w-full max-w-md shadow-xl border-border/50 relative z-10 animate-fade-in-up">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="mx-auto w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-2 shadow-inner">
            <Package className="w-6 h-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Gestão de Locação</CardTitle>
          <CardDescription>Faça login para gerenciar seu estoque e clientes.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@loja.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full h-11 text-base font-semibold mt-4">
              Entrar no Sistema
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-muted-foreground space-y-1">
            <p>Acesso demonstração:</p>
            <p>
              Admin: <strong>admin@loja.com.br</strong>
            </p>
            <p>
              Operador: <strong>joao@loja.com.br</strong>
            </p>
            <p className="text-xs pt-2">Qualquer senha é aceita.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
