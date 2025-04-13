import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import Navbar from '../components/Navbar'
const socket = io(import.meta.env.VITE_BACKEND_URL); // Ensure .env has VITE_BACKEND_URL

const VideoConsultationForm = () => {
  const { roomId } = useParams();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [inCall, setInCall] = useState(false);

  const servers = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  };

  useEffect(() => {
    if (!roomId) return;

    console.log('Joining room:', roomId);

    const initCall = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        localVideoRef.current.srcObject = stream;
        localStreamRef.current = stream;
        setInCall(true);

        socket.emit('join', roomId);

        socket.on('user-joined', async (userId) => {
          console.log('Another user joined:', userId);
          const pc = new RTCPeerConnection(servers);
          peerConnectionRef.current = pc;

          stream.getTracks().forEach((track) => pc.addTrack(track, stream));

          pc.onicecandidate = (event) => {
            if (event.candidate) {
              socket.emit('ice-candidate', { candidate: event.candidate, to: userId });
            }
          };

          pc.ontrack = (event) => {
            remoteVideoRef.current.srcObject = event.streams[0];
          };

          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit('offer', { offer, to: userId });
        });

        socket.on('offer', async ({ offer, from }) => {
          console.log('Received offer from:', from);
          const pc = new RTCPeerConnection(servers);
          peerConnectionRef.current = pc;

          stream.getTracks().forEach((track) => pc.addTrack(track, stream));

          pc.onicecandidate = (event) => {
            if (event.candidate) {
              socket.emit('ice-candidate', { candidate: event.candidate, to: from });
            }
          };

          pc.ontrack = (event) => {
            remoteVideoRef.current.srcObject = event.streams[0];
          };

          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit('answer', { answer, to: from });
        });

        socket.on('answer', async ({ answer }) => {
          console.log('Received answer');
          if (peerConnectionRef.current) {
            await peerConnectionRef.current.setRemoteDescription(
              new RTCSessionDescription(answer)
            );
          }
        });

        socket.on('ice-candidate', async ({ candidate }) => {
          if (peerConnectionRef.current && candidate) {
            await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
          }
        });
      } catch (err) {
        console.error('Failed to access media devices:', err);
        alert('Please allow camera and microphone access.');
      }
    };

    initCall();

    return () => {
      console.log('Cleaning up...');
      if (peerConnectionRef.current) peerConnectionRef.current.close();
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      socket.disconnect();
      setInCall(false);
    };
  }, [roomId]);

  const handleEndCall = () => {
    if (peerConnectionRef.current) peerConnectionRef.current.close();
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    socket.disconnect();
    setInCall(false);
  };

  const toggleMic = () => {
    const audioTrack = localStreamRef.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setMicOn(audioTrack.enabled);
    }
  };

  const toggleCamera = () => {
    const videoTrack = localStreamRef.current?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setCameraOn(videoTrack.enabled);
    }
  };

  return (
    <>
    <Navbar/>
    <div className="p-6 min-h-screen bg-gradient-to-r from-blue-400 via-blue-500 to-blue-500">

      <div className="flex flex-col md:flex-row gap-4 justify-center mb-6">
        <div className="relative w-full md:w-1/2 flex justify-center items-center">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="rounded-lg shadow-xl border-4 border-white"
          />
          <div className="absolute bottom-2 left-2 bg-black text-white px-3 py-1 text-sm rounded-md">
            You
          </div>
        </div>

        <div className="relative w-full md:w-1/2 flex justify-center items-center">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="rounded-lg shadow-xl border-4 border-white"
          />
          <div className="absolute bottom-2 left-2 bg-black text-white px-3 py-1 text-sm rounded-md">
            Participant
          </div>
        </div>
      </div>

      {!inCall && (
        <p className="text-center text-white mt-4 text-lg font-medium">Waiting for the other participant to join...</p>
      )}

      <div className="mt-8 flex gap-4 justify-center">
        <button
          onClick={handleEndCall}
          className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition duration-200"
        >
          End Call
        </button>
        <button
          onClick={toggleMic}
          className="px-6 py-3 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition duration-200"
        >
          {micOn ? 'Mute Mic' : 'Unmute Mic'}
        </button>
        <button
          onClick={toggleCamera}
          className="px-6 py-3 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition duration-200"
        >
          {cameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
        </button>
      </div>
    </div>
    </>
  );
};

export default VideoConsultationForm;
