import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Package, Users, FileText, Smartphone, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Guide() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center py-6">
        <h1 className="text-4xl font-bold tracking-tight">Guia de Implementação Rápida</h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
          Passo a passo para configurar o sistema perfeitamente e conectá-lo à operação da sua loja
          física.
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="border-l-4 border-l-primary shadow-sm hover:shadow transition-shadow">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <div className="bg-primary/10 p-3 rounded-full shrink-0">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl">1. Cadastro do Estoque Físico</CardTitle>
              <CardDescription>Migre seus itens para a plataforma</CardDescription>
            </div>
            <Link
              to="/inventory"
              className="hidden sm:flex items-center text-sm font-medium text-primary hover:underline"
            >
              Ir para Estoque <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </CardHeader>
          <CardContent className="ml-[68px] sm:ml-[72px]">
            <p className="text-muted-foreground mb-3">
              Para começar a locar, o sistema precisa conhecer seus produtos. Recomendamos fazer um
              balanço geral físico antes.
            </p>
            <ul className="list-decimal pl-5 space-y-1 text-sm text-muted-foreground">
              <li>
                Acesse a aba <strong>Estoque</strong> no menu lateral.
              </li>
              <li>Clique no botão "Novo Modelo".</li>
              <li>
                Preencha o Nome, a Referência Exata (SKU do seu controle interno), e a quantidade
                real disponível.
              </li>
              <li>
                Repita o processo até que todos os itens disponíveis na loja estejam listados.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 shadow-sm hover:shadow transition-shadow">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <div className="bg-emerald-500/10 p-3 rounded-full shrink-0">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl">2. Configuração de Acesso da Equipe</CardTitle>
              <CardDescription>Crie contas para os atendentes da loja</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="ml-[68px] sm:ml-[72px]">
            <p className="text-muted-foreground mb-3">
              Mantenha o controle delegando acessos individuais, evitando o uso de senhas
              compartilhadas.
            </p>
            <ul className="list-decimal pl-5 space-y-1 text-sm text-muted-foreground">
              <li>
                Vá em <strong>Configurações {'>'} Aba Equipe</strong>.
              </li>
              <li>Clique em "Novo Usuário" e preencha os dados do funcionário.</li>
              <li>
                Atribua o papel de <strong>Operador</strong> para uso no balcão, ou{' '}
                <strong>Administrador</strong> para gerentes.
              </li>
              <li>Se um funcionário sair da empresa, basta clicar em "Desativar Acesso".</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 shadow-sm hover:shadow transition-shadow">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <div className="bg-amber-500/10 p-3 rounded-full shrink-0">
              <FileText className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl">3. Personalização do Contrato</CardTitle>
              <CardDescription>Incorpore seus termos jurídicos no sistema</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="ml-[68px] sm:ml-[72px]">
            <p className="text-muted-foreground mb-3">
              O sistema possui um contrato genérico, mas é fundamental utilizar o documento revisado
              pelo seu advogado.
            </p>
            <ul className="list-decimal pl-5 space-y-1 text-sm text-muted-foreground">
              <li>
                Acesse <strong>Configurações {'>'} Aba Contratos</strong>.
              </li>
              <li>Faça o upload do seu modelo em formato PDF ou DOCX.</li>
              <li>
                Sempre que uma nova locação for gerada, o sistema apresentará este arquivo
                preenchido com os dados do cliente e dos equipamentos para assinatura digital ou
                impressão.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 shadow-sm hover:shadow transition-shadow">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <div className="bg-purple-500/10 p-3 rounded-full shrink-0">
              <Smartphone className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl">4. Instalação nos Celulares (Mobile PWA)</CardTitle>
              <CardDescription>Facilite a rotina no pátio e estoque</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="ml-[68px] sm:ml-[72px]">
            <p className="text-muted-foreground mb-3">
              Transforme este sistema em um aplicativo nos smartphones corporativos sem precisar
              baixar de lojas de app.
            </p>
            <ul className="list-decimal pl-5 space-y-1 text-sm text-muted-foreground">
              <li>
                No celular, abra o navegador Safari (iOS) ou Chrome (Android) e acesse a URL do
                sistema.
              </li>
              <li>
                Toque no botão de <strong>Compartilhar</strong> (iOS) ou nos{' '}
                <strong>Três Pontinhos</strong> (Android).
              </li>
              <li>
                Selecione a opção <strong>"Adicionar à Tela de Início"</strong>.
              </li>
              <li>
                O ícone do sistema aparecerá no celular, funcionando em tela cheia para consultas e
                baixas de estoque dinâmicas.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
