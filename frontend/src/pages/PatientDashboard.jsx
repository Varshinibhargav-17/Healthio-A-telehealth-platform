import React, { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import ProviderProfile from '../components/ProviderProfile';
import AppointmentForm from '../components/AppointmentForm';
import MessagingSection from '../components/MessagingSection';
import PrescriptionsByAppointment from "../components/PrescriptionsByAppointment";
import PatientBilling from "../components/PatientBilling";
import socket from '../socket';
import VideoConsultations from '../components/VideoConsultations';

const PatientDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formInput, setFormInput] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    age: '',
    email: '',
    phone_number: '',
    address: '',
  });
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [appointmentStatus, setAppointmentStatus] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    if (activeSection === 'appointments' || activeSection === 'video') {
      fetch(`http://localhost:5000/api/patient/auth/providers`, { credentials: 'include' })
        .then(res => res.json())
        .then(setProviders)
        .catch(console.error);
      fetch(`http://localhost:5000/api/patient/auth/appointments`, { credentials: 'include' })
        .then(res => res.json())
        .then(setAppointments)
        .catch(console.error);
    }
  }, [activeSection]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/patient/auth/profile`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
          setFormInput(data);
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/patient/auth/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formInput),
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setEditing(false);
        alert('Profile saved successfully.');
      } else {
        console.error('Failed to save/update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        if (!profile || editing) return (
          <div className="card bg-base-100 shadow-lg max-w-2xl mx-auto my-8">
            <div className="card-body">
              <h2 className="card-title text-2xl text-primary">{profile ? 'Update Your Profile' : 'Complete Your Profile'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input name="first_name" placeholder="First Name" value={formInput.first_name} onChange={handleChange} className="input input-bordered" required />
                  <input name="last_name" placeholder="Last Name" value={formInput.last_name} onChange={handleChange} className="input input-bordered" required />
                  <input type="date" name="date_of_birth" value={formInput.date_of_birth} onChange={handleChange} className="input input-bordered" required />
                  <input name="gender" placeholder="Gender" value={formInput.gender} onChange={handleChange} className="input input-bordered" required />
                  <input name="age" type="number" placeholder="Age" value={formInput.age} onChange={handleChange} className="input input-bordered" required />
                  <input name="email" type="email" placeholder="Email" value={formInput.email} onChange={handleChange} className="input input-bordered" required />
                  <input name="phone_number" placeholder="Phone Number" value={formInput.phone_number} onChange={handleChange} className="input input-bordered" required />
                  <input name="address" placeholder="Address" value={formInput.address} onChange={handleChange} className="input input-bordered" required />
                </div>
                <button type="submit" className="btn btn-primary mt-4">
                  {profile ? 'Update Profile' : 'Save Profile'}
                </button>
              </form>
            </div>
          </div>
        );
        return (
          <div className="card bg-base-100 shadow-lg max-w-2xl mx-auto my-8">
            <div className="card-body">
              <h2 className="card-title text-2xl text-primary">Your Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p><strong>First Name:</strong> {profile.first_name}</p>
                <p><strong>Last Name:</strong> {profile.last_name}</p>
                <p><strong>Date of Birth:</strong> {profile.date_of_birth}</p>
                <p><strong>Gender:</strong> {profile.gender}</p>
                <p><strong>Age:</strong> {profile.age}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Phone:</strong> {profile.phone_number}</p>
                <p><strong>Address:</strong> {profile.address}</p>
              </div>
              <button onClick={() => setEditing(true)} className="btn btn-secondary mt-4">Update</button>
            </div>
          </div>
        );

      case 'appointments':
        return (
          <div className="card bg-base-100 shadow-lg max-w-2xl mx-auto my-8">
            <div className="card-body">
              <h3 className="card-title text-xl text-primary">📅 Appointments</h3>

              {!showAppointmentForm && (
                <button
                  className="btn btn-primary mb-4"
                  onClick={() => setShowAppointmentForm(true)}
                >
                  Book New Appointment
                </button>
              )}

              {showAppointmentForm && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!selectedProvider) return alert("Please select a provider.");
                    const res = await fetch('http://localhost:5000/api/patient/auth/appointments', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      credentials: 'include',
                      body: JSON.stringify({
                        providerId: selectedProvider._id,
                        date: appointmentDate,
                        time: appointmentTime,
                      }),
                    });
                    if (res.ok) {
                      setShowAppointmentForm(false);
                      setAppointmentDate('');
                      setAppointmentTime('');
                      setSelectedProvider(null);
                      const updated = await fetch('http://localhost:5000/api/patient/auth/appointments', { credentials: 'include' });
                      setAppointments(await updated.json());
                    } else {
                      alert('Failed to book appointment');
                    }
                  }}
                  className="mb-6 space-y-4"
                >
                  <select
                    value={selectedProvider?._id || ''}
                    onChange={e => setSelectedProvider(providers.find(p => p._id === e.target.value))}
                    className="select select-bordered w-full"
                    required
                  >
                    <option value="">Select Provider</option>
                    {providers.map(p => (
                      <option key={p._id} value={p._id}>
                        {p.first_name} {p.last_name} ({p.specialization})
                      </option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={appointmentDate}
                    onChange={e => setAppointmentDate(e.target.value)}
                    className="input input-bordered w-full"
                    required
                  />
                  <input
                    type="time"
                    value={appointmentTime}
                    onChange={e => setAppointmentTime(e.target.value)}
                    className="input input-bordered w-full"
                    required
                  />
                  <div className="flex gap-2">
                    <button type="submit" className="btn btn-success">
                      Book
                    </button>
                    <button type="button" className="btn btn-ghost" onClick={() => setShowAppointmentForm(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <h4 className="text-lg font-semibold mb-2">Your Appointments</h4>
              {appointments.length === 0 ? (
                <p>No appointments found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table table-zebra">
                    <tbody>
                      {appointments.map((appt) => (
                        <tr key={appt._id}>
                          <td>
                            <strong>
                              {appt.providerName ||
                                (appt.provider?.first_name + ' ' + appt.provider?.last_name)}
                            </strong>
                            <br />
                            <span>{appt.date} at {appt.time}</span>
                            <br />
                            <span className="badge badge-sm">{appt.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );

      case 'messaging':
        return (
          <div className="card bg-base-100 shadow-lg max-w-2xl mx-auto my-8">
            <div className="card-body">
              <h3 className="card-title text-xl text-primary">💬 Messaging</h3>
              <MessagingSection patientId={profile?._id} />
            </div>
          </div>
        );

      case 'medical':
        return (
          <div className="card bg-base-100 shadow-lg max-w-3xl mx-auto my-8">
            <div className="card-body">
              <PrescriptionsByAppointment patientId={profile?._id} />
            </div>
          </div>
        );

      case 'billing':
        return (
          <div className="card bg-base-100 shadow-lg max-w-2xl mx-auto my-8">
            <div className="card-body">
              <PatientBilling />
            </div>
          </div>
        );

      case 'video':
        return (
          <VideoConsultations patientId={profile?._id} />
        );

      default:
        return (
          <div className="card bg-base-100 shadow-lg max-w-3xl mx-auto my-16">
            <div className="card-body text-center">
              <h2 className="card-title text-2xl text-primary justify-center">Welcome to Your Patient Dashboard!</h2>
              <p className="text-lg text-base-content">
                This platform is designed to provide you with a comprehensive overview of your health and wellness, making it easier for you to manage your healthcare needs from the comfort of your home.
              </p>
              <p className="text-lg text-base-content mt-4">
                Your health is our priority, and this dashboard is designed to enhance your telehealth experience by providing you with the tools and information you need to take charge of your health.
              </p>
              <p className="text-lg text-base-content mt-4">
                Thank you for choosing our telehealth platform. Together, we can achieve your health goals!
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <header className="bg-base-100 shadow-md p-4">
        <div className="navbar">
          <div className="flex-1">
            <button onClick={() => setActiveSection(null)} className="btn btn-ghost text-3xl text-primary">
              <FaUserCircle />
            </button>
          </div>
          <div className="flex-none">
            <ul className="menu menu-horizontal gap-2">
              <li><button onClick={() => setActiveSection('profile')} className="btn btn-ghost btn-sm">Profile</button></li>
              <li><button onClick={() => setActiveSection('appointments')} className="btn btn-ghost btn-sm">Appointments</button></li>
              <li><button onClick={() => setActiveSection('medical')} className="btn btn-ghost btn-sm">Prescriptions</button></li>
              <li><button onClick={() => setActiveSection('billing')} className="btn btn-ghost btn-sm">Billing</button></li>
              <li><button onClick={() => setActiveSection('messaging')} className="btn btn-ghost btn-sm">Messaging</button></li>
              <li><button onClick={() => setActiveSection('video')} className="btn btn-ghost btn-sm">Video Consultations</button></li>
            </ul>
          </div>
        </div>
      </header>
      <main className="flex-1 p-6 bg-base-200">{renderSection()}</main>
    </div>
  );
};

export default PatientDashboard;