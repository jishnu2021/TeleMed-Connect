import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_BACKEND_URL); // Make sure .env has VITE_BACKEND_URL

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
    <div className="p-4 min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold text-center text-medblue mb-6">Video Consultation</h2>

      <div className="flex flex-col md:flex-row gap-4 justify-center">
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="rounded-lg w-full md:w-1/2 shadow-md border"
        />
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="rounded-lg w-full md:w-1/2 shadow-md border"
        />
      </div>

      {!inCall && (
        <p className="text-center text-gray-600 mt-4">Waiting for the other participant to join...</p>
      )}

      <div className="mt-6 flex gap-4 justify-center">
        <button
          onClick={handleEndCall}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          End Call
        </button>
        <button
          onClick={toggleMic}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
        >
          {micOn ? 'Mute Mic' : 'Unmute Mic'}
        </button>
        <button
          onClick={toggleCamera}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
        >
          {cameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
        </button>
      </div>
    </div>
  );
};

export default VideoConsultationForm;
