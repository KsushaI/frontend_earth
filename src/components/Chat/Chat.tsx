/*import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';

type MessageStatus = 'sent' | 'delivered' | 'error';

interface Message {
  text: string;
  sender: string;
  timestamp: string;
  status: MessageStatus;
}

interface ChatProps {
  username: string;
  onLogout: () => void;
  ws: WebSocket | null;
}

const Chat: React.FC<ChatProps> = ({ username, onLogout, ws }) => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Handle incoming WebSocket messages
  useEffect(() => {
    if (!ws) return;

    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.type === 'status-update') {
        setMessages(prev =>
          prev.map(msg => {
            const isMatch =
              msg.text === data.text &&
              msg.sender === data.sender &&
              Math.abs(new Date(msg.timestamp).getTime() - new Date(data.timestamp).getTime()) < 1000;

            if (isMatch && msg.status === 'sent') {
              console.log('Found match! Updating status to:', data.status);
              return { ...msg, status: data.status };
            }
            return msg;
          })
        );
        return;
      }

      if (data.text) {
        setMessages(prev => [
          ...prev,
          {
            text: data.text,
            sender: data.sender || username,
            timestamp: data.timestamp || new Date().toISOString(),
            status: 'sent',
          },
        ]);
      }
    };

    ws.addEventListener('message', handleMessage);

    return () => {
      ws.removeEventListener('message', handleMessage);
    };
  }, [ws, username]);

  // Scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage = {
      text: inputText,
      sender: username,
      timestamp: new Date().toISOString(),
      status: 'sent' as const,
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(newMessage));
    } else {
      setMessages(prev =>
        prev.map(msg =>
          msg.text === newMessage.text && msg.timestamp === newMessage.timestamp
            ? { ...msg, status: 'error' }
            : msg
        )
      );
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMessageKey = (msg: Message) => {
    return `${msg.sender}-${msg.timestamp}-${msg.text.substring(0, 10)}`;
  };

  return (
    <div className="chat-page">
      <div className="chat-content">
        <div className="chat-header">
          <h1 className="chat-title">Земля Чат</h1>
          <div className="header-controls">
            <div className="connection-status">
              <span
                className={`status-indicator ${ws?.readyState === WebSocket.OPEN ? 'connected' : 'disconnected'}`}
              />
              <span>Подключен как {username}</span>
            </div>
            <button className="logout-btn" onClick={onLogout}>
              Выйти
            </button>
          </div>
        </div>
        <div className="chat-container">
          {messages.map((msg) => (
            <div
              key={getMessageKey(msg)}
              className={`message ${msg.sender === username ? 'sent' : 'received'}`}
              data-status={msg.status}
            >
              <div className="message-header">
                <span className="message-sender">{msg.sender}</span>
                <span className="message-time">{formatTime(new Date(msg.timestamp))}</span>
              </div>
              <div className="message-content">{msg.text}</div>
              {msg.sender === username && (
                <span className={`message-status ${msg.status}`} style={{ marginLeft: '8px' }}>
                  {msg.status === 'sent' && '✓'}
                  {msg.status === 'delivered' && '✓✓'}
                  {msg.status === 'error' && '❌'}
                </span>
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
            placeholder="Введите сообщение..."
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            maxLength={500}
          />
          <button className="send-btn" onClick={handleSend} disabled={!inputText.trim()}>
            Отправить
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;*/
import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';


type MessageStatus = 'sent' | 'delivered' | 'error';

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: string;
  status: MessageStatus;
}

interface ChatProps {
  username: string;
  onLogout: () => void;
  ws: WebSocket | null;
}

const generateId = () => 
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15);

const Chat: React.FC<ChatProps> = ({ username, onLogout, ws }) => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use ref to avoid stale state in WebSocket handlers
  const messagesRef = useRef<Message[]>([]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Handle incoming WebSocket messages
  useEffect(() => {
    if (!ws) return;

    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.type === 'status-update') {
        setMessages(prev => {
          return prev.map(msg => {
            // Match by ID only
            if (msg.id === data.id && msg.status !== data.status) {
              console.log('Found match! Updating status to:', data.status);
              return { ...msg, status: data.status };
            }
            return msg;
          });
        });
        return;
      }

      if (data.text) {
        const newMessage: Message = {
          id: generateId(),
          text: data.text,
          sender: data.sender || username,
          timestamp: data.timestamp || new Date().toISOString(),
          status: 'sent',
        };

        setMessages(prev => [...prev, newMessage]);
      }
    };

    ws.addEventListener('message', handleMessage);

    return () => {
      ws.removeEventListener('message', handleMessage);
    };
  }, [ws, username]);

  // Scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
  
    const id = generateId(); // You already have this
    const newMessage = {
      id,
      text: inputText,
      sender: username,
      timestamp: new Date().toISOString(),
      status: 'sent' as const,
    };
  
    setMessages(prev => [...prev, newMessage]);
    setInputText('');
  
    if (ws && ws.readyState === WebSocket.OPEN) {
      // Send full message including ID
      ws.send(JSON.stringify(newMessage));
    } else {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === newMessage.id ? { ...msg, status: 'error' } : msg
        )
      );
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMessageKey = (msg: Message) => {
    return `${msg.id}-${msg.text.substring(0, 10)}`;
  };

  return (
    <div className="chat-page">
      <div className="chat-content">
        <div className="chat-header">
          <h1 className="chat-title">Земля Чат</h1>
          <div className="header-controls">
            <div className="connection-status">
              <span
                className={`status-indicator ${ws?.readyState === WebSocket.OPEN ? 'connected' : 'disconnected'}`}
              />
              <span>Подключен как {username}</span>
            </div>
            <button className="logout-btn" onClick={onLogout}>
              Выйти
            </button>
          </div>
        </div>
        <div className="chat-container">
          {messages.map((msg) => (
            <div
              key={getMessageKey(msg)}
              className={`message ${msg.sender === username ? 'sent' : 'received'}`}
              data-status={msg.status}
            >
              <div className="message-header">
                <span className="message-sender">{msg.sender}</span>
                <span className="message-time">{formatTime(new Date(msg.timestamp))}</span>
              </div>
              <div className="message-content">{msg.text}</div>
              {msg.sender === username && (
                <span className={`message-status ${msg.status}`} style={{ marginLeft: '8px' }}>
                  {msg.status === 'sent' && '✓'}
                  {msg.status === 'delivered' && '✓✓'}
                  {msg.status === 'error' && '✗'}
                </span>
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
            placeholder="Введите сообщение..."
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            maxLength={500}
          />
          <button className="send-btn" onClick={handleSend} disabled={!inputText.trim()}>
            Отправить
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;

