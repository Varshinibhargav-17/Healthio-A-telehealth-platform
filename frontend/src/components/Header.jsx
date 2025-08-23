import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  const scrollToWelcome = () => {
    const welcome = document.getElementById('welcome');
    if (welcome) {
      welcome.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="navbar bg-base-100 shadow-md px-8"> {/* Changed to DaisyUI classes */}
      <div className="flex-1">
        <Link to="/" className="text-xl font-bold text-primary">Healthio</Link> {/* Added text-primary */}
      </div>
      <nav className="flex-none">
        <ul className="menu menu-horizontal space-x-2"> {/* Changed to DaisyUI menu structure */}
          <li>
            <Link
              to="/"
              onClick={(e) => {
                if (location.pathname === '/') {
                  e.preventDefault();
                  scrollToWelcome();
                }
              }}
              className="btn btn-ghost btn-sm" // Added DaisyUI button styles
            >
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="btn btn-ghost btn-sm">
              About
            </Link>
          </li>
          <li>
            <Link to="/contact" className="btn btn-ghost btn-sm">
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;