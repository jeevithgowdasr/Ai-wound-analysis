import { useState, useRef } from 'react';
import { Camera, AlertTriangle, ArrowLeft, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { analyzeWound } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function Capture() {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show preview
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        setLoading(true);
        setError(null);

        try {
            const result = await analyzeWound(file);
            // Artificial delay to show off the scanning animation
            setTimeout(() => {
                navigate('/dashboard', { state: { latestResult: result } });
            }, 3000);
        } catch (err) {
            console.error(err);
            setError("Analysis failed. Please rescind capture.");
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-aurora-subtle text-cyan-50 font-mono relative overflow-hidden">

            {/* HUD Grid Overlay */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20"
                style={{ backgroundImage: 'linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-6 border-b border-cyan-900/50 bg-black/60 backdrop-blur-md">
                <Link to="/" className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors">
                    <ArrowLeft className="h-5 w-5" />
                    <span className="text-sm tracking-widest uppercase">Abort</span>
                </Link>
                <div className="flex items-center gap-2 text-cyan-500">
                    <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse"></div>
                    <span className="text-xs uppercase tracking-[0.2em] font-bold">System Ready</span>
                </div>
            </div>

            <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">

                <AnimatePresence mode="wait">
                    {!preview ? (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.1, opacity: 0 }}
                            role="button"
                            tabIndex={0}
                            aria-label="Click to scan or upload wound image"
                            className="w-full max-w-md aspect-[3/4] rounded-3xl border-2 border-dashed border-cyan-800 bg-cyan-950/20 relative flex flex-col items-center justify-center gap-6 overflow-hidden group cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                            onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
                        >
                            {/* Animated Scanner Reticle */}
                            <div className="absolute inset-4 border border-cyan-500/30 rounded-2xl">
                                <div className="absolute top-0 left-0 h-4 w-4 border-t-2 border-l-2 border-cyan-400"></div>
                                <div className="absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2 border-cyan-400"></div>
                                <div className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-cyan-400"></div>
                                <div className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-cyan-400"></div>
                            </div>

                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="relative z-10"
                            >
                                <div className="h-20 w-20 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.3)] group-hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] transition-all duration-500">
                                    <Camera className="h-8 w-8 text-cyan-300" />
                                </div>
                            </motion.div>

                            <div className="text-center space-y-2 z-10">
                                <h2 className="text-xl font-bold tracking-wider text-white">INITIATE SCAN</h2>
                                <p className="text-xs text-cyan-400/70 max-w-[200px] mx-auto uppercase tracking-wide">
                                    Align wound within reticle. AI autofocals enabled.
                                </p>
                            </div>

                            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                capture="environment"
                                className="hidden"
                                onChange={handleFileSelect}
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="relative w-full max-w-md aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-2 border-cyan-500/50"
                        >
                            <img src={preview} alt="Analysis Target" className="w-full h-full object-cover filter contrast-125" />

                            {/* Scanning Overlay */}
                            {loading && (
                                <div className="absolute inset-0 pointer-events-none">
                                    <div className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay"></div>
                                    <motion.div
                                        initial={{ top: "0%" }}
                                        animate={{ top: "100%" }}
                                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                        className="absolute left-0 right-0 h-1 bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,1)] z-20"
                                    />

                                    <div className="absolute top-4 left-4 font-mono text-xs text-cyan-300 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Zap className="h-3 w-3 animate-pulse" />
                                            <span>ANALYZING TISSUE MATRIX...</span>
                                        </div>
                                        <div className="text-cyan-500/80">SEGMENTATION: PENDING</div>
                                        <div className="text-cyan-500/80">MORPHOMETRY: PENDING</div>
                                    </div>

                                    <div className="absolute bottom-8 left-0 right-0 text-center">
                                        <div className="inline-block bg-black/70 backdrop-blur-md px-4 py-2 rounded-full border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-widest animate-pulse">
                                            PROCESSING DATA...
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {error && (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="mt-6 flex items-center gap-3 bg-red-500/10 border border-red-500/50 text-red-400 px-6 py-4 rounded-xl backdrop-blur-md"
                    >
                        <AlertTriangle className="h-5 w-5" />
                        <span className="text-sm font-bold tracking-wide">{error}</span>
                    </motion.div>
                )}

            </main>

            {/* Footer Metrics Simulation */}
            <div className="p-4 border-t border-cyan-900/30 bg-black/80 backdrop-blur text-[10px] text-cyan-800 flex justify-between uppercase tracking-widest font-mono">
                <span>COORD: 34.052, -118.243</span>
                <span>ISO: AUTO</span>
                <span>AI MODEL: v4.2.0</span>
            </div>
        </div>
    );
}
