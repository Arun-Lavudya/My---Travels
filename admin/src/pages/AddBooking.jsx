import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Ticket, Users, Calendar, Bus as BusIcon, CheckCircle2, AlertCircle } from 'lucide-react';

const AddBooking = () => {
    const [schedules, setSchedules] = useState([]);
    const [selectedScheduleId, setSelectedScheduleId] = useState('');
    const [inventory, setInventory] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [customer, setCustomer] = useState({ name: '', email: '', phone: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const API_BASE = 'http://localhost:5001/api/v1';
    const token = JSON.parse(localStorage.getItem('user'))?.token;

    useEffect(() => {
        fetchSchedules();
    }, []);

    const fetchSchedules = async () => {
        try {
            const res = await axios.get(`${API_BASE}/bookings/schedules`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSchedules(res.data);
        } catch (err) {
            console.error('Error fetching schedules');
        }
    };

    const fetchInventory = async (scheduleId) => {
        if (!scheduleId) return;
        try {
            const res = await axios.get(`${API_BASE}/bookings/inventory/${scheduleId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setInventory(res.data);
            setSelectedScheduleId(scheduleId);
            setSelectedSeats([]);
            setError('');
        } catch (err) {
            console.error('Error fetching inventory');
        }
    };

    const toggleSeat = (seat) => {
        if (seat.status !== 'available') return;
        if (selectedSeats.includes(seat.seat_number)) {
            setSelectedSeats(selectedSeats.filter(s => s !== seat.seat_number));
        } else {
            setSelectedSeats([...selectedSeats, seat.seat_number]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedScheduleId) return setError('Please select a trip/schedule');
        if (!selectedSeats.length) return setError('Please select at least one seat');

        setLoading(true);
        setError('');
        try {
            await axios.post(`${API_BASE}/bookings/manual`, {
                schedule_id: selectedScheduleId,
                customer_name: customer.name,
                customer_email: customer.email,
                customer_phone: customer.phone,
                seats: selectedSeats
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-lg mx-auto mt-12">
                <div className="bg-emerald-100 p-4 rounded-full text-emerald-600 mb-6 font-bold">
                    <CheckCircle2 size={48} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Booking Confirmed!</h2>
                <p className="text-gray-500 text-center mt-2">The seats have been reserved successfully and the inventory has been updated.</p>
                <div className="flex gap-4 mt-8">
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                    >
                        New Booking
                    </button>
                    <a href="/bookings" className="px-8 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200">View All</a>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Ticket className="mr-2 text-sky-500" /> Manual Booking
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Trip Selection */}
                <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
                    <h2 className="text-lg font-semibold mb-6 flex items-center">
                        <Calendar size={18} className="mr-2 text-indigo-600" /> Select Trip
                    </h2>
                    <div className="space-y-3">
                        {schedules.map(s => (
                            <button
                                key={s.id}
                                onClick={() => fetchInventory(s.id)}
                                className={`w-full text-left p-4 rounded-xl border transition-all ${selectedScheduleId === s.id ? 'bg-indigo-50 border-indigo-200 ring-2 ring-indigo-100' : 'bg-white border-gray-100 hover:border-gray-300'
                                    }`}
                            >
                                <p className="text-xs font-bold text-gray-400 uppercase leading-none mb-1">{s.reg_number}</p>
                                <p className="font-bold text-gray-800 text-sm">{s.source_city} → {s.destination_city}</p>
                                <p className="text-xs text-indigo-600 mt-1">
                                    {new Date(s.departure_time).toLocaleDateString()} at {new Date(s.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </button>
                        ))}
                        {schedules.length === 0 && (
                            <p className="text-sm text-gray-500 italic">No active schedules found.</p>
                        )}
                    </div>
                </div>

                {/* Seat Map */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[400px]">
                    <h2 className="text-lg font-semibold mb-6 flex items-center">
                        <BusIcon size={18} className="mr-2 text-indigo-600" /> Seat Layout
                    </h2>

                    {selectedScheduleId ? (
                        <>
                            <div className="grid grid-cols-4 gap-4 max-w-sm mx-auto p-6 bg-gray-50 rounded-3xl border-4 border-gray-200 relative">
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-200 px-4 py-1 rounded-full text-[10px] font-black uppercase text-gray-500">Front</div>
                                {inventory.map(seat => (
                                    <button
                                        key={seat.seat_number}
                                        onClick={() => toggleSeat(seat)}
                                        disabled={seat.status !== 'available'}
                                        className={`h-14 rounded-xl font-bold transition-all flex items-center justify-center text-sm shadow-sm
                                            ${seat.status === 'booked' ? 'bg-gray-300 text-gray-500 cursor-not-allowed' :
                                                selectedSeats.includes(seat.seat_number) ? 'bg-indigo-600 text-white scale-105 shadow-md ring-4 ring-indigo-100' :
                                                    'bg-white text-gray-700 hover:border-indigo-400 border-2 border-gray-100 hover:shadow-md'}
                                        `}
                                    >
                                        {seat.seat_number}
                                    </button>
                                ))}
                            </div>
                            <div className="mt-8 flex justify-center gap-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <div className="flex items-center"><div className="w-3 h-3 bg-white border-2 border-gray-200 rounded mr-2"></div> Available</div>
                                <div className="flex items-center"><div className="w-3 h-3 bg-indigo-600 rounded mr-2"></div> Selected</div>
                                <div className="flex items-center"><div className="w-3 h-3 bg-gray-300 rounded mr-2"></div> Booked</div>
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <BusIcon size={48} className="mb-4 opacity-20" />
                            <p>Please select a trip to view seats</p>
                        </div>
                    )}
                </div>

                {/* Passenger Details */}
                <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
                    <h2 className="text-lg font-semibold mb-6 flex items-center">
                        <Users size={18} className="mr-2 text-indigo-600" /> Passenger
                    </h2>

                    {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 flex items-center text-xs"><AlertCircle size={14} className="mr-2" />{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Name</label>
                            <input
                                type="text"
                                className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-indigo-500 outline-none transition-colors"
                                required
                                value={customer.name}
                                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Phone</label>
                            <input
                                type="text"
                                className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-indigo-500 outline-none transition-colors"
                                required
                                value={customer.phone}
                                onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                            />
                        </div>

                        <div className="pt-4 border-t border-gray-50 mt-6">
                            <div className="flex justify-between mb-4">
                                <span className="text-sm text-gray-500">Seats ({selectedSeats.length})</span>
                                <span className="font-bold text-gray-800">{selectedSeats.join(', ') || '—'}</span>
                            </div>
                            <div className="flex justify-between text-xl mb-6">
                                <span className="font-black text-gray-900">Total</span>
                                <span className="font-black text-indigo-600">₹{(selectedSeats.length * 1200).toLocaleString()}</span>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !selectedSeats.length}
                                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                            >
                                {loading ? 'Processing...' : 'Complete Booking'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddBooking;
