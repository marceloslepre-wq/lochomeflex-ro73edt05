// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.5'
  }
  public: {
    Tables: {
      auditoria_contratos: {
        Row: {
          acao: string
          campos_antigos: Json | null
          campos_novos: Json | null
          created_at: string
          id: string
          ip_usuario: string | null
          rental_id: string | null
          usuario_id: string | null
        }
        Insert: {
          acao: string
          campos_antigos?: Json | null
          campos_novos?: Json | null
          created_at?: string
          id?: string
          ip_usuario?: string | null
          rental_id?: string | null
          usuario_id?: string | null
        }
        Update: {
          acao?: string
          campos_antigos?: Json | null
          campos_novos?: Json | null
          created_at?: string
          id?: string
          ip_usuario?: string | null
          rental_id?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'auditoria_contratos_rental_id_fkey'
            columns: ['rental_id']
            isOneToOne: false
            referencedRelation: 'rentals'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'auditoria_contratos_usuario_id_fkey'
            columns: ['usuario_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      customers: {
        Row: {
          address: Json | null
          attachment: string | null
          created_at: string
          delivery_address: Json | null
          document: string
          documento_url: Json | null
          email: string | null
          has_different_delivery_address: boolean | null
          id: string
          matricula: string
          name: string
          observations: string | null
          phone_cell: string | null
          phone_com: string | null
          phone_res: string | null
          updated_at: string
        }
        Insert: {
          address?: Json | null
          attachment?: string | null
          created_at?: string
          delivery_address?: Json | null
          document: string
          documento_url?: Json | null
          email?: string | null
          has_different_delivery_address?: boolean | null
          id?: string
          matricula: string
          name: string
          observations?: string | null
          phone_cell?: string | null
          phone_com?: string | null
          phone_res?: string | null
          updated_at?: string
        }
        Update: {
          address?: Json | null
          attachment?: string | null
          created_at?: string
          delivery_address?: Json | null
          document?: string
          documento_url?: Json | null
          email?: string | null
          has_different_delivery_address?: boolean | null
          id?: string
          matricula?: string
          name?: string
          observations?: string | null
          phone_cell?: string | null
          phone_com?: string | null
          phone_res?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      exchange_history: {
        Row: {
          available_credit: number
          created_at: string
          days_remaining: number
          days_used: number
          difference_to_pay: number
          exchange_date: string
          extra_days: number
          id: string
          new_cost: number
          new_inventory_id: string | null
          old_inventory_id: string | null
          rental_id: string | null
        }
        Insert: {
          available_credit: number
          created_at?: string
          days_remaining: number
          days_used: number
          difference_to_pay: number
          exchange_date?: string
          extra_days: number
          id?: string
          new_cost: number
          new_inventory_id?: string | null
          old_inventory_id?: string | null
          rental_id?: string | null
        }
        Update: {
          available_credit?: number
          created_at?: string
          days_remaining?: number
          days_used?: number
          difference_to_pay?: number
          exchange_date?: string
          extra_days?: number
          id?: string
          new_cost?: number
          new_inventory_id?: string | null
          old_inventory_id?: string | null
          rental_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'exchange_history_new_inventory_id_fkey'
            columns: ['new_inventory_id']
            isOneToOne: false
            referencedRelation: 'inventory'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'exchange_history_old_inventory_id_fkey'
            columns: ['old_inventory_id']
            isOneToOne: false
            referencedRelation: 'inventory'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'exchange_history_rental_id_fkey'
            columns: ['rental_id']
            isOneToOne: false
            referencedRelation: 'rentals'
            referencedColumns: ['id']
          },
        ]
      }
      historico_trocas: {
        Row: {
          contrato_id: string
          created_at: string | null
          credito_disponivel: number | null
          custo_novo: number | null
          data_troca: string | null
          dias_extras: number | null
          dias_restantes: number | null
          dias_usados: number | null
          diferenca_pagar: number | null
          id: string
          produto_antigo_id: string
          produto_novo_id: string
          valor_diario_novo: number | null
          valor_diario_original: number | null
        }
        Insert: {
          contrato_id: string
          created_at?: string | null
          credito_disponivel?: number | null
          custo_novo?: number | null
          data_troca?: string | null
          dias_extras?: number | null
          dias_restantes?: number | null
          dias_usados?: number | null
          diferenca_pagar?: number | null
          id?: string
          produto_antigo_id: string
          produto_novo_id: string
          valor_diario_novo?: number | null
          valor_diario_original?: number | null
        }
        Update: {
          contrato_id?: string
          created_at?: string | null
          credito_disponivel?: number | null
          custo_novo?: number | null
          data_troca?: string | null
          dias_extras?: number | null
          dias_restantes?: number | null
          dias_usados?: number | null
          diferenca_pagar?: number | null
          id?: string
          produto_antigo_id?: string
          produto_novo_id?: string
          valor_diario_novo?: number | null
          valor_diario_original?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'historico_trocas_contrato_id_fkey'
            columns: ['contrato_id']
            isOneToOne: false
            referencedRelation: 'rentals'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'historico_trocas_produto_antigo_id_fkey'
            columns: ['produto_antigo_id']
            isOneToOne: false
            referencedRelation: 'inventory'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'historico_trocas_produto_novo_id_fkey'
            columns: ['produto_novo_id']
            isOneToOne: false
            referencedRelation: 'inventory'
            referencedColumns: ['id']
          },
        ]
      }
      inventory: {
        Row: {
          assets: Json | null
          available_qty: number
          category: string
          code: string
          condition_status: string
          created_at: string
          daily_price: number | null
          description: string | null
          id: string
          image: string | null
          monthly_price: number | null
          name: string
          rented_qty: number
          total_qty: number
        }
        Insert: {
          assets?: Json | null
          available_qty?: number
          category: string
          code: string
          condition_status?: string
          created_at?: string
          daily_price?: number | null
          description?: string | null
          id?: string
          image?: string | null
          monthly_price?: number | null
          name: string
          rented_qty?: number
          total_qty?: number
        }
        Update: {
          assets?: Json | null
          available_qty?: number
          category?: string
          code?: string
          condition_status?: string
          created_at?: string
          daily_price?: number | null
          description?: string | null
          id?: string
          image?: string | null
          monthly_price?: number | null
          name?: string
          rented_qty?: number
          total_qty?: number
        }
        Relationships: []
      }
      inventory_locations: {
        Row: {
          available_qty: number
          id: string
          inventory_id: string
          location_id: string
          quantity: number
          rented_qty: number
          updated_at: string
        }
        Insert: {
          available_qty?: number
          id?: string
          inventory_id: string
          location_id: string
          quantity?: number
          rented_qty?: number
          updated_at?: string
        }
        Update: {
          available_qty?: number
          id?: string
          inventory_id?: string
          location_id?: string
          quantity?: number
          rented_qty?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'inventory_locations_inventory_id_fkey'
            columns: ['inventory_id']
            isOneToOne: false
            referencedRelation: 'inventory'
            referencedColumns: ['id']
          },
        ]
      }
      inventory_transfers: {
        Row: {
          created_at: string
          destination_location_id: string
          id: string
          inventory_id: string
          origin_location_id: string
          quantity: number
          status: string
        }
        Insert: {
          created_at?: string
          destination_location_id: string
          id?: string
          inventory_id: string
          origin_location_id: string
          quantity: number
          status?: string
        }
        Update: {
          created_at?: string
          destination_location_id?: string
          id?: string
          inventory_id?: string
          origin_location_id?: string
          quantity?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: 'inventory_transfers_inventory_id_fkey'
            columns: ['inventory_id']
            isOneToOne: false
            referencedRelation: 'inventory'
            referencedColumns: ['id']
          },
        ]
      }
      patrimonio: {
        Row: {
          created_at: string
          data_aquisicao: string | null
          estado: string | null
          fornecedor: string | null
          foto_url: string | null
          id: string
          inventory_id: string
          localizacao: string | null
          numero_patrimonio: string
          observacoes: string | null
          updated_at: string
          valor_compra: number | null
        }
        Insert: {
          created_at?: string
          data_aquisicao?: string | null
          estado?: string | null
          fornecedor?: string | null
          foto_url?: string | null
          id?: string
          inventory_id: string
          localizacao?: string | null
          numero_patrimonio: string
          observacoes?: string | null
          updated_at?: string
          valor_compra?: number | null
        }
        Update: {
          created_at?: string
          data_aquisicao?: string | null
          estado?: string | null
          fornecedor?: string | null
          foto_url?: string | null
          id?: string
          inventory_id?: string
          localizacao?: string | null
          numero_patrimonio?: string
          observacoes?: string | null
          updated_at?: string
          valor_compra?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'patrimonio_inventory_id_fkey'
            columns: ['inventory_id']
            isOneToOne: false
            referencedRelation: 'inventory'
            referencedColumns: ['id']
          },
        ]
      }
      profiles: {
        Row: {
          active: boolean
          auth_user_id: string | null
          created_at: string
          email: string
          id: string
          name: string
          permissions: Json | null
          role: string
        }
        Insert: {
          active?: boolean
          auth_user_id?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          permissions?: Json | null
          role?: string
        }
        Update: {
          active?: boolean
          auth_user_id?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          permissions?: Json | null
          role?: string
        }
        Relationships: []
      }
      rentals: {
        Row: {
          actual_return_date: string | null
          contract_number: string | null
          created_at: string
          custom_contract_html: string | null
          custom_contract_text: string | null
          customer_id: string | null
          expected_return_date: string
          id: string
          items: Json
          payment_method: string
          pickup_location_id: string | null
          start_date: string
          status: string
          total: number
          user_id: string | null
        }
        Insert: {
          actual_return_date?: string | null
          contract_number?: string | null
          created_at?: string
          custom_contract_html?: string | null
          custom_contract_text?: string | null
          customer_id?: string | null
          expected_return_date: string
          id?: string
          items?: Json
          payment_method?: string
          pickup_location_id?: string | null
          start_date: string
          status?: string
          total?: number
          user_id?: string | null
        }
        Update: {
          actual_return_date?: string | null
          contract_number?: string | null
          created_at?: string
          custom_contract_html?: string | null
          custom_contract_text?: string | null
          customer_id?: string | null
          expected_return_date?: string
          id?: string
          items?: Json
          payment_method?: string
          pickup_location_id?: string | null
          start_date?: string
          status?: string
          total?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'rentals_customer_id_fkey'
            columns: ['customer_id']
            isOneToOne: false
            referencedRelation: 'customers'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'rentals_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      rentals_backup_dates: {
        Row: {
          actual_return_date: string | null
          contract_number: string | null
          created_at: string | null
          custom_contract_html: string | null
          custom_contract_text: string | null
          customer_id: string | null
          expected_return_date: string | null
          id: string | null
          items: Json | null
          payment_method: string | null
          pickup_location_id: string | null
          start_date: string | null
          status: string | null
          total: number | null
          user_id: string | null
        }
        Insert: {
          actual_return_date?: string | null
          contract_number?: string | null
          created_at?: string | null
          custom_contract_html?: string | null
          custom_contract_text?: string | null
          customer_id?: string | null
          expected_return_date?: string | null
          id?: string | null
          items?: Json | null
          payment_method?: string | null
          pickup_location_id?: string | null
          start_date?: string | null
          status?: string | null
          total?: number | null
          user_id?: string | null
        }
        Update: {
          actual_return_date?: string | null
          contract_number?: string | null
          created_at?: string | null
          custom_contract_html?: string | null
          custom_contract_text?: string | null
          customer_id?: string | null
          expected_return_date?: string | null
          id?: string | null
          items?: Json | null
          payment_method?: string | null
          pickup_location_id?: string | null
          start_date?: string | null
          status?: string | null
          total?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          categories: Json | null
          company_address: string | null
          company_document: string | null
          company_name: string | null
          contract_file_name: string | null
          contract_template_html: string | null
          created_at: string
          id: string
          late_fee_type: string | null
          late_fee_value: number | null
          locations: Json | null
          logo_url: string | null
          primary_color: string | null
          updated_at: string
        }
        Insert: {
          categories?: Json | null
          company_address?: string | null
          company_document?: string | null
          company_name?: string | null
          contract_file_name?: string | null
          contract_template_html?: string | null
          created_at?: string
          id?: string
          late_fee_type?: string | null
          late_fee_value?: number | null
          locations?: Json | null
          logo_url?: string | null
          primary_color?: string | null
          updated_at?: string
        }
        Update: {
          categories?: Json | null
          company_address?: string | null
          company_document?: string | null
          company_name?: string | null
          contract_file_name?: string | null
          contract_template_html?: string | null
          created_at?: string
          id?: string
          late_fee_type?: string | null
          late_fee_value?: number | null
          locations?: Json | null
          logo_url?: string | null
          primary_color?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      exchange_rental_item: {
        Args: {
          p_difference_to_pay: number
          p_exchange_history_data: Json
          p_new_expected_return_date: string
          p_new_inventory_id: string
          p_old_inventory_id: string
          p_quantity: number
          p_rental_id: string
        }
        Returns: undefined
      }
      public_add_asset: {
        Args: { p_asset: Json; p_item_id: string }
        Returns: undefined
      }
      transfer_inventory: {
        Args: {
          p_destination_location_id: string
          p_inventory_id: string
          p_origin_location_id: string
          p_quantity: number
        }
        Returns: undefined
      }
      transfer_inventory_batch: {
        Args: {
          p_destination_location_id: string
          p_items: Json
          p_origin_location_id: string
        }
        Returns: undefined
      }
      update_rental_secure:
        | {
            Args: {
              p_custom_text: string
              p_expected_return_date: string
              p_rental_id: string
              p_start_date: string
              p_user_id: string
            }
            Returns: undefined
          }
        | {
            Args: {
              p_custom_text: string
              p_expected_return_date: string
              p_justificativa?: string
              p_rental_id: string
              p_start_date: string
              p_user_id: string
            }
            Returns: undefined
          }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

// ====== DATABASE EXTENDED CONTEXT (auto-generated) ======
// This section contains actual PostgreSQL column types, constraints, RLS policies,
// functions, triggers, indexes and materialized views not present in the type definitions above.
// IMPORTANT: The TypeScript types above map UUID, TEXT, VARCHAR all to "string".
// Use the COLUMN TYPES section below to know the real PostgreSQL type for each column.
// Always use the correct PostgreSQL type when writing SQL migrations.

// --- COLUMN TYPES (actual PostgreSQL types) ---
// Use this to know the real database type when writing migrations.
// "string" in TypeScript types above may be uuid, text, varchar, timestamptz, etc.
// Table: auditoria_contratos
//   id: uuid (not null, default: gen_random_uuid())
//   rental_id: uuid (nullable)
//   usuario_id: uuid (nullable)
//   acao: text (not null)
//   campos_antigos: jsonb (nullable)
//   campos_novos: jsonb (nullable)
//   ip_usuario: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: customers
//   id: uuid (not null, default: gen_random_uuid())
//   matricula: text (not null)
//   name: text (not null)
//   document: text (not null)
//   phone_res: text (nullable)
//   phone_cell: text (nullable)
//   phone_com: text (nullable)
//   email: text (nullable)
//   address: jsonb (nullable)
//   has_different_delivery_address: boolean (nullable, default: false)
//   delivery_address: jsonb (nullable)
//   observations: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
//   attachment: text (nullable)
//   documento_url: jsonb (nullable, default: '[]'::jsonb)
// Table: exchange_history
//   id: uuid (not null, default: gen_random_uuid())
//   rental_id: uuid (nullable)
//   old_inventory_id: uuid (nullable)
//   new_inventory_id: uuid (nullable)
//   exchange_date: timestamp with time zone (not null, default: now())
//   days_used: integer (not null)
//   days_remaining: integer (not null)
//   available_credit: numeric (not null)
//   new_cost: numeric (not null)
//   difference_to_pay: numeric (not null)
//   extra_days: integer (not null)
//   created_at: timestamp with time zone (not null, default: now())
// Table: historico_trocas
//   id: uuid (not null, default: gen_random_uuid())
//   contrato_id: uuid (not null)
//   produto_antigo_id: uuid (not null)
//   produto_novo_id: uuid (not null)
//   data_troca: timestamp without time zone (nullable, default: now())
//   dias_usados: integer (nullable)
//   dias_restantes: integer (nullable)
//   credito_disponivel: numeric (nullable)
//   valor_diario_original: numeric (nullable)
//   valor_diario_novo: numeric (nullable)
//   custo_novo: numeric (nullable)
//   diferenca_pagar: numeric (nullable)
//   dias_extras: integer (nullable)
//   created_at: timestamp without time zone (nullable, default: now())
// Table: inventory
//   id: uuid (not null, default: gen_random_uuid())
//   code: text (not null)
//   name: text (not null)
//   category: text (not null)
//   description: text (nullable)
//   total_qty: integer (not null, default: 0)
//   available_qty: integer (not null, default: 0)
//   rented_qty: integer (not null, default: 0)
//   condition_status: text (not null, default: 'Disponível'::text)
//   image: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   monthly_price: numeric (nullable, default: 0)
//   daily_price: numeric (nullable, default: 0)
//   assets: jsonb (nullable, default: '[]'::jsonb)
// Table: inventory_locations
//   id: uuid (not null, default: gen_random_uuid())
//   inventory_id: uuid (not null)
//   location_id: text (not null)
//   quantity: integer (not null, default: 0)
//   rented_qty: integer (not null, default: 0)
//   available_qty: integer (not null, default: 0)
//   updated_at: timestamp with time zone (not null, default: now())
// Table: inventory_transfers
//   id: uuid (not null, default: gen_random_uuid())
//   inventory_id: uuid (not null)
//   origin_location_id: text (not null)
//   destination_location_id: text (not null)
//   quantity: integer (not null)
//   status: text (not null, default: 'completed'::text)
//   created_at: timestamp with time zone (not null, default: now())
// Table: patrimonio
//   id: uuid (not null, default: gen_random_uuid())
//   inventory_id: uuid (not null)
//   numero_patrimonio: text (not null)
//   data_aquisicao: date (nullable)
//   estado: text (nullable)
//   localizacao: text (nullable)
//   observacoes: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
//   fornecedor: text (nullable)
//   valor_compra: numeric (nullable, default: 0)
//   foto_url: text (nullable)
// Table: profiles
//   id: uuid (not null, default: gen_random_uuid())
//   auth_user_id: uuid (nullable)
//   name: text (not null)
//   email: text (not null)
//   role: text (not null, default: 'Operador'::text)
//   active: boolean (not null, default: true)
//   permissions: jsonb (nullable, default: '[]'::jsonb)
//   created_at: timestamp with time zone (not null, default: now())
// Table: rentals
//   id: uuid (not null, default: gen_random_uuid())
//   customer_id: uuid (nullable)
//   start_date: date (not null)
//   expected_return_date: date (not null)
//   actual_return_date: date (nullable)
//   status: text (not null, default: 'Ativo'::text)
//   total: numeric (not null, default: 0)
//   custom_contract_text: text (nullable)
//   custom_contract_html: text (nullable)
//   user_id: uuid (nullable)
//   pickup_location_id: text (nullable)
//   items: jsonb (not null, default: '[]'::jsonb)
//   created_at: timestamp with time zone (not null, default: now())
//   contract_number: text (nullable)
//   payment_method: character varying (not null, default: 'PIX'::character varying)
// Table: rentals_backup_dates
//   id: uuid (nullable)
//   customer_id: uuid (nullable)
//   start_date: date (nullable)
//   expected_return_date: date (nullable)
//   actual_return_date: date (nullable)
//   status: text (nullable)
//   total: numeric (nullable)
//   custom_contract_text: text (nullable)
//   custom_contract_html: text (nullable)
//   user_id: uuid (nullable)
//   pickup_location_id: text (nullable)
//   items: jsonb (nullable)
//   created_at: timestamp with time zone (nullable)
//   contract_number: text (nullable)
//   payment_method: character varying (nullable)
// Table: settings
//   id: uuid (not null, default: gen_random_uuid())
//   primary_color: text (nullable, default: '#1e40af'::text)
//   logo_url: text (nullable)
//   contract_file_name: text (nullable)
//   contract_template_html: text (nullable)
//   late_fee_type: text (nullable, default: 'daily'::text)
//   late_fee_value: numeric (nullable, default: 2)
//   company_name: text (nullable, default: 'LocaWeb Gestão de Ativos LTDA'::text)
//   company_document: text (nullable, default: '00.000.000/0001-00'::text)
//   company_address: text (nullable, default: 'Av. Central, 1000 - Centro, São Paulo/SP'::text)
//   categories: jsonb (nullable, default: '["Ferramentas", "Equipamentos Pesados", "Acessórios", "Geral"]'::jsonb)
//   locations: jsonb (nullable, default: '[]'::jsonb)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())

// --- CONSTRAINTS ---
// Table: auditoria_contratos
//   PRIMARY KEY auditoria_contratos_pkey: PRIMARY KEY (id)
//   FOREIGN KEY auditoria_contratos_rental_id_fkey: FOREIGN KEY (rental_id) REFERENCES rentals(id) ON DELETE CASCADE
//   FOREIGN KEY auditoria_contratos_usuario_id_fkey: FOREIGN KEY (usuario_id) REFERENCES profiles(id) ON DELETE SET NULL
// Table: customers
//   PRIMARY KEY customers_pkey: PRIMARY KEY (id)
// Table: exchange_history
//   FOREIGN KEY exchange_history_new_inventory_id_fkey: FOREIGN KEY (new_inventory_id) REFERENCES inventory(id) ON DELETE SET NULL
//   FOREIGN KEY exchange_history_old_inventory_id_fkey: FOREIGN KEY (old_inventory_id) REFERENCES inventory(id) ON DELETE SET NULL
//   PRIMARY KEY exchange_history_pkey: PRIMARY KEY (id)
//   FOREIGN KEY exchange_history_rental_id_fkey: FOREIGN KEY (rental_id) REFERENCES rentals(id) ON DELETE CASCADE
// Table: historico_trocas
//   FOREIGN KEY historico_trocas_contrato_id_fkey: FOREIGN KEY (contrato_id) REFERENCES rentals(id) ON DELETE CASCADE
//   PRIMARY KEY historico_trocas_pkey: PRIMARY KEY (id)
//   FOREIGN KEY historico_trocas_produto_antigo_id_fkey: FOREIGN KEY (produto_antigo_id) REFERENCES inventory(id) ON DELETE CASCADE
//   FOREIGN KEY historico_trocas_produto_novo_id_fkey: FOREIGN KEY (produto_novo_id) REFERENCES inventory(id) ON DELETE CASCADE
// Table: inventory
//   PRIMARY KEY inventory_pkey: PRIMARY KEY (id)
// Table: inventory_locations
//   FOREIGN KEY inventory_locations_inventory_id_fkey: FOREIGN KEY (inventory_id) REFERENCES inventory(id) ON DELETE CASCADE
//   UNIQUE inventory_locations_inventory_id_location_id_key: UNIQUE (inventory_id, location_id)
//   PRIMARY KEY inventory_locations_pkey: PRIMARY KEY (id)
// Table: inventory_transfers
//   FOREIGN KEY inventory_transfers_inventory_id_fkey: FOREIGN KEY (inventory_id) REFERENCES inventory(id) ON DELETE CASCADE
//   PRIMARY KEY inventory_transfers_pkey: PRIMARY KEY (id)
//   CHECK inventory_transfers_quantity_check: CHECK ((quantity > 0))
// Table: patrimonio
//   CHECK patrimonio_estado_check: CHECK ((estado = ANY (ARRAY['novo'::text, 'bom'::text, 'regular'::text, 'ruim'::text])))
//   FOREIGN KEY patrimonio_inventory_id_fkey: FOREIGN KEY (inventory_id) REFERENCES inventory(id) ON DELETE CASCADE
//   UNIQUE patrimonio_numero_patrimonio_key: UNIQUE (numero_patrimonio)
//   PRIMARY KEY patrimonio_pkey: PRIMARY KEY (id)
// Table: profiles
//   FOREIGN KEY profiles_auth_user_id_fkey: FOREIGN KEY (auth_user_id) REFERENCES auth.users(id) ON DELETE CASCADE
//   PRIMARY KEY profiles_pkey: PRIMARY KEY (id)
// Table: rentals
//   FOREIGN KEY rentals_customer_id_fkey: FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT
//   PRIMARY KEY rentals_pkey: PRIMARY KEY (id)
//   FOREIGN KEY rentals_user_id_fkey: FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE SET NULL
// Table: settings
//   PRIMARY KEY settings_pkey: PRIMARY KEY (id)

// --- ROW LEVEL SECURITY POLICIES ---
// Table: auditoria_contratos
//   Policy "authenticated_insert_auditoria" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "authenticated_select_auditoria" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
// Table: customers
//   Policy "anon_insert" (INSERT, PERMISSIVE) roles={anon}
//     WITH CHECK: true
//   Policy "anon_select" (SELECT, PERMISSIVE) roles={anon}
//     USING: true
//   Policy "authenticated_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "authenticated_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: exchange_history
//   Policy "anon_select_exchange" (SELECT, PERMISSIVE) roles={anon}
//     USING: true
//   Policy "authenticated_all_exchange" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: historico_trocas
//   Policy "authenticated_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: inventory
//   Policy "anon_insert" (INSERT, PERMISSIVE) roles={anon}
//     WITH CHECK: true
//   Policy "anon_select" (SELECT, PERMISSIVE) roles={anon}
//     USING: true
//   Policy "anon_update" (UPDATE, PERMISSIVE) roles={anon}
//     USING: true
//     WITH CHECK: true
//   Policy "authenticated_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: inventory_locations
//   Policy "anon_select" (SELECT, PERMISSIVE) roles={anon}
//     USING: true
//   Policy "authenticated_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: inventory_transfers
//   Policy "anon_select" (SELECT, PERMISSIVE) roles={public}
//     USING: true
//   Policy "authenticated_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: patrimonio
//   Policy "anon_insert" (INSERT, PERMISSIVE) roles={anon}
//     WITH CHECK: true
//   Policy "anon_select" (SELECT, PERMISSIVE) roles={anon}
//     USING: true
//   Policy "authenticated_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: profiles
//   Policy "authenticated_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: rentals
//   Policy "authenticated_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: settings
//   Policy "anon_select" (SELECT, PERMISSIVE) roles={anon}
//     USING: true
//   Policy "authenticated_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true

// --- DATABASE FUNCTIONS ---
// FUNCTION exchange_rental_item(uuid, uuid, uuid, integer, date, numeric, jsonb)
//   CREATE OR REPLACE FUNCTION public.exchange_rental_item(p_rental_id uuid, p_old_inventory_id uuid, p_new_inventory_id uuid, p_quantity integer, p_new_expected_return_date date, p_difference_to_pay numeric, p_exchange_history_data jsonb)
//    RETURNS void
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//     v_rental record;
//     v_items jsonb;
//     v_new_items jsonb;
//     v_item jsonb;
//     v_found boolean := false;
//     v_new_inventory record;
//     v_location_id text;
//   BEGIN
//     -- 1. Get Rental
//     SELECT * INTO v_rental FROM public.rentals WHERE id = p_rental_id FOR UPDATE;
//     IF NOT FOUND THEN RAISE EXCEPTION 'Locação não encontrada'; END IF;
//
//     v_location_id := v_rental.pickup_location_id;
//
//     -- 2. Update Inventory (Old)
//     UPDATE public.inventory
//     SET available_qty = available_qty + p_quantity,
//         rented_qty = GREATEST(0, rented_qty - p_quantity)
//     WHERE id = p_old_inventory_id;
//
//     IF v_location_id IS NOT NULL THEN
//       UPDATE public.inventory_locations
//       SET available_qty = available_qty + p_quantity,
//           rented_qty = GREATEST(0, rented_qty - p_quantity)
//       WHERE inventory_id = p_old_inventory_id AND location_id = v_location_id;
//     END IF;
//
//     -- 3. Update Inventory (New)
//     SELECT * INTO v_new_inventory FROM public.inventory WHERE id = p_new_inventory_id FOR UPDATE;
//     IF v_new_inventory.available_qty < p_quantity THEN
//       RAISE EXCEPTION 'Quantidade indisponível para o novo produto';
//     END IF;
//
//     UPDATE public.inventory
//     SET available_qty = GREATEST(0, available_qty - p_quantity),
//         rented_qty = rented_qty + p_quantity
//     WHERE id = p_new_inventory_id;
//
//     IF v_location_id IS NOT NULL THEN
//       UPDATE public.inventory_locations
//       SET available_qty = GREATEST(0, available_qty - p_quantity),
//           rented_qty = rented_qty + p_quantity
//       WHERE inventory_id = p_new_inventory_id AND location_id = v_location_id;
//     END IF;
//
//     -- 4. Update items JSON in rental
//     v_items := v_rental.items;
//     v_new_items := '[]'::jsonb;
//
//     FOR v_item IN SELECT * FROM jsonb_array_elements(v_items)
//     LOOP
//       IF ((v_item->>'inventoryId' IS NOT NULL AND (v_item->>'inventoryId')::uuid = p_old_inventory_id)
//           OR
//           (v_item->>'inventory_id' IS NOT NULL AND (v_item->>'inventory_id')::uuid = p_old_inventory_id)
//           OR
//           (v_item->>'id' IS NOT NULL AND (v_item->>'id')::uuid = p_old_inventory_id))
//          AND NOT v_found THEN
//
//         v_item := jsonb_build_object(
//           'inventoryId', p_new_inventory_id,
//           'inventory_id', p_new_inventory_id,
//           'id', p_new_inventory_id,
//           'name', v_new_inventory.name,
//           'quantity', p_quantity,
//           'dailyPrice', v_new_inventory.daily_price,
//           'monthlyPrice', v_new_inventory.monthly_price
//         );
//         v_found := true;
//       END IF;
//       v_new_items := v_new_items || v_item;
//     END LOOP;
//
//     IF NOT v_found THEN RAISE EXCEPTION 'Produto antigo não encontrado na locação'; END IF;
//
//     -- 5. Update Rental
//     UPDATE public.rentals
//     SET items = v_new_items,
//         expected_return_date = p_new_expected_return_date,
//         total = total + p_difference_to_pay
//     WHERE id = p_rental_id;
//
//     -- 6. Insert History
//     INSERT INTO public.exchange_history (
//       rental_id, old_inventory_id, new_inventory_id,
//       exchange_date, days_used, days_remaining,
//       available_credit, new_cost, difference_to_pay, extra_days
//     ) VALUES (
//       p_rental_id, p_old_inventory_id, p_new_inventory_id,
//       NOW(),
//       (p_exchange_history_data->>'days_used')::int,
//       (p_exchange_history_data->>'days_remaining')::int,
//       (p_exchange_history_data->>'available_credit')::numeric,
//       (p_exchange_history_data->>'new_cost')::numeric,
//       p_difference_to_pay,
//       (p_exchange_history_data->>'extra_days')::int
//     );
//   END;
//   $function$
//
// FUNCTION handle_new_user()
//   CREATE OR REPLACE FUNCTION public.handle_new_user()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     INSERT INTO public.profiles (id, auth_user_id, email, name, role)
//     VALUES (NEW.id, NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)), 'Operador')
//     ON CONFLICT (id) DO UPDATE SET auth_user_id = EXCLUDED.auth_user_id;
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION public_add_asset(uuid, jsonb)
//   CREATE OR REPLACE FUNCTION public.public_add_asset(p_item_id uuid, p_asset jsonb)
//    RETURNS void
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     UPDATE public.inventory
//     SET
//       assets = COALESCE(assets, '[]'::jsonb) || p_asset,
//       total_qty = total_qty + 1,
//       available_qty = available_qty + 1
//     WHERE id = p_item_id;
//   END;
//   $function$
//
// FUNCTION set_contract_number()
//   CREATE OR REPLACE FUNCTION public.set_contract_number()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   BEGIN
//     IF NEW.contract_number IS NULL THEN
//       NEW.contract_number := 'LC' || LPAD(nextval('public.rental_contract_seq')::text, 3, '0');
//     END IF;
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION set_customer_matricula()
//   CREATE OR REPLACE FUNCTION public.set_customer_matricula()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//     next_val INT;
//   BEGIN
//     IF NEW.matricula IS NULL OR NEW.matricula = '' OR NEW.matricula = 'AUTO' THEN
//       SELECT MAX(NULLIF(regexp_replace(matricula, '\D', '', 'g'), '')::INT)
//       INTO next_val
//       FROM public.customers;
//
//       IF next_val IS NULL THEN
//         NEW.matricula := '0001';
//       ELSE
//         NEW.matricula := LPAD((next_val + 1)::text, 4, '0');
//       END IF;
//     END IF;
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION sync_historico_trocas()
//   CREATE OR REPLACE FUNCTION public.sync_historico_trocas()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//     v_original DECIMAL(10,2);
//     v_novo DECIMAL(10,2);
//   BEGIN
//     SELECT daily_price INTO v_original FROM public.inventory WHERE id = NEW.old_inventory_id;
//     SELECT daily_price INTO v_novo FROM public.inventory WHERE id = NEW.new_inventory_id;
//
//     INSERT INTO public.historico_trocas (
//       contrato_id, produto_antigo_id, produto_novo_id, data_troca,
//       dias_usados, dias_restantes, credito_disponivel,
//       valor_diario_original, valor_diario_novo,
//       custo_novo, diferenca_pagar, dias_extras
//     ) VALUES (
//       NEW.rental_id, NEW.old_inventory_id, NEW.new_inventory_id, NEW.exchange_date,
//       NEW.days_used, NEW.days_remaining, NEW.available_credit,
//       COALESCE(v_original, 0), COALESCE(v_novo, 0),
//       NEW.new_cost, NEW.difference_to_pay, NEW.extra_days
//     );
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION transfer_inventory(uuid, text, text, integer)
//   CREATE OR REPLACE FUNCTION public.transfer_inventory(p_inventory_id uuid, p_origin_location_id text, p_destination_location_id text, p_quantity integer)
//    RETURNS void
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//     v_origin_qty INTEGER;
//   BEGIN
//     -- Check origin qty
//     SELECT available_qty INTO v_origin_qty
//     FROM public.inventory_locations
//     WHERE inventory_id = p_inventory_id AND location_id = p_origin_location_id;
//
//     IF v_origin_qty IS NULL OR v_origin_qty < p_quantity THEN
//       RAISE EXCEPTION 'Quantidade indisponível no local de origem.';
//     END IF;
//
//     -- Update origin
//     UPDATE public.inventory_locations
//     SET available_qty = available_qty - p_quantity,
//         quantity = quantity - p_quantity
//     WHERE inventory_id = p_inventory_id AND location_id = p_origin_location_id;
//
//     -- Update destination
//     IF EXISTS (SELECT 1 FROM public.inventory_locations WHERE inventory_id = p_inventory_id AND location_id = p_destination_location_id) THEN
//       UPDATE public.inventory_locations
//       SET available_qty = available_qty + p_quantity,
//           quantity = quantity + p_quantity
//       WHERE inventory_id = p_inventory_id AND location_id = p_destination_location_id;
//     ELSE
//       INSERT INTO public.inventory_locations (inventory_id, location_id, quantity, available_qty, rented_qty)
//       VALUES (p_inventory_id, p_destination_location_id, p_quantity, p_quantity, 0);
//     END IF;
//
//     -- Insert transfer log
//     INSERT INTO public.inventory_transfers (inventory_id, origin_location_id, destination_location_id, quantity, status)
//     VALUES (p_inventory_id, p_origin_location_id, p_destination_location_id, p_quantity, 'completed');
//   END;
//   $function$
//
// FUNCTION transfer_inventory_batch(text, text, jsonb)
//   CREATE OR REPLACE FUNCTION public.transfer_inventory_batch(p_origin_location_id text, p_destination_location_id text, p_items jsonb)
//    RETURNS void
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//     v_item jsonb;
//     v_inventory_id uuid;
//     v_quantity integer;
//     v_origin_qty integer;
//     v_timestamp timestamp with time zone := NOW();
//   BEGIN
//     FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
//     LOOP
//       v_inventory_id := (v_item->>'inventory_id')::uuid;
//       v_quantity := (v_item->>'quantity')::integer;
//
//       -- Check origin qty
//       SELECT available_qty INTO v_origin_qty
//       FROM public.inventory_locations
//       WHERE inventory_id = v_inventory_id AND location_id = p_origin_location_id;
//
//       IF v_origin_qty IS NULL OR v_origin_qty < v_quantity THEN
//         RAISE EXCEPTION 'Quantidade indisponível no local de origem para o produto %', v_inventory_id;
//       END IF;
//
//       -- Update origin
//       UPDATE public.inventory_locations
//       SET available_qty = available_qty - v_quantity,
//           quantity = quantity - v_quantity
//       WHERE inventory_id = v_inventory_id AND location_id = p_origin_location_id;
//
//       -- Update destination
//       IF EXISTS (SELECT 1 FROM public.inventory_locations WHERE inventory_id = v_inventory_id AND location_id = p_destination_location_id) THEN
//         UPDATE public.inventory_locations
//         SET available_qty = available_qty + v_quantity,
//             quantity = quantity + v_quantity
//         WHERE inventory_id = v_inventory_id AND location_id = p_destination_location_id;
//       ELSE
//         INSERT INTO public.inventory_locations (inventory_id, location_id, quantity, available_qty, rented_qty)
//         VALUES (v_inventory_id, p_destination_location_id, v_quantity, v_quantity, 0);
//       END IF;
//
//       -- Insert transfer log
//       INSERT INTO public.inventory_transfers (inventory_id, origin_location_id, destination_location_id, quantity, status, created_at)
//       VALUES (v_inventory_id, p_origin_location_id, p_destination_location_id, v_quantity, 'completed', v_timestamp);
//     END LOOP;
//   END;
//   $function$
//
// FUNCTION update_inventory_qty_on_patrimonio()
//   CREATE OR REPLACE FUNCTION public.update_inventory_qty_on_patrimonio()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     IF TG_OP = 'INSERT' THEN
//       UPDATE public.inventory
//       SET total_qty = total_qty + 1,
//           available_qty = available_qty + 1
//       WHERE id = NEW.inventory_id;
//       RETURN NEW;
//     ELSIF TG_OP = 'DELETE' THEN
//       UPDATE public.inventory
//       SET total_qty = GREATEST(0, total_qty - 1),
//           available_qty = GREATEST(0, available_qty - 1)
//       WHERE id = OLD.inventory_id;
//       RETURN OLD;
//     END IF;
//     RETURN NULL;
//   END;
//   $function$
//
// FUNCTION update_patrimonio_updated_at()
//   CREATE OR REPLACE FUNCTION public.update_patrimonio_updated_at()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   BEGIN
//       NEW.updated_at = NOW();
//       RETURN NEW;
//   END;
//   $function$
//
// FUNCTION update_rental_secure(uuid, date, date, text, uuid)
//   CREATE OR REPLACE FUNCTION public.update_rental_secure(p_rental_id uuid, p_start_date date, p_expected_return_date date, p_custom_text text, p_user_id uuid)
//    RETURNS void
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//     v_count int;
//     v_old_start date;
//     v_old_return date;
//     v_old_text text;
//   BEGIN
//     -- Rate limit check
//     SELECT count(*) INTO v_count
//     FROM public.auditoria_contratos
//     WHERE usuario_id = p_user_id
//       AND created_at >= NOW() - INTERVAL '1 minute';
//
//     IF v_count >= 5 THEN
//       RAISE EXCEPTION 'Rate limit exceeded: max 5 edits per minute.';
//     END IF;
//
//     -- Get old values
//     SELECT start_date, expected_return_date, custom_contract_text
//     INTO v_old_start, v_old_return, v_old_text
//     FROM public.rentals
//     WHERE id = p_rental_id;
//
//     -- Update
//     UPDATE public.rentals
//     SET start_date = p_start_date,
//         expected_return_date = p_expected_return_date,
//         custom_contract_text = p_custom_text
//     WHERE id = p_rental_id;
//
//     -- Audit
//     INSERT INTO public.auditoria_contratos (rental_id, usuario_id, acao, campos_antigos, campos_novos, ip_usuario)
//     VALUES (
//       p_rental_id,
//       p_user_id,
//       'EDIT',
//       jsonb_build_object('start_date', v_old_start, 'expected_return_date', v_old_return, 'custom_contract_text', v_old_text),
//       jsonb_build_object('start_date', p_start_date, 'expected_return_date', p_expected_return_date, 'custom_contract_text', p_custom_text),
//       'rpc-call'
//     );
//   END;
//   $function$
//
// FUNCTION update_rental_secure(uuid, date, date, text, uuid, text)
//   CREATE OR REPLACE FUNCTION public.update_rental_secure(p_rental_id uuid, p_start_date date, p_expected_return_date date, p_custom_text text, p_user_id uuid, p_justificativa text DEFAULT NULL::text)
//    RETURNS void
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//     v_count int;
//     v_old_start date;
//     v_old_return date;
//     v_old_text text;
//   BEGIN
//     -- Rate limit check
//     SELECT count(*) INTO v_count
//     FROM public.auditoria_contratos
//     WHERE usuario_id = p_user_id
//       AND created_at >= NOW() - INTERVAL '1 minute';
//
//     IF v_count >= 5 THEN
//       RAISE EXCEPTION 'Rate limit exceeded: max 5 edits per minute.';
//     END IF;
//
//     -- Get old values
//     SELECT start_date, expected_return_date, custom_contract_text
//     INTO v_old_start, v_old_return, v_old_text
//     FROM public.rentals
//     WHERE id = p_rental_id;
//
//     -- Update
//     UPDATE public.rentals
//     SET start_date = p_start_date,
//         expected_return_date = p_expected_return_date,
//         custom_contract_text = p_custom_text
//     WHERE id = p_rental_id;
//
//     -- Audit
//     INSERT INTO public.auditoria_contratos (rental_id, usuario_id, acao, campos_antigos, campos_novos, ip_usuario)
//     VALUES (
//       p_rental_id,
//       p_user_id,
//       'EDIT',
//       jsonb_build_object('start_date', v_old_start, 'expected_return_date', v_old_return, 'custom_contract_text', v_old_text),
//       jsonb_build_object('start_date', p_start_date, 'expected_return_date', p_expected_return_date, 'custom_contract_text', p_custom_text, 'justificativa', p_justificativa),
//       'rpc-call'
//     );
//   END;
//   $function$
//

// --- TRIGGERS ---
// Table: customers
//   trg_set_customer_matricula: CREATE TRIGGER trg_set_customer_matricula BEFORE INSERT ON public.customers FOR EACH ROW EXECUTE FUNCTION set_customer_matricula()
// Table: exchange_history
//   on_exchange_history_inserted: CREATE TRIGGER on_exchange_history_inserted AFTER INSERT ON public.exchange_history FOR EACH ROW EXECUTE FUNCTION sync_historico_trocas()
// Table: patrimonio
//   trg_update_inventory_qty_on_patrimonio: CREATE TRIGGER trg_update_inventory_qty_on_patrimonio AFTER INSERT OR DELETE ON public.patrimonio FOR EACH ROW EXECUTE FUNCTION update_inventory_qty_on_patrimonio()
//   update_patrimonio_updated_at: CREATE TRIGGER update_patrimonio_updated_at BEFORE UPDATE ON public.patrimonio FOR EACH ROW EXECUTE FUNCTION update_patrimonio_updated_at()
// Table: rentals
//   trg_set_contract_number: CREATE TRIGGER trg_set_contract_number BEFORE INSERT ON public.rentals FOR EACH ROW EXECUTE FUNCTION set_contract_number()

// --- INDEXES ---
// Table: inventory_locations
//   CREATE UNIQUE INDEX inventory_locations_inventory_id_location_id_key ON public.inventory_locations USING btree (inventory_id, location_id)
// Table: patrimonio
//   CREATE UNIQUE INDEX patrimonio_numero_patrimonio_key ON public.patrimonio USING btree (numero_patrimonio)
