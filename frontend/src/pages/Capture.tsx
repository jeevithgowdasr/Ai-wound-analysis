import { useState, useRef } from 'react';
import { Camera, AlertTriangle, ArrowLeft, Zap, ShieldCheck } from 'lucide-react';
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
                navigate('/dashboard', { state: { analysisData: result } });
            }, 3500);
        } catch (err) {
            console.error(err);
            setError("Analysis failed. Please rescant capture.");
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-aurora-subtle font-plus-jakarta text-slate-100 relative overflow-hidden">
            {/* Mesh Background */}
            <div className="absolute inset-0 bg-mesh opacity-40 mix-blend-soft-light pointer-events-none"></div>
            
            {/* HUD Grid Overlay */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-10"
                style={{ backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }}>
            </div>

            {/* Header */}
            <header className="relative z-10 flex items-center justify-between px-8 py-6 bg-black/20 backdrop-blur-xl border-b border-white/5">
                <Link to="/" className="flex items-center gap-3 text-slate-400 hover:text-primary transition-all group" aria-label="Abort and go back home">
                    <div className="p-2 rounded-xl bg-white/5 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-bold tracking-[0.2em] uppercase">Abort</span>
                </Link>
                <div className="flex items-center gap-4 bg-glass-dark px-5 py-2.5 rounded-2xl border border-white/5 shadow-2xl">
                    <div className="flex items-center gap-2.5">
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">System Online</span>
                    </div>
                    <div className="h-4 w-px bg-white/10"></div>
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Encrypted</span>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
                <AnimatePresence mode="wait">
                    {!preview ? (
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.05, opacity: 0 }}
                            role="button"
                            tabIndex={0}
                            aria-label="Initiate wound scan"
                            className="w-full max-w-lg aspect-[4/5] rounded-[3rem] bg-glass-dark border border-white/5 relative flex flex-col items-center justify-center gap-8 overflow-hidden group cursor-pointer hover:border-primary/30 transition-all duration-700 shadow-3xl"
                            onClick={() => fileInputRef.current?.click()}
                            onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
                        >
                            {/* Scanning Reticles */}
                            <div className="absolute inset-10 pointer-events-none transition-transform duration-700 group-hover:scale-95">
                                <div className="absolute top-0 left-0 h-10 w-10 border-t-2 border-l-2 border-primary/40 rounded-tl-3xl"></div>
                                <div className="absolute top-0 right-0 h-10 w-10 border-t-2 border-r-2 border-primary/40 rounded-tr-3xl"></div>
                                <div className="absolute bottom-0 left-0 h-10 w-10 border-b-2 border-l-2 border-primary/40 rounded-bl-3xl"></div>
                                <div className="absolute bottom-0 right-0 h-10 w-10 border-b-2 border-r-2 border-primary/40 rounded-br-3xl"></div>
                            </div>

                            <div className="relative z-10 space-y-8 flex flex-col items-center">
                                <motion.div
                                    animate={{ 
                                        y: [0, -15, 0],
                                        boxShadow: ["0 0 40px rgba(16,185,129,0.1)", "0 0 80px rgba(16,185,129,0.3)", "0 0 40px rgba(16,185,129,0.1)"]
                                    }}
                                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                    className="h-32 w-32 rounded-[2.5rem] bg-primary/10 flex items-center justify-center border border-primary/20 relative"
                                >
                                    <div className="absolute inset-0 rounded-[2.5rem] bg-primary/5 animate-ping opacity-20"></div>
                                    <Camera className="h-12 w-12 text-primary" strokeWidth={1.5} />
                                </motion.div>

                                <div className="text-center space-y-4">
                                    <h2 className="text-3xl font-black tracking-tighter text-white">INITIATE SCAN</h2>
                                    <p className="text-slate-400 max-w-[280px] mx-auto text-sm leading-relaxed font-medium uppercase tracking-widest opacity-60">
                                        Secure AI analysis protocol ready. Align within frame.
                                    </p>
                                </div>
                            </div>

                            {/* HUD Ambient Details */}
                            <div className="absolute bottom-10 left-10 text-[10px] font-black text-primary/40 tracking-[0.4em] uppercase">Auth: v4.2</div>
                            <div className="absolute bottom-10 right-10 text-[10px] font-black text-primary/40 tracking-[0.4em] uppercase">FRM: 60fps</div>

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
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative w-full max-w-lg aspect-[4/5] rounded-[3rem] overflow-hidden shadow-edge border border-white/10"
                        >
                            <img src={preview} alt="Target Bio-Data" className="w-full h-full object-cover grayscale brightness-75 contrast-125" />

                            {/* Scanning Visuals */}
                            {loading && (
                                <div className="absolute inset-0">
                                    <div className="absolute inset-0 bg-primary/5 backdrop-contrast-125"></div>
                                    
                                    {/* Scan Line */}
                                    <motion.div
                                        initial={{ top: "-10%" }}
                                        animate={{ top: "110%" }}
                                        transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                                        className="absolute left-0 right-0 h-[2px] bg-primary shadow-[0_0_30px_#10b981,0_0_60px_#10b981] z-30"
                                    />

                                    {/* Data Stream */}
                                    <div className="absolute top-8 left-8 space-y-3 z-30">
                                        <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md border border-primary/20 px-4 py-2 rounded-xl">
                                            <Zap className="h-4 w-4 text-primary animate-pulse" />
                                            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Neural Processing...</span>
                                        </div>
                                    </div>

                                    {/* HUD Overlays */}
                                    <div className="absolute inset-0 pointer-events-none border-[20px] border-black/40 mix-blend-overlay"></div>
                                    
                                    <div className="absolute bottom-12 left-0 right-0 flex justify-center z-30">
                                        <div className="bg-glass-dark px-8 py-4 rounded-3xl border border-white/10 shadow-3xl text-center">
                                            <div className="flex items-center gap-3 justify-center">
                                                <div className="flex gap-1">
                                                    {[1,2,3].map(i => <div key={i} className="h-1 w-4 bg-primary rounded-full animate-pulse" style={{ animationDelay: `${i*0.2}s` }}></div>)}
                                                </div>
                                                <span className="text-[11px] font-black text-white uppercase tracking-[0.3em] inline-block mt-0.5">Calculating Metrics</span>
                                            </div>
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
                        className="mt-8 flex items-center gap-4 bg-red-500/10 border border-red-500/20 text-red-400 px-8 py-5 rounded-2xl backdrop-blur-xl shadow-2xl"
                    >
                        <div className="p-2 bg-red-500/20 rounded-xl">
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-bold uppercase tracking-widest">{error}</span>
                    </motion.div>
                )}
            </main>

            {/* Footer Telemetry */}
            <footer className="relative z-10 px-10 py-6 bg-black/20 border-t border-white/5 backdrop-blur-xl flex justify-between items-center text-[9px] font-black uppercase tracking-[0.4em] text-slate-500">
                <div className="flex gap-8">
                    <span>GEO: 34.05 / 118.24</span>
                    <span>OP: HUD_v4</span>
                </div>
                <div className="flex gap-2 items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-500 opacity-30"></div>
                    <span>Secure Link Established</span>
                </div>
            </footer>
        </div>
    );
}
