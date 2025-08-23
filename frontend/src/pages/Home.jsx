import React from 'react';
import WelcomeBoard from '../sections/WelcomeBoard';

const Home = () => {
  return (
    <div className="min-h-screen bg-base-100"> {/* Uses theme background and ensures full height */}
      <div className="container mx-auto px-4 py-8"> {/* Adds container for proper width and padding */}
        <WelcomeBoard />
      </div>
    </div>
  );
};

export default Home;