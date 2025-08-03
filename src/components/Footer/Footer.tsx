import {useTranslation} from '../../hooks/useTranslation';
import s from './Footer.module.css';

const Footer = () => {
  const {t} = useTranslation();

  return (
    <footer className={s.footer}>
      <p>
        © {new Date().getFullYear()} {t('footer.title')}. {t('footer.rights')}
      </p>
    </footer>
  );
};
export default Footer;
