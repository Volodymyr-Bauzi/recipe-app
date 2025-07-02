import {useEffect, useRef, useState} from 'react';
import s from './App.module.css';
import AuthModal from './components/AuthModal';
import {useSupabaseAuth} from './hooks/useSupabaseAuth';
import {supabase} from './lib/supabaseClient';

function App() {
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
  console.log('user', user);

  const handleLogout = async () => {
    const {error} = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error.message);
    } else {
      console.log('User logged out successfully');
    }
  };

  return (
    <>
      <div className={s.body}>
        {/* Header */}
        <header ref={headerRef} className={s.header}>
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
        </header>

        <div className={s.content}>
          {/* Search Section */}
          <section className={s.searchSection}>
            <input
              type="text"
              placeholder="Шукати рецепт..."
              className={s.searchInput}
            />
          </section>

          {/* Categories Section */}
          <section className={s.categoriesSection}>
            <h2 className={s.sectionTitle}>Категорії</h2>
            <ul className={s.categoriesList}>
              <li className={s.categoryItem}>Сніданок</li>
              <li className={s.categoryItem}>Обід</li>
              <li className={s.categoryItem}>Вечеря</li>
              <li className={s.categoryItem}>Десерти</li>
            </ul>
          </section>

          {/* Recipes Section */}
          <section className={s.recipesSection}>
            <h2 className={s.sectionTitle}>Рецепти</h2>
            <div className={s.recipesGrid}>{/* Recipes */}</div>
          </section>

          {/* Footer */}
          <footer className={s.footer}>
            <p>
              © {new Date().getFullYear()} Смачні Рецепти. Всі права захищені.
            </p>
          </footer>
        </div>
      </div>

      {/* Modal */}
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </>
  );
}

export default App;
