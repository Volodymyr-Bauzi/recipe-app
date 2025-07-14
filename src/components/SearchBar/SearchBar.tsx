import s from './SearchBar.module.css';

interface SearchBarProps {
  query: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({query, onChange}) => {
  return (
    <section className={s.searchSection}>
      <input
        type="text"
        value={query}
        onChange={onChange}
        placeholder="Шукати рецепт..."
        className={s.searchInput}
      />
    </section>
  );
};
export default SearchBar;
