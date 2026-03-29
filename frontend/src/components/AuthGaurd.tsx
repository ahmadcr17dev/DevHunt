// AuthGuard.tsx - FIXED
import type { JSX } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

const AuthGuard = ({ children }: { children: JSX.Element }) => {
    const { user, loadingUser } = useAuth();
    const location = useLocation();

    // Show loader while checking auth
    if (loadingUser) {
        return null; // or <Loader /> if you want
    }

    // If LOGGED IN → redirect (but NOT if already on target page)
    if (user) {
        const targetPath = user.role === "employer" ? "/employer" : "/jobspage";
        
        // Prevent loop - don't redirect if already on target
        if (location.pathname === targetPath) {
            return children;
        }
        
        return <Navigate to={targetPath} state={{ from: location }} replace />;
    }

    // Not logged in → allow access
    return children;
};

export default AuthGuard;