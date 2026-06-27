import { useEffect, useState } from 'react';
import Signuppage from './pages/signup';
import LoginPage from './pages/login';
import HomePage from './pages/home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  return (
    <div className={`app-shell ${darkMode ? 'dark' : 'bright'}`}>
      <Router>
        <Routes>
          <Route path='/' element={<Signuppage darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path='/signup' element={<Signuppage darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path='/login' element={<LoginPage darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path='/home' element={<HomePage darkMode={darkMode} setDarkMode={setDarkMode} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
