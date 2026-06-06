import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon, LogIn, User, LogOut, Store, Edit2 } from "lucide-react";
import clsx from "clsx";

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

    // Initialize dark mode on mount
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
    }, []);

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
                const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
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
                    ? "bg-white/90 dark:bg-[#020617]/90 backdrop-blur-md shadow-md py-3"
                    : "bg-transparent py-4",
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-[#259d84] rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">
                                    P
                                </span>
                            </div>
                            <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
                                Pangan
                                <span className="text-[#259d84]">Pintar</span>
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                className={clsx(
                                    "font-medium transition-colors",
                                    link.active
                                        ? "text-[#259d84]"
                                        : "text-gray-700 dark:text-gray-300 hover:text-[#259d84] dark:hover:text-[#259d84]",
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
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Toggle dark mode"
                        >
                            {(typeof isDark !== "undefined" ? isDark : isDarkState) ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {/* User Menu or Login Button */}
                        {user ? (
                            <div className="relative group">
                                <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                    <User size={18} className="text-gray-700 dark:text-gray-300" />
                                    <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                                        {(user.namaLengkap || user.name || 'User').split(' ')[0]}
                                    </span>
                                </button>
                                {/* Dropdown */}
                                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                                    <div className="py-2">
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                                        >
                                            <User size={16} className="mr-2" />
                                            Profile
                                        </Link>
                                        <Link
                                            to="/edit-profile"
                                            className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                                        >
                                            <Edit2 size={16} className="mr-2" />
                                            Edit Profile
                                        </Link>
                                        {affiliateStore ? (
                                            <Link
                                                to={`/affiliate/${affiliateStore.slug}`}
                                                className="block px-4 py-2 text-green-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                                            >
                                                <Store size={16} className="mr-2" />
                                                Toko Saya
                                            </Link>
                                        ) : (
                                            <Link
                                                to="/join-affiliate"
                                                className="block px-4 py-2 text-green-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                                            >
                                                <Store size={16} className="mr-2" />
                                                Join Affiliate
                                            </Link>
                                        )}
                                        <hr className="my-2 border-gray-200 dark:border-gray-700" />
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                                        >
                                            <LogOut size={16} className="mr-2" />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="flex items-center space-x-2 px-5 py-2.5 bg-[#259d84] hover:bg-[#1f7a68] text-white font-medium rounded-lg transition-colors"
                            >
                                <LogIn size={18} />
                                <span>Login</span>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center space-x-3">
                        <button
                            onClick={handleToggleDarkMode}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                            aria-label="Toggle dark mode"
                        >
                            {(typeof isDark !== "undefined" ? isDark : isDarkState) ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="md:hidden bg-white dark:bg-[#020617] shadow-lg">
                    <div className="px-4 py-4 space-y-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                onClick={() => setIsOpen(false)}
                                className={clsx(
                                    "block py-2 font-medium",
                                    link.active
                                        ? "text-[#259d84]"
                                        : "text-gray-700 dark:text-gray-300 hover:text-[#259d84]",
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <hr className="border-gray-200 dark:border-gray-700" />
                        {user ? (
                            <>
                                {affiliateStore ? (
                                    <Link
                                        to={`/affiliate/${affiliateStore.slug}`}
                                        onClick={() => setIsOpen(false)}
                                        className="block py-2 text-green-600 font-medium"
                                    >
                                        <Store size={18} className="inline mr-2" />
                                        Toko Saya
                                    </Link>
                                ) : (
                                    <Link
                                        to="/join-affiliate"
                                        onClick={() => setIsOpen(false)}
                                        className="block py-2 text-green-600 font-medium"
                                    >
                                        <Store size={18} className="inline mr-2" />
                                        Join Affiliate
                                    </Link>
                                )}
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsOpen(false);
                                    }}
                                    className="flex items-center space-x-2 w-full px-5 py-2.5 text-red-600 font-medium"
                                >
                                    <LogOut size={18} />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-center space-x-2 w-full px-5 py-2.5 bg-[#259d84] hover:bg-[#1f7a68] text-white font-medium rounded-lg transition-colors"
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