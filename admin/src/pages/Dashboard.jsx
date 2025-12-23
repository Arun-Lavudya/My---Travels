import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bus, Navigation, Ticket } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({
        activeBuses: 0,
        totalRoutes: 0,
        todaysBookings: 0,
        totalBookings: 0
    });

    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('http://localhost:5001/api/v1/dashboard/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(res.data);
            } catch (err) {
                console.error('Error fetching dashboard stats');
            }
        };

        fetchStats();
    }, [token]);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Operations Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600">
                            <Bus size={24} />
                        </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Active Buses</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stats.activeBuses}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-sky-100 p-3 rounded-xl text-sky-600">
                            <Navigation size={24} />
                        </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Total Routes</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalRoutes}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600">
                            <Ticket size={24} />
                        </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Today's Bookings</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stats.todaysBookings}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-amber-100 p-3 rounded-xl text-amber-600">
                            <Ticket size={24} />
                        </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Total Bookings</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalBookings}</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
