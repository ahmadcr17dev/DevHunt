import Home from "./pages/Home";
import Login from "./components/Login";
import { Route, Routes, Navigate } from "react-router-dom";
import Register from "./components/Register";
import ProfileCompleted from "./components/ProfileCompleted";
import Profile from "./components/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import EmployerProtectedRoute from "./components/EmployerProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import PostJob from "./components/PostJob";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/postjob" element={<PostJob />} />

        {/* General Protected Route */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profilecompleted" element={<ProfileCompleted />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Employer Protected Route */}
        <Route element={<EmployerProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>

        {/* Optional: Catch-all redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;