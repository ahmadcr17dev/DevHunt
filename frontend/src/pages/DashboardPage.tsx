import { Outlet } from "react-router-dom";
import EmployerSidebar from "../components/EmployerSidebar";

const DashboardPage = () => {
    return (
        <>
            <div className="flex min-h-dvh bg-slate-950">
                <EmployerSidebar />
                <main className="min-w-0 flex-1 p-0">
                    <Outlet />
                </main>
            </div>
        </>
    );
}

export default DashboardPage;