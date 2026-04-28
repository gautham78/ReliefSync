import { motion } from 'motion/react';
import { MapPin, Users, Activity, Clock } from 'lucide-react';

interface Report {
  id: string;
  location: string;
  resource: string;
  urgency: 'Low' | 'Medium' | 'High';
  people: number;
  rawText: string;
  imageUrl: string;
  createdAt: any;
}

export const ReportGrid = ({ reports }: { reports: Report[] }) => {
  if (reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 border border-dashed border-zinc-800 rounded-xl">
        <Clock className="w-10 h-10 text-zinc-700 mb-4" />
        <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">No reports received yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {reports.map((report, idx) => (
        <motion.div
          key={report.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-zinc-900/30 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors"
          id={`report-${report.id}`}
        >
          <div className="p-4 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-500" />
                <h3 className="text-white font-medium">{report.location}</h3>
              </div>
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                report.urgency === 'High' ? 'bg-red-500/20 text-red-500' :
                report.urgency === 'Medium' ? 'bg-orange-500/20 text-orange-500' :
                'bg-emerald-500/20 text-emerald-500'
              }`}>
                {report.urgency} Priority
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-black/40 p-3 rounded-lg border border-zinc-800/50">
                <p className="text-zinc-500 text-[10px] uppercase font-mono mb-1">Resource</p>
                <div className="flex items-center gap-2">
                  <Activity className="w-3 h-3 text-zinc-400" />
                  <span className="text-white capitalize text-sm">{report.resource}</span>
                </div>
              </div>
              <div className="bg-black/40 p-3 rounded-lg border border-zinc-800/50">
                <p className="text-zinc-500 text-[10px] uppercase font-mono mb-1">Impact</p>
                <div className="flex items-center gap-2">
                  <Users className="w-3 h-3 text-zinc-400" />
                  <span className="text-white text-sm">{report.people} Affected</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800/20">
              <p className="text-zinc-600 text-[9px] uppercase font-mono mb-1">Verified Extract</p>
              <p className="text-zinc-400 text-xs italic line-clamp-3">"{report.rawText}"</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
