import React, {useState, useEffect, useCallback, useRef} from 'react';
import {supabase} from '../../lib/supabaseClient';
import type {User} from '@supabase/supabase-js';
import type {Recipe} from '../../types';
import ModalWrapper from '../ModalWrapper';
import styles from './RecipeModal.module.css';
import FontSizeChanger from '../FontSizeChanger';

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onRecipeAdded?: () => void;
  onRecipeUpdated?: () => void;
  recipeToEdit?: Recipe | null;
}

const LOCAL_FONT_SIZE_KEY = 'recipeModalFontSize';
const LOCAL_STORAGE_KEY = 'unsavedRecipeForm';

const categories = [
  'Торти',
  'Десерти',
  'Основні',
  'Супи',
  'Гарніри',
  'Салати',
  "М'ясне",
  'Закрутки',
  'Закуски',
];

function RecipeModal({
  isOpen,
  onClose,
  user,
  onRecipeAdded,
  onRecipeUpdated,
  recipeToEdit,
}: RecipeModalProps) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    ingredients: '',
    instructions: '',
    cookingTime: '',
    category: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(() => {
    const stored = localStorage.getItem(LOCAL_FONT_SIZE_KEY);
    return stored ? parseInt(stored, 10) || 16 : 16;
  });

  const isEditMode = !!recipeToEdit;
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const {id, value} = e.target;
    setForm((prev) => ({...prev, [id]: value}));
  };

  const clearForm = () => {
    setForm({
      title: '',
      description: '',
      ingredients: '',
      instructions: '',
      cookingTime: '',
      category: '',
    });
  };

  const debounceSave = useCallback(
    (timeout = 500) => {
      if (isEditMode) return;
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify({...form, timeStamp: Date.now()})
        );
      }, timeout);
    },
    [form, isEditMode]
  );
  useEffect(() => {
    if (recipeToEdit) {
      setForm({
        title: recipeToEdit.title || '',
        description: recipeToEdit.description || '',
        ingredients: recipeToEdit.ingredients || '',
        instructions: recipeToEdit.instructions || '',
        cookingTime: recipeToEdit.cooking_time
          ? recipeToEdit.cooking_time.toString()
          : '',
        category: recipeToEdit.category || '',
      });
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } else {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Date.now() - parsed.timeStamp < 86400000) {
            setForm({
              title: parsed.title || '',
              description: parsed.description || '',
              ingredients: parsed.ingredients || '',
              instructions: parsed.instructions || '',
              cookingTime: parsed.cookingTime || '',
              category: parsed.category || '',
            });
          }
        } catch (e) {
          console.error('Error parsing saved recipe form:', e);
        }
      }
    }
  }, [recipeToEdit]);

  useEffect(() => {
    debounceSave();
  }, [form, debounceSave]);

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
        ...form,
        cooking_time: form.cookingTime ? parseInt(form.cookingTime) : null,
        user_id: currentUser.id,
      };

      const table = supabase.from('recipes');
      let supabaseError;

      if (isEditMode && recipeToEdit) {
        ({error: supabaseError} = await table
          .update(recipeData)
          .eq('id', recipeToEdit.id)
          .select());
        if (!supabaseError && onRecipeUpdated) onRecipeUpdated();
      } else {
        ({error: supabaseError} = await table.insert([recipeData]).select());
        if (!supabaseError && onRecipeAdded) onRecipeAdded();
      }

      if (supabaseError) throw supabaseError;

      localStorage.removeItem(LOCAL_STORAGE_KEY);
      clearForm();
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
      <FontSizeChanger onFontSizeChange={setFontSize} />

      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.formGroup}>
          <label
            htmlFor="title"
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: `${fontSize > 41 ? '36' : fontSize * 1.5}px`,
              marginBottom: `${fontSize > 44 ? '16px' : '6px'}`,
            }}
          >
            Назва рецепту
          </label>
          <input
            id="title"
            type="text"
            style={{fontSize: `${fontSize > 30 ? '24' : fontSize}px`}}
            value={form.title}
            onChange={handleChange}
            required
            placeholder="Введіть назву рецепту"
          />
        </div>

        {/* Category */}
        <div className={styles.formGroup}>
          <label htmlFor="category" style={{fontSize: `${fontSize}px`}}>
            Категорія
          </label>
          <select
            id="category"
            value={form.category}
            style={{fontSize: `${fontSize > 30 ? '24' : fontSize}px`}}
            onChange={handleChange}
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

        {/* Description */}
        <div className={styles.formGroup}>
          <label htmlFor="description" style={{fontSize: `${fontSize}px`}}>
            Опис
          </label>
          <textarea
            id="description"
            value={form.description}
            style={{fontSize: `${fontSize > 30 ? '24' : fontSize}px`}}
            onChange={handleChange}
            required
            placeholder="Короткий опис рецепту"
            rows={3}
          />
        </div>

        {/* Ingredients */}
        <div className={styles.formGroup}>
          <label htmlFor="ingredients" style={{fontSize: `${fontSize}px`}}>
            Інгредієнти
          </label>
          <textarea
            id="ingredients"
            value={form.ingredients}
            style={{fontSize: `${fontSize > 30 ? '24' : fontSize}px`}}
            onChange={handleChange}
            required
            placeholder="Введіть інгредієнти (по одному на рядок)"
            rows={5}
          />
        </div>

        {/* Instructions */}
        <div className={styles.formGroup}>
          <label htmlFor="instructions" style={{fontSize: `${fontSize}px`}}>
            Інструкції
          </label>
          <textarea
            id="instructions"
            value={form.instructions}
            style={{fontSize: `${fontSize > 30 ? '24' : fontSize}px`}}
            onChange={handleChange}
            required
            placeholder="Введіть інструкції з приготування"
            rows={5}
          />
        </div>

        {/* Cooking Time */}
        <div className={styles.formGroup}>
          <label
            htmlFor="cookingTime"
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: `${fontSize > 44 ? '40' : fontSize * 1.5}px`,
              marginBottom: `${fontSize > 44 ? '16px' : '6px'}`,
            }}
          >
            Час приготування (хвилини)
          </label>
          <input
            id="cookingTime"
            type="number"
            value={form.cookingTime}
            style={{fontSize: `${fontSize > 30 ? '24' : fontSize}px`}}
            onChange={handleChange}
            required
            min="1"
            placeholder="Введіть час приготування в хвилинах"
          />
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button
            type="button"
            onClick={onClose}
            className={styles.cancelBtn}
            disabled={isSubmitting}
            style={{fontSize: `${fontSize > 24 ? '24' : fontSize}px`}}
          >
            Скасувати
          </button>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isSubmitting}
            style={{fontSize: `${fontSize > 30 ? '26' : fontSize}px`}}
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
