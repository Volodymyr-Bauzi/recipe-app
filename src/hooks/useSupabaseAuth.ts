// src/hooks/useSupabaseAuth.ts
import {useEffect, useState} from 'react';
import {supabase} from '../lib/supabaseClient';
import type {User} from '@supabase/supabase-js';

interface UseSupabaseAuth {
  user: User | null;
}

export function useSupabaseAuth(): UseSupabaseAuth {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Get session on initial load
    supabase.auth.getUser().then(({data}) => {
      if (data?.user) setUser(data.user);
    });

    // Listen for login/logout
    const {data: listener} = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return {user};
}
