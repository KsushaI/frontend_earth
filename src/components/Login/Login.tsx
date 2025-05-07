/*import React, { useState } from 'react';
import './Login.css';

interface LoginProps {
  onLogin: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username.trim());
    }
  };

  return (
    <div className="container">
     
      <div className="column left-col">
        <div className="half first-half">
          <img src="/earth.svg" alt="Earth" className="column-img" />
        </div>
        <div className="half second-half">
          <img src="/satelite_b.svg" alt="Satellite B" className="column-img" />
        </div>
      </div>

      
      <div className="column center-col">
        <div className="half first-half">
          <div className="form-wrapper">
            <h1 className="title">Вход в систему</h1>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Введите имя пользователя" 
              className="input-field"
            />
          </div>
        </div>
        <div className="half second-half" onClick={handleSubmit}>
          <button className="login-btn"><span>Войти</span></button>
        </div>
      </div>

      
      <div className="column right-col">
        <div className="half first-half">
          <img src="/satelite_w.svg" alt="Satellite W" className="column-img" />
        </div>
        <div className="half second-half">
          <img src="/mars.svg" alt="Mars" className="column-img" />
        </div>
      </div>
    </div>
  );
}

export default Login;*//*
import React, { useState } from 'react';
import './Login.css';

interface LoginProps {
  onLogin: (username: string, isEarth: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState(
    localStorage.getItem('chat_username') || ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isEarth = new URLSearchParams(window.location.search).get('planet') === 'earth';
    
    if (username.trim()) {
      // Сохраняем в LocalStorage
      localStorage.setItem('chat_username', username.trim());
      localStorage.setItem('chat_isEarth', String(isEarth));
      onLogin(username.trim(), isEarth);
    }
  };

  return (
    <div className="container">
      <div className="column left-col">
        <div className="half first-half">
          <img src="/earth.svg" alt="Earth" className="column-img" />
        </div>
        <div className="half second-half">
          <img src="/satelite_b.svg" alt="Satellite B" className="column-img" />
        </div>
      </div>

      <div className="column center-col">
        <div className="half first-half">
          <div className="form-wrapper">
            <h1 className="title">Вход в систему</h1>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Введите имя пользователя"
              className="input-field"
            />
          </div>
        </div>
        <div className="half second-half" onClick={handleSubmit}>
          <button className="login-btn"><span>Войти</span></button>
        </div>
      </div>

      <div className="column right-col">
        <div className="half first-half">
          <img src="/satelite_w.svg" alt="Satellite W" className="column-img" />
        </div>
        <div className="half second-half">
          <img src="/mars.svg" alt="Mars" className="column-img" />
        </div>
      </div>
    </div>
  );
};

export default Login;*//*
import React, { useState } from 'react';
import './Login.css';

interface LoginProps {
  onLogin: (username: string, isEarth: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState(
    localStorage.getItem('chat_username') || ''
  );
  const [selectedPlanet, setSelectedPlanet] = useState<'earth' | 'mars'>(
    new URLSearchParams(window.location.search).get('planet') === 'mars' ? 'mars' : 'earth'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isEarth = selectedPlanet === 'earth';
    
    if (username.trim()) {
      localStorage.setItem('chat_username', username.trim());
      localStorage.setItem('chat_isEarth', String(isEarth));
      onLogin(username.trim(), isEarth);
    }
  };

  const handlePlanetChange = (planet: 'earth' | 'mars') => {
    setSelectedPlanet(planet);
    // Обновляем URL без перезагрузки страницы
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('planet', planet);
    window.history.pushState({}, '', newUrl.toString());
  };

  return (
    <div className="container">
      <div className="column left-col">
        <div className="half first-half">
          <img src="/earth.svg" alt="Earth" className="column-img" />
        </div>
        <div className="half second-half">
          <img src="/satelite_b.svg" alt="Satellite B" className="column-img" />
        </div>
      </div>

      <div className="column center-col">
        <div className="half first-half">
          <div className="form-wrapper">
            <h1 className="title">Вход в систему</h1>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Введите имя пользователя"
              className="input-field"
            />
          </div>
        </div>
        <div className="half second-half" onClick={handleSubmit}>
          <button className="login-btn"><span>Войти</span></button>
        </div>
      </div>

      <div className="column right-col">
        <div className="half first-half">
          <img src="/satelite_w.svg" alt="Satellite W" className="column-img" />
        </div>
        <div className="half second-half">
          <img src="/mars.svg" alt="Mars" className="column-img" />
        </div>
      </div>
    </div>
  );
};

export default Login;*//*
import React, { useState } from 'react';
import './Login.css';

interface LoginProps {
  onLogin: (username: string, isEarth: boolean) => void;
  defaultPlanet: 'earth' | 'mars';
}

const Login: React.FC<LoginProps> = ({ onLogin, defaultPlanet }) => {
  const [username, setUsername] = useState(
    localStorage.getItem('chat_username') || ''
  );
  const [selectedPlanet, setSelectedPlanet] = useState<'earth' | 'mars'>(defaultPlanet);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isEarth = selectedPlanet === 'earth';
    
    if (username.trim()) {
      onLogin(username.trim(), isEarth);
    }
  };

  const handlePlanetChange = (planet: 'earth' | 'mars') => {
    setSelectedPlanet(planet);
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('planet', planet);
    window.history.pushState({}, '', newUrl.toString());
  };

  return (
    <div className="container">
      <div className="column left-col">
        <div className="half first-half">
          <img 
            src="/earth.svg" 
            alt="Earth" 
            className={`column-img ${selectedPlanet === 'earth' ? 'active' : ''}`}
            onClick={() => handlePlanetChange('earth')}
          />
        </div>
        <div className="half second-half">
          <img 
            src="/satelite_b.svg" 
            alt="Satellite B" 
            className="column-img" 
          />
        </div>
      </div>

      <div className="column center-col">
        <div className="half first-half">
          <div className="form-wrapper">
            <h1 className="title">Вход в систему</h1>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Введите имя пользователя"
              className="input-field"
            />
          </div>
        </div>
        <div className="half second-half" onClick={handleSubmit}>
          <button className="login-btn"><span>Войти</span></button>
        </div>
      </div>

      <div className="column right-col">
        <div className="half first-half">
          <img 
            src="/satelite_w.svg" 
            alt="Satellite W" 
            className="column-img" 
          />
        </div>
        <div className="half second-half">
          <img 
            src="/mars.svg" 
            alt="Mars" 
            className={`column-img ${selectedPlanet === 'mars' ? 'active' : ''}`}
            onClick={() => handlePlanetChange('mars')}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;*/
import React, { useState } from 'react';
import './Login.css';

interface LoginProps {
  onLogin: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState(
    localStorage.getItem('chat_username') || ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      alert('Введите имя пользователя');
      return;
    }

    // Save to localStorage and proceed
    localStorage.setItem('chat_username', trimmedUsername);
    onLogin(trimmedUsername);
  };

  return (
    <div className="container">
      {/* Left Column - Earth */}
      <div className="column left-col">
        <div className="half first-half">
          <img src="/earth.svg" alt="Earth" className="column-img" />
        </div>
        <div className="half second-half">
          <img src="/satelite_b.svg" alt="Satellite B" className="column-img" />
        </div>
      </div>

      {/* Center Column - Login Form */}
      <div className="column center-col">
        <div className="half first-half">
          <div className="form-wrapper">
            <h1 className="title">Вход в систему</h1>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Введите имя пользователя"
              className="input-field"
            />
          </div>
        </div>
        <div className="half second-half" onClick={handleSubmit}>
          <button className="login-btn">
            <span>Войти</span>
          </button>
        </div>
      </div>

      {/* Right Column - Placeholder */}
      <div className="column right-col">
        <div className="half first-half">
          <img src="/satelite_w.svg" alt="Satellite W" className="column-img" />
        </div>
        <div className="half second-half">
          <img src="/mars.svg" alt="Mars" className="column-img" />
        </div>
      </div>
    </div>
  );
};

export default Login;