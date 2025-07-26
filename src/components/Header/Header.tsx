import {useSupabaseAuth} from '../../hooks/useSupabaseAuth';
import {useEffect, useRef, useState} from 'react';
import {supabase} from '../../lib/supabaseClient';
import AuthModal from '../AuthModal/AuthModal';
import s from './Header.module.css';

interface HeaderProps {
  onAddRecipeClick: () => void;
}

const Header = ({onAddRecipeClick}: HeaderProps) => {
  const {user} = useSupabaseAuth();
  const headerRef = useRef<HTMLElement | null>(null);

  const [authOpen, setAuthOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!headerRef.current) return;
      const scrolled =
        document.documentElement.scrollTop > 50 || document.body.scrollTop > 50;
      headerRef.current.classList.toggle(s.shrunk, scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('modalOpen', authOpen);
    return () => document.body.classList.remove('modalOpen');
  }, [authOpen]);

  const handleLogout = async () => {
    const {error} = await supabase.auth.signOut();
    if (error) console.error('Logout error:', error.message);
  };

  const toggleMenu = () => setActiveMenu((prev) => !prev);

  const userName = user?.user_metadata.full_name?.split(' ')[0] || user?.email;
  const avatarUrl = user?.user_metadata.avatar_url || '/default-avatar.png';

  return (
    <header ref={headerRef} className={s.header}>
      <div className={s.headerContent}>
        <div className={s.headerMain}>
          <button className={s.toggleNavBarButton} onClick={toggleMenu}>
            ☰
          </button>
          <h1 className={s.headerTitle}>Домашні Рецепти</h1>
        </div>

        <div className={`${s.headerSecondary} ${activeMenu ? s.active : ''}`}>
          <button
            className={s.addButton}
            onClick={user ? onAddRecipeClick : () => setAuthOpen(true)}
          >
            {user ? 'Додати новий рецепт' : 'Увійдіть, щоб додати рецепт'}
          </button>

          <div className={s.authButtons}>
            {user ? (
              <div className={s.userInfo}>
                <img src={avatarUrl} alt="User Avatar" className={s.avatar} />
                <span className={s.userName}>{userName}</span>
                <button className={s.logoutBtn} onClick={handleLogout}>
                  Вийти
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                className={s.authButton}
              >
                Увійти / Зареєструватися
              </button>
            )}
          </div>
        </div>
      </div>

      {authOpen && (
        <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      )}
    </header>
  );
};

export default Header;
