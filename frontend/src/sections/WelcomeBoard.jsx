import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomeBoard = () => {
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    setShowRoleSelector(true);
  };

  return (
    <section id="welcome" className="hero min-h-screen bg-base-100">
      <div className="hero-content text-center flex flex-col">
        
        {/* Main Header */}
        <h1 className="text-5xl font-bold text-primary">Welcome to Healthio</h1>
        <p className="text-lg text-base-content mt-4 max-w-2xl">
          Accessible and connected healthcare at your fingertips
        </p>

        {/* Description Card */}
        <div className="card bg-base-200 shadow-lg mt-8 max-w-3xl mx-auto">
          <div className="card-body text-left py-8">
            <p className="py-2">
              At <strong className="text-primary">Healthio</strong>, we believe quality healthcare should be available to everyone, anytime, anywhere. Our platform connects you with certified doctors, mental health professionals, and wellness experts — all from the comfort of your home.
            </p>
            <p className="py-2">
              Whether you're seeking urgent care, chronic condition management, mental health support, or a routine consultation, Healthio is your trusted partner in digital healthcare. We ensure secure, convenient, and personalized care using state-of-the-art technology and a compassionate care team.
            </p>
            <p className="py-2">
              Join thousands of patients who are experiencing faster, easier, and more connected healthcare — all through one intuitive platform.
            </p>
          </div>
        </div>

        {/* Get Started Button */}
        {!showRoleSelector && (
          <div className="mt-8">
            <button
              onClick={handleGetStarted}
              className="btn btn-primary btn-lg"
            >
              Get Started
            </button>
          </div>
        )}

        {/* Role Selector */}
        {showRoleSelector && (
          <div className="mt-10 text-center">
            <h2 className="text-2xl font-semibold mb-6 text-secondary">Are you a patient or provider?</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => navigate('/patient')}
                className="btn btn-primary btn-wide"
              >
                Patient
              </button>
              <button
                onClick={() => navigate('/provider')}
                className="btn btn-outline btn-wide"
              >
                Provider
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default WelcomeBoard;