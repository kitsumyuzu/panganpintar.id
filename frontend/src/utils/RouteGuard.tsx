import { useState, useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import LoginWarningModal from "../components/LoginWarningModal";

interface RouteGuardProps {
    children: ReactNode;
    requireAuth?: boolean;
}

export default function RouteGuard({
    children,
    requireAuth = true,
}: RouteGuardProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [showWarning, setShowWarning] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        if (requireAuth && (!token || !user)) {
            setShowWarning(true);
        } else {
            setShowWarning(false);
        }
        setIsLoading(false);
    }, [requireAuth]);

    const handleCloseWarning = () => {
        setShowWarning(false);
        if (!localStorage.getItem("token")) {
            navigate("/");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#e4e4e4] dark:bg-[#020617] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#259d84]"></div>
            </div>
        );
    }

    if (showWarning) {
        return (
            <>
                {children}
                <LoginWarningModal
                    isOpen={showWarning}
                    onClose={handleCloseWarning}
                    message="Anda harus login untuk mengakses halaman tersebut."
                />
            </>
        );
    }

    return <>{children}</>;
}