import React, { useState, useEffect,useRef } from "react";
import { User, Code, LogOut, Folder, Search, Sun, Moon,Trophy,Flame } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import { useProblemStore } from "../store/useProblemStore";

const Navbar = () => {
  const { authUser } = useAuthStore();
  const [darkMode, setDarkMode] = useState(true);
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const { problems, isProblemsLoading, getAllProblems } = useProblemStore();

  useEffect(() => {
    if (authUser && problems.length === 0) {
      getAllProblems();
    }
  }, [authUser, getAllProblems, problems.length]);  

  const randomChallengeRef = useRef(null);
  useEffect(() => {
    if (authUser && problems.length > 0 && !randomChallengeRef.current) {
      const random = problems[Math.floor(Math.random() * problems.length)];
     
      randomChallengeRef.current = {
        title: random.title,
        link: `/problem/${random.id}`,
      };
      setDailyChallenge(randomChallengeRef.current);
      
    }
  }, [authUser, problems]);
  

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "light" : "dark"
    );
  };

  return (
    <nav className="sticky top-0 z-30 bg-primary/20 w-full">
      <div className="flex w-full justify-between items-center px-6 py-3 bg-black/15 shadow-lg shadow-neutral-600/5 backdrop-blur-lg border border-gray-200/10 rounded-xl">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/leetlab.svg"
            className="h-14 w-14 bg-primary/20 rounded-full p-2"
          />
          <span className="text-lg bg-primary/20 shadow-md rounded-2xl px-2 py-1 text-white md:text-2xl font-bold tracking-tight hidden md:block">
            LeetLab
          </span>
        </Link>

        {/* Daily Challenge */}
        {dailyChallenge && (
          <div className="hidden md:flex items-center gap-2 bg-primary/30 text-white px-4 py-2 rounded-lg shadow-md">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <p className="text-sm font-semibold">Daily Challenge:</p>
            <Link
              to={dailyChallenge.link}
              className="text-white font-bold hover:underline"
            >
              {dailyChallenge.title}
            </Link>
          </div>
        )}

        {/* Actions & User Dropdown */}
        <div className="flex items-center gap-6">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="btn btn-circle btn-ghost hover:bg-primary/20"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 border-white-400" />
            ) : (
              <Moon className="w-5 h-5 bg-amber-400-300" />
            )}
          </button>

          {/* User Profile Dropdown */}
          <div className="flex items-center gap-8">
            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                className="btn btn-ghost btn-circle avatar flex flex-row "
              >
                <div className="w-10 rounded-full ">
                  <img
                    src={
                      authUser?.image ||
                      "https://avatar.iran.liara.run/public/boy"
                    }
                    alt="User Avatar"
                    className="object-cover"
                  />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 space-y-3"
              >
                <li>
                  <p className="text-base font-semibold">{authUser?.name}</p>
                  <hr className="border-gray-200/10" />
                </li>
                <li>
                  <Link
                    to="/profile"
                    className="hover:bg-primary hover:text-white text-base font-semibold"
                  >
                    <User className="w-4 h-4 mr-2" />
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/submissions"
                    className="hover:bg-primary hover:text-white text-base font-semibold"
                  >
                    <Folder className="w-4 h-4 mr-2" />
                    Submissions
                  </Link>
                </li>
                {authUser?.role === "ADMIN" && (
                  <li>
                    <Link
                      to="/add-problem"
                      className="hover:bg-primary hover:text-white text-base font-semibold"
                    >
                      <Code className="w-4 h-4 mr-1 pr-1" />
                      Add Problem
                    </Link>
                  </li>
                )}
                <li>
                  <LogoutButton className="hover:bg-primary hover:text-white">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </LogoutButton>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;