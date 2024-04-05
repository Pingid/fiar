import { create } from 'zustand'

export const useAuth = create<AuthContext>(() => ({ status: 'disabled' }))

type AuthContext =
  | { status: 'disabled' }
  | {
      status: 'signed-in'
      user: { uid: string; email?: string | null; displayName?: string | null } | null
      signin: () => void
      signout: () => void
    }
  | { status: 'signed-out'; user: null; signin: () => void; signout: () => void }
