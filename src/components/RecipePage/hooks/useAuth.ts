// RecipePage/hooks/useAuth.ts
import {useState, useEffect} from 'react';
import type {User} from '@supabase/supabase-js';
import {supabase} from '../../../lib/supabaseClient';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {data} = await supabase.auth.getUser();
      setUser(data.user);
    };

    fetchUser();
  }, []);

  const isAdmin = user?.id === process.env.REACT_APP_SUPABASE_ADMIN_USER_ID;

  return {user, isAdmin};
};
