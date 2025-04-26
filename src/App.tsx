import React, { useState } from 'react';
import './App.css';
import Login from './components/Login/Login'
import Chat from './components/Chat/Chat'
function App() {
  const [username, setUsername] = useState<string | null>(null);
  const isEarthConnection = window.location.hostname === 'earth';

  const handleLogin = (username: string) => {
    setUsername(username);
  };

  return (
    <div className="app">
      {!username ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Chat 
        />
      )}
    </div>
  );
}

export default App
/*

import React, { useState } from 'react';
import Login from './components/Login/Login'
import Chat from './components/Chat/Chat'
import './App.css';

const App: React.FC = () => {
  const [username, setUsername] = useState<string | null>(null);
  const isEarthConnection = window.location.hostname === 'earth';

  const handleLogin = (username: string) => {
    setUsername(username);
  };

  const handleLogout = () => {
    setUsername(null);
  };

  return (
    <div className="app">
      {!username ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Chat 
          username={username} 
          isEarthConnection={isEarthConnection} 
        />
      )}
    </div>
  );
};

export default App;*/