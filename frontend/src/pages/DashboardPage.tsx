import { Outlet } from "react-router-dom";
import EmployerSidebar from "../components/EmployerSidebar";

const DashboardPage = () => {
    return (
        <>
            <div className="flex h-screen bg-slate-950 overflow-hidden">
                <EmployerSidebar />
                <main className="flex-1 overflow-y-auto p-0">
                    <Outlet />  {/* ← PostJob renders here */}
                </main>
            </div>
        </>
    );
}

export default DashboardPage;