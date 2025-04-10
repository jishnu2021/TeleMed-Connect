import React, { useState } from 'react';
import ChatWidget from './ChatWidget';

const ChatButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (window.Tawk_API) {
      if (isChatOpen) {
        window.Tawk_API.hide();  // Hide the chat
      } else {
        window.Tawk_API.show();  // Show the chat
      }
    }
  };

  return (
    <div>
      {/* Chat button */}
      <button onClick={toggleChat} style={styles.chatButton}>
        💬
      </button>

      {/* Include the chat widget only if it's opened */}
      {isChatOpen && <ChatWidget />}
    </div>
  );
};

const styles = {
  chatButton: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    fontSize: '24px',
    padding: '10px',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '50%',
    color: 'white',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
};

export default ChatButton;
