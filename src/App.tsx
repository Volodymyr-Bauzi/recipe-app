import {useEffect, useRef} from 'react';
import s from './App.module.css';

function App() {
  // Specify the HTML element with a generic
  const headerRef = useRef<HTMLTableCellElement | null>(null);

  useEffect(() => {
    const scrollFunction = () => {
      if (headerRef.current) {
        const header = headerRef.current.style;
        if (
          document.body.scrollTop > 50 ||
          document.documentElement.scrollTop > 50
        ) {
          header.fontSize = '8px';
          header.padding = '4px';
        } else {
          header.fontSize = '15px';
          header.padding = '15px';
        }
      }
    };

    window.addEventListener('scroll', scrollFunction);

    return () => {
      window.removeEventListener('scroll', scrollFunction);
    };
  }, []);

  return (
    <>
      <div className={s.body}>
        {/* Attach ref directly to header */}
        <header ref={headerRef} className={s.header}>
          <h1 className={s.headerTitle}>Рецепти</h1>
        </header>
      </div>
    </>
  );
}

export default App;
