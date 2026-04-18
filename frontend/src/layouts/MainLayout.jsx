import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function MainLayout() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
    };

    const handleNavClick = () => {
        setSidebarOpen(false); // auto close di mobile
    };

    const navItemClass = ({ isActive }) =>
        `block px-4 py-2 rounded-lg transition ${
            isActive
                ? "bg-white text-indigo-700 font-semibold"
                : "hover:bg-indigo-600"
        }`;

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">

            {/* OVERLAY (mobile) */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* SIDEBAR */}
            <aside
                className={`
                w-64 bg-gradient-to-b from-indigo-700 to-indigo-900 text-white flex flex-col shadow-lg

                fixed md:static top-0 left-0 h-full md:h-auto z-50
                transform transition-transform duration-300

                ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
                `}
            >
                <div className="p-6 text-xl font-bold border-b border-indigo-500">
                    SS STORE
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <NavLink to="/dashboard" onClick={handleNavClick} className={navItemClass}>
                        Dashboard
                    </NavLink>

                    <NavLink to="/produk" onClick={handleNavClick} className={navItemClass}>
                        Produk
                    </NavLink>

                    <NavLink to="/penjualan" onClick={handleNavClick} className={navItemClass}>
                        Penjualan
                    </NavLink>
                </nav>

                <div className="p-4 border-t border-indigo-500 text-sm">
                    <p>Logged in as</p>
                    <b>Admin SS Store</b>
                </div>
            </aside>

            {/* MAIN */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* TOPBAR */}
                <header className="bg-white shadow px-4 md:px-6 py-4 flex justify-between items-center">

                    <div className="flex items-center gap-3">
                        {/* HAMBURGER */}
                        <button
                            className="md:hidden text-gray-700 text-xl"
                            onClick={() => setSidebarOpen(true)}
                        >
                            ☰
                        </button>

                        <h1 className="text-lg md:text-xl font-semibold text-gray-700">
                            Admin Panel
                        </h1>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-3 md:px-4 py-2 text-sm rounded-lg hover:bg-red-600 transition"
                    >
                        Logout
                    </button>
                </header>

                {/* CONTENT */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}