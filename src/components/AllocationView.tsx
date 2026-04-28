import { useState } from 'react';
import { motion } from 'motion/react';
import { Brain, Star, TrendingUp, RefreshCw } from 'lucide-react';
import { generateAllocationPlan, AllocationPlan } from '../lib/gemini';

export const AllocationView = ({ reports }: { reports: any[] }) => {
  const [plan, setPlan] = useState<AllocationPlan | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (reports.length === 0) return;
    setLoading(true);
    try {
      const result = await generateAllocationPlan(reports);
      setPlan(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 backdrop-blur-sm h-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-orange-500" />
          <h2 className="text-white font-semibold text-sm uppercase tracking-wider font-mono">AI Resource Strategy</h2>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading || reports.length === 0}
          className="text-zinc-400 hover:text-white transition-colors"
          title="Regenerate Plan"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {!plan && !loading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <p className="text-zinc-500 text-center text-sm font-mono leading-relaxed max-w-xs">
            Connect field reports to generate optimal resource allocation using AI reasoning.
          </p>
          <button
            onClick={handleGenerate}
            disabled={reports.length === 0}
            className="bg-white text-black px-6 py-2 rounded-lg font-bold text-sm hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            Run Allocation Logic
          </button>
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <RefreshCw className="w-8 h-8 text-orange-500 animate-spin" />
          <p className="text-zinc-500 text-[10px] uppercase font-mono tracking-widest animate-pulse">Computing Optimization...</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div>
            <p className="text-zinc-500 text-[10px] uppercase font-mono mb-3 flex items-center gap-2">
              <Star className="w-3 h-3 text-orange-500 fill-orange-500" />
              Priority Locations
            </p>
            <div className="space-y-2">
              {plan?.priorityList.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-black/40 rounded-lg border border-zinc-800/50">
                  <div>
                    <p className="text-white text-sm font-medium">{item.location}</p>
                    <p className="text-zinc-500 text-[10px] uppercase">{item.urgency} priority</p>
                  </div>
                  <div className="text-right">
                    <p className="text-orange-500 font-mono font-bold">{item.count}</p>
                    <p className="text-zinc-500 text-[9px] uppercase">Req units</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-zinc-500 text-[10px] uppercase font-mono mb-3 flex items-center gap-2">
              <TrendingUp className="w-3 h-3 text-orange-500" />
              Distribution Strategy
            </p>
            <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-lg">
              <p className="text-zinc-300 text-sm leading-relaxed italic">
                "{plan?.distributionStrategy}"
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
