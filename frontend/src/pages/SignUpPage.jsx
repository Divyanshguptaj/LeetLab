import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {isSigningUp,signUp} = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = {name,email,password};
    signUp(formData);
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className='min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 p-4'>
      <div className="w-full max-w-md p-8 space-y-7 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
        
        <h2 className='text-white font-extrabold text-4xl text-center mb-6'>Create New Account</h2>
        
        <form className='space-y-6' onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              required
              placeholder="Your full name"
              className='w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                         transition-all duration-200 placeholder-gray-400'
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              placeholder="you@example.com"
              className='w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                         transition-all duration-200 placeholder-gray-400'
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className='w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                         transition-all duration-200 placeholder-gray-400'
            />
          </div>

          <button 
            type="submit" 
            className={`w-full py-3 rounded-lg text-lg font-semibold transition-all duration-300 
                       ${isSigningUp 
                         ? 'bg-blue-700 text-gray-300 cursor-not-allowed flex items-center justify-center gap-2' 
                         : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'}`}
            disabled={isSigningUp}
          >
            {isSigningUp ? (
              <>
                <span className='w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin'></span>
                Signing up...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p className='text-gray-400 text-center text-sm mt-6'>
          Already have an account? 
          <Link className='text-blue-500 hover:text-blue-400 font-medium ml-1 transition-colors duration-200' to={'/login'}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;