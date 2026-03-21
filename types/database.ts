// Tipos generados a partir del schema de Supabase
// Actualiza este archivo si modificas el schema.sql

export type RolUsuario = 'paciente' | 'admin'
export type EstatusCredito = 'pendiente' | 'activo' | 'pagado' | 'moroso' | 'rechazado'
export type EstatusCuota = 'pendiente' | 'pagada' | 'vencida'
export type EstatusMembresia = 'activa' | 'inactiva' | 'cancelada'
export type ModuloTipo = 'odontologia' | 'nutricion' | 'medicina_general' | 'psicologia' | 'oftalmologia'

export interface Profile {
  id: string
  nombre_completo: string
  telefono: string | null
  rol: RolUsuario
  ingresos_mensuales: number | null
  historial_bancario_url: string | null
  score_credito: number | null
  created_at: string
  updated_at: string
}

export interface Credito {
  id: string
  paciente_id: string
  folio: string
  monto_aprobado: number
  monto_pendiente: number
  plazo_meses: number
  tasa_interes: number
  estatus: EstatusCredito
  fecha_aprobacion: string | null
  created_at: string
  updated_at: string
}

export interface Cuota {
  id: string
  credito_id: string
  numero: number
  monto: number
  fecha_vence: string
  fecha_pago: string | null
  estatus: EstatusCuota
  created_at: string
  updated_at: string
}

export interface Membresia {
  id: string
  paciente_id: string
  estatus: EstatusMembresia
  fecha_inicio: string
  fecha_fin: string | null
  created_at: string
  updated_at: string
  modulos?: MembresiaModulo[]
}

export interface MembresiaModulo {
  id: string
  membresia_id: string
  modulo: ModuloTipo
  activo: boolean
  created_at: string
}

export interface AdminStats {
  total_creditos: number
  creditos_activos: number
  cartera_activa: number
  creditos_morosos: number
  tasa_morosidad: number
  membresias_activas: number
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
      }
      creditos: {
        Row: Credito
        Insert: Omit<Credito, 'id' | 'folio' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Credito, 'id' | 'created_at' | 'updated_at'>>
      }
      cuotas: {
        Row: Cuota
        Insert: Omit<Cuota, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Cuota, 'id' | 'created_at' | 'updated_at'>>
      }
      membresias: {
        Row: Membresia
        Insert: Omit<Membresia, 'id' | 'modulos' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Membresia, 'id' | 'modulos' | 'created_at' | 'updated_at'>>
      }
      membresias_modulos: {
        Row: MembresiaModulo
        Insert: Omit<MembresiaModulo, 'id' | 'created_at'>
        Update: Partial<Omit<MembresiaModulo, 'id' | 'created_at'>>
      }
    }
    Views: {
      admin_stats: {
        Row: AdminStats
      }
    }
  }
}
