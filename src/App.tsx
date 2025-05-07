/*import React, { useState } from 'react';
import Login from './components/Login/Login';
import Chat from './components/Chat/Chat';
import "./App.css"
function App() {
  const [username, setUsername] = useState<string | null>(null);
  const [isEarth, setIsEarth] = useState(false);

  const handleLogin = (username: string, isEarth: boolean) => {
    setUsername(username);
    setIsEarth(isEarth);
  };

  return (
    <div className="app">
      {!username ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Chat username={username} isEarth={isEarth} />
      )}
    </div>
  );
}

export default App;*//*
import React, { useState, useEffect } from 'react';
import Login from './components/Login/Login';
import Chat from './components/Chat/Chat';
import "./App.css"

function App() {
  const [username, setUsername] = useState<string | null>(null);
  //const [isEarth, setIsEarth] = useState(false);
  const isEarth = process.env.REACT_APP_PLANET === 'earth';

  useEffect(() => {
    // Восстанавливаем состояние из localStorage при загрузке
    if (!username) return;
    const wsUrl = `${process.env.REACT_APP_WS_URL}?username=${encodeURIComponent(username)}`;
    const socket = new WebSocket(wsUrl);
    
    const savedUsername = localStorage.getItem('chat_username');
    const savedIsEarth = localStorage.getItem('chat_isEarth');
    if (savedUsername) setUsername(savedUsername);
    //if (savedIsEarth) setIsEarth(savedIsEarth === 'true');
  }, []);

  const handleLogin = (username: string, isEarth: boolean) => {
    setUsername(username);
    //setIsEarth(isEarth);
    localStorage.setItem('chat_username', username);
    localStorage.setItem('chat_isEarth', String(isEarth));
  };

  return (
    <div className="app">
      {!username ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Chat username={username} isEarth={isEarth} />
      )}
    </div>
  );
}

export default App;
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

export default App;*//*
import React, { useState, useEffect } from 'react';
import Login from './components/Login/Login';
import Chat from './components/Chat/Chat';
import "./App.css"

function App() {
  const [username, setUsername] = useState<string | null>(null);
  const isEarth = process.env.REACT_APP_PLANET === 'earth';

  useEffect(() => {
    const savedUsername = localStorage.getItem('chat_username');
    if (savedUsername) setUsername(savedUsername);
  }, []);

  const handleLogin = (username: string, isEarth: boolean) => {
    setUsername(username);
    localStorage.setItem('chat_username', username);
    localStorage.setItem('chat_isEarth', String(isEarth));
  };

  return (
    <div className="app">
      {!username ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Chat username={username} isEarth={isEarth} />
      )}
    </div>
  );
}

export default App;*//*
import React, { useState, useEffect } from 'react';
import Login from './components/Login/Login';
import Chat from './components/Chat/Chat';
import "./App.css";

function App() {
  const [username, setUsername] = useState<string | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const isEarth = true;
  

  useEffect(() => {
    const savedUsername = localStorage.getItem('chat_username');
    if (savedUsername) {
      setUsername(savedUsername);
      connectWebSocket(savedUsername);
    }
    console.log(process.env.REACT_APP_PLANET);

    return () => {
      // Закрываем соединение при размонтировании компонента
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const connectWebSocket = (username: string) => {
    const wsUrl = `ws://${window.location.hostname}:8005?username=${encodeURIComponent(username)}`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log('WebSocket connected');
      setWs(socket);
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
      setWs(null);
    };

    return socket;
  };

  const handleLogin = (username: string) => {
    const socket = connectWebSocket(username);
    setUsername(username);
    setWs(socket);
    localStorage.setItem('chat_username', username);
  };

  const handleLogout = () => {
    if (ws) {
      ws.close(); // Явное закрытие соединения
    }
    localStorage.removeItem('chat_username');
    setUsername(null);
    setWs(null);
  };

  return (
    <div className={`app ${isEarth ? 'earth-theme' : 'mars-theme'}`}>
      {!username ? (
        <Login onLogin={handleLogin} isEarth={isEarth} />
      ) : (
        <Chat 
          username={username} 
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;*/
/*
import React, { useState, useEffect } from 'react';
import Login from './components/Login/Login';
import Chat from './components/Chat/Chat';
import './App.css';

const App: React.FC = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const isEarth = true; // Or dynamically determine this based on env or user selection

  // Restore username from localStorage on load
  useEffect(() => {
    const savedUsername = localStorage.getItem('chat_username');
    if (savedUsername) {
      setUsername(savedUsername);
      connectWebSocket(savedUsername);
    }
  }, []);

  // Setup WebSocket connection
  const connectWebSocket = (username: string): WebSocket => {
    const wsUrl = `ws://${window.location.hostname}:8005?username=${encodeURIComponent(username)}`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log('WebSocket connected');
      setWs(socket);
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
      setWs(null);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return socket;
  };

  // Handle successful login
  const handleLogin = (username: string) => {
    // Close existing WebSocket connection if any
    if (ws) {
      ws.close();
    }

    // Create a new WebSocket connection
    const socket = connectWebSocket(username);
    setUsername(username);
    setWs(socket);
    localStorage.setItem('chat_username', username);
  };

  // Handle logout
  const handleLogout = () => {
    if (ws) {
      ws.close();
    }
    localStorage.removeItem('chat_username');
    setUsername(null);
    setWs(null);
  };

  return (
    <div className={`app ${isEarth ? 'earth-theme' : 'mars-theme'}`}>
      {!username ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Chat username={username} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;*/
/*
import React, { useState, useEffect } from 'react';
import Login from './components/Login/Login';
import Chat from './components/Chat/Chat';
import './App.css';

const App: React.FC = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);

  // Restore username from localStorage on load
  useEffect(() => {
    const savedUsername = localStorage.getItem('chat_username');
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  // Setup WebSocket connection
  const connectWebSocket = (username: string): WebSocket => {
    const wsUrl = `ws://${window.location.hostname}:8005?username=${encodeURIComponent(username)}`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log('WebSocket connected');
      setWs(socket);
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
      setWs(null);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return socket;
  };

  // Handle successful login
  const handleLogin = (username: string) => {
    // Close existing WebSocket connection if any
    if (ws) {
      ws.close();
    }

    // Create a new WebSocket connection
    const socket = connectWebSocket(username);
    setUsername(username);
    setWs(socket);
    localStorage.setItem('chat_username', username);
  };

  // Handle logout
  const handleLogout = () => {
    if (ws) {
      ws.close();
    }
    localStorage.removeItem('chat_username');
    setUsername(null);
    setWs(null);
  };

  return (
    <div>
      {!username ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Chat username={username} onLogout={handleLogout} ws={ws} />
      )}
    </div>
  );
};

export default App;*/
import React, { useState, useEffect } from 'react';
import Login from './components/Login/Login';
import Chat from './components/Chat/Chat';
import './App.css';

const App: React.FC = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const isEarth = true;

  useEffect(() => {
    const savedUsername = localStorage.getItem('chat_username');
    if (savedUsername) {
      setUsername(savedUsername);
      connectWebSocket(savedUsername);
    }
  }, []);

  const connectWebSocket = (username: string): WebSocket => {
    const wsUrl = `ws://${window.location.hostname}:8005?username=${encodeURIComponent(username)}`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log('WebSocket connected');
      setWs(socket);
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
      setWs(null);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return socket;
  };

  const handleLogin = (username: string) => {
    // Close existing WebSocket connection if any
    if (ws) {
      ws.close();
    }

    // Create a new WebSocket connection
    const socket = connectWebSocket(username);
    setUsername(username);
    setWs(socket);
    localStorage.setItem('chat_username', username);
  };

  const handleLogout = () => {
    if (ws) {
      ws.close(); // Ensure WebSocket is closed on logout
    }
    localStorage.removeItem('chat_username');
    setUsername(null);
    setWs(null);
  };

  return (
    <div className={`app ${isEarth ? 'earth-theme' : 'mars-theme'}`}>
      {!username ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Chat username={username} onLogout={handleLogout} ws={ws} />
      )}
    </div>
  );
};

export default App;