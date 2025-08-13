import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import RecipePage from './components/RecipePage/RecipePage';
import {TranslationProvider} from './contexts/TranslationContext';
import {ThemeProvider} from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <TranslationProvider locale="ukr">
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recipe/:id" element={<RecipePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </TranslationProvider>
    </ThemeProvider>
  );
}

export default App;
