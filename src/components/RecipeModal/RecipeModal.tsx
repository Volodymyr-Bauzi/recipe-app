import React, {useState, useEffect, useCallback, useRef} from 'react';
import {supabase} from '../../lib/supabaseClient';
import type {User} from '@supabase/supabase-js';
import type {Recipe} from '../../types';
import ModalWrapper from '../ModalWrapper';
import styles from './RecipeModal.module.css';
import FontSizeChanger from '../FontSizeChanger';
import {useTranslation} from '../../hooks/useTranslation';

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
    cooking_time: '',
    category: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(() => {
    const stored = localStorage.getItem(LOCAL_FONT_SIZE_KEY);
    return stored ? parseInt(stored, 10) || 16 : 16;
  });

  const {t} = useTranslation();

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
      cooking_time: '',
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
        cooking_time: recipeToEdit.cooking_time
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
              cooking_time: parsed.cooking_time || '',
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
        cooking_time: form.cooking_time ? parseInt(form.cooking_time) : null,
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
      title={isEditMode ? t('recipe.edit') : t('recipe.add')}
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
            {t('recipe.form.title.label')}
          </label>
          <input
            id="title"
            type="text"
            style={{fontSize: `${fontSize > 30 ? '24' : fontSize}px`}}
            value={form.title}
            onChange={handleChange}
            required
            placeholder={t('recipe.form.title.placeholder')}
          />
        </div>

        {/* Category */}
        <div className={styles.formGroup}>
          <label htmlFor="category" style={{fontSize: `${fontSize}px`}}>
            {t('recipe.form.category.label')}
          </label>
          <select
            id="category"
            value={form.category}
            style={{fontSize: `${fontSize > 30 ? '24' : fontSize}px`}}
            onChange={handleChange}
            required
            className={styles.select}
          >
            <option value="">{t('recipe.form.category.placeholder')}</option>
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
            {t('recipe.form.description.label')}
          </label>
          <textarea
            id="description"
            value={form.description}
            style={{fontSize: `${fontSize > 30 ? '24' : fontSize}px`}}
            onChange={handleChange}
            required
            placeholder={t('recipe.form.description.placeholder')}
            rows={3}
          />
        </div>

        {/* Ingredients */}
        <div className={styles.formGroup}>
          <label htmlFor="ingredients" style={{fontSize: `${fontSize}px`}}>
            {t('recipe.form.ingredients.label')}
          </label>
          <textarea
            id="ingredients"
            value={form.ingredients}
            style={{fontSize: `${fontSize > 30 ? '24' : fontSize}px`}}
            onChange={handleChange}
            required
            placeholder={t('recipe.form.ingredients.placeholder')}
            rows={5}
          />
        </div>

        {/* Instructions */}
        <div className={styles.formGroup}>
          <label htmlFor="instructions" style={{fontSize: `${fontSize}px`}}>
            {t('recipe.form.instructions.label')}
          </label>
          <textarea
            id="instructions"
            value={form.instructions}
            style={{fontSize: `${fontSize > 30 ? '24' : fontSize}px`}}
            onChange={handleChange}
            required
            placeholder={t('recipe.form.instructions.placeholder')}
            rows={5}
          />
        </div>

        {/* Cooking Time */}
        <div className={styles.formGroup}>
          <label
            htmlFor="cooking_time"
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: `${fontSize > 44 ? '40' : fontSize * 1.5}px`,
              marginBottom: `${fontSize > 44 ? '16px' : '6px'}`,
            }}
          >
            {t('recipe.form.cookingTime.label')}
          </label>
          <input
            id="cooking_time"
            type="number"
            value={form.cooking_time}
            style={{fontSize: `${fontSize > 30 ? '24' : fontSize}px`}}
            onChange={handleChange}
            required
            min="1"
            placeholder={t('recipe.form.cookingTime.placeholder')}
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
            {t('recipe.form.button.cancel')}
          </button>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isSubmitting}
            style={{fontSize: `${fontSize > 30 ? '26' : fontSize}px`}}
          >
            {isSubmitting
              ? isEditMode
                ? t('recipe.form.button.updating')
                : t('recipe.form.button.adding')
              : isEditMode
              ? t('recipe.form.button.update')
              : t('recipe.form.button.add')}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}

export default RecipeModal;
