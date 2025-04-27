/*import React, { useState, useEffect, KeyboardEvent } from 'react';
import './Chat.css';

// Types
type MessageStatus = 'sent' | 'delivered' | 'error';

interface ChatMessage {
  id: number;
  text: string;
  sender: string;
  timestamp: Date;
  isReceived: boolean;
  status: MessageStatus;
}

// Mock data and services
const MOCK_USERNAME = 'EarthUser123';
const MOCK_PARTNER = 'MarsUser456';

const mockSendMessage = (text: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(Math.random() > 0.2), 1000); // 80% success rate
  });
};

const mockReceiveMessage = (text: string): Promise<ChatMessage> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Date.now(),
        text: `Mock response to: "${text}"`,
        sender: MOCK_PARTNER,
        timestamp: new Date(),
        isReceived: true,
        status: 'delivered'
      });
    }, 1500);
  });
};

const Chat: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize with mock data
  useEffect(() => {
    const initialMessages: ChatMessage[] = [
      {
        id: 1,
        text: 'Welcome to Mars-Earth Chat!',
        sender: 'System',
        timestamp: new Date(),
        isReceived: true,
        status: 'delivered'
      },
      {
        id: 2,
        text: 'Connection established with Mars base',
        sender: 'System',
        timestamp: new Date(Date.now() - 3600000),
        isReceived: true,
        status: 'delivered'
      }
    ];
    setMessages(initialMessages);
  }, []);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now(),
      text: inputText,
      sender: MOCK_USERNAME,
      timestamp: new Date(),
      isReceived: false,
      status: 'sent'
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setIsLoading(true);
    setError(null);

    try {
      const sendSuccess = await mockSendMessage(inputText);

      if (sendSuccess) {
        setMessages(prev => prev.map(msg =>
          msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
        ));

        // Simulate receiving a response
        const response = await mockReceiveMessage(inputText);
        setMessages(prev => [...prev, response]);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (err) {
      setError('Не удалось отправить сообщение. Пожалуйста, попробуйте ещё раз.');
      setMessages(prev => prev.map(msg =>
        msg.id === newMessage.id ? { ...msg, status: 'error' } : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  // In your Chat component (add this to the existing code)
  const handleLogout = () => {
    // TODO: Add WebSocket disconnection logic here when implemented
    console.log("Logging out..."); // For now just log to console
    // For now, just redirect to main page
    window.location.href = "/"; // Or use your router if you're using one
  };


  return (
    <div className="chat-page">
      <div className="chat-content">
        <div className="chat-header">
          <h1 className="chat-title">Земля-Марс Чат</h1>
          <div className="header-controls">
            <div className="connection-status">
              <span className="status-indicator connected" />
              <span>Подключен как {MOCK_USERNAME}</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Выйти
            </button>
          </div>
        </div>

        <div className="chat-container">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.isReceived ? 'received' : 'sent'}`}
            >
              <div className="message-header">
                <span className="message-sender">{message.sender}</span>
                <span className="message-time">{formatTime(message.timestamp)}</span>
              </div>
              <div className="message-content">{message.text}</div>
              {!message.isReceived && (
                <div className="message-status">
                  {message.status === 'sent' && <span>✓</span>}
                  {message.status === 'delivered' && <span>✓✓</span>}
                  {message.status === 'error' && <span className="error">✗</span>}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="message-input-container">
          <input
            type="text"
            className="message-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Введите текст сообщения..."
            disabled={isLoading}
          />
          <button
            className="send-btn"
            onClick={handleSend}
            disabled={!inputText.trim() || isLoading}
          >
            {isLoading ? 'Отправляется...' : 'Отправить'}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};


export default Chat;*//*
import React, { useState, useEffect } from 'react';
import './Chat.css';

interface Message {
  id: number;
  text: string;
  sender: string;
  timestamp: string;
  status?: 'delivered' | 'error';
}

const Chat: React.FC<{ username: string; isEarth: boolean }> = ({ username, isEarth }) => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const wsUrl = isEarth 
      ? 'ws://localhost:8005?username=' + encodeURIComponent(username)
      : 'ws://localhost:8010?username=' + encodeURIComponent(username);

    const socket = new WebSocket(wsUrl);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: data.text,
        sender: data.sender,
        timestamp: new Date().toISOString(),
        status: data.status
      }]);
    };

    setWs(socket);
    return () => socket.close();
  }, [isEarth, username]);

  const handleSend = () => {
    if (!isEarth) {
      alert("На Марсе можно только получать сообщения!");
      return;
    }

    const newMessage = {
      text: inputText,
      sender: username,
      timestamp: new Date().toISOString()
    };

    ws?.send(JSON.stringify(newMessage));
    setInputText('');
  };

  return (
    <div className="chat-page">
      <div className="chat-content">
        <div className="chat-header">
          <h1 className="chat-title">{isEarth ? 'Земля' : 'Марс'} Чат</h1>
          <div className="header-controls">
            <div className="connection-status">
              <span className="status-indicator connected" />
              <span>Подключен как {username}</span>
            </div>
            <button className="logout-btn">Выйти</button>
          </div>
        </div>

        <div className="chat-container">
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.sender === username ? 'sent' : 'received'}`}>
              <div className="message-header">
                <span className="message-sender">{msg.sender}</span>
                <span className="message-time">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="message-content">
                {msg.status === 'error' ? `Ошибка: ${msg.text}` : msg.text}
              </div>
              {msg.status && (
                <div className="message-status">
                  {msg.status === 'delivered' ? '✓✓' : '✗'}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="message-input-container">
          <input
            type="text"
            className="message-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isEarth ? "Введите сообщение..." : "Только чтение"}
            disabled={!isEarth}
          />
          <button
            className="send-btn"
            onClick={handleSend}
            disabled={!inputText.trim() || !isEarth}
          >
            Отправить
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;*//*
import React, { useState, useEffect } from 'react';
import './Chat.css';

// Define strict types for message status
type MessageStatus = 'sent' | 'delivered' | 'error';

interface Message {
  id: number;
  text: string;
  sender: string;
  timestamp: string;
  status?: MessageStatus;
}

const Chat: React.FC<{ username: string; isEarth: boolean }> = ({ username, isEarth }) => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const wsUrl = isEarth 
      ? 'ws://localhost:8005?username=' + encodeURIComponent(username)
      : 'ws://localhost:8010?username=' + encodeURIComponent(username);

    const socket = new WebSocket(wsUrl);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      // Handle status updates (type-safe)
      if (data.type === 'status-update') {
        setMessages(prev => prev.map(msg => {
          if (msg.id === data.id) {
            return {
              ...msg,
              status: data.status === 'error' ? 'error' : 'delivered'
            };
          }
          return msg;
        }));
        return;
      }

      // Create new message with proper typing
      const newMessage: Message = {
        id: data.id || Date.now(),
        text: data.text,
        sender: data.sender,
        timestamp: data.timestamp || new Date().toISOString(),
        status: (data.status === 'error' ? 'error' : 
                data.sender === username ? 'sent' : 'delivered')
      };

      // This is now type-safe
      setMessages(prev => [...prev, newMessage]);
    };

    setWs(socket);
    return () => socket.close();
  }, [isEarth, username]);

  const handleSend = () => {
    if (!isEarth || !inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      text: inputText,
      sender: username,
      timestamp: new Date().toISOString(),
      status: 'sent' // Initial status
    };

    setMessages(prev => [...prev, newMessage]);
    ws?.send(JSON.stringify(newMessage));
    setInputText('');
  };

  return (
    <div className="chat-page">
      <div className="chat-content">
        <div className="chat-header">
          <h1 className="chat-title">{isEarth ? 'Земля' : 'Марс'} Чат</h1>
          <div className="header-controls">
            <div className="connection-status">
              <span className="status-indicator connected" />
              <span>Подключен как {username}</span>
            </div>
            <button 
              className="logout-btn"
              onClick={() => {
                localStorage.removeItem('chat_username');
                window.location.href = '/';
              }}
            >
              Выйти
            </button>
          </div>
        </div>

        <div className="chat-container">
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.sender === username ? 'sent' : 'received'}`}>
              <div className="message-header">
                <span className="message-sender">{msg.sender}</span>
                <span className="message-time">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="message-content">
                {msg.status === 'error' ? `Ошибка: ${msg.text}` : msg.text}
              </div>
              {msg.sender === username && (
                <div className={`message-status ${msg.status}`}>
                  {msg.status === 'sent' && '✓'}
                  {msg.status === 'delivered' && '✓✓'}
                  {msg.status === 'error' && '✗'}
                </div>
              )}
            </div>
          ))}
        </div>

        {isEarth && (
          <div className="message-input-container">
            <input
              type="text"
              className="message-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Введите сообщение..."
            />
            <button
              className="send-btn"
              onClick={handleSend}
              disabled={!inputText.trim()}
            >
              Отправить
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;*//*
import React, { useState, useEffect } from 'react';
import './Chat.css';

type MessageStatus = 'sent' | 'delivered' | 'error';

interface Message {
  id: number;
  text: string;
  sender: string;
  timestamp: string;
  status: MessageStatus;
  isError?: boolean;
}

const Chat: React.FC<{ username: string; isEarth: boolean }> = ({ username, isEarth }) => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const wsUrl = isEarth 
      ? 'ws://localhost:8005?username=' + encodeURIComponent(username)
      : 'ws://localhost:8010?username=' + encodeURIComponent(username);

    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      // Обработка обновления статуса
      if (data.type === 'status-update') {
        setMessages(prev => prev.map(msg => 
          msg.id === data.id ? { ...msg, status: data.status } : msg
        ));
        return;
      }

      // Обработка новых сообщений
      const newMessage: Message = {
        id: data.id || Date.now(),
        text: data.isError ? `Ошибка доставки: ${data.text}` : data.text,
        sender: data.sender,
        timestamp: data.timestamp || new Date().toISOString(),
        status: data.status || 'delivered',
        isError: data.isError
      };

      setMessages(prev => [...prev, newMessage]);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    setWs(socket);
    return () => socket.close();
  }, [isEarth, username]);

  const handleSend = () => {
    if (!isEarth) {
      alert("На Марсе можно только получать сообщения!");
      return;
    }

    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      text: inputText,
      sender: username,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };

    setMessages(prev => [...prev, newMessage]);
    ws?.send(JSON.stringify(newMessage));
    setInputText('');
  };

  const handleLogout = () => {
    localStorage.removeItem('chat_username');
    localStorage.removeItem('chat_isEarth');
    ws?.close();
    window.location.href = '/';
  };

  return (
    <div className="chat-page">
      <div className="chat-content">
        <div className="chat-header">
          <h1 className="chat-title">{isEarth ? 'Земля' : 'Марс'} Чат</h1>
          <div className="header-controls">
            <div className="connection-status">
              <span className="status-indicator connected" />
              <span>Подключен как {username}</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Выйти
            </button>
          </div>
        </div>

        <div className="chat-container">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${
                msg.sender === username 
                  ? 'sent' 
                  : msg.isError ? 'error' : 'received'
              }`}
            >
              <div className="message-header">
                <span className="message-sender">{msg.sender}</span>
                <span className="message-time">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="message-content">
                {msg.text}
              </div>
              {msg.sender === username && (
                <div className={`message-status ${msg.status}`}>
                  {msg.status === 'sent' && '✓'}
                  {msg.status === 'delivered' && '✓✓'}
                  {msg.status === 'error' && '✗'}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="message-input-container">
          <input
            type="text"
            className="message-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isEarth ? "Введите сообщение..." : "Только чтение"}
            disabled={!isEarth}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            className="send-btn"
            onClick={handleSend}
            disabled={!inputText.trim() || !isEarth}
          >
            Отправить
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;*//*
import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';

type MessageStatus = 'sent' | 'delivered' | 'error';

interface Message {
  id: number;
  text: string;
  sender: string;
  timestamp: string;
  status: MessageStatus;
  isError?: boolean;
}

const Chat: React.FC<{ username: string; isEarth: boolean }> = ({ username, isEarth }) => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Получаем текущий хост для WebSocket соединения
  const getWebSocketHost = () => {
    if (process.env.NODE_ENV === 'development') {
      // В development используем текущий хост
      return window.location.hostname;
    }
    // В production можно указать конкретный хост
    return window.location.hostname;
  };

  useEffect(() => {
    const wsHost = getWebSocketHost();
    const wsUrl = isEarth 
      ? `ws://${wsHost}:8005?username=${encodeURIComponent(username)}`
      : `ws://${wsHost}:8010?username=${encodeURIComponent(username)}`;

    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'status-update') {
        setMessages(prev => prev.map(msg => 
          msg.id === data.messageId ? { ...msg, status: data.status } : msg
        ));
        return;
      }

      const newMessage: Message = {
        id: data.id || Date.now(),
        text: data.isError ? `Ошибка доставки: ${data.text}` : data.text,
        sender: data.sender || 'Unknown',
        timestamp: data.timestamp || new Date().toISOString(),
        status: data.status || 'delivered',
        isError: data.isError
      };

      setMessages(prev => [...prev, newMessage]);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    setWs(socket);
    return () => socket.close();
  }, [isEarth, username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!isEarth) {
      alert("На Марсе можно только получать сообщения!");
      return;
    }

    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      text: inputText,
      sender: username,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };

    setMessages(prev => [...prev, newMessage]);
    ws?.send(JSON.stringify(newMessage));
    setInputText('');
  };

  const handleLogout = () => {
    localStorage.removeItem('chat_username');
    localStorage.removeItem('chat_isEarth');
    ws?.close();
    window.location.href = '/';
  };*/
/*
import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';

type MessageStatus = 'sent' | 'delivered' | 'error';

interface Message {
  id: number;
  text: string;
  sender: string;
  timestamp: string;
  status: MessageStatus;
  isError?: boolean;
}

const Chat: React.FC<{ username: string; isEarth: boolean }> = ({ username, isEarth }) => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getWebSocketHost = () => window.location.hostname;

  useEffect(() => {
    const wsHost = getWebSocketHost();
    const wsUrl = isEarth 
      ? `ws://${wsHost}:8005?username=${encodeURIComponent(username)}`
      : `ws://${wsHost}:8010?username=${encodeURIComponent(username)}`;

    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'status-update') {
        setMessages(prev => prev.map(msg => 
          msg.id === data.messageId ? { ...msg, status: data.status } : msg
        ));
        return;
      }

      const newMessage: Message = {
        id: data.id || Date.now(),
        text: data.isError ? `Ошибка доставки: ${data.text}` : data.text,
        sender: data.sender || 'Unknown',
        timestamp: data.timestamp || new Date().toISOString(),
        status: data.status || 'delivered',
        isError: data.isError,
      };

      setMessages(prev => [...prev, newMessage]);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    setWs(socket);
    return () => socket.close();
  }, [isEarth, username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!isEarth) {
      alert("На Марсе можно только получать сообщения!");
      return;
    }

    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      text: inputText,
      sender: username,
      timestamp: new Date().toISOString(),
      status: 'sent',
    };

    setMessages(prev => [...prev, newMessage]);
    ws?.send(JSON.stringify(newMessage));
    setInputText('');
  };

  const handleLogout = () => {
    localStorage.removeItem('chat_username');
    localStorage.removeItem('chat_isEarth');
    ws?.close();
    window.location.href = '/';
  };
*/
import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';

type MessageStatus = 'sent' | 'delivered' | 'error';

interface Message {
  id: number;
  text: string;
  sender: string;
  timestamp: string;
  status: MessageStatus;
  isError?: boolean;
}

interface ChatProps {
  username: string;
  isEarth: boolean;
  onLogout: () => void;
  ws: WebSocket | null;
}

const Chat: React.FC<ChatProps> = ({ username, isEarth, onLogout, ws }) => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wsHost = window.location.hostname;
    const wsUrl = isEarth 
      ? `ws://${wsHost}:8005?username=${encodeURIComponent(username)}`
      : `ws://${wsHost}:8010?username=${encodeURIComponent(username)}`;

    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'status-update') {
        setMessages(prev => prev.map(msg => 
          msg.id === data.messageId ? { ...msg, status: data.status } : msg
        ));
        return;
      }

      const newMessage: Message = {
        id: data.id || Date.now(),
        text: data.isError ? `Ошибка доставки: ${data.text}` : data.text,
        sender: data.sender || 'Unknown',
        timestamp: data.timestamp || new Date().toISOString(),
        status: data.status || 'delivered',
        isError: data.isError
      };

      setMessages(prev => [...prev, newMessage]);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    
    return () => socket.close();
  }, [isEarth, username]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!isEarth) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "Отправка сообщений с Марса запрещена",
        sender: "Система",
        timestamp: new Date().toISOString(),
        status: 'error',
        isError: true
      }]);
      return;
    }

    if (!inputText.trim()) return;

    // Generate unique ID if not exists
  const messageId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  
  const newMessage = {
    id: messageId, // Ensure unique ID
    text: inputText,
    sender: username,
    timestamp: new Date().toISOString()
  };

  // Only send once through WebSocket
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(newMessage));
  }
  
  setInputText('');
  };

  const handleLogout = () => {
    localStorage.removeItem('chat_username');
    localStorage.removeItem('chat_isEarth');
    ws?.close();
    window.location.href = '/';
  };
   const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  return (
    <div className="chat-page">
      <div className="chat-content">
        <div className="chat-header">
          <h1 className="chat-title">{isEarth ? 'Земля-Марс' : 'Марс'} Чат</h1>
          <div className="header-controls">
            <div className="connection-status">
              <span className="status-indicator connected" />
              <span>Подключен как {username}</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Выйти
            </button>
          </div>
        </div>

        <div className="chat-container">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${
                msg.sender === username 
                  ? 'sent' 
                  : msg.isError ? 'error' : 'received'
              }`}
            >
              <div className="message-header">
                <span className="message-sender">{msg.sender}</span>
                <span className="message-time">
                  {formatTime(new Date(msg.timestamp))}
                </span>
              </div>
              <div className="message-content">
                {msg.text}
              </div>
              {msg.sender === username && (
                <div className={`message-status ${msg.status}`}>
                  {msg.status === 'sent' && '✗'}
                  {msg.status === 'delivered' && '✓✓'}
                  {msg.status === 'error' && '✗'}
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="message-input-container">
          <input
            type="text"
            className="message-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isEarth ? "Введите сообщение..." : "Только чтение"}
            disabled={!isEarth}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            className="send-btn"
            onClick={handleSend}
            disabled={!inputText.trim() || !isEarth}
          >
            Отправить
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
