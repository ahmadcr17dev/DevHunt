import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "./Loader";

const EmployerProtectedRoute = () => {
    const { user, loadingUser } = useAuth();

    // if user is loading than wait until fetching
    if (loadingUser) {
        return <Loader />
    }

    if (!user || user.role !== "employer") {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}

export default EmployerProtectedRoute;