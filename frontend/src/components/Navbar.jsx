import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

import { useLocation } from 'react-router-dom';



const Navbar = () => {
  const navigate = useNavigate();
  const { logout, authUser } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    // Optional: navigate to login page after logout
    navigate('/'); 
  }

  const handleSignup = () => {
    navigate('/signup');
  };

  const handleLogin = () => {
    navigate('/login');
  };


const location = useLocation();
const currentPath = location.pathname;


  return (
    <nav className="bg-gray-800 text-gray-100 shadow-lg px-16 py-4 flex justify-between w-screen items-center z-20 relative">
      {/* Logo/Brand */}
      <div className="flex items-center">
        <Link to={'/'} className="text-3xl font-extrabold text-blue-400 hover:text-blue-300 transition-colors duration-200">
          LeetLab
        </Link>
      </div>

      {/* Navigation Buttons / User Dropdown */}
      <div className="flex items-center gap-4">
        {!authUser ? (
          <>
            <button
              onClick={handleSignup}
              className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-md font-semibold"
            >
              Sign Up
            </button>
            <button
              onClick={handleLogin}
              className="px-5 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors duration-200 shadow-md font-semibold border border-gray-600"
            >
              Login
            </button>
          </>
        ) : (
          <div className="relative group"> 
            <button className="flex items-center space-x-2 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500 shadow-md">
                <img
                  alt="User Avatar"
                  src={`https://avatar.iran.liara.run/public/boy?username=${authUser.email}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </button>

          
            <ul className="absolute right-0 mt-3 w-52 bg-gray-700 rounded-lg shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-focus-within:opacity-100 group-hover:visible group-focus-within:visible transform translate-y-2 group-hover:translate-y-0 group-focus-within:translate-y-0 transition-all duration-300 z-50">
              {
      currentPath!=="/profile" &&
             ( 
             <li>
                <Link to={'/profile'} className="block px-4 py-3 text-gray-200 hover:bg-gray-600 hover:text-white transition-colors duration-200">
                  Profile
                </Link>
              </li>
              ) 
              }
              {
       authUser.role ==="ADMIN"?
            ( <li>
                <Link to={'/createProblem'} className="block px-4 py-3 text-gray-200 hover:bg-gray-600 hover:text-white transition-colors duration-200">
                  Create Problem
                </Link>
              </li>)
              : ""
              }
              <li>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-3 text-red-400 hover:bg-gray-600 hover:text-red-300 transition-colors duration-200">
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;