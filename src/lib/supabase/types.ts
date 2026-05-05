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
//   attachment: text (nullable)
//   documento_url: jsonb (nullable, default: '[]'::jsonb)
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

// --- TRIGGERS ---
// Table: customers
//   trg_set_customer_matricula: CREATE TRIGGER trg_set_customer_matricula BEFORE INSERT ON public.customers FOR EACH ROW EXECUTE FUNCTION set_customer_matricula()
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
