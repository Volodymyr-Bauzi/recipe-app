import React, {useState, useEffect} from 'react';
import {supabase} from '../../lib/supabaseClient';
import type {User} from '@supabase/supabase-js';
import type {Recipe} from '../../types';
import ModalWrapper from '../ModalWrapper';
import styles from './RecipeModal.module.css';

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onRecipeAdded?: () => void;
  onRecipeUpdated?: () => void;
  recipeToEdit?: Recipe | null;
}

function RecipeModal({
  isOpen,
  onClose,
  user,
  onRecipeAdded,
  onRecipeUpdated,
  recipeToEdit,
}: RecipeModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const isEditMode = !!recipeToEdit;

  useEffect(() => {
    if (recipeToEdit) {
      setTitle(recipeToEdit.title || '');
      setDescription(recipeToEdit.description || '');
      setIngredients(recipeToEdit.ingredients || '');
      setInstructions(recipeToEdit.instructions || '');
      setCookingTime(
        recipeToEdit.cooking_time ? recipeToEdit.cooking_time.toString() : ''
      );
      setCategory(recipeToEdit.category || '');
    } else {
      setTitle('');
      setDescription('');
      setIngredients('');
      setInstructions('');
      setCookingTime('');
      setCategory('');
    }
  }, [recipeToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('You must be logged in to manage recipes');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const {
        data: {user: currentUser},
      } = await supabase.auth.getUser();

      if (!currentUser) {
        throw new Error('User session expired. Please log in again.');
      }

      const recipeData = {
        title,
        description,
        ingredients,
        instructions,
        cooking_time: cookingTime ? parseInt(cookingTime) : null,
        category,
        user_id: currentUser.id,
      };

      let error;

      if (isEditMode && recipeToEdit) {
        const {error: updateError} = await supabase
          .from('recipes')
          .update(recipeData)
          .eq('id', recipeToEdit.id)
          .select();

        error = updateError;

        if (!error && onRecipeUpdated) {
          onRecipeUpdated();
        }
      } else {
        const {error: insertError} = await supabase
          .from('recipes')
          .insert([recipeData])
          .select();

        error = insertError;

        if (!error && onRecipeAdded) {
          onRecipeAdded();
        }
      }

      if (error) throw error;

      // Clear form and close modal
      setTitle('');
      setDescription('');
      setIngredients('');
      setInstructions('');
      setCookingTime('');
      setCategory('');
      onClose();
    } catch (err) {
      console.error(`Error ${isEditMode ? 'updating' : 'adding'} recipe:`, err);
      setError(
        `Failed to ${isEditMode ? 'update' : 'add'} recipe. Please try again.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalWrapper
      isOpen={isOpen}
      title={isEditMode ? 'Редагувати рецепт' : 'Додати новий рецепт'}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.formGroup}>
          <label htmlFor="title">Назва рецепту</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Введіть назву рецепту"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="category">Категорія</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className={styles.select}
          >
            <option value="">Виберіть категорію</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Опис</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Короткий опис рецепту"
            rows={3}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="ingredients">Інгредієнти</label>
          <textarea
            id="ingredients"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            required
            placeholder="Введіть інгредієнти (по одному на рядок)"
            rows={5}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="instructions">Інструкції</label>
          <textarea
            id="instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            required
            placeholder="Введіть інструкції з приготування"
            rows={5}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="cookingTime">Час приготування (хвилини)</label>
          <input
            id="cookingTime"
            type="number"
            value={cookingTime}
            onChange={(e) => setCookingTime(e.target.value)}
            required
            min="1"
            placeholder="Введіть час приготування в хвилинах"
          />
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={onClose}
            className={styles.cancelBtn}
            disabled={isSubmitting}
          >
            Скасувати
          </button>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? isEditMode
                ? 'Оновлення...'
                : 'Додавання...'
              : isEditMode
              ? 'Оновити рецепт'
              : 'Додати рецепт'}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}

export default RecipeModal;
