import React, { useState } from 'react';
import { Search, Calendar, MapPin, Bus } from 'lucide-react';

function App() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', { from, to, date });
    alert(`Searching buses from ${from} to ${to} on ${date}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Bus className="h-10 w-10 text-red-600 mr-2" />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900 leading-tight">ASAP Travels</span>
                <span className="text-xs text-gray-500 font-medium tracking-wide">As soon as Possible</span>
              </div>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-sky-600 px-3 py-2 font-medium">Bus Tickets</a>
              <a href="#" className="text-gray-700 hover:text-sky-600 px-3 py-2 font-medium">Help</a>
              <a href="#" className="text-gray-700 hover:text-sky-600 px-3 py-2 font-medium">Account</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-sky-600 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16 text-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
            India's No. 1 Online Bus Ticket Booking Site
          </h1>
          <p className="mt-4 text-xl text-sky-100 max-w-3xl mx-auto">
            Book your bus tickets from the comfort of your home. Secure, Fast, and Reliable.
          </p>
        </div>
      </div>

      {/* Search Widget */}
      <div className="-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-10">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">

            {/* From Input */}
            <div className="flex-1 w-full relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Bus className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Enter Source City"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                />
              </div>
            </div>

            {/* To Input */}
            <div className="flex-1 w-full relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Enter Destination City"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                />
              </div>
            </div>

            {/* Date Input */}
            <div className="flex-1 w-full relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            {/* Search Button */}
            <div className="w-full md:w-auto">
              <button
                type="submit"
                className="w-full flex justify-center items-center py-3 px-8 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
              >
                <Search className="h-5 w-5 mr-2" />
                Search Buses
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center max-w-4xl mx-auto">
          <div className="p-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-sky-100 mb-4">
              <Calendar className="h-8 w-8 text-sky-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Reschedule Tickets</h3>
            <p className="text-gray-600">Change your travel date for free up to 8 hours before departure.</p>
          </div>
          <div className="p-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-sky-100 mb-4">
              <MapPin className="h-8 w-8 text-sky-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Live Tracking</h3>
            <p className="text-gray-600">Track your bus location in real-time and share with family.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
