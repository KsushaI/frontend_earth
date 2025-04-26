import React, { useState, useEffect, KeyboardEvent } from 'react';
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


export default Chat;