import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Patient = () => {
  const [formType, setFormType] = useState('signup');
  const [formInput, setFormInput] = useState({ email: '', username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('patientUser');
    if (savedUser) {
      navigate('/patient-dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormInput({ ...formInput, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/patient/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formInput)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Signup failed');

      alert('Signup successful! Please log in.');
      setFormType('login');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/patient/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formInput)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      localStorage.setItem('patientUser', JSON.stringify(data.user));
      navigate('/patient-dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="hero min-h-screen bg-base-100">
      <div className="hero-content flex-col">
        <div className="card w-full max-w-md shadow-2xl bg-base-100">
          <div className="card-body">
            <h1 className="text-3xl font-bold text-center text-primary">
              {formType === 'signup' ? 'Patient Sign Up' : 'Patient Login'}
            </h1>

            {error && (
              <div className="alert alert-error mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={formType === 'signup' ? handleSignup : handleLogin} className="space-y-4 mt-4">
              {formType === 'signup' && (
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formInput.email}
                  onChange={handleChange}
                  required
                  className="input input-bordered input-primary w-full"
                />
              )}
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formInput.username}
                onChange={handleChange}
                required
                className="input input-bordered input-primary w-full"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formInput.password}
                onChange={handleChange}
                required
                className="input input-bordered input-primary w-full"
              />
              <button
                type="submit"
                className="btn btn-primary w-full"
              >
                {formType === 'signup' ? 'Sign Up' : 'Login'}
              </button>
            </form>

            <p className="text-center text-sm mt-4">
              {formType === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                className="link link-primary hover:underline"
                onClick={() => setFormType(formType === 'signup' ? 'login' : 'signup')}
              >
                {formType === 'signup' ? 'Login' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Patient;