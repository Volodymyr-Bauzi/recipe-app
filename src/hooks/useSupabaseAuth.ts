// src/hooks/useSupabaseAuth.ts
import {useEffect, useState} from 'react';
import {supabase} from '../lib/supabaseClient';
import type {User} from '@supabase/supabase-js';
interface UseSupabaseAuth {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
}

export function useSupabaseAuth(): UseSupabaseAuth {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const {
        data: {user},
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Check admin status from JWT app_metadata
        const appMetadata = user.app_metadata || {};
        const isUserAdmin = appMetadata.role === 'admin';
        setIsAdmin(isUserAdmin);
      } else {
        setIsAdmin(false);
      }

      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: {subscription},
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        // Check admin status from JWT app_metadata
        const appMetadata = session.user.app_metadata || {};
        const isUserAdmin = appMetadata.role === 'admin';
        setIsAdmin(isUserAdmin);
      } else {
        setIsAdmin(false);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return {user, isAdmin, loading};
}
