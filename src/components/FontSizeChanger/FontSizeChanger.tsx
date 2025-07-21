// FontSizeChanger.tsx
import React, {useState} from 'react';
import styles from './FontSizeChanger.module.css';

interface FontSizeChangerProps {
  onFontSizeChange: (size: number) => void;
}

const LOCAL_FONT_SIZE_KEY = 'recipeModalFontSize';

const FontSizeChanger: React.FC<FontSizeChangerProps> = ({
  onFontSizeChange,
}) => {
  const [fontSize, setFontSize] = useState(() => {
    const stored = localStorage.getItem(LOCAL_FONT_SIZE_KEY);
    return stored ? parseInt(stored, 10) || 16 : 16;
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = Number(e.target.value);
    setFontSize(size);
    localStorage.setItem(LOCAL_FONT_SIZE_KEY, size.toString());
    onFontSizeChange(size);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      setFontSize(val);
      localStorage.setItem(LOCAL_FONT_SIZE_KEY, val.toString());
      onFontSizeChange(val);
    }
  };

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.changeFontSize}
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          fill="#000000"
          width="24px"
          height="24px"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="m22 6-3-4-3 4h2v4h-2l3 4 3-4h-2V6zM9.307 4l-6 16h2.137l1.875-5h6.363l1.875 5h2.137l-6-16H9.307zm-1.239 9L10.5 6.515 12.932 13H8.068z" />
        </svg>
        <div className={styles.changeFontSizeText}>Змінити розмір шрифту</div>
      </button>

      {isOpen && (
        <div className={styles.fontSizeControls}>
          <label>
            <input
              type="range"
              min="10"
              max="48"
              value={fontSize}
              onChange={handleSliderChange}
              className={styles.slider}
            />
            <input
              type="number"
              value={fontSize}
              onChange={handleInputChange}
              className={styles.numberInput}
            />
            <span>px</span>
          </label>
        </div>
      )}
    </div>
  );
};

export default FontSizeChanger;
