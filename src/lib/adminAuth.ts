import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { getSupabaseClient } from './supabaseClient';

export type AdminAuthStatus = 'loading' | 'active' | 'unauthorized' | 'offline';

export interface AdminAuthState {
  status: AdminAuthStatus;
  user: User | null;
  session: Session | null;
  error: string | null;
}

type AuthStateListener = (state: AdminAuthState) => void;

class AdminAuthManager {
  private currentState: AdminAuthState = {
    status: 'loading',
    user: null,
    session: null,
    error: null
  };
  private listeners: Set<AuthStateListener> = new Set();
  private initialized = false;

  constructor() {
    this.cleanLegacyMockAuth();
  }

  // Remove any legacy mock localStorage flags from previous versions
  private cleanLegacyMockAuth(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.removeItem('gulpash_admin_auth_v2');
        window.localStorage.removeItem('gulpash_admin_auth');
      } catch {
        // ignore storage errors
      }
    }
  }

  // Check if user has genuine admin role in app_metadata or user_metadata
  public isAuthorizedAdmin(user: User | null): boolean {
    if (!user) return false;
    const appRole = user.app_metadata?.role;
    const userRole = user.user_metadata?.role;
    return appRole === 'admin' || userRole === 'admin';
  }

  public async initialize(): Promise<AdminAuthState> {
    if (this.initialized) {
      return this.currentState;
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      this.updateState({
        status: 'offline',
        user: null,
        session: null,
        error: 'Supabase client could not be initialized.'
      });
      this.initialized = true;
      return this.currentState;
    }

    try {
      // 1. Fetch current session from Supabase persistent storage
      const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
      
      if (sessionErr || !sessionData?.session) {
        this.updateState({
          status: 'offline',
          user: null,
          session: null,
          error: null
        });
      } else {
        const session = sessionData.session;
        // 2. Fetch authenticated user details
        const { data: userData, error: userErr } = await supabase.auth.getUser();
        const user = userData?.user || session.user;

        if (userErr || !user) {
          this.updateState({
            status: 'offline',
            user: null,
            session: null,
            error: userErr?.message || 'Invalid session user'
          });
        } else if (this.isAuthorizedAdmin(user)) {
          this.updateState({
            status: 'active',
            user,
            session,
            error: null
          });
        } else {
          this.updateState({
            status: 'unauthorized',
            user,
            session,
            error: 'User account does not have administrator privileges (role: admin required).'
          });
        }
      }

      // 3. Listen to all auth state changes reactively
      supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
        if (!session) {
          this.updateState({
            status: 'offline',
            user: null,
            session: null,
            error: null
          });
          return;
        }

        const user = session.user;
        if (this.isAuthorizedAdmin(user)) {
          this.updateState({
            status: 'active',
            user,
            session,
            error: null
          });
        } else {
          this.updateState({
            status: 'unauthorized',
            user,
            session,
            error: 'User account does not have administrator privileges.'
          });
        }
      });

    } catch (err: any) {
      this.updateState({
        status: 'offline',
        user: null,
        session: null,
        error: err?.message || 'Auth initialization failed'
      });
    }

    this.initialized = true;
    return this.currentState;
  }

  public getState(): AdminAuthState {
    return this.currentState;
  }

  public subscribe(listener: AuthStateListener): () => void {
    this.listeners.add(listener);
    // Immediately invoke with current state
    listener(this.currentState);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private updateState(newState: AdminAuthState): void {
    this.currentState = newState;
    this.listeners.forEach(fn => fn(this.currentState));
  }

  // Authoritative Sign In with Password
  public async signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { success: false, error: 'Supabase client is not available' };
    }

    this.cleanLegacyMockAuth();

    try {
      const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password.trim()
      });

      if (authErr) {
        return { success: false, error: authErr.message || 'Authentication failed' };
      }

      // Immediately verify session & user
      const { data: { session } } = await supabase.auth.getSession();
      const { data: { user } } = await supabase.auth.getUser();

      if (!session || !user) {
        return { success: false, error: 'Authentication established but session was not found.' };
      }

      if (!this.isAuthorizedAdmin(user)) {
        this.updateState({
          status: 'unauthorized',
          user,
          session,
          error: 'Your account does not have administrator privileges.'
        });
        return { 
          success: false, 
          error: 'Access denied: Your account does not have the "admin" role in app_metadata.' 
        };
      }

      this.updateState({
        status: 'active',
        user,
        session,
        error: null
      });

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Sign in error' };
    }
  }

  // Authoritative Sign Out
  public async signOut(): Promise<void> {
    const supabase = getSupabaseClient();
    this.cleanLegacyMockAuth();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase sign out error:', err);
      }
    }
    this.updateState({
      status: 'offline',
      user: null,
      session: null,
      error: null
    });
  }

  // Get current access token for authenticated API requests
  public async getCurrentAccessToken(): Promise<string | null> {
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session?.access_token) {
        return sessionData.session.access_token;
      }

      // If session might be expired, attempt refresh
      const { data: refreshData } = await supabase.auth.refreshSession();
      return refreshData?.session?.access_token || null;
    } catch {
      return null;
    }
  }
}

export const adminAuthService = new AdminAuthManager();
