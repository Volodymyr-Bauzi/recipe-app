import s from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={s.footer}>
      <p>© {new Date().getFullYear()} Смачні Рецепти. Всі права захищені.</p>
    </footer>
  );
};
export default Footer;
