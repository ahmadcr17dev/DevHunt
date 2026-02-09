import { useAuth } from "../context/AuthContext";
import { Outlet, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { useEffect } from "react";

const ProtectedRoute = () => {
    const { user, loadingUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login", { replace: true }); // redirect immediately if not logged in
        }
    }, [user]);

    // Wait for user to load
    if (loadingUser) return <Loader />;

    return <Outlet />;
};

export default ProtectedRoute;