import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

import Hero from '@/components/Hero';
import MapSection from '@/components/MapSection';
import PredictionSection from '@/components/PredictionSection';

import Affiliate from '@/pages/Affiliate';
import AffiliateStoreDetail from '@/pages/AffiliateStoreDetail';
import JoinAffiliate from '@/pages/JoinAffiliate';

import BudgetInput from '@/pages/BudgetInput';
import SmartBudget from '@/pages/SmartBudget';

import About from '@/pages/About';
import RouteGuard from '@/utils/RouteGuard';

import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Profile from '@/pages/Profile';
import EditProfile from '@/pages/EditProfile';

// Content wrapper that checks auth
function ProtectedContent({ children }: { children: React.ReactNode }) {
    return <RouteGuard requireAuth={true}>{children}</RouteGuard>;
}

function AppContent() {
    const [isDark, setIsDark] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia(
            '(prefers-color-scheme: dark)',
        ).matches;

        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDark(false);
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleDarkMode = () => {
        const newMode = !isDark;
        setIsDark(newMode);
        if (newMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    if (!mounted) {
        return null;
    }

    return (
        <div
            className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#020617]' : 'bg-[#e4e4e4]'}`}
        >
            <Navbar isDark={isDark} onToggleDarkMode={toggleDarkMode} />

            <main className='flex-1'>
                <Routes>
                    {/* Public Routes */}
                    <Route
                        path='/'
                        element={
                            <>
                                <Hero />
                                <MapSection />
                                <PredictionSection />
                            </>
                        }
                    />
                    <Route path='/about' element={<About />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />
                    <Route
                        path='/forgot-password'
                        element={<ForgotPassword />}
                    />
                    <Route
                        path='/reset-password/:token'
                        element={<ResetPassword />}
                    />

                    {/* Protected Routes */}
                    <Route
                        path='/affiliate'
                        element={
                            <ProtectedContent>
                                <Affiliate />
                            </ProtectedContent>
                        }
                    />
                    <Route
                        path='/affiliate/:slug'
                        element={
                            <ProtectedContent>
                                <AffiliateStoreDetail />
                            </ProtectedContent>
                        }
                    />
                    <Route
                        path='/join-affiliate'
                        element={
                            <ProtectedContent>
                                <JoinAffiliate />
                            </ProtectedContent>
                        }
                    />
                    <Route
                        path='/smart-budgeting'
                        element={
                            <ProtectedContent>
                                <BudgetInput />
                            </ProtectedContent>
                        }
                    />
                    <Route
                        path='/smart-budget'
                        element={
                            <ProtectedContent>
                                <SmartBudget />
                            </ProtectedContent>
                        }
                    />
                    <Route
                        path='/profile'
                        element={
                            <ProtectedContent>
                                <Profile />
                            </ProtectedContent>
                        }
                    />
                    <Route
                        path='/edit-profile'
                        element={
                            <ProtectedContent>
                                <EditProfile />
                            </ProtectedContent>
                        }
                    />
                </Routes>
            </main>

            <Footer />
        </div>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;