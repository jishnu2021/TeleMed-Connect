import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import '../style/chat.css';
import Navbar from '../components/Navbar';

// For deployment on Render
const API_URL = process.env.NODE_ENV === 'production' 
  ? "https://telemed-connect-backend.onrender.com"  // Replace with your actual Render URL
  : "http://localhost:5000";

// Create socket connection outside component to prevent multiple connections
const socket = io(API_URL, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
  transports: ['websocket']
});

const Chat = () => {
  const { appointmentId } = useParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState('');
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [typingStatus, setTypingStatus] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  // Set up socket connection and event listeners
  useEffect(() => {
    // Check user type
    const loggedInUser = localStorage.getItem('telemed-doctor') 
      ? 'doctor' 
      : localStorage.getItem('telemed-patient') 
      ? 'patient'
      : null;

    if (!loggedInUser) {
      window.location.href = '/login';
      return;
    }
    
    setUser(loggedInUser);
    
    // Connect to socket
    if (!socket.connected) {
      socket.connect();
    }
    
    // Join the specific room for this appointment
    socket.emit('join', appointmentId);
    
    // Socket event listeners for connection status
    socket.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
    });
    
    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });
    
    // Handle typing indicators
    socket.on('typing', ({ sender, appointmentId: typingAppointmentId }) => {
      if (typingAppointmentId === appointmentId && sender !== loggedInUser) {
        setTypingUser(sender === 'patient' ? 'Patient' : 'Doctor');
        setTypingStatus(true);
        
        // Clear typing indicator after 2 seconds of inactivity
        setTimeout(() => {
          setTypingStatus(false);
        }, 2000);
      }
    });
    
    // Listen for real-time messages specific to this appointment
    socket.on('receive-message', (newMsg) => {
      if (newMsg.appointmentId === appointmentId) {
        setMessages(prevMessages => [...prevMessages, newMsg]);
      }
    });
    
    // Fetch message history
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/messages/${appointmentId}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMessages();
    
    // Clean up socket listeners on unmount
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('receive-message');
      socket.off('typing');
      socket.emit('leave-room', appointmentId);
    };
  }, [appointmentId]);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Focus input field when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  // Send message handler
  const sendMessageHandler = async (e) => {
    e?.preventDefault(); // Handle form submission
    
    if (message.trim()) {
      const newMessage = { 
        appointmentId, 
        sender: user, 
        message: message.trim(),
        timestamp: new Date().toISOString()
      };
      
      try {
        // Optimistically update UI
        setMessages(prevMessages => [...prevMessages, newMessage]);
        setMessage('');
        
        // Save message to backend
        await axios.post(`${API_URL}/send-message`, newMessage);
        
        // Emit message via socket
        socket.emit('send-message', newMessage);
      } catch (error) {
        console.error('Error sending message:', error);
        // You could add error handling here, like showing an error toast
      }
    }
  };
  
  // Handle typing indicator
  const handleTyping = () => {
    socket.emit('typing', { sender: user, appointmentId });
  };
  
  // Format timestamp to readable time
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <Navbar />
      <div className="chat-container">
        <div className="chat-header">
          <h2>{user === 'patient' ? 'Chat with Doctor' : 'Chat with Patient'}</h2>
          <div className="connection-status">
            <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}></span>
            <span>{isConnected ? 'Connected' : 'Reconnecting...'}</span>
          </div>
        </div>

        <div className="messages-container">
          {isLoading ? (
            <div className="loading-messages">
              <div className="loader"></div>
              <p>Loading conversation...</p>
            </div>
          ) : messages.length > 0 ? (
            <div className="messages">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`message ${msg.sender === user ? 'outgoing' : 'incoming'}`}
                >
                  <div className="message-content">
                    <div className="message-header">
                      <span className="message-sender">
                        {msg.sender === 'patient' ? 'Patient' : 'Doctor'}
                      </span>
                      {msg.timestamp && (
                        <span className="message-time">{formatTime(msg.timestamp)}</span>
                      )}
                    </div>
                    <p className="message-text">{msg.message}</p>
                  </div>
                </div>
              ))}
              {typingStatus && (
                <div className="typing-indicator">
                  <span>{typingUser} is typing</span>
                  <span className="dots">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="no-messages">
              <p>No messages yet. Start the conversation!</p>
            </div>
          )}
        </div>

        <form className="message-input-form" onSubmit={sendMessageHandler}>
          <div className="message-input">
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyUp={handleTyping}
              placeholder="Type a message"
              disabled={!isConnected}
            />
            <button 
              type="submit" 
              disabled={!message.trim() || !isConnected}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Chat;