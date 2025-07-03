import s from './App.module.css';
import Footer from './components/Footer';
import Header from './components/Header';
function App() {
  return (
    <>
      <div className={s.body}>
        {/* Header */}
        <Header />

        <div className={s.content}>
          {/* Search Section */}
          <section className={s.searchSection}>
            <input
              type="text"
              placeholder="Шукати рецепт..."
              className={s.searchInput}
            />
          </section>

          {/* Categories Section */}
          <section className={s.categoriesSection}>
            <h2 className={s.sectionTitle}>Категорії</h2>
            <ul className={s.categoriesList}>
              <li className={s.categoryItem}>Сніданок</li>
              <li className={s.categoryItem}>Обід</li>
              <li className={s.categoryItem}>Вечеря</li>
              <li className={s.categoryItem}>Десерти</li>
            </ul>
          </section>

          {/* Recipes Section */}
          <section className={s.recipesSection}>
            <h2 className={s.sectionTitle}>Рецепти</h2>
            <div className={s.recipesGrid}>{/* Recipes */}</div>
          </section>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </>
  );
}

export default App;
