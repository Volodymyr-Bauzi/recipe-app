import {useTheme} from '../../contexts/ThemeContext';
import {useTranslation} from '../../hooks/useTranslation';
import s from './ThemeToggleBtn.module.css';

const ThemeToggleBtn = () => {
  const {theme, toggleTheme} = useTheme();
  const {t} = useTranslation();

  return (
    <button
      onClick={toggleTheme}
      className={s.toggleTheme}
      style={{
        color: theme === 'dark' ? '#fff' : '#333',
      }}
    >
      {theme === 'dark' ? `🌙 ${t('theme.dark')}` : `☀️ ${t('theme.light')}`}
    </button>
  );
};
export default ThemeToggleBtn;
