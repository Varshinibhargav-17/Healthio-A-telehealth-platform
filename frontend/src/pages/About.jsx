import React from 'react';

const About = () => {
  return (
    <div className="hero min-h-screen bg-base-100"> {/* Container with min-height for full page */}
      <div className="hero-content text-center"> {/* Centers content nicely */}
        <div className="max-w-xl"> {/* Controls max width for readability */}

          {/* Page Title */}
          <h1 className="text-5xl font-bold text-primary">About Healthio</h1>

          {/* Content Card - Adds structure and a subtle shadow */}
          <div className="py-6 px-8 text-left mt-8 bg-base-100 rounded-xl shadow-lg"> 
            <p className="py-2">
              Welcome to <strong className="text-primary">Healthio</strong>, a next-generation telehealth platform designed to connect patients with licensed healthcare professionals — instantly, securely, and from the comfort of their own homes.
            </p>
            
            <div className="divider my-6"></div> {/* Themed divider */}

            <h2 className="text-2xl font-semibold text-secondary mt-6">Our Mission</h2>
            <p className="py-2">
              To make quality healthcare accessible, affordable, and convenient for everyone — regardless of location. We believe that no one should have to wait hours or travel miles to receive expert medical advice.
            </p>

            <div className="divider my-6"></div>

            <h2 className="text-2xl font-semibold text-secondary">What We Offer</h2>
            <ul className="list-disc list-inside py-2 space-y-2"> {/* Styled list */}
              <li>24/7 Virtual Consultations with certified doctors</li>
              <li>Confidential mental health therapy and counseling</li>
              <li>Ongoing support for chronic conditions like diabetes and hypertension</li>
              <li>Fast, secure e-prescriptions and lab referrals</li>
              <li>A personal health dashboard to manage records and prescriptions</li>
            </ul>

            <div className="divider my-6"></div>

            <h2 className="text-2xl font-semibold text-secondary">Why Choose Healthio?</h2>
            <ul className="list-none list-inside py-2 space-y-2">
              <li>✅ <strong>Certified Doctors & Specialists</strong></li>
              <li>✅ <strong>HIPAA-compliant & Secure</strong></li>
              <li>✅ <strong>Transparent Pricing</strong></li>
              <li>✅ <strong>Multilingual Support</strong></li>
            </ul>

            <div className="divider my-6"></div>

            <p className="py-2 font-medium">
              Join thousands who trust Healthio for modern, reliable, and compassionate healthcare — anytime, anywhere.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;