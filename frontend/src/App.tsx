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
import { useEffect } from "react";
import JobsOverview from "./components/JobsOverview";
import EmployerAccount from "./components/EmployerAccount";
import UpdateJobs from "./components/UpdateJobs";
import JobPage from "./components/Jobs";

const App = () => {

  // cursor spotlight function
  useEffect(() => {
    const HandleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty("--cursor-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--cursor-y", `${e.clientY}px`);
    }
    window.addEventListener("mousemove", HandleMouseMove);
    return () => window.removeEventListener("mousemove", HandleMouseMove);
  }, [])

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobspage" element={<JobPage />} />

        {/* General Protected Route */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profilecompleted" element={<ProfileCompleted />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Employer Protected Route */}
        <Route element={<EmployerProtectedRoute />}>
          <Route path="/employer" element={<DashboardPage />}>
            <Route index element={<JobsOverview />} />
            <Route path="getmyjobs" element={<JobsOverview />} />
            <Route path="createjob" element={<PostJob />} />
            <Route path="updatejobs" element={<UpdateJobs />} />
            <Route path="myaccount" element={<EmployerAccount />} />
          </Route>
        </Route>

        {/* Optional: Catch-all redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;