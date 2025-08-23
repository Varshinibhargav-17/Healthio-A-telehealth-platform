import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

export default function VideoChat({ patientId, providerId, appointmentId }) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const socketRef = useRef();
  
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [localStream, setLocalStream] = useState(null);
  const [callStartTime, setCallStartTime] = useState(null);
  const [callDuration, setCallDuration] = useState('00:00');

  // Format call duration
  useEffect(() => {
    if (providerId && patientId && appointmentId && socketRef.current) {
      socketRef.current.emit("video-call-invite", { providerId, patientId, appointmentId });
    }
  }, [providerId, patientId, appointmentId]);

  useEffect(() => {
    if (!callStartTime) return;
    
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - callStartTime) / 1000);
      const minutes = Math.floor(elapsed / 60);
      const seconds = elapsed % 60;
      setCallDuration(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [callStartTime]);

  useEffect(() => {
    socketRef.current = io('http://localhost:5000');
    socketRef.current.emit('join-room', { appointmentId });
    
    let peerConnection;
    let stream;

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(mediaStream => {
        localVideoRef.current.srcObject = mediaStream;
        stream = mediaStream;
        setLocalStream(mediaStream);
        setConnectionStatus('Connected');
        setCallStartTime(Date.now());

        // Create peer connection
        peerConnection = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });

        // Add local stream tracks to peer connection
        mediaStream.getTracks().forEach(track => {
          peerConnection.addTrack(track, mediaStream);
        });

        const isInitiator = patientId < providerId;
        if (isInitiator) {
          peerConnection.onnegotiationneeded = async () => {
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            socketRef.current.emit('signal', { appointmentId, data: { type: 'offer', offer } });
          };
        }

        // Handle remote stream
        peerConnection.ontrack = event => {
          remoteVideoRef.current.srcObject = event.streams[0];
          setIsConnected(true);
          setConnectionStatus('Call Active');
        };

        // Handle ICE candidates
        peerConnection.onicecandidate = event => {
          if (event.candidate) {
            socketRef.current.emit('signal', {
              appointmentId,
              data: { type: 'candidate', candidate: event.candidate }
            });
          }
        };

        // Listen for signaling messages
        socketRef.current.on('signal', async data => {
          if (data.type === 'offer') {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            socketRef.current.emit('signal', {
              appointmentId,
              data: { type: 'answer', answer }
            });
          } else if (data.type === 'answer') {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
          } else if (data.type === 'candidate') {
            await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
          }
        });
      })
      .catch(error => {
        console.error('Error accessing media devices:', error);
        setConnectionStatus('Connection Failed');
      });

    return () => {
      socketRef.current.disconnect();
      if (peerConnection) peerConnection.close();
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [appointmentId, patientId, providerId]);

  const toggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const endCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    socketRef.current.disconnect();
    setConnectionStatus('Call Ended');
    setCallStartTime(null);
  };

  return (
    <div className="bg-base-100 rounded-lg shadow-lg overflow-hidden max-w-6xl mx-auto" data-theme="corporate">
      {/* Header */}
      <div className="bg-base-200 px-6 py-4 border-b border-base-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-base-content">Telemedicine Consultation</h2>
              <div className="flex items-center gap-4 mt-1">
                <div className={`badge ${
                  connectionStatus === 'Call Active' ? 'badge-success' :
                  connectionStatus === 'Connecting...' ? 'badge-warning' :
                  connectionStatus === 'Connection Failed' ? 'badge-error' :
                  'badge-neutral'
                }`}>
                  {connectionStatus}
                </div>
                {callStartTime && (
                  <span className="text-sm text-base-content/60">
                    Duration: {callDuration}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="text-sm text-base-content/60">
            Appointment ID: {appointmentId}
          </div>
        </div>
      </div>

      {/* Video Container */}
      <div className="p-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Remote Video (Other Participant) */}
          <div className="relative">
            <div className="bg-base-300 rounded-lg overflow-hidden aspect-video">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              {!isConnected && (
                <div className="absolute inset-0 flex items-center justify-center bg-base-300">
                  <div className="text-center">
                    <div className="avatar placeholder mb-4">
                      <div className="bg-neutral text-neutral-content rounded-full w-20">
                        <span className="text-2xl">👤</span>
                      </div>
                    </div>
                    <p className="text-base-content/60">Waiting for other participant...</p>
                  </div>
                </div>
              )}
            </div>
            <div className="absolute top-4 left-4">
              <div className="badge badge-secondary">
                {providerId ? 'Patient' : 'Provider'}
              </div>
            </div>
          </div>

          {/* Local Video (You) */}
          <div className="relative">
            <div className="bg-base-300 rounded-lg overflow-hidden aspect-video">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : ''}`}
              />
              {isVideoOff && (
                <div className="absolute inset-0 flex items-center justify-center bg-base-300">
                  <div className="text-center">
                    <div className="avatar placeholder mb-4">
                      <div className="bg-primary text-primary-content rounded-full w-20">
                        <span className="text-2xl">📷</span>
                      </div>
                    </div>
                    <p className="text-base-content/60">Camera is off</p>
                  </div>
                </div>
              )}
            </div>
            <div className="absolute top-4 left-4">
              <div className="badge badge-primary">
                You ({providerId ? 'Provider' : 'Patient'})
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-4 p-4 bg-base-200 rounded-full">
            {/* Mute Button */}
            <button
              onClick={toggleMute}
              className={`btn btn-circle ${isMuted ? 'btn-error' : 'btn-ghost'}`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              )}
            </button>

            {/* Video Toggle Button */}
            <button
              onClick={toggleVideo}
              className={`btn btn-circle ${isVideoOff ? 'btn-error' : 'btn-ghost'}`}
              title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
            >
              {isVideoOff ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>

            {/* End Call Button */}
            <button
              onClick={endCall}
              className="btn btn-error btn-circle"
              title="End call"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 3l18 18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Connection Info */}
        <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm">
              <p className="font-semibold text-info mb-1">Video Call Guidelines:</p>
              <ul className="list-disc list-inside space-y-1 text-base-content/70">
                <li>Ensure you have a stable internet connection</li>
                <li>Find a quiet, well-lit environment</li>
                <li>Test your audio and video before the consultation</li>
                <li>Keep your camera at eye level for better communication</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}