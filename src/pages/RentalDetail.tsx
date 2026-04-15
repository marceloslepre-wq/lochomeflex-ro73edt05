import { useParams, useNavigate } from 'react-router-dom'
import useMainStore from '@/stores/main'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Save,
  Edit2,
  Printer,
  MessageCircle,
  Mail,
  Link as LinkIcon,
} from 'lucide-react'
import { useState, useMemo } from 'react'
import { useToast } from '@/hooks/use-toast'
import { usePermissions } from '@/hooks/use-permissions'
import logoImg from '@/assets/logo_hospital_home_final-f2434.jpg'

export default function RentalDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { rentals, customers, inventory, settings, updateRental } = useMainStore()
  const { toast } = useToast()
  const { can } = usePermissions()
  const [isEditing, setIsEditing] = useState(false)

  const rental = rentals.find((r) => r.id === id)
  const customer = customers.find((c) => c?.id === rental?.customerId)

  const defaultContractText = useMemo(() => {
    if (!rental || !customer) return ''

    let text = `TERMOS E CONDIÇÕES DE LOCAÇÃO,\nGUARDA E USO DE EQUIPAMENTO HOSPITALAR\n\n`
    text += `Constitui objeto do presente termo de condições de locação, uso e guarda de equipamento hospitalar de propriedade de HOSPITAL HOME COMERCIO ATACADISTA DE PRODUTOS HOSPITALARES EM GERAL.\n\n`

    const cAddr = (customer.address as any) || {}
    const cAddressStr = cAddr.street
      ? `${cAddr.street}, ${cAddr.number || 'S/N'}${cAddr.complement ? ' - ' + cAddr.complement : ''}`
      : 'Não informado'
    const cNeighborhood = cAddr.neighborhood || 'Não informado'
    const cCity = cAddr.city ? `${cAddr.city}/${cAddr.state || ''}` : 'Não informado'
    const cZip = cAddr.zipCode || 'Não informado'

    text += `LOCATÁRIA: ${customer.name}\n`
    text += `Endereço: ${cAddressStr}    Bairro: ${cNeighborhood}    Cidade: ${cCity}    CEP: ${cZip}\n`
    text += `RG: ${customer.rg || 'Não informado'}    CPF: ${customer.document}\n`
    text += `Telefones: ${[customer.phone_cell, customer.phone_res, customer.phone_com].filter(Boolean).join(' / ')}\n\n`

    const lessorAddress =
      settings.companyAddress || 'rua Manoel Vivacqua, n. 616, Jabuor, Vitória – ES'
    const lessorZip = '29072-045'
    text += `LOCADOR: ${settings.companyName || 'Lojas Hospital Home'}, localizada na ${lessorAddress}. CEP: ${lessorZip}. CNPJ n. ${settings.companyDocument || '10.893.738/0006-93'}.\n\n`

    text += `CONTRATO Nº: ${rental.contractNumber || rental.id}\n\n`
    text += `1. Pelo presente instrumento o locador aluga à locatária o(s) equipamento(s) abaixo discriminado(s), e se obriga a locá-lo(s) nas condições estabelecidas neste contrato:\n\n`

    rental.items.forEach((ri) => {
      const item = inventory.find((i) => i.id === ri.itemId)
      text += `   • ${ri.qty}x - ${item?.name} (SKU/Ref: ${item?.code || '-'})\n`
    })

    const pickupLoc = settings.locations?.find((l: any) => l.id === rental.pickupLocationId)
    const pAddress = pickupLoc?.address || 'Não informado'
    const pZip = pickupLoc?.zipCode || 'Não informado'

    text += `\nLocal de Retirada/Entrega: ${rental.pickupLocationId === 'delivery' ? 'Entrega no Endereço do Cliente' : pickupLoc?.name ? `${pickupLoc.name} - Endereço: ${pAddress} - CEP: ${pZip}` : 'Não informado'}\n\n`

    text += `2. PREÇO E PRAZO DE LOCAÇÃO:\n`
    text += `2.1 O locador compromete a manter no endereço informado no momento da locação responsável para receber o equipamento locado, esse deverá assinar o recibo de entrega no momento da entrega pela transportadora ou em loja física se for o caso.\n\n`
    text += `2.2 Após o cancelamento da locação ou termino da vigência do contrato a locatária deverá entrar em contato com o locador para agendar a retirada do equipamento e disponibilizá-lo para retirada pela transportadora, a mesma tem um prazo de até 03 (três) dias uteis para efetuar a retirada, caso a transportadora não consiga recolher o equipamento na data agendada, o locatário deverá arcar com as despesas da remarcação assim como pagamento do aluguel em pro-rata, pelo período adicional que ficou de posse do equipamento.\n\n`
    text += `2.3 No primeiro dia após o termino do prazo do contrato de locação a locatária deverá entrar em sua conta no site do locador e solicitar renovação ou cancelamento com recolhimento do(s) produto(s) ora locado(s), ou se preferir entrar em contato nos Telefones: 27-3026-330 ou 27-99904-6961 ou Email: aluguel@hospitalhome.com.br, para efetuar a renovação do aluguel e pagamento do mês seguinte dentro da vigência do contrato.\n\n`

    text += `3. CONDIÇÕES DE ENTREGA, USO E MANUTENÇÃO\n`
    text += `3.1 A devolução do equipamento se dará da forma escolhida no momento da locação se foi por transportadora será por transportadora se foi por retirada em loja será por devolução na mesma loja que foi retirada.\n`
    text += `3.2 A manutenção do(s) equipamento(s), objeto(s) do presente contrato é de total responsabilidade do locador; a Locatária cabe manter o(s) equipamento(s) em perfeitas condições de uso e avisar imediatamente à LOCADOR sobre eventuais problemas que impeçam o seu adequado funcionamento; para que esta tome as providências cabíveis, a danificação do equipamento pela Locatária, implicará a compra do produto e seu pagamento ao Locador.\n`
    text += `3.3 Em caso do equipamento locado for “cama hospitalar”, sendo o endereço de entrega PRÉDIO, a entrega de cama hospitalar é realizada até a portaria principal do prédio, sendo de total responsabilidade do locatário e transporte até seu apartamento.\n`
    text += `3.4 A transportadora não realiza a montagem do equipamento, este é feito pelo Locatário.\n`
    text += `3.5 O locatário assinará uma nota promissória no valor de venda do equipamento ora locado a título de em caso de perda ou dano ao equipamento causando sua inoperabilidade para futuras locação o locador seja restituído desse valor.\n\n`

    text += `4. DISPOSIÇÕES GERAIS:\n`
    text += `4.1 O locatário se compromete a, no tempo e na forma acordada entre as partes, realizar a entrega do bem locado em perfeito estado de conservação aos prepostos da contratada, sob pena de ser responsabilizado por perdas e danos.\n`
    text += `4.2 Em caso de mora na devolução do equipamento sem prévio acordo de renovação contratual e, em caso de inadimplemento do valor correspondente ao aluguel, fica o locatário ciente de que incidirá multa diária de R$ 100,00 (cem reais) até o limite do valor do equipamento, sem prejuízo da obrigação de arcar com os alugueis proporcionais ao tempo em que permanecer na posse do mesmo, sobre os quais incidirão juros de 1% (um por cento ao mês), correção monetária e multa de 2% (dois por cento) do valor devido.\n`
    text += `4.3 Em caso de inadimplemento de quaisquer obrigações acima, fica o locatário ciente de que o locador poderá negativa-lo junto aos órgãos de proteção ao crédito e levar o título a protesto, sem prejuízo do direito de ação, ficando a cargo do locatário o pagamento de custas judiciais e honorários advocatícios em 20% (vinte por cento).\n`
    text += `4.4 Não é fornecido Nota Fiscal para locação de bens móveis, fornecemos recibo conforme o Artigo 1 da Lei 8846 de 1994.\n`
    text += `4.5 Na devolução antes do prazo previsto, não haverá ressarcimento de valores.\n`
    text += `4.6 Após 07 de inadimplência em caso de relocação, o contrato será reincidido automaticamente, devendo ao locatário fazer a devolução do equipamento ora locado imediatamente, caso não ocorra poderá o locador tomar as providencias prevista na cláusula 4.3 do presente contrato.\n`
    text += `4.7 Os equipamentos locados são de relocações continua, então podem conter sinais de uso como arranhões, manchas, desgastes de peças.\n`
    text += `4.8 Todos equipamentos assim que retornam da locação passam por manutenção preventiva e higienização, antes de serem relocados.\n`
    text += `4.9 Podem haver diferença na cor e nos modelos locados, mas todas as características informadas compõem todos produtos locados.\n`
    text += `4.10 Não garantimos marcar e modelos específicos, pois trabalhamos com várias marcas e modelos, as fotos dos produtos são ilustrativas de produto novo.\n\n`

    text += `5. As partes elegem o foro de Vitória/ES para resolução de eventuais disputas relacionadas a este termo.\n\n`

    text += `Vitória ES, ${new Date(rental.startDate).toLocaleDateString('pt-BR')}.\n\n\n`
    text += `____________________________________                                     ____________________________________\n`
    text += `             Locador                                                                         Locatário\n`

    return text
  }, [rental, customer, inventory, settings])

  const [contractText, setContractText] = useState(
    rental?.customContractText || defaultContractText,
  )

  const generateContractHtml = () => {
    if (!rental) return null
    if (rental.customContractHtml) {
      return rental.customContractHtml.replace(
        /Gerado ao salvar/g,
        rental.contractNumber || rental.id,
      )
    }
    if (settings.contractTemplateHtml) {
      let html = settings.contractTemplateHtml
      html = html.replace(/{{rentalId}}/g, rental.id)
      html = html.replace(/{{companyName}}/g, settings.companyName)
      html = html.replace(/{{companyDocument}}/g, settings.companyDocument)
      html = html.replace(/{{companyAddress}}/g, settings.companyAddress)
      html = html.replace(/{{customerName}}/g, customer?.name || '')
      html = html.replace(/{{customerDocument}}/g, customer?.document || '')
      html = html.replace(/{{customerPhone}}/g, customer?.phone || '')
      html = html.replace(/{{customerEmail}}/g, customer?.email || '')
      html = html.replace(/{{startDate}}/g, new Date(rental.startDate).toLocaleDateString('pt-BR'))
      html = html.replace(
        /{{expectedReturnDate}}/g,
        new Date(rental.expectedReturnDate).toLocaleDateString('pt-BR'),
      )
      html = html.replace(/{{totalValue}}/g, rental.total.toFixed(2))
      html = html.replace(
        /{{lateFeeInfo}}/g,
        settings.lateFeeType === 'daily'
          ? settings.lateFeeValue + '% ao dia'
          : 'R$ ' + settings.lateFeeValue + ' ao dia',
      )

      const itemsHtml = rental.items
        .map((ri) => {
          const item = inventory.find((i) => i.id === ri.itemId)
          return `<tr>
          <td style="border: 1px solid #000; padding: 8px; text-align: center;">${ri.qty}</td>
          <td style="border: 1px solid #000; padding: 8px;">${item?.name || 'Item Removido'}</td>
          <td style="border: 1px solid #000; padding: 8px;">${item?.code || '-'}</td>
        </tr>`
        })
        .join('')
      html = html.replace(/{{itemsList}}/g, itemsHtml)
      return html
    }
    return null
  }

  const finalHtml = useMemo(generateContractHtml, [rental, settings, customer, inventory])

  if (!rental) return <div className="p-6">Locação não encontrada no sistema.</div>

  const handleSave = () => {
    updateRental(rental.id, { customContractText: contractText })
    setIsEditing(false)
    toast({
      title: 'Contrato Atualizado',
      description: 'O texto do contrato foi salvo para esta locação.',
    })
  }

  const handleWhatsApp = () => {
    const text = `Acesse o contrato de locação: ${window.location.href}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  const handleEmail = () => {
    const text = `Acesse o contrato de locação: ${window.location.href}`
    window.open(
      `mailto:${customer?.email || ''}?subject=${encodeURIComponent('Contrato de Locação')}&body=${encodeURIComponent(text)}`,
      '_blank',
    )
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: 'Link copiado',
      description: 'O link do contrato foi copiado para a área de transferência.',
    })
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Locação {rental.id}</h1>
            <p className="text-muted-foreground mt-1">Cliente: {customer?.name}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Badge
            variant={
              rental.status === 'Ativo'
                ? 'default'
                : rental.status === 'Atrasado'
                  ? 'destructive'
                  : 'secondary'
            }
          >
            {rental.status}
          </Badge>
          {!isEditing ? (
            <>
              <Button variant="outline" size="sm" onClick={handleCopyLink}>
                <LinkIcon className="w-4 h-4 mr-2" /> Copiar Link
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                onClick={handleWhatsApp}
              >
                <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                onClick={handleEmail}
              >
                <Mail className="w-4 h-4 mr-2" /> E-mail
              </Button>
              <Button size="sm" onClick={() => window.print()}>
                <Printer className="w-4 h-4 mr-2" /> Imprimir
              </Button>
              {can('rentals:manage') && (
                <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit2 className="w-4 h-4 mr-2" /> Editar
                </Button>
              )}
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" /> Salvar
              </Button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="print:hidden">
          {finalHtml && (
            <div className="mb-4 p-4 bg-amber-50 text-amber-800 rounded-md text-sm">
              <strong>Aviso:</strong> Este contrato está usando um template de alta fidelidade
              configurado nas configurações. A edição de texto simples abaixo pode não refletir na
              impressão se o template estiver ativo.
            </div>
          )}
          <Textarea
            className="min-h-[500px] font-mono text-sm leading-relaxed whitespace-pre-wrap resize-y"
            value={contractText}
            onChange={(e) => setContractText(e.target.value)}
          />
        </div>
      ) : (
        <div
          className="print-contract-container w-full max-w-[210mm] mx-auto bg-white sm:shadow-lg sm:border rounded-sm text-black relative"
          style={{ padding: finalHtml ? '0' : '48px' }}
        >
          {finalHtml ? (
            <div dangerouslySetInnerHTML={{ __html: finalHtml }} />
          ) : (
            <>
              <div className="text-center border-b pb-6 mb-6">
                <img
                  src={logoImg}
                  className="h-20 mx-auto mb-4 object-contain"
                  alt="Logo Hospital Home"
                />
                <h1 className="text-2xl font-bold uppercase tracking-widest">
                  Contrato de Locação
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Contrato nº {rental.contractNumber || rental.id}
                </p>
              </div>

              <div className="font-serif text-[15px] leading-loose whitespace-pre-wrap">
                {rental.customContractText || defaultContractText}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
