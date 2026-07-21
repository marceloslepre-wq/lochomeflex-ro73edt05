import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'

type Profile = Database['public']['Tables']['profiles']['Row']

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<{ error: any }>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    let profileFetchId = 0

    const fetchProfile = async (userId: string) => {
      const currentFetchId = ++profileFetchId
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('auth_user_id', userId)
          .single()

        if (!mounted || currentFetchId !== profileFetchId) return

        if (data) {
          setProfile(data)
          return
        }

        if (error && error.code !== 'PGRST116') {
          console.error('Profile fetch error:', error)
        }

        const { data: fallbackData, error: fallbackError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()

        if (!mounted || currentFetchId !== profileFetchId) return

        if (fallbackError && fallbackError.code !== 'PGRST116') {
          console.error('Fallback profile fetch error:', fallbackError)
        }

        if (fallbackData) setProfile(fallbackData)
      } catch (err) {
        if (mounted && currentFetchId === profileFetchId) {
          console.error('Error fetching profile:', err)
        }
      } finally {
        if (mounted && currentFetchId === profileFetchId) {
          setLoading(false)
        }
      }
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return

      setSession(session)
      setUser(session?.user ?? null)

      if (event === 'INITIAL_SESSION') {
        if (session?.user) {
          fetchProfile(session.user.id)
        } else {
          setProfile(null)
          setLoading(false)
        }
        return
      }

      if (event === 'SIGNED_OUT') {
        setProfile(null)
        setLoading(false)
      } else if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password })
    return { error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  return (
    <AuthContext.Provider value={{ user, session, profile, signIn, signUp, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
