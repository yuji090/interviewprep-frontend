import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import { AuthContext } from '../context/AuthContext';
import './css/GlobalChat.css'; 

const GlobalChat = () => {
  const { token, userEmail } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const clientRef = useRef(null);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    fetch('http://localhost:8080/api/chat/messages', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Fetch failed');
        return res.json();
      })
      .then((data) => setMessages(data || []))
      .catch((err) => console.error('Error loading messages:', err));

    const client = new Client({
      brokerURL: `ws://localhost:8080/ws?token=${token}`,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('🟢 Connected to WebSocket');
        client.subscribe('/topic/public', (msg) => {
          const parsed = JSON.parse(msg.body);
          setMessages((prev) => [...prev, parsed]);
          scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
        });
      },
      onStompError: (frame) => {
        console.error('❌ STOMP Error:', frame);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [token, userEmail, navigate]);

  const send = () => {
    const trimmed = input.trim();
    if (!trimmed || !clientRef.current?.connected) return;

    clientRef.current.publish({
      destination: '/app/chat.sendMessage',
      body: trimmed,
    });
    setInput('');
  };

  return (
    <div className="global-chat">
      <div className="menu">
        <div className="back" onClick={() => navigate('/home')}>
          ←
          <img src="https://img.icons8.com/ios-glyphs/30/ffffff/home.png" alt="Go Home" />
        </div>
        <div className="name">Global Chat</div>
        <div className="members">Live discussion with peers</div>
      </div>

      <ul className="chat">
        {messages.map((m, idx) => (
          <li key={idx} className={m.senderName === userEmail ? 'self' : 'other'}>
            <div className="msg">
              <div className="user">{m.senderName}</div>
              <p>{m.content}</p>
              <time>{new Date(m.timestamp).toLocaleTimeString()}</time>
            </div>
          </li>
        ))}
        <div ref={scrollRef} />
      </ul>

      <div className="typezone">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Type your message..."
        />
        <div className="emojis" title="Emojis (not functional)" />
        <button className="send" onClick={send} title="Send" />
      </div>
    </div>
  );
};

export default GlobalChat;
