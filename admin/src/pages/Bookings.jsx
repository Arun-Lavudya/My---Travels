import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Ticket, User, Calendar, MapPin, Bus } from 'lucide-react';

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;

    useEffect(() => {
        fetchBookings();
    }, [token]);

    const fetchBookings = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/v1/bookings', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBookings(res.data);
        } catch (err) {
            console.error('Error fetching bookings');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Ticket className="mr-2 text-indigo-600" /> All Bookings
            </h1>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Customer</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Route</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Travel Date</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Bus / Amount</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {bookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600 mr-3">
                                            <User size={18} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{booking.customer_name}</p>
                                            <p className="text-xs text-gray-500">{booking.customer_phone}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <MapPin size={14} className="mr-1 text-gray-400" />
                                        {booking.source_city} → {booking.destination_city}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Calendar size={14} className="mr-1 text-gray-400" />
                                        {new Date(booking.departure_time).toLocaleDateString(undefined, {
                                            day: 'numeric',
                                            month: 'short',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div>
                                        <div className="flex items-center text-xs text-gray-500 mb-1">
                                            <Bus size={12} className="mr-1" /> {booking.bus_reg}
                                        </div>
                                        <p className="font-bold text-gray-900">₹{parseFloat(booking.total_amount).toLocaleString()}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                                            booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                'bg-amber-100 text-amber-700'
                                        }`}>
                                        {booking.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {bookings.length === 0 && !loading && (
                    <div className="p-12 text-center text-gray-500">
                        No bookings found yet.
                    </div>
                )}
                {loading && (
                    <div className="p-12 text-center text-gray-500">
                        Loading bookings...
                    </div>
                )}
            </div>
        </div>
    );
};

export default Bookings;
