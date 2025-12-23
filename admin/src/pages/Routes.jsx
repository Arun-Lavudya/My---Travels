import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, MapPin, Navigation, AlertCircle, Trash2, Edit } from 'lucide-react';

const RoutesPage = () => {
    const [routes, setRoutes] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingRoute, setEditingRoute] = useState(null);
    const [formData, setFormData] = useState({
        source_city: '',
        destination_city: '',
        distance_km: '',
        duration_minutes: ''
    });
    const [error, setError] = useState('');

    const user = JSON.parse(localStorage.getItem('user'));
    const isAdmin = user?.role === 'admin';
    const API_URL = 'http://localhost:5001/api/v1/routes';
    const token = user?.token;

    useEffect(() => {
        fetchRoutes();
    }, []);

    const fetchRoutes = async () => {
        try {
            const res = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRoutes(res.data);
        } catch (err) {
            console.error('Error fetching routes');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingRoute) {
                await axios.put(`${API_URL}/${editingRoute.id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(API_URL, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            handleCloseForm();
            fetchRoutes();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save route');
        }
    };

    const handleEdit = (route) => {
        setEditingRoute(route);
        setFormData({
            source_city: route.source_city,
            destination_city: route.destination_city,
            distance_km: route.distance_km,
            duration_minutes: route.duration_minutes
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this route?')) return;
        try {
            await axios.delete(`${API_URL}/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchRoutes();
            setError('');
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to delete route';
            setError(msg);
            setShowForm(true);
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingRoute(null);
        setFormData({ source_city: '', destination_city: '', distance_km: '', duration_minutes: '' });
        setError('');
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Route Management</h1>
                {isAdmin && (
                    <button
                        onClick={() => { editingRoute ? handleCloseForm() : setShowForm(!showForm) }}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700"
                    >
                        <Plus size={18} className="mr-2" />
                        {editingRoute ? 'Cancel Edit' : 'Add Route'}
                    </button>
                )}
            </div>

            {showForm && isAdmin && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 max-w-2xl">
                    <h2 className="text-lg font-semibold mb-4">{editingRoute ? 'Edit Route' : 'Define New Route'}</h2>
                    {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 flex items-center"><AlertCircle size={18} className="mr-2" />{error}</div>}
                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Source City</label>
                            <input
                                type="text"
                                className="w-full border rounded-lg p-2"
                                placeholder="e.g. Hyderabad"
                                required
                                value={formData.source_city}
                                onChange={(e) => setFormData({ ...formData, source_city: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Destination City</label>
                            <input
                                type="text"
                                className="w-full border rounded-lg p-2"
                                placeholder="e.g. Bangalore"
                                required
                                value={formData.destination_city}
                                onChange={(e) => setFormData({ ...formData, destination_city: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Distance (km)</label>
                            <input
                                type="number"
                                className="w-full border rounded-lg p-2"
                                placeholder="e.g. 570"
                                value={formData.distance_km}
                                onChange={(e) => setFormData({ ...formData, distance_km: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                            <input
                                type="number"
                                className="w-full border rounded-lg p-2"
                                placeholder="e.g. 480"
                                value={formData.duration_minutes}
                                onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                            />
                        </div>
                        <div className="col-span-2 flex justify-end gap-2 mt-2">
                            <button type="button" onClick={handleCloseForm} className="px-4 py-2 text-gray-600">Cancel</button>
                            <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg">
                                {editingRoute ? 'Update Route' : 'Save Route'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {routes.map((route) => (
                    <div key={route.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative group">
                        {isAdmin && (
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleEdit(route)}
                                    className="text-gray-300 hover:text-indigo-600"
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(route.id)}
                                    className="text-gray-300 hover:text-red-500"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        )}
                        <div className="flex items-start justify-between mb-4">
                            <div className="bg-sky-100 p-3 rounded-lg text-sky-600">
                                <Navigation size={24} />
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Distance</span>
                                <p className="font-bold text-gray-800">{route.distance_km} KM</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col items-center">
                                <MapPin size={16} className="text-indigo-600" />
                                <div className="w-0.5 h-8 bg-gray-200"></div>
                                <MapPin size={16} className="text-sky-600" />
                            </div>
                            <div className="flex flex-col gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">From</p>
                                    <p className="font-bold text-gray-800">{route.source_city}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">To</p>
                                    <p className="font-bold text-gray-800">{route.destination_city}</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between text-sm">
                            <span className="text-gray-500">Est. Duration</span>
                            <span className="font-semibold text-gray-700">{Math.floor(route.duration_minutes / 60)}h {route.duration_minutes % 60}m</span>
                        </div>
                    </div>
                ))}
                {routes.length === 0 && (
                    <div className="col-span-full p-12 bg-white rounded-xl border border-dashed border-gray-300 text-center text-gray-500">
                        No routes defined yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoutesPage;
