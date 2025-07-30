import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import RecipePage from './components/RecipePage/RecipePage';
import {TranslationProvider} from './contexts/TranslationContext';

function App() {
  return (
    <TranslationProvider locale="ukr">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/recipe/:id" element={<RecipePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </TranslationProvider>
  );
}

export default App;
