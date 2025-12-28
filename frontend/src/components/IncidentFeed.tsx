'use client';

import { useEffect, useState } from 'react';
import socket from '@/lib/socket';
import { Clock, ShieldCheck, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Incident {
    id: string;
    type: string;
    description: string;
    severity: string;
    status: string;
    createdAt: string;
    latitude: number;
    longitude: number;
}

export default function IncidentFeed({ initialIncidents }: { initialIncidents: Incident[] }) {
    const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);

    useEffect(() => {
        socket.on('new-incident', (newIncident: Incident) => {
            setIncidents((prev) => [newIncident, ...prev]);
        });

        return () => {
            socket.off('new-incident');
        };
    }, []);

    const getSeverityColor = (severity: string) => {
        switch (severity.toUpperCase()) {
            case 'CRITICAL': return 'bg-red-500 text-white';
            case 'HIGH': return 'bg-orange-500 text-white';
            case 'MEDIUM': return 'bg-yellow-500 text-black';
            default: return 'bg-blue-500 text-white';
        }
    };

    return (
        <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence>
                {incidents.map((incident) => (
                    <motion.div
                        key={incident.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white/5 backdrop-blur-sm border border-white/10 p-5 rounded-xl hover:bg-white/10 transition-all cursor-pointer group"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getSeverityColor(incident.severity)}`}>
                                {incident.severity}
                            </span>
                            <div className="flex items-center gap-1 text-gray-500 text-xs" suppressHydrationWarning>
                                <Clock className="w-3 h-3" />
                                {new Date(incident.createdAt).toLocaleTimeString()}
                            </div>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                            {incident.type}
                        </h3>

                        <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                            {incident.description}
                        </p>

                        <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-1 text-gray-500 text-[11px]">
                                <MapPin className="w-3 h-3" />
                                <span>{incident.latitude.toFixed(4)}, {incident.longitude.toFixed(4)}</span>
                            </div>

                            <div className="flex items-center gap-1">
                                {incident.status === 'VERIFIED' && (
                                    <ShieldCheck className="w-4 h-4 text-green-500" />
                                )}
                                <span className="text-[10px] text-gray-400 font-medium">
                                    {incident.status}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
