import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    supabase.auth.getSession().then(() => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const errorDescription = hashParams.get('error_description')

      if (errorDescription) {
        toast({
          title: 'Erro de recuperação',
          description: 'Link expirado ou inválido. Solicite um novo link de recuperação.',
          variant: 'destructive',
        })
        navigate('/public/forgot-password')
      }
    })
  }, [navigate, toast])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password || !confirmPassword) return

    if (password !== confirmPassword) {
      return toast({
        title: 'Erro',
        description: 'As senhas não coincidem.',
        variant: 'destructive',
      })
    }

    if (password.length < 8) {
      return toast({
        title: 'Erro',
        description: 'A senha deve ter no mínimo 8 caracteres.',
        variant: 'destructive',
      })
    }

    setIsSubmitting(true)

    const { error } = await supabase.auth.updateUser({
      password: password,
    })

    setIsSubmitting(false)

    if (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a senha. O link pode estar expirado.',
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Sucesso',
        description: 'Senha atualizada com sucesso. Faça login com sua nova senha.',
      })
      await supabase.auth.signOut()
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md shadow-lg border-primary/10">
        <CardHeader className="space-y-2 text-center pb-6">
          <CardTitle className="text-2xl font-bold tracking-tight">Nova Senha</CardTitle>
          <CardDescription>Digite sua nova senha abaixo</CardDescription>
        </CardHeader>
        <form onSubmit={handleUpdate}>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-left">
              <Label htmlFor="password">Nova Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            <div className="space-y-2 text-left">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Button type="submit" className="w-full text-base h-11" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
              Atualizar Senha
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
