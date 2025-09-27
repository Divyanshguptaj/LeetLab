import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Home } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen from-base-300 to-base-200 max-w-7xl w-full">
      <nav className="navbar bg-base-100 shadow-lg px-4">
        <div className="flex-1 gap-2 container items-center flex flex-row">
          <Link to={"/"} className="flex items-center gap-2 text-primary">
            <Home className="w-10 h-10" />
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <h2 className="pl-3 text-lg font-semibold">Privacy Policy</h2>
        </div>
      </nav>

      <div className="bg-base-50 flex flex-col items-center p-10">
        <div className="max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold z-10 mb-4">
            Privacy Policy for <span className="text-primary">LeetLab</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            At LeetLab, we value your privacy and are committed to protecting
            your personal data. This policy outlines how we collect, use, and
            safeguard your information.
          </p>

          <div className="mt-6 flex flex-col md:flex-row gap-4">
            <div className="card bg-primary/20 shadow-md p-5 rounded-lg">
              <h2 className="text-xl font-semibold">🔒 Data Collection</h2>
              <p className="text-gray-400 p-1.5">
                We collect minimal personal data, including email and usage
                statistics, to enhance your experience.
              </p>
            </div>
            <div className="card bg-primary/20 shadow-md p-5 rounded-lg">
              <h2 className="text-xl font-semibold">📜 Usage of Data</h2>
              <p className="text-gray-400 p-1.5">
                Your data is used solely for improving platform functionality
                and providing personalized recommendations.
              </p>
            </div>
            <div className="card bg-primary/20 shadow-md p-5 rounded-lg">
              <h2 className="text-xl font-semibold">🚫 Third-Party Sharing</h2>
              <p className="text-gray-400 p-1.5">
                We do not sell or share your personal data with third parties
                without consent.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-gray-400 text-lg leading-relaxed">
              For any privacy-related inquiries, contact us at{" "}
              <span className="text-primary">privacy@leetlab.com</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;