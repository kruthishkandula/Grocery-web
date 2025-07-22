import React from 'react';
import { useTheme, ThemeMode } from '../theme/ThemeContext';

const ThemeSelector: React.FC = () => {
  const { theme, setTheme, toggleTheme } = useTheme();

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title">🌱 Grocery Admin Theme</h5>
        <p className="card-text text-muted">Switch between light and dark modes</p>
        
        {/* Theme Toggle Buttons */}
        <div className="mb-3">
          <div className="btn-group" role="group" aria-label="Theme selection">
            <button 
              className={`btn ${theme === 'light' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setTheme('light')}
              type="button"
            >
              ☀️ Light Mode
            </button>
            <button 
              className={`btn ${theme === 'dark' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setTheme('dark')}
              type="button"
            >
              🌙 Dark Mode
            </button>
          </div>
        </div>

        {/* Quick Toggle */}
        <div className="d-flex align-items-center justify-content-between">
          <span className="text-muted">
            Current: <strong className="text-primary">{theme === 'light' ? 'Light' : 'Dark'} Mode</strong>
          </span>
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={toggleTheme}
            type="button"
          >
            🔄 Toggle
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;