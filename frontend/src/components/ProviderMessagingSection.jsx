import React, { useState, useEffect, useRef } from 'react';
import { io } from "socket.io-client"; // Updated import for socket.io-client


function ProviderMessagingSection({ providerId }) {
  const [msgPatients, setMsgPatients] = useState([]);
  const [msgSelectedPatient, setMsgSelectedPatient] = useState(null);
  const [msgMessages, setMsgMessages] = useState([]);
  const [msgInput, setMsgInput] = useState('');
  const socketRef = useRef();

  // Fetch list of patients with appointments
  useEffect(() => {
    fetch('http://localhost:5000/api/provider/auth/patients', { credentials: 'include' })
      .then(res => res.json())
      .then(setMsgPatients)
      .catch(err => console.error('Error fetching patients:', err));
  }, []);

  useEffect(() => {
    socketRef.current = io("http://localhost:5000");
    // Listen for incoming messages
    socketRef.current.on('receiveMessage', (msg) => {
      setMsgMessages((prev) => [...prev, msg]);
    });
    return () => socketRef.current.disconnect();
  }, []);

  // Start chat and load message history
  const startChat = (patient) => {
    setMsgSelectedPatient(patient);
    const room = [patient._id, providerId].sort().join('-');
    socketRef.current.emit('joinRoom', { patientId: patient._id, providerId });
    fetch(`http://localhost:5000/api/messages/conversation?patientId=${patient._id}&providerId=${providerId}`)
      .then(res => res.json())
      .then(setMsgMessages)
      .catch(err => console.error('Error fetching messages:', err));
  };

  const sendMessage = () => {
    if (!msgInput.trim() || !msgSelectedPatient) return;
    
    const room = [msgSelectedPatient._id, providerId].sort().join('-');
    const messageData = {
      room,
      message: msgInput,
      sender: providerId,
      patientId: msgSelectedPatient._id,
      providerId,
      timestamp: new Date()
    };

    socketRef.current.emit('sendMessage', messageData);
    setMsgInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getPatientInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '?';
  };

  return (
    <div className="flex h-[600px] bg-base-200 rounded-lg shadow-lg overflow-hidden" data-theme="corporate">
      {/* Patients Sidebar */}
      <div className="w-80 bg-base-100 border-r border-base-300">
        {/* Sidebar Header */}
        <div className="p-6 bg-base-200 border-b border-base-300">
          <h2 className="text-xl font-semibold text-base-content">Patient Messages</h2>
        </div>

        {/* Patients List */}
        <div className="overflow-y-auto h-full">
          {msgPatients.length === 0 ? (
            <div className="p-6 text-center text-base-content/60">
              <div className="loading loading-spinner loading-md mb-4"></div>
              <p>Loading patients...</p>
            </div>
          ) : (
            msgPatients.map((patient) => (
              <div
                key={patient._id}
                onClick={() => startChat(patient)}
                className={`p-4 border-b border-base-200 cursor-pointer transition-all duration-200 hover:bg-base-200 ${
                  msgSelectedPatient?._id === patient._id 
                    ? 'bg-primary/10 border-r-4 border-r-primary' 
                    : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="avatar placeholder">
                    <div className="bg-neutral text-neutral-content rounded-full w-10">
                      <span className="text-sm font-medium">
                        {getPatientInitials(patient.name || patient.firstName + ' ' + patient.lastName)}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-base-content truncate">
                      {patient.name || `${patient.firstName} ${patient.lastName}`}
                    </h3>
                    <p className="text-sm text-base-content/60 truncate">
                      {patient.email}
                    </p>
                  </div>
                  <div className="badge badge-outline badge-sm">
                    Active
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {msgSelectedPatient ? (
          <>
            {/* Chat Header */}
            <div className="p-6 bg-base-100 border-b border-base-300">
              <div className="flex items-center gap-3">
                <div className="avatar placeholder">
                  <div className="bg-primary text-primary-content rounded-full w-12">
                    <span className="text-lg font-medium">
                      {getPatientInitials(msgSelectedPatient.name || msgSelectedPatient.firstName + ' ' + msgSelectedPatient.lastName)}
                    </span>
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-base-content">
                    {msgSelectedPatient.name || `${msgSelectedPatient.firstName} ${msgSelectedPatient.lastName}`}
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="badge badge-success badge-sm">Online</div>
                    <span className="text-sm text-base-content/60">{msgSelectedPatient.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 p-6 overflow-y-auto bg-base-200 space-y-4">
              {msgMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-base-content/60">
                    <div className="text-6xl mb-4">💬</div>
                    <p className="text-lg">No messages yet</p>
                    <p className="text-sm">Start a conversation with your patient</p>
                  </div>
                </div>
              ) : (
                msgMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`chat ${message.sender === providerId ? 'chat-end' : 'chat-start'}`}
                  >
                    <div className="chat-image avatar">
                      <div className="w-10 rounded-full">
                        <div className={`avatar placeholder`}>
                          <div className={`${message.sender === providerId ? 'bg-primary text-primary-content' : 'bg-secondary text-secondary-content'} rounded-full w-10`}>
                            <span className="text-xs">
                              {message.sender === providerId ? 'Dr' : getPatientInitials(msgSelectedPatient.name || msgSelectedPatient.firstName + ' ' + msgSelectedPatient.lastName)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="chat-header">
                      <time className="text-xs opacity-50">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </time>
                    </div>
                    <div className={`chat-bubble ${message.sender === providerId ? 'chat-bubble-primary' : 'chat-bubble-secondary'}`}>
                      {message.message}
                    </div>
                    
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 bg-base-100 border-t border-base-300">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={msgInput}
                  onChange={(e) => setMsgInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="input input-bordered flex-1 input-primary focus:input-primary"
                />
                <button
                  onClick={sendMessage}
                  disabled={!msgInput.trim()}
                  className="btn btn-primary"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center bg-base-200">
            <div className="text-center text-base-content/60">
              <div className="text-8xl mb-6">💬</div>
              <h3 className="text-2xl font-semibold mb-2">Select a Patient</h3>
              <p className="text-lg">Choose a patient from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProviderMessagingSection;
  