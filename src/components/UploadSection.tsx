import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, X, Loader2, CheckCircle2, AlertCircle, Code, Eye } from 'lucide-react';
import { extractFieldData, StructuredReport } from '../lib/gemini';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/error-handler';

export const UploadSection = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [debugData, setDebugData] = useState<StructuredReport | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setError(null);
        setDebugData(null);
        setSuccess(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    if (!image || !auth.currentUser) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Extract base64 part
      const base64Data = image.split(',')[1];
      const structuredData = await extractFieldData(base64Data);
      setDebugData(structuredData);

      const path = 'reports';
      try {
        await addDoc(collection(db, path), {
        location: structuredData.location,
        resource: structuredData.resource,
        urgency: structuredData.urgency,
        people: structuredData.people,
        userId: auth.currentUser.uid,
        status: 'Digitized',
        createdAt: serverTimestamp(),
        });
        setSuccess(true);
        setImage(null);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, path);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to process image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-white font-semibold text-sm uppercase tracking-wider font-mono">Capture Field Data</h2>
          <button 
            onClick={() => setShowDebug(!showDebug)} 
            className={`p-1.5 rounded-lg transition-colors ${showDebug ? 'bg-orange-500 text-black' : 'bg-zinc-800 text-zinc-400'}`}
            title="Toggle Debug View"
          >
            <Code className="w-4 h-4" />
          </button>
        </div>

        {!image ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-zinc-700 rounded-lg p-12 flex flex-col items-center gap-4 cursor-pointer hover:border-orange-500/50 hover:bg-orange-500/5 transition-all group"
          >
            <Upload className="w-10 h-10 text-zinc-500 group-hover:text-orange-500 transition-colors" />
            <div className="text-center">
              <p className="text-zinc-300 text-sm font-medium">Click to upload handwritten survey</p>
              <p className="text-zinc-500 text-xs mt-1">PNG, JPG supported</p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative"
          >
            <img src={image} alt="Preview" className="w-full h-48 object-cover rounded-lg border border-zinc-700" />
            <button
              onClick={() => setImage(null)}
              className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-full text-white hover:bg-black transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              onClick={processImage}
              disabled={loading}
              className="mt-4 w-full bg-orange-500 text-black py-3 rounded-lg font-bold hover:bg-orange-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>AI Analyzing...</span>
                </>
              ) : (
                <span>Digitize & Save to Firestore</span>
              )}
            </button>
          </motion.div>
        )}

        <AnimatePresence>
          {showDebug && debugData && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-black/80 rounded-lg border border-zinc-800 p-4 font-mono text-[10px] overflow-hidden"
            >
              <div className="flex items-center gap-2 text-orange-500 mb-2 border-b border-zinc-800 pb-2" id="debug-section">
                <Eye className="w-3 h-3" />
                <span className="uppercase tracking-widest font-bold">Intelligence Debug</span>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-zinc-500 uppercase mb-1">Generated JSON:</p>
                  <pre className="text-emerald-400 overflow-x-auto p-2 bg-zinc-950 rounded">
                    {JSON.stringify(debugData, null, 2)}
                  </pre>
                </div>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex items-center gap-2 text-red-500 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20"
              id="error-msg"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex items-center gap-2 text-emerald-500 text-sm bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20"
              id="success-msg"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Structured data successfully pushed to 'reports' collection.</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
