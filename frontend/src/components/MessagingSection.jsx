import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaArrowLeft, FaPaperPlane, FaComments } from 'react-icons/fa';
import socket from "../socket";

function MessagingSection({ patientId }) {
  const [msgproviders, setmsgProviders] = useState([]);
  const [msgselectedProvider, setmsgSelectedProvider] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/patient/auth/providers', { credentials: 'include' })
      .then(res => res.json())
      .then(setmsgProviders);
  }, []);

  useEffect(() => {
    socket.on('receiveMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => socket.off('receiveMessage');
  }, []);

  const startChat = (provider) => {
    setmsgSelectedProvider(provider);
    const room = [patientId, provider._id].sort().join('-');
    socket.emit('joinRoom', { patientId, providerId: provider._id });
    fetch(`http://localhost:5000/api/messages/conversation?patientId=${patientId}&providerId=${provider._id}`)
      .then(res => res.json())
      .then(setMessages);
  };

  const sendMessage = () => {
    if (input.trim()) {
      const room = [patientId, msgselectedProvider._id].sort().join('-');
      socket.emit('sendMessage', {
        room,
        message: input,
        sender: 'patient',
        patientId,
        providerId: msgselectedProvider._id,
      });
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  if (!msgselectedProvider) {
    return (
      <div className="card bg-base-100 shadow-lg" data-theme="corporate">
        <div className="card-body">
          <div className="flex items-center mb-6">
            <FaComments className="text-primary text-2xl mr-3" />
            <h3 className="card-title text-2xl">Available Healthcare Providers</h3>
          </div>
          
          {msgproviders.length === 0 ? (
            <div className="alert alert-info">
              <span>No providers available for messaging at this time.</span>
            </div>
          ) : (
            <div className="space-y-3">
              {msgproviders.map((prov) => (
                <div key={prov._id} className="card bg-base-200 hover:bg-base-300 transition-colors">
                  <div className="card-body compact flex-row items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="avatar placeholder">
                        <div className="bg-primary text-primary-content rounded-full w-12">
                          <span className="text-xl">
                            <FaUserCircle />
                          </span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">
                          Dr. {prov.first_name} {prov.last_name}
                        </h4>
                        <p className="text-sm text-base-content/70">
                          {prov.specialization || 'General Practice'}
                        </p>
                      </div>
                    </div>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => startChat(prov)}
                    >
                      <FaComments className="mr-1" />
                      Message
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-lg h-96 flex flex-col" data-theme="corporate">
      <div className="card-body p-0 flex flex-col h-full">
        {/* Chat Header */}
        <div className="bg-primary text-primary-content p-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="avatar placeholder">
                <div className="bg-primary-content text-primary rounded-full w-10">
                  <span className="text-lg">
                    <FaUserCircle />
                  </span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  Dr. {msgselectedProvider.first_name} {msgselectedProvider.last_name}
                </h3>
                <p className="text-sm opacity-90">
                  {msgselectedProvider.specialization || 'General Practice'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setmsgSelectedProvider(null)}
              className="btn btn-ghost btn-sm btn-circle text-primary-content"
              title="Back to providers"
            >
              <FaArrowLeft />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-base-50 space-y-3">
          {messages.length === 0 ? (
            <div className="text-center text-base-content/50 py-8">
              <FaComments className="text-4xl mx-auto mb-2 opacity-50" />
              <p>Start your conversation with Dr. {msgselectedProvider.first_name}</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.sender === 'patient' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`
                  max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm
                  ${msg.sender === 'patient' 
                    ? 'bg-primary text-primary-content rounded-br-none' 
                    : 'bg-base-200 text-base-content rounded-bl-none'
                  }
                `}>
                  <p className="text-sm">{msg.message}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Input */}
        <div className="p-4 bg-base-200 rounded-b-2xl">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="input input-bordered flex-1"
              placeholder="Type your message..."
            />
            <button
              onClick={sendMessage}
              className="btn btn-primary btn-square"
              disabled={!input.trim()}
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessagingSection;