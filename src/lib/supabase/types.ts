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
      customers: {
        Row: {
          address: Json | null
          created_at: string
          delivery_address: Json | null
          document: string
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
          created_at?: string
          delivery_address?: Json | null
          document: string
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
          created_at?: string
          delivery_address?: Json | null
          document?: string
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
      inventory: {
        Row: {
          available_qty: number
          category: string
          code: string
          condition_status: string
          created_at: string
          description: string | null
          id: string
          image: string | null
          name: string
          rented_qty: number
          total_qty: number
        }
        Insert: {
          available_qty?: number
          category: string
          code: string
          condition_status?: string
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          name: string
          rented_qty?: number
          total_qty?: number
        }
        Update: {
          available_qty?: number
          category?: string
          code?: string
          condition_status?: string
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          name?: string
          rented_qty?: number
          total_qty?: number
        }
        Relationships: []
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
          created_at: string
          custom_contract_html: string | null
          custom_contract_text: string | null
          customer_id: string | null
          expected_return_date: string
          id: string
          items: Json
          pickup_location_id: string | null
          start_date: string
          status: string
          total: number
          user_id: string | null
        }
        Insert: {
          actual_return_date?: string | null
          created_at?: string
          custom_contract_html?: string | null
          custom_contract_text?: string | null
          customer_id?: string | null
          expected_return_date: string
          id?: string
          items?: Json
          pickup_location_id?: string | null
          start_date: string
          status?: string
          total?: number
          user_id?: string | null
        }
        Update: {
          actual_return_date?: string | null
          created_at?: string
          custom_contract_html?: string | null
          custom_contract_text?: string | null
          customer_id?: string | null
          expected_return_date?: string
          id?: string
          items?: Json
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
      [_ in never]: never
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
// Table: customers
//   PRIMARY KEY customers_pkey: PRIMARY KEY (id)
// Table: inventory
//   PRIMARY KEY inventory_pkey: PRIMARY KEY (id)
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
// Table: customers
//   Policy "anon_insert" (INSERT, PERMISSIVE) roles={anon}
//     WITH CHECK: true
//   Policy "authenticated_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "authenticated_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: inventory
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
//   Policy "authenticated_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
