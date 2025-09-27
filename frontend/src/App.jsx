import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import ProblemsPage from "./pages/ProblemsPage";
import ProblemPage from "./pages/ProblemPage";

import useAuthStore from "./store/authStore";
import LoadingSpinner from "./components/LoadingSpinner";
import useProblemStore from "./store/problemStore";
import CreatePlaylist from "./pages/CreatePlaylist";
import ViewPlaylist from "./pages/ViewPlaylist";
import CreateProblem from "./components/CreateProblem";
import Navbar from "./components/Navbar";
import About from "./components/About";
import Faq from "./components/Faq";
import PrivacyPolicy from "./components/PrivacyPolicy";
import Contact from "./components/Contact";
import Submissions from "./pages/Submission";
import ProfileSubmission from "./components/ProfileSubmission";
import ViewPlaylistDetails from "./pages/ViewPlaylistDetails";

const App = () => {
  const { authUser, check, isCheckingAuth } = useAuthStore();
  const { isProblemLoading } = useProblemStore();

  useEffect(() => {
    check();
  }, [check]);

  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <Toaster />
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={authUser ? <Navigate to="/problems" /> : <HomePage />}
        />

        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to={"/problems"} />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to={"/problems"} />}
        />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/createPlaylist" element={<CreatePlaylist />} />
        <Route path="/viewPlaylist" element={<ViewPlaylist />} />
        <Route path="/viewPlaylist/:id" element={<ViewPlaylistDetails />} />
        <Route path="/createProblem" element={<CreateProblem />} />

        <Route
          path="/problems"
          element={authUser ? <ProblemsPage /> : <Navigate to={"/"} />}
        />

        <Route
          path="/problem/:id"
          element={isProblemLoading ? <LoadingSpinner /> : <ProblemPage />}
        />
        <Route
          path="/submissions"
          element={authUser ? <Submissions /> : <Navigate to="/login" />}
        />

        <Route path="/profileSubmission" element={<ProfileSubmission />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
};

export default App;
