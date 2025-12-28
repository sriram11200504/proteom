'use client';

import { useState } from 'react';
import axios from 'axios';
import { AlertCircle, MapPin, Send } from 'lucide-react';

export default function IncidentForm({ userId }: { userId: string }) {
    const [type, setType] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // For now, using hardcoded location. In real app, use Geolocation API.
            const latitude = 12.9716;
            const longitude = 77.5946;

            await axios.post('http://localhost:5000/api/incidents', {
                type,
                description,
                latitude,
                longitude,
                userId,
                severity: 'MEDIUM', // AI will decide this later
            });

            setType('');
            setDescription('');
            alert('Incident reported successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to report incident.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl">
            <div className="flex items-center gap-2 mb-6">
                <AlertCircle className="text-red-500 w-6 h-6" />
                <h2 className="text-xl font-bold text-white">Report Incident</h2>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Incident Type</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        required
                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-red-500 outline-none transition-all"
                    >
                        <option value="" disabled>Select type</option>
                        <option value="Fire">Fire</option>
                        <option value="Medical">Medical Emergency</option>
                        <option value="Accident">Accident</option>
                        <option value="Crime">Crime</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        placeholder="Describe the situation..."
                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-red-500 outline-none transition-all h-32 resize-none"
                    />
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <MapPin className="w-3 h-3" />
                    <span>Location: Bangalore, India (Simulated)</span>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Submitting...' : (
                        <>
                            <Send className="w-4 h-4" />
                            Submit Report
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
