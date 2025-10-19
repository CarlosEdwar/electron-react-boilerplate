import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Importe os componentes do PDV (vamos criá-los em seguida)
import PDV from './components/App';
import Hello from './Hello'; // Mantemos o componente original como fallback

function MainApp() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PDV />} />
        <Route path="/hello" element={<Hello />} />
      </Routes>
    </Router>
  );
}

export default MainApp;