import {useTranslation} from '../../hooks/useTranslation';
import s from './SearchBar.module.css';

interface SearchBarProps {
  query: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({query, onChange}) => {
  const {t} = useTranslation();

  return (
    <section className={s.searchSection}>
      <input
        type="text"
        value={query}
        onChange={onChange}
        placeholder={t('search.placeholder')}
        className={s.searchInput}
      />
    </section>
  );
};
export default SearchBar;
