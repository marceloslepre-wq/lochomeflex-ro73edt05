import { useParams, useNavigate } from 'react-router-dom'
import useMainStore from '@/stores/main'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Save, Edit2, Printer, Link as LinkIcon } from 'lucide-react'
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
  const [docType, setDocType] = useState<'contract' | 'delivery' | 'return'>('contract')

  const rental = rentals.find((r) => r.id === id)
  const customer = customers.find((c) => c?.id === rental?.customerId)

  const defaultContractText = useMemo(() => {
    if (!rental || !customer) return ''

    let text = `TERMOS E CONDIÇÕES DE LOCAÇÃO, GUARDA E USO DE EQUIPAMENTO HOSPITALAR\n\n`
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
    text += `RG: ${(customer as any).rg || 'Não informado'}    CPF/CNPJ: ${customer.document}\n`
    text += `Telefones: ${[customer.phone_cell, customer.phone_res, customer.phone_com].filter(Boolean).join(' / ')}\n\n`

    const lessorAddress =
      settings.companyAddress || 'rua Manoel Vivacqua, n. 616, Jabuor, Vitória – ES'
    const lessorZip = '29072-045'
    text += `LOCADOR: ${settings.companyName || 'Lojas Hospital Home'}, localizada na ${lessorAddress}. CEP: ${lessorZip}. CNPJ n. ${settings.companyDocument || '10.893.738/0006-93'}.\n\n`

    text += `1. Pelo presente instrumento o locador aluga à locatária o(s) equipamento(s) abaixo discriminado(s), e se obriga a locá-lo(s) nas condições estabelecidas neste contrato:\n\n`

    rental.items.forEach((ri) => {
      const item = inventory.find((i) => i.id === ri.itemId)
      text += `   • ${ri.qty}x - ${item?.name} (SKU: ${item?.code || '-'}) (Retirada: ${new Date(rental.startDate).toLocaleDateString('pt-BR')} | Devolução: ${new Date(rental.expectedReturnDate).toLocaleDateString('pt-BR')})\n`
    })

    const pickupLoc = settings.locations?.find((l: any) => l.id === rental.pickupLocationId)
    let pAddress = pickupLoc?.address || ''

    pAddress = pAddress
      .replace(/ - CEP: Sem CEP/gi, '')
      .replace(/CEP: Sem CEP/gi, '')
      .trim()

    const pickupText =
      rental.pickupLocationId === 'delivery'
        ? 'Entrega no Endereço do Cliente'
        : pickupLoc?.name
          ? `${pickupLoc.name}${pAddress ? `, Endereço: ${pAddress}` : ''}`
          : 'Não informado'

    text += `\nLocal de Retirada/Entrega: ${pickupText}\n\n`

    text += `2. PREÇO E PRAZO DE LOCAÇÃO:\n`
    text += `2.1 O locador compromete a manter no endereço informado no momento da locação responsável para receber o equipamento locado, esse deverá assinar o recibo de entrega no momento da entrega pela transportadora ou em loja física se for o caso.\n\n`
    text += `2.2 Após o cancelamento da locação ou termino da vigência do contrato a locatária deverá entrar em contato com o locador para agendar a retirada do equipamento e disponibilizá-lo para retirada pela transportadora, a mesma tem um prazo de até 03 (três) dias uteis para efetuar a retirada, caso a transportadora não consiga recolher o equipamento na data agendada, o locatário deverá arcar com as despesas da remarcação assim como pagamento do aluguel em pro-rata, pelo período adicional que ficou de posse do equipamento.\n\n`
    text += `2.3 No primeiro dia após o termino do prazo do contrato de locação a locatária deverá entrar em sua conta no site do locador e solicitar renovação ou cancelamento com recolhimento do(s) produto(s) ora locado(s), ou se preferir entrar em contato nos números: 27-3026-330 / 99904-6961 ou pelo e-mail: aluguel@hospitalhome.com.br, para efetuar a renovação do aluguel e pagamento do mês seguinte dentro da vigência do contrato.\n\n`

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
      html = html.replace(/{{rentalId}}/g, rental.contractNumber || rental.id)
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

  const getReturnReceipt = () => {
    return `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #000; padding: 20px;">
        <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px;">
          ${settings.logoUrl ? `<img src="${settings.logoUrl}" style="max-height: 80px; margin-bottom: 10px;" />` : ''}
          <h1 style="font-size: 24px; margin: 0; text-transform: uppercase;">Recibo de Devolução</h1>
          <p style="margin: 5px 0 0;">Contrato Nº: ${rental?.contractNumber || rental?.id}</p>
        </div>

        <div style="margin-bottom: 20px;">
          <p><strong>LOCADOR:</strong> ${settings.companyName || 'Lojas Hospital Home'}</p>
          <p><strong>LOCATÁRIO:</strong> ${customer?.name}</p>
          <p><strong>CPF/CNPJ:</strong> ${customer?.document}</p>
          <p><strong>Data de Devolução:</strong> ${rental?.actualReturnDate ? new Date(rental.actualReturnDate).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR')}</p>
        </div>

        <p>Declaramos para os devidos fins que recebemos em devolução os equipamentos abaixo descritos, referentes ao contrato supracitado:</p>

        <table style="width: 100%; border-collapse: collapse; margin-top: 20px; margin-bottom: 40px;">
          <thead>
            <tr>
              <th style="border: 1px solid #000; padding: 8px; text-align: center;">Qtd</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: left;">Descrição</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: left;">SKU/Cód</th>
            </tr>
          </thead>
          <tbody>
            ${rental?.items
              .map((ri) => {
                const item = inventory.find((i) => i.id === ri.itemId)
                return `
                <tr>
                  <td style="border: 1px solid #000; padding: 8px; text-align: center;">${ri.qty}</td>
                  <td style="border: 1px solid #000; padding: 8px;">${item?.name || 'Item'}</td>
                  <td style="border: 1px solid #000; padding: 8px;">${item?.code || '-'}</td>
                </tr>
              `
              })
              .join('')}
          </tbody>
        </table>

        <p>O(s) equipamento(s) foi(ram) devolvido(s) e passará(ão) por vistoria técnica.</p>

        <div style="margin-top: 60px; text-align: center;">
          <div style="border-top: 1px solid #000; width: 300px; margin: 0 auto; padding-top: 5px;">
            Assinatura do Recebedor<br/>
            ${settings.companyName}
          </div>
        </div>
      </div>
    `
  }

  const getDeliveryReceipt = () => {
    return `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #000; padding: 20px;">
        <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px;">
          ${settings.logoUrl ? `<img src="${settings.logoUrl}" style="max-height: 80px; margin-bottom: 10px;" />` : ''}
          <h1 style="font-size: 24px; margin: 0; text-transform: uppercase;">Recibo de Entrega / Locação</h1>
          <p style="margin: 5px 0 0;">Contrato Nº: ${rental?.contractNumber || rental?.id}</p>
        </div>

        <div style="margin-bottom: 20px;">
          <p><strong>LOCADOR:</strong> ${settings.companyName || 'Lojas Hospital Home'}</p>
          <p><strong>LOCATÁRIO:</strong> ${customer?.name}</p>
          <p><strong>CPF/CNPJ:</strong> ${customer?.document}</p>
          <p><strong>Data de Retirada:</strong> ${rental?.startDate ? new Date(rental.startDate).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR')}</p>
        </div>

        <p>Declaramos para os devidos fins que o locatário retirou/recebeu os equipamentos abaixo descritos, em perfeitas condições de uso:</p>

        <table style="width: 100%; border-collapse: collapse; margin-top: 20px; margin-bottom: 40px;">
          <thead>
            <tr>
              <th style="border: 1px solid #000; padding: 8px; text-align: center;">Qtd</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: left;">Descrição</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: left;">SKU/Cód</th>
            </tr>
          </thead>
          <tbody>
            ${rental?.items
              .map((ri) => {
                const item = inventory.find((i) => i.id === ri.itemId)
                return `
                <tr>
                  <td style="border: 1px solid #000; padding: 8px; text-align: center;">${ri.qty}</td>
                  <td style="border: 1px solid #000; padding: 8px;">${item?.name || 'Item'}</td>
                  <td style="border: 1px solid #000; padding: 8px;">${item?.code || '-'}</td>
                </tr>
              `
              })
              .join('')}
          </tbody>
        </table>

        <div style="margin-top: 60px; text-align: center;">
          <div style="border-top: 1px solid #000; width: 300px; margin: 0 auto; padding-top: 5px;">
            Assinatura do Locatário<br/>
            ${customer?.name}
          </div>
        </div>
      </div>
    `
  }

  if (!rental) return <div className="p-6">Locação não encontrada no sistema.</div>

  const handleSave = () => {
    updateRental(rental.id, { customContractText: contractText })
    setIsEditing(false)
    toast({
      title: 'Contrato Atualizado',
      description: 'O texto do contrato foi salvo para esta locação.',
    })
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
      <div className="flex gap-2 mb-4 print:hidden border-b pb-4 overflow-x-auto">
        <Button
          variant={docType === 'contract' ? 'default' : 'outline'}
          onClick={() => setDocType('contract')}
        >
          Contrato
        </Button>
        <Button
          variant={docType === 'delivery' ? 'default' : 'outline'}
          onClick={() => setDocType('delivery')}
        >
          Recibo Locação
        </Button>
        <Button
          variant={docType === 'return' ? 'default' : 'outline'}
          onClick={() => setDocType('return')}
        >
          Recibo Devolução
        </Button>
      </div>

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
              <Button size="sm" onClick={() => window.print()}>
                <Printer className="w-4 h-4 mr-2" /> Imprimir
              </Button>
              {can('rentals:manage') && docType === 'contract' && (
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

      {docType === 'contract' && isEditing ? (
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
          style={{ padding: finalHtml && docType === 'contract' ? '0' : '48px' }}
        >
          {docType === 'contract' && finalHtml ? (
            <div dangerouslySetInnerHTML={{ __html: finalHtml }} />
          ) : docType === 'contract' ? (
            <>
              <div className="text-center border-b pb-6 mb-6">
                {settings.logoUrl ? (
                  <img
                    src={settings.logoUrl}
                    className="max-h-20 mx-auto mb-4 object-contain"
                    alt="Logo"
                  />
                ) : (
                  <img
                    src={logoImg}
                    className="h-20 mx-auto mb-4 object-contain"
                    alt="Logo Hospital Home"
                  />
                )}
                <h1 className="text-xl font-bold uppercase mt-4">
                  Contrato Nº: {rental.contractNumber || rental.id}
                </h1>
              </div>

              <div className="font-serif text-[15px] leading-loose whitespace-pre-wrap">
                {(rental.customContractText || defaultContractText)
                  .replace(/CONTRATO Nº:.*?\n\n/g, '')
                  .replace(/ - CEP: Sem CEP/gi, '')
                  .replace(/CEP: Sem CEP/gi, '')}
              </div>
            </>
          ) : docType === 'return' ? (
            <div dangerouslySetInnerHTML={{ __html: getReturnReceipt() }} />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: getDeliveryReceipt() }} />
          )}
        </div>
      )}
    </div>
  )
}
