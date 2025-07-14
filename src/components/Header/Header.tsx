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
  const [activeMenu, setActiveMenu] = useState<boolean | null>(false);

  useEffect(() => {
    const scrollFunction = () => {
      if (headerRef.current) {
        const header = headerRef.current.style;
        console.log('Header style:', headerRef.current);
        if (
          document.body.scrollTop > 50 ||
          document.documentElement.scrollTop > 50
        ) {
          header.fontSize = '10px';
          header.padding = '4px';
        } else {
          header.fontSize = '16px';
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

  const openAuthModal = () => {
    setAuthOpen(true);
  };

  return (
    <header ref={headerRef} className={s.header}>
      <div className={s.headerContent}>
        <div className={s.headerMain}>
          <div className={s.hamburgerMenu}>
            {/* Hamburger menu for mobile view */}
            <button
              className={s.toggleNavBarButton}
              onClick={() => setActiveMenu(!activeMenu)}
            >
              ☰
            </button>
          </div>
          <h1 className={s.headerTitle}>Домашні Рецепти</h1>
        </div>
        <div className={`${s.headerSecondary} ${activeMenu ? s.active : ''}`}>
          <button
            className={s.addButton}
            onClick={user ? onAddRecipeClick : openAuthModal}
          >
            {!user ? 'Увійдіть, щоб додати рецепт' : 'Додати новий рецепт'}
          </button>
          <div className={s.authButtons}>
            {user ? (
              <div className={s.userInfo}>
                <img
                  src={user.user_metadata.avatar_url || '/default-avatar.png'}
                  alt="User Avatar"
                  className={s.avatar}
                />
                <span className={s.userName}>
                  {user.user_metadata.full_name?.split(' ')[0] || user.email}
                </span>
                <button className={s.logoutBtn} onClick={handleLogout}>
                  Вийти
                </button>
              </div>
            ) : (
              <div>
                <button onClick={openAuthModal} className={s.authButton}>
                  Увійти / Зареєструватися
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Auth Modal */}
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </header>
  );
};

export default Header;
