import IncidentForm from '@/components/IncidentForm';
import IncidentFeed from '@/components/IncidentFeed';
import axios from 'axios';

async function getIncidents() {
  try {
    const res = await axios.get('http://localhost:5000/api/incidents');
    return res.data;
  } catch (error) {
    console.error('Failed to fetch incidents', error);
    return [];
  }
}

export default async function Home() {
  const initialIncidents = await getIncidents();
  // Mock User ID for Hackathon
  const mockUserId = "401d5da0-d29f-446e-8d38-25ac507e07a8";

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-red-500/30">
      {/* Hero Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full" />
      </div>

      <nav className="relative z-10 border-b border-white/5 bg-black/50 backdrop-blur-xl px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-400 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20">
              <span className="font-black text-xl">P</span>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">PROMETEO <span className="text-red-500">2026</span></h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-medium leading-none">Emergency Response Hub</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-gray-400">Live Server</span>
            </span>
            <button className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg border border-white/10 text-xs font-bold transition-all">
              Responder Login
            </button>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Reporting */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-2">
              <h2 className="text-4xl font-black leading-none">Fast Reporting.</h2>
              <p className="text-gray-400 text-sm">Every second counts. Report incidents instantly to coordinate with local responders.</p>
            </div>
            <IncidentForm userId={mockUserId} />
          </div>

          {/* Right Column - Live Feed */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold">Live Incident Feed</h2>
                <div className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-500/20">
                  Real-time
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-colors">Filters</button>
              </div>
            </div>

            <IncidentFeed initialIncidents={initialIncidents} />
          </div>
        </div>
      </div>
    </main>
  );
}
