import {useTranslation} from '../../hooks/useTranslation';
import s from './CategoryFilter.module.css';

interface CategoryFilterProps {
  selected: string | null;
  onSelect: (category: string, all?: boolean) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selected,
  onSelect,
}) => {
  const {t} = useTranslation();

  const categories = [
    t('categories.mainDishes'),
    t('categories.soups'),
    t('categories.sides'),
    t('categories.meats'),
    t('categories.salads'),
    t('categories.desserts'),
    t('categories.snacks'),
    t('categories.baking'),
    t('categories.beverages'),
    t('categories.preserves'),
    t('categories.pizza'),
  ];
  return (
    <section className={s.categoriesSection}>
      <h2 className={s.sectionTitle}>{t('categories.title')}</h2>
      <ul className={s.categoriesList}>
        <li
          className={`${s.categoryItem} ${selected === 'all' ? s.active : ''}`}
          onClick={() => onSelect('all', true)}
        >
          {t('categories.all')}
        </li>
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
