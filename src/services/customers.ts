import { supabase } from '@/lib/supabase/client'
import { Address } from '@/stores/main'

export interface CustomerDocument {
  name: string
  url: string
  date: string
  path: string
}

export interface Customer {
  id: string
  matricula: string
  name: string
  document: string
  phoneRes?: string
  phoneCell?: string
  phoneCom?: string
  phone?: string
  email?: string
  address?: Address
  hasDifferentDeliveryAddress?: boolean
  deliveryAddress?: Address
  observations?: string
  documento_url?: CustomerDocument[]
}

const mapFromDb = (row: any): Customer => ({
  id: row.id,
  matricula: row.matricula,
  name: row.name,
  document: row.document,
  phoneRes: row.phone_res,
  phoneCell: row.phone_cell,
  phoneCom: row.phone_com,
  phone: row.phone_cell || row.phone_res || row.phone_com,
  email: row.email,
  address: row.address,
  hasDifferentDeliveryAddress: row.has_different_delivery_address,
  deliveryAddress: row.delivery_address,
  observations: row.observations,
  documento_url: row.documento_url || [],
})

const mapToDb = (customer: Partial<Customer>) => {
  const db: any = {}
  if (customer.matricula !== undefined) db.matricula = customer.matricula
  if (customer.name !== undefined) db.name = customer.name
  if (customer.document !== undefined) db.document = customer.document
  if (customer.phoneRes !== undefined) db.phone_res = customer.phoneRes
  if (customer.phoneCell !== undefined) db.phone_cell = customer.phoneCell
  if (customer.phoneCom !== undefined) db.phone_com = customer.phoneCom
  if (customer.email !== undefined) db.email = customer.email
  if (customer.address !== undefined) db.address = customer.address
  if (customer.hasDifferentDeliveryAddress !== undefined)
    db.has_different_delivery_address = customer.hasDifferentDeliveryAddress
  if (customer.deliveryAddress !== undefined) db.delivery_address = customer.deliveryAddress
  if (customer.observations !== undefined) db.observations = customer.observations
  if (customer.documento_url !== undefined) db.documento_url = customer.documento_url
  return db
}

export const customerService = {
  async checkDocumentExists(document: string, excludeId?: string) {
    const cleanDoc = document.replace(/\D/g, '')
    if (!cleanDoc) return false

    let query = supabase.from('customers').select('id, document')
    if (excludeId) {
      query = query.neq('id', excludeId)
    }
    const { data, error } = await query
    if (error) return false

    return data.some((c) => c.document && c.document.replace(/\D/g, '') === cleanDoc)
  },

  async getCustomers() {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: true })
    if (error) throw error
    return data.map(mapFromDb)
  },

  async createCustomer(customer: Omit<Customer, 'id'>) {
    const dbPayload = mapToDb(customer)
    if (!dbPayload.matricula) {
      dbPayload.matricula = 'AUTO'
    }
    const { data, error } = await supabase.from('customers').insert(dbPayload).select().single()
    if (error) throw error
    return mapFromDb(data)
  },

  async updateCustomer(id: string, customer: Partial<Customer>) {
    const { data, error } = await supabase
      .from('customers')
      .update(mapToDb(customer))
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return mapFromDb(data)
  },

  async deleteCustomer(id: string) {
    const { error } = await supabase.from('customers').delete().eq('id', id)
    if (error) throw error
  },

  async getNextMatricula() {
    const { data, error } = await supabase
      .from('customers')
      .select('matricula')
      .order('matricula', { ascending: false })
      .limit(1)
    if (error) throw error
    if (data && data.length > 0 && data[0].matricula) {
      const lastMatricula = parseInt(data[0].matricula, 10)
      if (!isNaN(lastMatricula)) {
        return String(lastMatricula + 1).padStart(4, '0')
      }
    }
    return '0001'
  },

  async uploadDocument(customerId: string, file: File): Promise<CustomerDocument> {
    const fileExt = file.name.split('.').pop() || ''
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
    const filePath = `${customerId}/${fileName}`

    const { error } = await supabase.storage.from('clientes').upload(filePath, file)

    if (error) throw error

    const { data: publicUrlData } = supabase.storage.from('clientes').getPublicUrl(filePath)

    return {
      name: file.name,
      url: publicUrlData.publicUrl,
      date: new Date().toISOString(),
      path: filePath,
    }
  },
}
