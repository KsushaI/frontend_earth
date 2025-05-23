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