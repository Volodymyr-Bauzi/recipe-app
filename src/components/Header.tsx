import {useSupabaseAuth} from '../hooks/useSupabaseAuth';
import {useEffect, useRef, useState} from 'react';
import {supabase} from '../lib/supabaseClient';
import AuthModal from './AuthModal';
import s from './Header.module.css';

const Header = () => {
  const {user} = useSupabaseAuth();

  const headerRef = useRef<HTMLTableCellElement | null>(null);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    const scrollFunction = () => {
      if (headerRef.current) {
        const header = headerRef.current.style;
        if (
          document.body.scrollTop > 50 ||
          document.documentElement.scrollTop > 50
        ) {
          header.fontSize = '8px';
          header.padding = '4px';
        } else {
          header.fontSize = '15px';
          header.padding = '15px';
        }
      }
    };

    window.addEventListener('scroll', scrollFunction);
    return () => window.removeEventListener('scroll', scrollFunction);
  }, []);

  const handleLogout = async () => {
    const {error} = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error.message);
    } else {
      console.log('User logged out successfully');
    }
  };

  return (
    <header ref={headerRef} className={s.header}>
      <div className={s.headerContent}>
        <button className={s.addButton}>Добавити</button>
        <h1 className={s.headerTitle}>Рецепти</h1>
        <div className={s.authButtons}>
          {user ? (
            <div className={s.userInfo}>
              <img
                src={user.user_metadata.avatar_url || '/default-avatar.png'}
                alt="User Avatar"
                className={s.avatar}
              />
              <span className={s.userName}>
                {user.user_metadata.full_name.split(' ')[0] || user.email}
              </span>
              <button className={s.logoutBtn} onClick={handleLogout}>
                Вийти
              </button>
            </div>
          ) : (
            <div>
              <button
                onClick={() => setAuthOpen(true)}
                className={s.authButton}
              >
                Увійти / Зареєструватися
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Modal */}
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </header>
  );
};
export default Header;
