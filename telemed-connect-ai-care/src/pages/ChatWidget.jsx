import React, { useEffect } from 'react';

const ChatWidget = () => {
  useEffect(() => {
    // Load the Tawk.to script dynamically
    const script = document.createElement('script');
    script.src = 'https://embed.tawk.to/67f6fbd7494f18190b75459b/1ioecfgv2';  // Your Tawk.to script URL
    script.async = true;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');

    // Append the script to the document body
    document.body.appendChild(script);

    // Return a cleanup function to remove the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;  // The widget will be injected into the body dynamically
};

export default ChatWidget;
