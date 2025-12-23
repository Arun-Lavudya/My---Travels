import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Bus as BusIcon, AlertCircle, Edit, Trash2 } from 'lucide-react';

const Buses = () => {
    const [buses, setBuses] = useState([]);
    const [busTypes, setBusTypes] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingBus, setEditingBus] = useState(null);
    const [formData, setFormData] = useState({
        bus_type_id: '',
        reg_number: '',
        name: '',
        total_seats: '',
        status: 'active'
    });
    const [error, setError] = useState('');

    const user = JSON.parse(localStorage.getItem('user'));
    const isAdmin = user?.role === 'admin';
    const API_URL = 'http://localhost:5001/api/v1/buses';
    const token = user?.token;

    useEffect(() => {
        fetchBuses();
        fetchBusTypes();
    }, []);

    const fetchBuses = async () => {
        try {
            const res = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBuses(res.data);
        } catch (err) {
            console.error('Error fetching buses');
        }
    };

    const fetchBusTypes = async () => {
        try {
            const res = await axios.get(`${API_URL}/types`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBusTypes(res.data);
        } catch (err) {
            console.error('Error fetching bus types');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingBus) {
                await axios.put(`${API_URL}/${editingBus.id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(API_URL, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            handleCloseForm();
            fetchBuses();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save bus');
        }
    };

    const handleEdit = (bus) => {
        setEditingBus(bus);
        setFormData({
            bus_type_id: bus.bus_type_id,
            reg_number: bus.reg_number,
            name: bus.name,
            total_seats: bus.total_seats,
            status: bus.status
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this bus?')) return;
        try {
            await axios.delete(`${API_URL}/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchBuses();
            setError(''); // Clear any previous errors
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to delete bus';
            setError(msg);
            setShowForm(true); // Show form to reveal the error alert
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingBus(null);
        setFormData({ bus_type_id: '', reg_number: '', name: '', total_seats: '', status: 'active' });
        setError('');
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Fleet Management</h1>
                {isAdmin && (
                    <button
                        onClick={() => { editingBus ? handleCloseForm() : setShowForm(!showForm) }}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700"
                    >
                        <Plus size={18} className="mr-2" />
                        {editingBus ? 'Cancel Edit' : 'Add Bus'}
                    </button>
                )}
            </div>

            {showForm && isAdmin && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 max-w-2xl">
                    <h2 className="text-lg font-semibold mb-4">{editingBus ? 'Edit Bus' : 'Register New Bus'}</h2>
                    {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 flex items-center"><AlertCircle size={18} className="mr-2" />{error}</div>}
                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bus Name / Label</label>
                            <input
                                type="text"
                                className="w-full border rounded-lg p-2"
                                placeholder="e.g. Morning Star #1"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                            <input
                                type="text"
                                className="w-full border rounded-lg p-2"
                                placeholder="TS09UB1234"
                                required
                                value={formData.reg_number}
                                onChange={(e) => setFormData({ ...formData, reg_number: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bus Type</label>
                            <select
                                className="w-full border rounded-lg p-2"
                                required
                                value={formData.bus_type_id}
                                onChange={(e) => setFormData({ ...formData, bus_type_id: e.target.value })}
                            >
                                <option value="">Select Type</option>
                                {busTypes.map(t => (
                                    <option key={t.id} value={t.id}>{t.name} ({t.type})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Total Seats</label>
                            <input
                                type="number"
                                className="w-full border rounded-lg p-2"
                                required
                                value={formData.total_seats}
                                onChange={(e) => setFormData({ ...formData, total_seats: e.target.value })}
                            />
                        </div>
                        <div className="col-span-2 flex justify-end gap-2 mt-2">
                            <button type="button" onClick={handleCloseForm} className="px-4 py-2 text-gray-600">Cancel</button>
                            <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg">
                                {editingBus ? 'Update Bus' : 'Save Bus'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Bus Name</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Reg No</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Type</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Seats</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                            {isAdmin && <th className="px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {buses.map((bus) => (
                            <tr key={bus.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 flex items-center">
                                    <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600 mr-3">
                                        <BusIcon size={18} />
                                    </div>
                                    <span className="font-medium text-gray-900">{bus.name}</span>
                                </td>
                                <td className="px-6 py-4 text-gray-600 font-mono">{bus.reg_number}</td>
                                <td className="px-6 py-4 text-gray-600">{bus.bus_type_name}</td>
                                <td className="px-6 py-4 text-gray-600">{bus.total_seats}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium uppercase">
                                        {bus.status}
                                    </span>
                                </td>
                                {isAdmin && (
                                    <td className="px-6 py-4 text-gray-600">
                                        <div className="flex gap-3">
                                            <button onClick={() => handleEdit(bus)} className="text-gray-400 hover:text-indigo-600 transition-colors">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(bus.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {buses.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        No buses registered yet. Click "Add Bus" to get started.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Buses;
