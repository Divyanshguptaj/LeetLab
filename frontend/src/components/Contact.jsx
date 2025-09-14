import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Home, Mail, Phone } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen from-base-300 to-base-200 max-w-7xl w-full">
      <nav className="navbar bg-base-100 shadow-lg px-4">
        <div className="flex-1 gap-2 container items-center flex flex-row">
          <Link to={"/"} className="flex items-center gap-2 text-primary">
            <Home className="w-10 h-10" />
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <h2 className="pl-3 text-lg font-semibold">Contact Us</h2>
        </div>
      </nav>

      <div className="bg-base-50 flex flex-col items-center p-10">
        <div className="max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold z-10 mb-4">
            Get in Touch with <span className="text-primary">LeetLab</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Have questions, feedback, or collaboration ideas? Reach out to us!
          </p>

          <div className="mt-6 flex flex-col md:flex-row gap-4">
            <div className="card bg-primary/20 shadow-md p-5 rounded-lg">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" /> Email Us
              </h2>
              <p className="text-gray-400 p-1.5">
                Send us an email at{" "}
                <span className="text-primary">contact@leetlab.com</span>
              </p>
            </div>

           

            <div className="card bg-primary/20 shadow-md p-5 rounded-lg">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                🌍 Social Media
              </h2>
              <p className="text-gray-400 p-1.5">
                Connect with us on{" "}
                <span className="text-primary">LinkedIn</span> and{" "}
                <span className="text-primary">Twitter</span>.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-gray-400 text-lg leading-relaxed">
              We look forward to hearing from you!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;