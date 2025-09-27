import React from 'react'
import ProfileSubmission from '../components/ProfileSubmission'
import { Link } from 'react-router-dom'
import { ChevronLeft, Home } from 'lucide-react'

const Submissions = () => {
  return (
    <div className="min-h-screen from-base-300 to-base-200 max-w-7xl w-full">
    <nav className="navbar bg-base-100 shadow-lg px-4">
      <div className="flex-1 gap-2 container items-center">
        <Link to={"/"} className="flex items-center gap-2 mb-4 mt-4 text-primary">
          <Home className="w-6 h-6" />
          <ChevronLeft className="w-4 h-4" />
        </Link>
        <ProfileSubmission/>
        </div>
        </nav>
        </div>
   
  )
}

export default Submissions