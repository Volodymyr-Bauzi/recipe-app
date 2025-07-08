import {useState} from 'react';
import {Link} from 'react-router-dom';
import type {Recipe} from '../types';
import s from './RecipeList.module.css';
import PageWrapper from './PageWrapper';

const RecipeList = () => {
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
      <section className={s.searchSection}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Шукати рецепт..."
          className={s.searchInput}
        />
      </section>

      {/* Categories Section */}
      <section className={s.categoriesSection}>
        <h2 className={s.sectionTitle}>Категорії</h2>
        <ul className={s.categoriesList}>
          {['Сніданок', 'Обід', 'Вечеря', 'Десерти'].map((category) => (
            <li
              key={category}
              className={`${s.categoryItem} ${
                selectedCategory === category ? s.active : ''
              }`}
              onClick={() => handleCategorySelect(category)}
            >
              {category}
            </li>
          ))}
        </ul>
      </section>

      {/* Recipes Section */}
      <section className={s.recipesSection}>
        <h2 className={s.sectionTitle}>Рецепти</h2>
        <div className={s.recipesGrid}>
          {recipes.length > 0 ? (
            recipes.map((recipe) => (
              <Link
                to={`/recipe/${recipe.id}`}
                key={recipe.id}
                className={s.recipeCard}
                style={{textDecoration: 'none', color: 'inherit'}}
              >
                <h3 className={s.recipeTitle}>{recipe.title}</h3>
                <p className={s.recipeCategory}>{recipe.category}</p>
                <p className={s.recipeDescription}>{recipe.description}</p>
                {recipe.cooking_time && (
                  <p className={s.recipeTime}>
                    Час приготування: {recipe.cooking_time} хв
                  </p>
                )}
              </Link>
            ))
          ) : (
            <p className={s.noRecipes}>Рецептів не знайдено</p>
          )}
        </div>
      </section>
    </PageWrapper>
  );
};

export default RecipeList;
