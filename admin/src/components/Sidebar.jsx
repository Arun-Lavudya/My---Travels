import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Bus, Route, Ticket, LogOut } from 'lucide-react';
import authService from '../services/authService';

const Sidebar = () => {
    const user = authService.getCurrentUser();
    const handleLogout = () => {
        authService.logout();
        window.location.reload();
    };

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Bookings', path: '/bookings', icon: Ticket },
        { name: 'Buses', path: '/buses', icon: Bus, roles: ['admin'] },
        { name: 'Routes', path: '/routes', icon: Route, roles: ['admin'] },
        { name: 'Add Booking', path: '/add-booking', icon: Ticket },
    ];

    const filteredItems = navItems.filter(item => !item.roles || item.roles.includes(user?.role));

    return (
        <div className="w-64 bg-indigo-900 min-h-screen text-white flex flex-col">
            <div className="p-6">
                <h2 className="text-2xl font-bold">ASAP Admin</h2>
                <p className="text-xs text-indigo-300 capitalize">{user?.role} Account</p>
            </div>

            <nav className="flex-1 mt-6">
                {filteredItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center px-6 py-3 transition-colors ${isActive ? 'bg-indigo-700 border-l-4 border-sky-400' : 'hover:bg-indigo-800'
                            }`
                        }
                    >
                        <item.icon className="mr-3" size={20} />
                        {item.name}
                    </NavLink>
                ))}
            </nav>

            <button
                onClick={handleLogout}
                className="flex items-center px-6 py-4 hover:bg-indigo-800 transition-colors mt-auto border-t border-indigo-800"
            >
                <LogOut className="mr-3" size={20} />
                Logout
            </button>
        </div>
    );
};

export default Sidebar;
