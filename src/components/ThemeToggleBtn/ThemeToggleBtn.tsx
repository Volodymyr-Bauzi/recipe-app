import {useTheme} from '../../contexts/ThemeContext';
import s from './ThemeToggleBtn.module.css';

const ThemeToggleBtn = () => {
  const {theme, toggleTheme} = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className={s.toggleTheme}
      style={{
        background: theme === 'dark' ? '#333' : '#fff',
        color: theme === 'dark' ? '#fff' : '#333',
      }}
    >
      {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
};
export default ThemeToggleBtn;
