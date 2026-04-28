import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { auth, db, loginWithGoogle } from './lib/firebase';
import { Header } from './components/Header';
import { UploadSection } from './components/UploadSection';
import { ReportGrid } from './components/ReportGrid';
import { AllocationView } from './components/AllocationView';
import { Shield, ArrowRight, LayoutDashboard, Database, Info } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [user, loadingAuth] = useAuthState(auth);
  const [reportsValue, loadingReports] = useCollection(
    query(collection(db, 'reports'), orderBy('createdAt', 'desc'), limit(50))
  );

  const reports = reportsValue?.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as any[] || [];

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Shield className="w-12 h-12 text-orange-500" />
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white selection:bg-orange-500/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#FF6B0015,transparent_50%)]" />
        <div className="relative pt-32 pb-20 px-6 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-8"
          >
            <div className="bg-orange-500 p-3 rounded-2xl rotate-3 shadow-2xl shadow-orange-500/20">
              <Shield className="text-black w-10 h-10" />
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent"
          >
            ReliefSync
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Bridge the gap between offline crisis data and real-time response. 
            Convert handwritten field notes into structured insights using Gemini Multimodal AI.
          </motion.p>
          
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={loginWithGoogle}
            className="bg-white text-black px-8 py-4 rounded-full font-bold flex items-center gap-3 mx-auto hover:bg-zinc-200 transition-all hover:scale-105"
          >
            <span>Start Field Mission</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 pb-32">
          {[
            { icon: LayoutDashboard, title: "Real-time Dashboard", desc: "Instantly visualize field data incoming from any location." },
            { icon: Database, title: "AI Structuring", desc: "Gemini converts raw handwritten text into validated JSON datasets." },
            { icon: Shield, title: "Smart Allocation", desc: "Prioritize resources based on automated urgency scoring." }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + (i * 0.1) }}
              className="p-8 border border-zinc-800 rounded-3xl bg-zinc-900/20 backdrop-blur-sm"
            >
              <feature.icon className="w-8 h-8 text-orange-500 mb-6" />
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20 px-6">
      <Header />
      
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input and Intelligence */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <UploadSection />
          <AllocationView reports={reports} />
          
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4 text-zinc-400">
              <Info className="w-4 h-4" />
              <span className="text-[10px] uppercase font-mono tracking-widest font-bold">System Status</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500">Firebase Connectivity</span>
                <span className="text-emerald-500 font-mono">ACTIVE</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500">Multimodal OCR</span>
                <span className="text-emerald-500 font-mono">READY</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500">Stored Reports</span>
                <span className="text-white font-mono">{reports.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Data Visualization */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Active Field Reports</h2>
              <p className="text-zinc-500 text-sm">Digitized insights from conflict zones and remote regions.</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest">Live Sync</span>
            </div>
          </div>
          
          {loadingReports ? (
            <div className="h-64 flex flex-col items-center justify-center border border-zinc-800 rounded-xl animate-pulse">
              <Database className="w-8 h-8 text-zinc-700 mb-2" />
              <span className="text-zinc-600 text-[10px] font-mono tracking-widest uppercase">Fetching Records...</span>
            </div>
          ) : (
            <ReportGrid reports={reports} />
          )}
        </div>
      </main>
    </div>
  );
}
