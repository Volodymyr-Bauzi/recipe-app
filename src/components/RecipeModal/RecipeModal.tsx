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

function RecipeModal({
  isOpen,
  onClose,
  user,
  onRecipeAdded,
  onRecipeUpdated,
  recipeToEdit,
}: RecipeModalProps) {
  const LOCAL_STORAGE_KEY = 'unsavedRecipeForm';
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(() => {
    const stored = localStorage.getItem(LOCAL_FONT_SIZE_KEY);
    return stored ? parseInt(stored, 10) || 16 : 16;
  });

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

  const isEditMode = !!recipeToEdit;

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const debounceSave = useCallback(
    (timeout = 500) => {
      const saveToLocalStorage = () => {
        const formData = {
          title,
          description,
          ingredients,
          instructions,
          cookingTime,
          category,
          timeStamp: Date.now(),
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
      };
      // Clear any existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      // Set a new timeout
      saveTimeoutRef.current = setTimeout(saveToLocalStorage, timeout);
    },
    [title, description, ingredients, instructions, cookingTime, category]
  );
  useEffect(() => {
    if (!isEditMode) {
      const savedForm = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedForm) {
        try {
          const parsedForm = JSON.parse(savedForm);

          const isRecent =
            Date.now() - parsedForm.timeStamp < 24 * 60 * 60 * 1000; // 24 hours
          if (isRecent) {
            setTitle(parsedForm.title || '');
            setDescription(parsedForm.description || '');
            setIngredients(parsedForm.ingredients || '');
            setInstructions(parsedForm.instructions || '');
            setCookingTime(parsedForm.cookingTime || '');
            setCategory(parsedForm.category || '');
          }
        } catch (error) {
          console.error('Error parsing saved form:', error);
        }
      }
    }
  }, [isEditMode]);

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
      localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear saved form when editing
    }
  }, [recipeToEdit]);

  useEffect(() => {
    if (!isEditMode) {
      debounceSave();
    }
  }, [
    title,
    description,
    ingredients,
    instructions,
    cookingTime,
    category,
    debounceSave,
    isEditMode,
  ]);

  const clearLocalStorage = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

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
      clearLocalStorage();
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
      <FontSizeChanger onFontSizeChange={(size) => setFontSize(size)} />
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.formGroup}>
          <label
            htmlFor="title"
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: `${fontSize > 44 ? '36' : fontSize * 1.5}px`,
              marginBottom: `${fontSize > 44 ? '16px' : '6px'}`,
            }}
          >
            Назва рецепту
          </label>
          <input
            id="title"
            type="text"
            style={{fontSize: `${fontSize > 30 ? '24' : fontSize}px`}}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Введіть назву рецепту"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="category" style={{fontSize: `${fontSize}px`}}>
            Категорія
          </label>
          <select
            id="category"
            value={category}
            style={{fontSize: `${fontSize > 30 ? '24' : fontSize}px`}}
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
          <label htmlFor="description" style={{fontSize: `${fontSize}px`}}>
            Опис
          </label>
          <textarea
            id="description"
            value={description}
            style={{fontSize: `${fontSize > 30 ? '24' : fontSize}px`}}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Короткий опис рецепту"
            rows={3}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="ingredients" style={{fontSize: `${fontSize}px`}}>
            Інгредієнти
          </label>
          <textarea
            id="ingredients"
            value={ingredients}
            style={{fontSize: `${fontSize > 30 ? '24' : fontSize}px`}}
            onChange={(e) => setIngredients(e.target.value)}
            required
            placeholder="Введіть інгредієнти (по одному на рядок)"
            rows={5}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="instructions" style={{fontSize: `${fontSize}px`}}>
            Інструкції
          </label>
          <textarea
            id="instructions"
            value={instructions}
            style={{fontSize: `${fontSize > 30 ? '24' : fontSize}px`}}
            onChange={(e) => setInstructions(e.target.value)}
            required
            placeholder="Введіть інструкції з приготування"
            rows={5}
          />
        </div>

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
            value={cookingTime}
            style={{fontSize: `${fontSize > 30 ? '24' : fontSize}px`}}
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
