import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon, LogIn, User, LogOut, Store, Edit2 } from "lucide-react";
import clsx from "clsx";
import logoImg from "../brandIcon.png";

interface NavbarProps {
    onToggleDarkMode?: () => void;
    isDark?: boolean;
}

interface UserData {
    id: number;
    name?: string;
    namaLengkap?: string;
    email: string;
    username?: string;
    phone?: string;
    avatar?: string;
    role: string;
}

interface AffiliateStore {
    id: number;
    name: string;
    slug: string;
}

export default function Navbar({ onToggleDarkMode, isDark }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDarkState, setIsDarkState] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [user, setUser] = useState<UserData | null>(null);
    const [affiliateStore, setAffiliateStore] = useState<AffiliateStore | null>(null);
    const location = useLocation();

    useEffect(() => {
        setMounted(true);
        if (typeof isDark === "undefined") {
            const savedTheme = localStorage.getItem("theme");
            const prefersDark = window.matchMedia(
                "(prefers-color-scheme: dark)",
            ).matches;

            if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
                setIsDarkState(true);
                document.documentElement.classList.add("dark");
            } else {
                setIsDarkState(false);
                document.documentElement.classList.remove("dark");
            }
        }

        // Check for logged in user
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
            }
        }
    }, [isDark]);

    // Check user on mount and when logged in
    useEffect(() => {
        const checkUser = () => {
            const token = localStorage.getItem("token");
            const savedUser = localStorage.getItem("user");

            if (token && savedUser) {
                try {
                    setUser(JSON.parse(savedUser));
                } catch {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };

        checkUser();

        // Listen for custom login event
        window.addEventListener("user-logged-in", checkUser);

        // Check periodically (for same-tab updates)
        const interval = setInterval(checkUser, 500);

        return () => {
            window.removeEventListener("user-logged-in", checkUser);
            clearInterval(interval);
        };
    }, []);

    // Check for affiliate store
    useEffect(() => {
        const checkAffiliateStore = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setAffiliateStore(null);
                return;
            }

            try {
                const API_URL = import.meta.env.VITE_API_URL || "https://kdn.infinitelearningstudent.id";
                const res = await fetch(`${API_URL}/api/affiliate/my-store`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                if (data.success && data.data) {
                    setAffiliateStore(data.data);
                } else {
                    setAffiliateStore(null);
                }
            } catch (err) {
                console.error("Check affiliate error:", err);
                setAffiliateStore(null);
            }
        };

        checkAffiliateStore();
    }, [user]); // Re-check when user changes

    // Handle scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Toggle dark mode
    const handleToggleDarkMode = () => {
        if (onToggleDarkMode) {
            onToggleDarkMode();
        } else {
            const newMode = !isDarkState;
            setIsDarkState(newMode);

            if (newMode) {
                document.documentElement.classList.add("dark");
                localStorage.setItem("theme", "dark");
            } else {
                document.documentElement.classList.remove("dark");
                localStorage.setItem("theme", "light");
            }
        }
    };

    // Logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setAffiliateStore(null);
        window.location.href = "/login";
    };

    if (!mounted) {
        return null;
    }

    const navLinks = [
        { name: "Home", href: "/", active: location.pathname === "/" },
        {
            name: "Affiliate",
            href: "/affiliate",
            active: location.pathname.startsWith("/affiliate"),
        },
        {
            name: "Smart Budgeting",
            href: "/smart-budgeting",
            active: location.pathname.startsWith("/smart-budget"),
        },
        {
            name: "About",
            href: "/about",
            active: location.pathname === "/about",
        },
    ];

    return (
        <nav
            className={clsx(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled
                    ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm py-3"
                    : "bg-transparent py-5",
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center h-full">
                        <Link to="/" className="flex items-center group block">
                            <img 
                                src={logoImg} 
                                alt="Pangan Pintar Logo" 
                                className="h-10 w-auto max-h-[80px] object-contain group-hover:scale-105 transition-transform duration-200"
                            />
                        </Link>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                className={clsx(
                                    "font-semibold text-sm tracking-wide transition-colors duration-200",
                                    link.active
                                        ? "text-emerald-600 dark:text-emerald-400"
                                        : "text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400",
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Right Side - Theme Toggle & Auth */}
                    <div className="hidden md:flex items-center space-x-4">
                        {/* Theme Toggle */}
                        <button
                            onClick={handleToggleDarkMode}
                            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/40 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200"
                            aria-label="Toggle dark mode"
                        >
                            {(typeof isDark !== "undefined" ? isDark : isDarkState) ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        {/* User Menu or Login Button */}
                        {user ? (
                            <div className="relative group">
                                <button className="flex items-center space-x-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/40 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors duration-200">
                                    <User size={16} className="text-slate-500 dark:text-slate-400" />
                                    <span className="text-slate-700 dark:text-slate-200 text-sm font-semibold">
                                        {(user.namaLengkap || user.name || 'User').split(' ')[0]}
                                    </span>
                                </button>
                                {/* Dropdown */}
                                <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800/80 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-1.5">
                                    <div className="space-y-0.5">
                                        <Link
                                            to="/profile"
                                            className="px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl flex items-center transition-colors"
                                        >
                                            <User size={16} className="mr-2.5 text-slate-400" />
                                            Profile
                                        </Link>
                                        <Link
                                            to="/edit-profile"
                                            className="px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl flex items-center transition-colors"
                                        >
                                            <Edit2 size={16} className="mr-2.5 text-slate-400" />
                                            Edit Profile
                                        </Link>
                                        {affiliateStore ? (
                                            <Link
                                                to={`/affiliate/${affiliateStore.slug}`}
                                                className="px-4 py-2.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-xl flex items-center transition-colors"
                                            >
                                                <Store size={16} className="mr-2.5" />
                                                Toko Saya
                                            </Link>
                                        ) : (
                                            <Link
                                                to="/join-affiliate"
                                                className="px-4 py-2.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-xl flex items-center transition-colors"
                                            >
                                                <Store size={16} className="mr-2.5" />
                                                Join Affiliate
                                            </Link>
                                        )}
                                        <hr className="my-1.5 border-slate-100 dark:border-slate-800" />
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2.5 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl flex items-center transition-colors"
                                        >
                                            <LogOut size={16} className="mr-2.5" />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="flex items-center space-x-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-md shadow-emerald-600/10 transition-all duration-200 transform hover:-translate-y-0.5"
                            >
                                <LogIn size={16} />
                                <span>Login</span>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center space-x-2">
                        <button
                            onClick={handleToggleDarkMode}
                            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/40 text-slate-600 dark:text-slate-300"
                            aria-label="Toggle dark mode"
                        >
                            {(typeof isDark !== "undefined" ? isDark : isDarkState) ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2.5 rounded-xl text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/40"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="md:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-900 shadow-xl transition-colors duration-300 animate-fade-in">
                    <div className="px-4 py-5 space-y-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                onClick={() => setIsOpen(false)}
                                className={clsx(
                                    "block py-1 font-semibold text-sm tracking-wide",
                                    link.active
                                        ? "text-emerald-600 dark:text-emerald-400"
                                        : "text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400",
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <hr className="border-slate-100 dark:border-slate-900" />
                        {user ? (
                            <div className="space-y-3 pt-1">
                                {affiliateStore ? (
                                    <Link
                                        to={`/affiliate/${affiliateStore.slug}`}
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center text-sm font-semibold text-emerald-600 dark:text-emerald-400"
                                    >
                                        <Store size={18} className="mr-2.5" />
                                        Toko Saya
                                    </Link>
                                ) : (
                                    <Link
                                        to="/join-affiliate"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center text-sm font-semibold text-emerald-600 dark:text-emerald-400"
                                    >
                                        <Store size={18} className="mr-2.5" />
                                        Join Affiliate
                                    </Link>
                                )}
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsOpen(false);
                                    }}
                                    className="flex items-center w-full text-left text-sm font-semibold text-red-600 dark:text-red-400"
                                >
                                    <LogOut size={18} className="mr-2.5" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-center space-x-2 w-full px-5 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-md shadow-emerald-600/10 transition-colors"
                            >
                                <LogIn size={18} />
                                <span>Login</span>
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}