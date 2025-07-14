import {useState} from 'react';
import type {Recipe} from '../../types';
import s from './HomePage.module.css';
import PageWrapper from '../PageWrapper';
import RecipeCard from '../RecipeCard';
import SearchBar from '../SearchBar';
import CategoryFilter from '../CategoryFilter';

const HomePage = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch recipes function

  // Handle recipe search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category === selectedCategory ? null : category);
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
        <h2 className={s.sectionTitle}>Рецепти</h2>
        <div className={s.recipesGrid}>
          {recipes.length > 0 ? (
            recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))
          ) : (
            <p className={s.noRecipes}>Рецептів не знайдено</p>
          )}
        </div>
      </section>
    </PageWrapper>
  );
};

export default HomePage;
