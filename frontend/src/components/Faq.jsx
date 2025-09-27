import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Home } from "lucide-react";

const Faq = () => {
  const faqs = [
    {
      question: "What is LeetLab?",
      answer:
        "LeetLab is an interactive coding platform designed to help developers prepare for coding interviews.",
    },
    {
      question: "Is LeetLab free to use?",
      answer:
        "Yes! You can solve coding problems and track progress for free. Some premium features may require an upgrade.",
    },
    {
      question: "Can I submit my own problems?",
      answer:
        "Yes, if you’re an admin, you can add custom problems and test cases.",
    },
    {
      question: "Which languages are supported?",
      answer: "LeetLab supports Python, JavaScript, Java, and more!",
    },
    {
      question: "How can I upgrade to premium?",
      answer:
        "Click the 'Upgrade to Premium' button in your profile section to access exclusive features.",
    },
  ];

  return (
    <div className="min-h-screen from-base-300 to-base-200 max-w-7xl w-full">
      <nav className="navbar bg-base-100 shadow-lg px-4">
        <div className="flex-1 gap-2 container items-center flex flex-row">
          <Link
            to={"/"}
            className="flex items-center gap-2  text-primary"
          >
            <Home className="w-10 h-10" />
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <h2 className="pl-3  text-lg font-semibold">FAQ Section</h2>
        </div>
      </nav>
      <div className=" bg-base-100 flex flex-col items-center p-10">
        <div className="max-w-3xl text-center">
          <h1 className="text-4xl font-extrabold mb-6">
            Frequently Asked Questions
          </h1>

          {faqs.map((faq, index) => (
            <div
              key={index}
              className="collapse collapse-plus bg-primary/20 shadow-md rounded-lg mb-4"
            >
              <input type="checkbox" className="peer" />
              <div className="collapse-title text-lg font-semibold ">
                {faq.question}
              </div>
              <div className="collapse-content text-gray-400 ">
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faq