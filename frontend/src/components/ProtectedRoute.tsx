import { useAuth } from "../context/AuthContext";
import { Outlet, Navigate } from "react-router-dom";
import Loader from "../components/Loader";

const ProtectedRoute = () => {
    const { user, loadingUser } = useAuth();

    // While auth is loading, show loader
    if (loadingUser) return <Loader />;

    // If user is not logged in, redirect to login
    if (!user) return <Navigate to="/login" replace />;

    // User is logged in, render protected routes
    return <Outlet />;
};

export default ProtectedRoute;