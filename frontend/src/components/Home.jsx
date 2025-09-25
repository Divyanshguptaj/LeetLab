import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className='w-full min-h-screen flex flex-col justify-between bg-gradient-to-br from-base-100 to-base-200 text-base-content'>
            {/* Header Section */}
            <header className='flex flex-col justify-center items-center py-20 px-4 text-center'>
                <h1 className='text-6xl sm:text-7xl lg:text-8xl font-extrabold text-primary mb-6 animate-fade-in-down drop-shadow-lg leading-tight'>
                    Welcome to <span className='text-secondary'>LeetLab</span>
                </h1>
                <p className='text-2xl sm:text-3xl font-light max-w-3xl mx-auto opacity-90 animate-fade-in-up'>
                    Your Personal Lab to Master Data Structures and Algorithms with Ease.
                </p>
                <div className='mt-10 animate-fade-in-up delay-200'>
                    <Link
                        to="/login"
                        className="btn bg-white text-black btn-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                    >
                        Start Practicing Now!
                    </Link>

                </div>
            </header>

            {/* Features Section */}
            <section className='container mx-auto px-16 py-16 sm:py-20 '>
                <h2 className='text-4xl font-bold text-center text-primary mb-12 animate-fade-in-up'>
                    Key Features
                </h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>

                    <div className='card bg-base-300 shadow-xl rounded-2xl p-6 transform transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl animate-fade-in-up'>
                        <div className='card-body items-center text-center p-0'>
                            <h3 className='card-title text-2xl font-semibold text-accent mb-3'>
                                Advanced Code Editor
                            </h3>
                            <p className='text-base text-base-content opacity-80'>
                                Integrated Monaco Editor supporting multiple languages for a seamless coding experience.
                            </p>

                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mt-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                        </div>
                    </div>


                    <div className='card bg-base-300 shadow-xl rounded-2xl p-6 transform transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl animate-fade-in-up delay-100'>
                        <div className='card-body items-center text-center p-0'>
                            <h3 className='card-title text-2xl font-semibold text-accent mb-3'>
                                Custom Playlists
                            </h3>
                            <p className='text-base text-base-content opacity-80'>
                                Create and organize your own playlists to group related problems and optimize your learning path.
                            </p>

                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mt-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                            </svg>
                        </div>
                    </div>


                    <div className='card bg-base-300 shadow-xl rounded-2xl p-6 transform transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl animate-fade-in-up delay-200'>
                        <div className='card-body items-center text-center p-0'>
                            <h3 className='card-title text-2xl font-semibold text-accent mb-3'>
                                Real-time Feedback
                            </h3>
                            <p className='text-base text-base-content opacity-80'>
                                Get instant results, including memory and time consumption, to quickly iterate and improve your solutions.
                            </p>

                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mt-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </section>


            <section className='py-16 px-4 text-center bg-primary text-primary-content'>
                <h2 className='text-3xl font-bold mb-4 animate-fade-in-up'>Ready to Level Up Your DSA Skills?</h2>
                <p className='text-xl opacity-90 mb-8 animate-fade-in-up delay-100'>
                    Join a community of learners and start your journey to coding mastery!
                </p>
                <Link
                    to="/signup"
                    className="btn bg-white text-black border-white btn-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                >
                    Get Started Free
                </Link>

            </section>


            <footer className='footer footer-center p-8 bg-base-300 text-base-content'>
                <aside>
                    <p className='text-lg'>
                        &copy; {new Date().getFullYear()} LeetLab. All rights reserved.
                    </p>
                    <p className='text-sm mt-2'>
                        Designed with ❤️ for aspiring problem solvers.
                    </p>
                </aside>

                <nav>
                    <div className="grid grid-flow-col gap-4 mt-2">
                        <a href="#" className="link link-hover">About Us</a>
                        <a href="#" className="link link-hover">Contact</a>
                        <a href="#" className="link link-hover">Privacy Policy</a>
                    </div>
                </nav>
            </footer>
        </div>
    );
};

export default Home;