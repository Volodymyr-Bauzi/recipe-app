import {useState} from 'react';
import type {Recipe} from '../../types';
import s from './HomePage.module.css';
import PageWrapper from '../PageWrapper';
import RecipeCard from '../RecipeCard';
import SearchBar from '../SearchBar';
import CategoryFilter from '../CategoryFilter';
import {useTranslation} from '../../hooks/useTranslation';

const HomePage = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const {t} = useTranslation();

  // Fetch recipes function

  // Handle recipe search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(
      category === selectedCategory
        ? category === 'all'
          ? null
          : category
        : category
    );
  };

  return (
    <PageWrapper
      setRecipes={setRecipes}
      searchQuery={searchQuery}
      selectedCategory={selectedCategory}
    >
      <SearchBar query={searchQuery} onChange={handleSearch} />
      <CategoryFilter
        selected={selectedCategory}
        onSelect={handleCategorySelect}
      />

      <section className={s.recipesSection}>
        <h2 className={s.sectionTitle}>{t('recipe.title')}</h2>
        <div className={s.recipesGrid}>
          {recipes.length > 0 ? (
            recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))
          ) : (
            <p className={s.noRecipes}>{t('recipe.noResults')}</p>
          )}
        </div>
      </section>
    </PageWrapper>
  );
};

export default HomePage;
