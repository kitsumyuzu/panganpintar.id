import { Navigate, useLocation } from "react-router-dom";
import { useState, useEffect, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
    children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // Check for token
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        if (token && user) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#e4e4e4] dark:bg-[#020617] flex items-center justify-center">
                <Loader2 className="animate-spin text-[#259d84]" size={40} />
            </div>
        );
    }

    if (!isAuthenticated) {
        // Store the location they were trying to go to
        return (
            <Navigate to="/login" state={{ from: location.pathname }} replace />
        );
    }

    return <>{children}</>;
}