import { create } from 'zustand'

export const useAuth = create<AuthContext>(() => ({ status: 'disabled' }))

type AuthContext =
  | { status: 'disabled' }
  | { status: 'signed-in'; user: { name: string; id: string } | null; signin: () => void; signout: () => void }
  | { status: 'signed-out'; user: null; signin: () => void; signout: () => void }
