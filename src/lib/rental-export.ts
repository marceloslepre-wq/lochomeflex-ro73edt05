import { getCachedLocations } from '@/hooks/use-locations'

interface AddressFields {
  street?: string
  rua?: string
  logradouro?: string
  number?: string
  numero?: string
  complement?: string
  complemento?: string
  neighborhood?: string
  bairro?: string
  city?: string
  cidade?: string
  state?: string
  estado?: string
  uf?: string
  zipCode?: string
  cep?: string
  [key: string]: unknown
}

export function formatAddress(address: unknown): string {
  if (!address) return '-'
  if (typeof address === 'string') return address
  const a = address as AddressFields
  const parts: string[] = []
  const street = a.street || a.rua || a.logradouro || ''
  const number = a.number || a.numero || ''
  const complement = a.complement || a.complemento || ''
  const neighborhood = a.neighborhood || a.bairro || ''
  const city = a.city || a.cidade || ''
  const state = a.state || a.estado || a.uf || ''
  const zip = a.zipCode || a.cep || ''

  let mainPart = ''
  if (street) mainPart += street
  if (number) mainPart += (mainPart ? ', ' : '') + number
  if (complement) mainPart += (mainPart ? ' - ' : '') + complement
  if (mainPart) parts.push(mainPart)
  if (neighborhood) parts.push(neighborhood)
  const cityState = [city, state].filter(Boolean).join(' - ')
  if (cityState) parts.push(cityState)
  if (zip) parts.push(`CEP: ${zip}`)
  return parts.length > 0 ? parts.join(', ') : '-'
}

export function formatPhoneExport(phone: string | null | undefined): string {
  if (!phone) return '-'
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 11) {
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7, 11)}`
  }
  if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 6)}-${cleaned.substring(6, 10)}`
  }
  return phone
}

export function formatDateExport(dateStr?: string | null): string {
  if (!dateStr) return '-'
  const parts = dateStr.split('T')[0].split('-')
  if (parts.length !== 3) return dateStr
  const [y, m, d] = parts
  return `${d}/${m}/${y}`
}

function getLocationName(rental: any, locations: any[]): string {
  const locId =
    rental.localRetiradaId ||
    rental.local_retirada_id ||
    rental.pickupLocationId ||
    rental.pickup_location_id
  if (!locId) return '-'
  const loc = locations.find((l) => l.id === locId)
  if (!loc) return '-'
  return loc.nome || loc.name || '-'
}

function getDeliveryAddress(customer: any): string {
  if (!customer) return '-'
  const hasDiff = customer.hasDifferentDeliveryAddress ?? customer.has_different_delivery_address
  if (hasDiff) {
    return formatAddress(customer.deliveryAddress || customer.delivery_address)
  }
  return formatAddress(customer.address)
}

function getItemValue(item: any): number {
  const val =
    item.price ||
    item.value ||
    item.valor ||
    item.dailyPrice ||
    item.monthlyPrice ||
    item.monthly_price ||
    0
  return typeof val === 'string' ? parseFloat(val) || 0 : val
}

function normalizeDate(dateStr?: string | null): string {
  if (!dateStr) return ''
  const parts = dateStr.split('T')[0].split('-')
  if (parts.length !== 3) return dateStr.split('T')[0] || ''
  const [y, m, d] = parts
  return `${y}-${m}-${d}`
}

function normalizeCurrency(value: number | string | undefined | null): string {
  const num = typeof value === 'string' ? parseFloat(value) || 0 : (value ?? 0)
  return num.toFixed(2)
}

export function buildDetailedRentalExport(
  rentals: any[],
  customers: any[],
  inventory: any[],
  settingsLocations: any[],
): { headers: string[]; data: any[][] } {
  const cachedLocs = getCachedLocations() || []
  const allLocations = [...cachedLocs, ...(settingsLocations || [])]

  const headers = [
    'contrato_numero',
    'cliente_nome',
    'cliente_documento',
    'cliente_telefone',
    'cliente_endereco',
    'endereco_entrega',
    'local_retirada',
    'produto_nome',
    'produto_codigo',
    'quantidade',
    'valor_unitario',
    'data_inicio',
    'data_devolucao_prevista',
    'status',
  ]

  const data: any[][] = []

  rentals.forEach((r) => {
    const customer = customers.find((c) => c.id === r.customerId)
    const contractNumber =
      r.contractNumber || r.contract_number || r.id.substring(0, 8).toUpperCase()
    const status = r.status || 'Ativo'
    const customerName = customer?.name || ''
    const document = customer?.document || ''
    const phone =
      customer?.phone_cell ||
      customer?.phoneCell ||
      customer?.phone_res ||
      customer?.phoneRes ||
      customer?.phone_com ||
      customer?.phoneCom ||
      ''
    const fullAddress = formatAddress(customer?.address)
    const deliveryAddr = getDeliveryAddress(customer)
    const locationName = getLocationName(r, allLocations)
    const expectedReturnDate = r.expectedReturnDate || r.expected_return_date
    const items = Array.isArray(r.items) ? r.items : []

    if (items.length === 0) {
      data.push([
        contractNumber,
        customerName,
        document,
        phone,
        fullAddress,
        deliveryAddr,
        locationName,
        '',
        '',
        '',
        '',
        normalizeDate(r.startDate),
        normalizeDate(expectedReturnDate),
        status,
      ])
    } else {
      items.forEach((item: any) => {
        const itemId = item.itemId || item.id || item.inventory_id
        const invItem = inventory.find((i) => i.id === itemId)
        const productName = item.name || item.itemName || item.productName || invItem?.name || ''
        const itemQty = item.qty || item.quantity || item.quantidade || 1
        const productCode =
          item.code || item.itemCode || item.reference || item.referencia || invItem?.code || ''
        const itemValue = getItemValue(item)

        data.push([
          contractNumber,
          customerName,
          document,
          phone,
          fullAddress,
          deliveryAddr,
          locationName,
          productName,
          productCode,
          String(itemQty),
          normalizeCurrency(itemValue),
          normalizeDate(r.startDate),
          normalizeDate(expectedReturnDate),
          status,
        ])
      })
    }
  })

  return { headers, data }
}
