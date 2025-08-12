import {useSupabaseAuth} from '../../hooks/useSupabaseAuth';
import {useEffect, useRef, useState} from 'react';
import {supabase} from '../../lib/supabaseClient';
import AuthModal from '../AuthModal/AuthModal';
import s from './Header.module.css';
import {useTranslation} from '../../hooks/useTranslation';
import type {AvailableLanguageCode} from '../../translations';
import {IoIosSettings} from 'react-icons/io';

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

  // const currentLang = availableLanguages.find((lang) => lang.code === locale);

  const myStyles: React.CSSProperties = {
    flexDirection: 'row-reverse',
  };
  const mySecondaryStyles: React.CSSProperties = {
    alignItems: 'end',
  };

  return (
    <header ref={headerRef} className={s.header}>
      <div className={s.headerContent}>
        <div style={myStyles} className={s.headerMain}>
          <button
            className={`${s.toggleNavBarButton} ${s.headerBtn}`}
            onClick={toggleMenu}
          >
            ☰
          </button>
          <h1 className={s.headerTitle}>{t('header.title')}</h1>
        </div>

        <div
          style={mySecondaryStyles}
          className={`${s.headerSecondary} ${activeMenu ? s.active : ''}`}
        >
          <button
            className={`${s.addButton} ${s.headerBtn}`}
            onClick={user ? onAddRecipeClick : () => setAuthOpen(true)}
          >
            {t('header.addRecipe')}
          </button>

          <div className={`${s.languageSwitcher} ${s.headerBtn}`}>
            <select
              name="languageSelect"
              value={locale}
              onChange={(e) =>
                setLocale(
                  (e.target as HTMLSelectElement).value as AvailableLanguageCode
                )
              }
              className={s.languageSelect}
            >
              {availableLanguages.map(({code, label, flag}) => (
                <option key={code} value={code}>
                  {flag} {label}
                </option>
              ))}
            </select>
          </div>

          <div className={s.settings}>
            <button className={`${s.settingsButton}  ${s.headerBtn}`}>
              <IoIosSettings /> {t('header.settings')}
            </button>
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
                <button
                  className={`${s.logoutBtn}  ${s.headerBtn}`}
                  onClick={handleLogout}
                >
                  {t('header.logout')}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                className={`${s.authButton}  ${s.headerBtn}`}
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
