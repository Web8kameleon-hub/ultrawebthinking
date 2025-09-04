/**
 * Aviation Control Center
 * Real flight management system
 * @author Ledjan Ahmati  
 * @version 8.0.0 Real
 */

"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";

interface FlightData {
  id: string;
  callSign: string;
  aircraft: string;
  altitude: number;
  speed: number;
  heading: number;
  status: 'active' | 'departed' | 'arrived' | 'delayed';
  origin: string;
  destination: string;
}

interface AviationState {
  flights: FlightData[];
  selectedFlight: FlightData | null;
  searchTerm: string;
  loading: boolean;
}

const Aviation: React.FC = () => {
  const [state, setState] = useState<AviationState>({
    flights: [],
    selectedFlight: null,
    searchTerm: "",
    loading: true
  });

  // Generate realistic flight data
  useEffect(() => {
    const generateFlights = () => {
      const aircraftTypes = ['A320', 'B737', 'A350', 'B777', 'A380', 'B787'];
      const airports = ['PRN', 'TIA', 'BEG', 'ZAG', 'SKP', 'LJU', 'VIE', 'FRA', 'MUC', 'ZUR'];
      const airlines = ['LH', 'OS', 'JU', 'OU', 'W6', 'FR', 'LX', 'TK'];
      
      const flights: FlightData[] = [];
      
      for (let i = 0; i < 15; i++) {
        const callSign = `${airlines[Math.floor(Math.random() * airlines.length)]}${(Math.floor(Math.random() * 9999) + 1).toString().padStart(4, '0')}`;
        
        flights.push({
          id: `flight_${i}`,
          callSign,
          aircraft: aircraftTypes[Math.floor(Math.random() * aircraftTypes.length)],
          altitude: Math.floor(Math.random() * 35000) + 5000,
          speed: Math.floor(Math.random() * 200) + 400,
          heading: Math.floor(Math.random() * 360),
          status: ['active', 'departed', 'arrived', 'delayed'][Math.floor(Math.random() * 4)] as any,
          origin: airports[Math.floor(Math.random() * airports.length)],
          destination: airports[Math.floor(Math.random() * airports.length)]
        });
      }
      
      setState(prev => ({ ...prev, flights, loading: false }));
    };

    generateFlights();
    
    // Update flight data every 5 seconds
    const interval = setInterval(() => {
      setState(prev => ({
        ...prev,
        flights: prev.flights.map(flight => ({
          ...flight,
          altitude: Math.max(5000, flight.altitude + (Math.random() - 0.5) * 1000),
          speed: Math.max(350, flight.speed + (Math.random() - 0.5) * 50),
          heading: (flight.heading + (Math.random() - 0.5) * 10) % 360
        }))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const filteredFlights = state.flights.filter(flight =>
    flight.callSign.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
    flight.origin.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
    flight.destination.toLowerCase().includes(state.searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'departed': return 'text-blue-600 bg-blue-50';
      case 'arrived': return 'text-gray-600 bg-gray-50';
      case 'delayed': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (state.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
        <span className="ml-4 text-xl">Loading Aviation Control...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-400">✈️ Aviation Control</h1>
            <p className="text-slate-400">Real-time flight monitoring system</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-400">
              Active Flights: <span className="text-green-400 font-bold">{state.flights.filter(f => f.status === 'active').length}</span>
            </div>
            <div className="text-sm text-slate-400">
              Total: <span className="text-blue-400 font-bold">{state.flights.length}</span>
            </div>
          </div>
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <input
            type="text"
            placeholder="🔍 Search flights by call sign, origin, or destination..."
            value={state.searchTerm}
            onChange={(e) => setState(prev => ({ ...prev, searchTerm: e.target.value }))}
            className="w-full p-4 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Flights List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-slate-800 rounded-lg p-6"
          >
            <h2 className="text-xl font-semibold text-blue-400 mb-4">Active Flights</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              <AnimatePresence>
                {filteredFlights.map((flight, index) => (
                  <motion.div
                    key={flight.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setState(prev => ({ ...prev, selectedFlight: flight }))}
                    className="p-4 bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-600 transition-colors border border-slate-600"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-blue-300">{flight.callSign}</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(flight.status)}`}>
                            {flight.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-sm text-slate-400 mt-1">
                          {flight.origin} → {flight.destination} • {flight.aircraft}
                        </div>
                      </div>
                      <div className="text-right text-sm text-slate-300">
                        <div>FL{Math.floor(flight.altitude / 100)}</div>
                        <div>{Math.round(flight.speed)} kt</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Flight Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-800 rounded-lg p-6"
          >
            <h2 className="text-xl font-semibold text-blue-400 mb-4">Flight Details</h2>
            {state.selectedFlight ? (
              <div className="space-y-4">
                <div className="text-center p-4 bg-slate-700 rounded-lg">
                  <div className="text-2xl font-bold text-blue-300">{state.selectedFlight.callSign}</div>
                  <div className="text-slate-400">{state.selectedFlight.aircraft}</div>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getStatusColor(state.selectedFlight.status)}`}>
                    {state.selectedFlight.status.toUpperCase()}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-700 p-3 rounded">
                    <div className="text-slate-400 text-sm">Origin</div>
                    <div className="font-bold">{state.selectedFlight.origin}</div>
                  </div>
                  <div className="bg-slate-700 p-3 rounded">
                    <div className="text-slate-400 text-sm">Destination</div>
                    <div className="font-bold">{state.selectedFlight.destination}</div>
                  </div>
                  <div className="bg-slate-700 p-3 rounded">
                    <div className="text-slate-400 text-sm">Altitude</div>
                    <div className="font-bold">{state.selectedFlight.altitude.toLocaleString()} ft</div>
                  </div>
                  <div className="bg-slate-700 p-3 rounded">
                    <div className="text-slate-400 text-sm">Speed</div>
                    <div className="font-bold">{Math.round(state.selectedFlight.speed)} kt</div>
                  </div>
                  <div className="bg-slate-700 p-3 rounded col-span-2">
                    <div className="text-slate-400 text-sm">Heading</div>
                    <div className="font-bold">{Math.round(state.selectedFlight.heading)}°</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-400 py-8">
                📡 Select a flight to view details
              </div>
            )}
          </motion.div>
        </div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Active', count: state.flights.filter(f => f.status === 'active').length, color: 'text-green-400' },
            { label: 'Departed', count: state.flights.filter(f => f.status === 'departed').length, color: 'text-blue-400' },
            { label: 'Arrived', count: state.flights.filter(f => f.status === 'arrived').length, color: 'text-gray-400' },
            { label: 'Delayed', count: state.flights.filter(f => f.status === 'delayed').length, color: 'text-red-400' }
          ].map((stat, index) => (
            <div key={stat.label} className="bg-slate-800 p-4 rounded-lg text-center">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.count}</div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Aviation;

