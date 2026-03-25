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
import { Separator } from '@/components/ui/separator'

export default function Settings() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie regras de negócio, dados da empresa e usuários.
        </p>
      </div>

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
              <Select defaultValue="daily">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Percentual Diário (%)</SelectItem>
                  <SelectItem value="fixed">Valor Fixo Diário (R$)</SelectItem>
                  <SelectItem value="hourly">Multa por Hora</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Valor / Percentual</Label>
              <Input type="number" defaultValue="2" />
            </div>
          </div>
          <Button>Salvar Regras</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dados da Empresa (Contrato)</CardTitle>
          <CardDescription>
            Informações que aparecerão nos contratos e recibos gerados.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Razão Social</Label>
              <Input defaultValue="LocaWeb Gestão de Ativos LTDA" />
            </div>
            <div className="space-y-2">
              <Label>CNPJ</Label>
              <Input defaultValue="00.000.000/0001-00" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Endereço Completo</Label>
              <Input defaultValue="Av. Central, 1000 - Centro, São Paulo/SP" />
            </div>
          </div>
          <Button>Atualizar Dados</Button>
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground text-center pt-8">
        Sistema Gestão de Locação v1.0.0
      </div>
    </div>
  )
}
