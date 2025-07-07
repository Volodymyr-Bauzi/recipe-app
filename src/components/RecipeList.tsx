import {useEffect, useState} from 'react';
import {useSupabaseAuth} from '../hooks/useSupabaseAuth';
import {supabase} from '../lib/supabaseClient';
import Header from './Header';
import Footer from './Footer';
import {Link} from 'react-router-dom';
import {AddRecipeModal} from './AddRecipeModal';
import type {Recipe} from '../types';
import s from './RecipeList.module.css';

const RecipeList = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {user} = useSupabaseAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch recipes function
  const fetchRecipes = async () => {
    let query = supabase
      .from('recipes')
      .select('*')
      .order('created_at', {ascending: false});

    // Add search filter if query exists
    if (searchQuery) {
      query = query.ilike('title', `%${searchQuery}%`);
    }

    // Add category filter if selected
    if (selectedCategory) {
      query = query.eq('category', selectedCategory);
    }

    const {data, error} = await query;

    if (error) {
      console.error('Error fetching recipes:', error);
      return;
    }

    if (data) {
      setRecipes(data);
    }
  };

  // Load recipes when component mounts or when search/category changes
  useEffect(() => {
    fetchRecipes();
  }, [searchQuery, selectedCategory]);

  // Handle recipe search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  return (
    <>
      <div className={s.body}>
        {/* Header - pass the setIsModalOpen function */}
        <Header onAddRecipeClick={() => setIsModalOpen(true)} />

        <div className={s.content}>
          {/* Search Section */}
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

          {/* Footer */}
          <Footer />
        </div>
      </div>

      {/* Recipe Modal */}
      <AddRecipeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={user}
        onRecipeAdded={fetchRecipes}
      />
    </>
  );
};

export default RecipeList;
