import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { type Database } from './supabase/database.types'

export class AuthError extends Error {
  constructor(message: string, public code?: string) {
    super(message)
    this.name = 'AuthError'
  }
}

export const createClient = () => {
  return createClientComponentClient<Database>()
}

export async function signIn(email: string, password: string) {
  const supabase = createClient()

  try {
    if (!email || !password) {
      throw new AuthError('Email and password are required')
    }

    // Sign in with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (authError) {
      if (authError.message.includes('Invalid login credentials')) {
        throw new AuthError('Invalid email or password', 'INVALID_CREDENTIALS')
      }
      throw new AuthError(authError.message, authError.name)
    }

    if (!authData?.user) {
      throw new AuthError('Authentication failed - no user returned')
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    if (profileError) {
      throw new AuthError('Failed to fetch user profile', profileError.code)
    }

    if (!profile) {
      throw new AuthError('User profile not found')
    }

    return {
      user: authData.user,
      profile,
      session: authData.session
    }
  } catch (error) {
    if (error instanceof AuthError) {
      throw error
    }
    throw new AuthError('An unexpected error occurred during authentication')
  }
}

export async function signUp(
  email: string,
  password: string,
  userData: {
    first_name: string
    last_name: string
    role: 'student' | 'teacher'
  }
) {
  const supabase = createClient()

  try {
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })

    if (signUpError) throw signUpError

    if (!authData?.user) {
      throw new AuthError('Registration failed - no user returned')
    }

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        role: userData.role
      })

    if (profileError) {
      throw new AuthError('Failed to create user profile', profileError.code)
    }

    return {
      user: authData.user,
      session: authData.session
    }
  } catch (error) {
    if (error instanceof AuthError) {
      throw error
    }
    throw new AuthError('An unexpected error occurred during registration')
  }
}

export async function signOut() {
  const supabase = createClient()
  
  try {
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw new AuthError(error.message, error.name)
    }
  } catch (error) {
    if (error instanceof AuthError) {
      throw error
    }
    throw new AuthError('Failed to sign out')
  }
}

export async function resetPassword(email: string) {
  const supabase = createClient()

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })

    if (error) {
      throw new AuthError(error.message, error.name)
    }
  } catch (error) {
    if (error instanceof AuthError) {
      throw error
    }
    throw new AuthError('Failed to send password reset email')
  }
}

export async function updatePassword(password: string) {
  const supabase = createClient()

  try {
    const { error } = await supabase.auth.updateUser({
      password
    })

    if (error) {
      throw new AuthError(error.message, error.name)
    }
  } catch (error) {
    if (error instanceof AuthError) {
      throw error
    }
    throw new AuthError('Failed to update password')
  }
}