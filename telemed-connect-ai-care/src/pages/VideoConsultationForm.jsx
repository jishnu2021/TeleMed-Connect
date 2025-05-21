import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import Navbar from '../components/Navbar';

// Socket connection - make sure this is defined OUTSIDE the component
let socket = null;
let peerConnection = null;

const VideoConsultationForm = () => {
  const { roomId } = useParams();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  // ICE servers configuration - add more STUN/TURN servers for better connectivity
  const iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:19302' }
    ]
  };

  // Create and configure the peer connection
  const createPeerConnection = () => {
    console.log('Creating peer connection...');
    
    // Close any existing connection
    if (peerConnection) {
      peerConnection.close();
      peerConnection = null;
    }
    
    // Create new connection
    peerConnection = new RTCPeerConnection(iceServers);
    
    // Add local tracks to the peer connection
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        console.log('Adding local track to peer connection:', track.kind);
        peerConnection.addTrack(track, localStreamRef.current);
      });
    }
    
    // Handle incoming tracks from remote peer
    peerConnection.ontrack = (event) => {
      console.log('Received remote track:', event.streams[0]);
      if (remoteVideoRef.current && event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
        setConnectionStatus('connected');
      }
    };
    
    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('Sending ICE candidate');
        socket.emit('ice-candidate', {
          candidate: event.candidate,
          roomId: roomId
        });
      }
    };
    
    // Log connection state changes
    peerConnection.oniceconnectionstatechange = () => {
      console.log('ICE Connection State:', peerConnection.iceConnectionState);
      if (peerConnection.iceConnectionState === 'connected' || 
          peerConnection.iceConnectionState === 'completed') {
        setConnectionStatus('connected');
      } else if (peerConnection.iceConnectionState === 'failed' ||
                 peerConnection.iceConnectionState === 'disconnected') {
        setConnectionStatus('failed');
      }
    };
    
    return peerConnection;
  };

  // Initialize media stream
  const setupMediaStream = async () => {
    try {
      console.log('Requesting media devices...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      console.log('Got local media stream');
      localStreamRef.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      return stream;
    } catch (err) {
      console.error('Error accessing media devices:', err);
      alert('Failed to access camera or microphone. Please check permissions.');
      return null;
    }
  };

  // Main setup on component mount
  useEffect(() => {
    if (!roomId) return;
    
    const initializeCall = async () => {
      try {
        // Setup local media first
        await setupMediaStream();
        
        // Connect to signaling server
        // Use dynamic socket URL based on environment
        const socketUrl = import.meta.env.VITE_SOCKET_SERVER || 
          (window.location.protocol === 'https:' 
            ? 'https://telemed-connect.onrender.com'
            : 'http://localhost:5000');
            
        console.log('Connecting to socket server:', socketUrl);
        socket = io(socketUrl, {
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          timeout: 20000
        });
        
        // Handle socket connection events
        socket.on('connect', () => {
          console.log('Connected to signaling server with ID:', socket.id);
          // Join the room after connection is established
          socket.emit('join', roomId);
        });
        
        socket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          setConnectionStatus('error');
        });
        
        // Room events
        socket.on('room-created', () => {
          console.log('You created the room. Waiting for others to join.');
          setConnectionStatus('waiting');
        });
        
        socket.on('room-joined', () => {
          console.log('You joined an existing room.');
        });
        
        socket.on('user-joined', async (userId) => {
          console.log('Another user joined the room:', userId);
          
          // Create peer connection when user joins
          const pc = createPeerConnection();
          
          try {
            // Create and send offer
            console.log('Creating offer...');
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            
            console.log('Sending offer to room');
            socket.emit('offer', {
              offer: pc.localDescription,
              roomId: roomId
            });
          } catch (err) {
            console.error('Error creating offer:', err);
          }
        });
        
        // Handle WebRTC signaling
        socket.on('offer', async (data) => {
          console.log('Received offer:', data.offer);
          
          // Create peer connection if we don't have one
          if (!peerConnection) {
            createPeerConnection();
          }
          
          try {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
            
            console.log('Creating answer...');
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            
            console.log('Sending answer');
            socket.emit('answer', {
              answer: peerConnection.localDescription,
              roomId: roomId
            });
          } catch (err) {
            console.error('Error handling offer:', err);
          }
        });
        
        socket.on('answer', async (data) => {
          console.log('Received answer:', data.answer);
          
          try {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
          } catch (err) {
            console.error('Error handling answer:', err);
          }
        });
        
        socket.on('ice-candidate', async (data) => {
          console.log('Received ICE candidate');
          
          try {
            if (peerConnection) {
              await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
            }
          } catch (err) {
            console.error('Error adding ICE candidate:', err);
          }
        });
        
        socket.on('user-disconnected', () => {
          console.log('The other participant left the call');
          setConnectionStatus('waiting');
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null;
          }
        });
        
      } catch (err) {
        console.error('Error initializing call:', err);
        setConnectionStatus('error');
      }
    };
    
    initializeCall();
    
    // Cleanup on unmount
    return () => {
      console.log('Cleaning up resources...');
      
      if (socket) {
        socket.disconnect();
        socket = null;
      }
      
      if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
      }
      
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [roomId]);

  const handleEndCall = () => {
    if (socket) {
      socket.disconnect();
    }
    
    if (peerConnection) {
      peerConnection.close();
      peerConnection = null;
    }
    
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    // Redirect to dashboard or home
    window.location.href = '/dashboard';
  };

  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      if (audioTracks.length > 0) {
        const enabled = !audioTracks[0].enabled;
        audioTracks[0].enabled = enabled;
        setMicOn(enabled);
      }
    }
  };

  const toggleCamera = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      if (videoTracks.length > 0) {
        const enabled = !videoTracks[0].enabled;
        videoTracks[0].enabled = enabled;
        setCameraOn(enabled);
      }
    }
  };

  // Debug function to help troubleshoot
  const forceReconnect = () => {
    if (socket) {
      socket.disconnect();
      socket.connect();
      socket.emit('join', roomId);
    }
    
    // Try to set up peer connection again
    createPeerConnection();
    
    console.log('Attempting to reconnect...');
  };

  return (
    <>
      <Navbar />
      <div className="p-6 min-h-screen bg-gradient-to-r from-blue-400 via-blue-500 to-blue-500">
        <div className="mb-4 text-white text-center">
          <h2 className="text-2xl font-bold">Video Consultation</h2>
          <p>Status: {connectionStatus === 'connected' ? 'Connected' : 
                       connectionStatus === 'waiting' ? 'Waiting for other participant' : 
                       connectionStatus === 'connecting' ? 'Connecting...' :
                       'Connection issue - Try refreshing'}</p>
        </div>
      
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-6">
          {/* Local video */}
          <div className="relative w-full md:w-1/2 flex justify-center items-center bg-gray-800 rounded-lg min-h-64">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="rounded-lg shadow-xl border-4 border-white w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-3 py-1 text-sm rounded-md">
              You {!cameraOn && '(Camera Off)'}
            </div>
          </div>

          {/* Remote video */}
          <div className="relative w-full md:w-1/2 flex justify-center items-center bg-gray-800 rounded-lg min-h-64">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="rounded-lg shadow-xl border-4 border-white w-full h-full object-cover"
            />
            {connectionStatus !== 'connected' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                <div className="text-white text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-2"></div>
                  <p>{connectionStatus === 'waiting' ? 'Waiting for other participant...' : 
                      connectionStatus === 'connecting' ? 'Connecting...' : 
                      'Connection failed'}</p>
                </div>
              </div>
            )}
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-3 py-1 text-sm rounded-md">
              {connectionStatus === 'connected' ? 'Participant' : 'Waiting for participant...'}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <button
            onClick={handleEndCall}
            className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition duration-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              <path d="M16.707 3.293a1 1 0 010 1.414L15.414 6l1.293 1.293a1 1 0 01-1.414 1.414L14 7.414l-1.293 1.293a1 1 0 11-1.414-1.414L12.586 6l-1.293-1.293a1 1 0 011.414-1.414L14 4.586l1.293-1.293a1 1 0 011.414 0z" />
            </svg>
            End Call
          </button>
          <button
            onClick={toggleMic}
            className={`px-6 py-3 ${micOn ? 'bg-gray-800' : 'bg-red-500'} text-white rounded-full hover:bg-opacity-90 transition duration-200 flex items-center`}
          >
            {micOn ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
                Mute
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                </svg>
                Unmute
              </>
            )}
          </button>
          <button
            onClick={toggleCamera}
            className={`px-6 py-3 ${cameraOn ? 'bg-gray-800' : 'bg-red-500'} text-white rounded-full hover:bg-opacity-90 transition duration-200 flex items-center`}
          >
            {cameraOn ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                  <path d="M14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                </svg>
                Turn Off Camera
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                </svg>
                Turn On Camera
              </>
            )}
          </button>
          
          {connectionStatus !== 'connected' && (
            <button
              onClick={forceReconnect}
              className="px-6 py-3 bg-yellow-600 text-white rounded-full hover:bg-yellow-700 transition duration-200 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Try Reconnect
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default VideoConsultationForm;