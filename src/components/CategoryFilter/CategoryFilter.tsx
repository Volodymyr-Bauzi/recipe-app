import {useTranslation} from '../../hooks/useTranslation';
import s from './CategoryFilter.module.css';

interface CategoryFilterProps {
  selected: string | null;
  onSelect: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selected,
  onSelect,
}) => {
  const {t} = useTranslation();

  const categories = [
    t('categories.all'),
    t('categories.desserts'),
    t('categories.mainDishes'),
    t('categories.salads'),
    t('categories.soups'),
    t('categories.beverages'),
    t('categories.snacks'),
    t('categories.baking'),
    t('categories.meats'),
    t('categories.preserves'),
    t('categories.sides'),
    t('categories.pizza'),
  ];
  return (
    <section className={s.categoriesSection}>
      <h2 className={s.sectionTitle}>{t('categories.title')}</h2>
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
