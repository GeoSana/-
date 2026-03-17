import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import TutorPage from './pages/TutorPage';
import QuizPage from './pages/QuizPage';
import AuthPage from './pages/AuthPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="map" element={<MapPage />} />
          <Route path="tutor" element={<TutorPage />} />
          <Route path="quiz" element={<QuizPage />} />
          <Route path="auth" element={<AuthPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
