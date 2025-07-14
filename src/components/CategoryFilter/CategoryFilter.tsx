import s from './CategoryFilter.module.css';

interface CategoryFilterProps {
  selected: string | null;
  onSelect: (category: string) => void;
}

const categories = [
  'Десерти',
  'Основні',
  'Супи',
  'Гарніри',
  'Салати',
  "М'ясне",
  'Закрутки',
  'Закуски',
];

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selected,
  onSelect,
}) => {
  return (
    <section className={s.categoriesSection}>
      <h2 className={s.sectionTitle}>Категорії</h2>
      <ul className={s.categoriesList}>
        {categories.map((category) => (
          <li
            key={category}
            className={`${s.categoryItem} ${
              selected === category ? s.active : ''
            }`}
            onClick={() => onSelect(category)}
          >
            {category}
          </li>
        ))}
      </ul>
    </section>
  );
};
export default CategoryFilter;
