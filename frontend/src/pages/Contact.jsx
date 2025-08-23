import React from 'react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-base-100 py-12 px-4"> {/* Use theme background and padding */}
      <div className="max-w-4xl mx-auto text-center"> {/* Center and constrain width */}
        
        {/* Page Header */}
        <h1 className="text-5xl font-bold text-primary mb-6">Contact Us</h1>
        <p className="text-lg text-base-content max-w-2xl mx-auto mb-12"> {/* Theme text color */}
          Whether you have a question about our services, need technical support, or want to provide feedback — we’re here to help.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left"> {/* Grid layout for cards */}
          
          {/* Customer Support Card */}
          <div className="card bg-base-200 shadow-lg"> {/* Card with subtle background */}
            <div className="card-body">
              <h2 className="card-title text-secondary text-2xl mb-4">Customer Support</h2> {/* Secondary color */}
              <p>📞 <strong>Phone:</strong> 1122334455</p>
              <p>📧 <strong>Email:</strong> <span className="text-primary">support@Healthio.com</span></p> {/* Primary color */}
              <p>🕒 <strong>Hours:</strong> 24/7 Support Available</p>
            </div>
          </div>

          {/* Corporate & Partnerships Card */}
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-secondary text-2xl mb-4">Corporate & Partnerships</h2>
              <p>🤝 <strong>Email:</strong> <span className="text-primary">partnerships@Healthio.com</span></p>
            </div>
          </div>

          {/* Media Inquiries Card */}
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-secondary text-2xl mb-4">Media Inquiries</h2>
              <p>📰 <strong>Email:</strong> <span className="text-primary">media@Healthio.com</span></p>
            </div>
          </div>

          {/* Registered Office Card */}
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-secondary text-2xl mb-4">Registered Office</h2>
              <p>🏢 Healthio Technologies Pvt. Ltd.</p>
              <p>123 Mainst,3rd Cross</p>
              <p>Bangalore-560060</p>
              <p>Karnataka,India</p>
            </div>
          </div>

          {/* Follow Us Card - spans full width on mobile, half on medium+ screens */}
          <div className="card bg-base-200 shadow-lg md:col-span-2"> {/* This card spans two columns */}
            <div className="card-body">
              <h2 className="card-title text-secondary text-2xl mb-4">Follow Us</h2>
              <p>🌐 <a href="https://www.healthio.com" className="text-primary hover:underline">www.healthio.com</a></p>
              <p>🔗 LinkedIn | Twitter | Facebook | Instagram</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;