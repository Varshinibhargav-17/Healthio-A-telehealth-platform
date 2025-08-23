import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import VideoChat from "./VideoChat"; // your WebRTC component

const socket = io("http://localhost:5000"); // adjust backend URL

export default function PatientVideoConsultations({ patientId }) {
  const [callInvite, setCallInvite] = useState(null); // store invite details
  const [inCall, setInCall] = useState(false);

  useEffect(() => {
    // Listen for provider's video call invitation
    socket.on("video-call-invite", (data) => {
      if (data.patientId === patientId) {
        setCallInvite(data);
      }
    });

    return () => {
      socket.off("video-call-invite");
    };
  }, [patientId]);

  const joinCall = () => {
    setInCall(true);
    socket.emit("patient-joined-call", { 
      patientId, 
      providerId: callInvite.providerId, 
      appointmentId: callInvite.appointmentId 
    });
  };

  return (
    <div className="p-6 bg-base-200 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-primary mb-4">Video Consultations</h2>

      {!inCall && !callInvite && (
        <p className="text-lg text-gray-600">
          Waiting for your provider to start a video consultation...
        </p>
      )}

      {callInvite && !inCall && (
        <div className="p-4 bg-yellow-100 border border-yellow-400 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-secondary mb-2">
            Incoming Video Call 🚨
          </h3>
          <p className="mb-3">
            Dr. {callInvite.providerName} has started your consultation for{" "}
            {new Date(callInvite.date).toLocaleString()}.
          </p>
          <button className="btn btn-success" onClick={joinCall}>
            Join Call
          </button>
        </div>
      )}

      {inCall && callInvite && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-secondary mb-2">
            Video Chat with Dr. {callInvite.providerName}
          </h3>
          <VideoChat
            patientId={patientId}
            providerId={callInvite.providerId}
            appointmentId={callInvite.appointmentId}
          />
        </div>
      )}
    </div>
  );
}
