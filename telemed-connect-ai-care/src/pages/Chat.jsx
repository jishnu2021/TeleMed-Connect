import React, { useEffect, useState, useRef } from 'react';  // Import useRef
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';  // Ensure axios is installed
import '../style/chat.css';  // Add your custom styles for chat
import Navbar from '../components/Navbar'
const socket = io('http://localhost:5000'); // Your backend server URL

const API_URL = "http://localhost:5000"

const Chat = () => {
  const { appointmentId } = useParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState('');  // Dynamically set user type (patient/doctor)
  const messagesEndRef = useRef(null);  // Ref to scroll to the bottom

  // Fetch the message history when the component mounts
  useEffect(() => {
    // Check if the user is logged in as patient or doctor
    const loggedInUser = localStorage.getItem('telemed-doctor') 
      ? 'doctor' 
      : localStorage.getItem('telemed-patient') 
      ? 'patient'
      : null;

    if (loggedInUser) {
      setUser(loggedInUser); // Set user type based on the key in localStorage
    } else {
      // Redirect to login page if no valid user found
      window.location.href = '/login'; 
    }

    // Fetch message history from the API
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${API_URL}/messages/${appointmentId}`);
        setMessages(response.data);  // Set initial chat history
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    // Listen for new messages from the socket
    socket.on('receive-message', ({ message, sender }) => {
      setMessages((prevMessages) => [...prevMessages, { message, sender }]);  // Add new message to the UI
    });

    return () => {
      socket.off('receive-message');  // Clean up socket listener on unmount
    };
  }, [appointmentId]);

  // Send message to the backend and emit it to the socket
  const sendMessageHandler = async () => {
    if (message.trim()) {
      const newMessage = { appointmentId, sender: user, message };

      try {
        // Save the message to the backend
        await axios.post(`${API_URL}/send-message`, newMessage);

        // Emit the message via socket for live updates
        socket.emit('send-message', newMessage);

        // Update the chat UI with the new message
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        // Clear input field after sending
        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  // Scroll to the bottom every time a new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
    <Navbar/>
    <div className="chat-container">
      <div className="chat-header">
        <h2>{user === 'patient' ? 'Chat with Doctor' : 'Chat with Patient'}</h2>
      </div>

      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <div className="message-header">
              <span className="message-sender">{msg.sender === 'patient' ? 'Patient' : 'Doctor'}</span>
            </div>
            <p className="message-text">{msg.message}</p>
          </div>
        ))}
        {/* Scroll to bottom */}
        <div ref={messagesEndRef} />
      </div>

      <div className="message-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={sendMessageHandler}>Send</button>
      </div>
    </div>
    </>
  );
};

export default Chat;
