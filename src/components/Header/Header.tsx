import {useSupabaseAuth} from '../../hooks/useSupabaseAuth';
import {useEffect, useRef, useState} from 'react';
import {supabase} from '../../lib/supabaseClient';
import AuthModal from '../AuthModal/AuthModal';
import s from './Header.module.css';
import {useTranslation} from '../../hooks/useTranslation';
import type {AvailableLanguageCode} from '../../translations';

interface HeaderProps {
  onAddRecipeClick: () => void;
}

const Header = ({onAddRecipeClick}: HeaderProps) => {
  const {user} = useSupabaseAuth();
  const headerRef = useRef<HTMLElement | null>(null);

  const [authOpen, setAuthOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(false);

  const {t, locale, setLocale, availableLanguages} = useTranslation();

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
          <h1 className={s.headerTitle}>{t('header.title')}</h1>
        </div>

        <div className={`${s.headerSecondary} ${activeMenu ? s.active : ''}`}>
          <button
            className={s.addButton}
            onClick={user ? onAddRecipeClick : () => setAuthOpen(true)}
          >
            {user ? t('header.addRecipe') : t('header.loginToAdd')}
          </button>

          <div className={s.LanguageSwitcher}>
            <select
              value={locale}
              onChange={(e) =>
                setLocale(
                  (e.target as HTMLSelectElement).value as AvailableLanguageCode
                )
              }
              className={s.languageSelect}
            >
              {availableLanguages.map(({code, label}) => (
                <option key={code} value={code}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className={s.authButtons}>
            {user ? (
              <div className={s.userInfo}>
                <img
                  src={avatarUrl}
                  alt={t('header.userAvatarAlt')}
                  className={s.avatar}
                />
                <span className={s.userName}>{userName}</span>
                <button className={s.logoutBtn} onClick={handleLogout}>
                  {t('header.logout')}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                className={s.authButton}
              >
                {t('header.loginOrRegister')}
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
