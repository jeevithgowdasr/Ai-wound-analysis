import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    ArrowLeft, Activity, Calendar, ShieldAlert, TrendingUp, 
    Camera, Share2, FileText 
} from 'lucide-react';

export default function Dashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const data = location.state?.analysisData || {
        analysis_date: "2024-03-05",
        metrics: {
            area_cm2: 12.4,
            percent_reduction: 15,
            healing_status: "Progressing",
            velocity_cm2_week: 0.8
        },
        healing_score: 85,
        healing_grade: "B+",
        patient_summary: "The wound shows healthy granulation tissue and significant reduction in exudate levels.",
        score_explanation: [
            "15% surface area reduction in 7 days",
            "Pink granulation tissue covering 80%",
            "Minimal signs of periwound inflammation",
            "Optimal moisture balance achieved"
        ],
        tissue_analysis: {
            risk_level: "Low"
        },
        mask_url: null
    };

    if (!data) return null;

    return (
        <div className="min-h-screen bg-aurora-deep text-foreground font-sans relative overflow-x-hidden">
            {/* Background Texture & Mesh */}
            <div className="absolute inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 filter brightness-100 contrast-150 mix-blend-overlay fixed"></div>
            <div className="absolute inset-0 z-0 bg-mesh pointer-events-none"></div>

            {/* Top Navigation Bar */}
            <div className="relative z-20 flex items-center justify-between px-8 py-6 border-b border-white/5 bg-black/20 backdrop-blur-xl">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-all group"
                >
                    <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs uppercase tracking-widest font-bold">Back to Fleet</span>
                </button>
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-black">System Status</span>
                        <span className="text-xs text-primary font-mono tracking-widest flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                            OPERATIONAL
                        </span>
                    </div>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative z-10 max-w-7xl mx-auto p-6 md:p-10 space-y-8"
            >
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="flex items-center gap-3 text-primary"
                        >
                            <Calendar className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase tracking-[0.4em]">{data.analysis_date}</span>
                        </motion.div>
                        <h1 className="text-5xl md:text-6xl font-light text-white tracking-tighter">
                            Analysis <span className="font-bold text-gradient">Report</span>
                        </h1>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-6 py-3 rounded-2xl bg-primary text-black font-bold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                            Finalize Report
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Metrics Grid */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Area Metric */}
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="glass-dark rounded-[2.5rem] p-8 space-y-6 relative group overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-16 bg-primary/10 blur-[60px] group-hover:bg-primary/20 transition-colors"></div>
                                <div className="flex justify-between items-start">
                                    <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20">
                                        <Activity className="h-6 w-6" />
                                    </div>
                                    <span className="text-xs font-bold text-green-400 bg-green-900/30 px-3 py-1 rounded-full border border-green-500/30">
                                        -{data.metrics.percent_reduction}%
                                    </span>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Surface Metrics</h4>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-6xl font-light text-white">{data.metrics.area_cm2}</span>
                                        <span className="text-xl text-slate-500 font-medium">cm²</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Velocity Metric */}
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="glass-dark rounded-[2.5rem] p-8 space-y-6 relative group overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-16 bg-accent/10 blur-[60px] group-hover:bg-accent/20 transition-colors"></div>
                                <div className="flex justify-between items-start">
                                    <div className="p-3 rounded-2xl bg-accent/10 text-accent border border-accent/20">
                                        <TrendingUp className="h-6 w-6" />
                                    </div>
                                    <span className="text-xs font-bold text-accent/80 uppercase tracking-widest">{data.metrics.healing_status}</span>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Healing Velocity</h4>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-6xl font-light text-white">{data.metrics.velocity_cm2_week}</span>
                                        <span className="text-xl text-slate-500 font-medium">cm²/wk</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Large Healing Score Segment */}
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            className="glass-dark rounded-[3rem] p-10 border border-white/5 relative overflow-hidden group shadow-2xl"
                        >
                            <div className="flex flex-col md:flex-row gap-10 items-center">
                                <div className="relative w-48 h-48 flex items-center justify-center">
                                    <svg className="w-full h-full -rotate-90">
                                        <circle
                                            cx="96" cy="96" r="88"
                                            fill="none" stroke="currentColor"
                                            strokeWidth="8" className="text-white/5"
                                        />
                                        <motion.circle
                                            cx="96" cy="96" r="88"
                                            fill="none" stroke="currentColor"
                                            strokeWidth="8" strokeDasharray="552.92"
                                            initial={{ strokeDashoffset: 552.92 }}
                                            animate={{ strokeDashoffset: 552.92 * (1 - data.healing_score / 100) }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className="text-primary"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute flex flex-col items-center">
                                        <span className="text-5xl font-black text-white">{data.healing_score}</span>
                                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Score</span>
                                    </div>
                                </div>
                                <div className="flex-1 space-y-6">
                                    <div className="space-y-1">
                                        <h3 className="text-3xl font-bold text-white tracking-tight">Healing Grade: {data.healing_grade}</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed">{data.patient_summary}</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {data.score_explanation.map((item: string, i: number) => (
                                            <div key={i} className="flex items-start gap-2">
                                                <div className="h-5 w-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center shrink-0 mt-0.5">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-current"></div>
                                                </div>
                                                <span className="text-xs text-slate-300">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Visualizer + Actions */}
                    <div className="space-y-8">
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="glass-dark rounded-[3rem] overflow-hidden flex flex-col border border-white/5 shadow-2xl"
                        >
                            <div className="p-8 border-b border-white/5 bg-white/5">
                                <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                    <ShieldAlert className="h-4 w-4 text-primary" />
                                    Tissue Segmentation
                                </h3>
                            </div>
                            <div className="aspect-square bg-slate-900 relative">
                                {data.mask_url ? (
                                    <img src={data.mask_url} alt="Wound Mask" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center p-12 bg-aurora-subtle">
                                        <div className="w-full h-full rounded-2xl border-2 border-dashed border-primary/20 flex flex-col items-center justify-center gap-4 text-primary/40">
                                            <Camera className="h-12 w-12" />
                                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Visual Data Pending</span>
                                        </div>
                                    </div>
                                )}
                                {/* HUD Overlay in corner */}
                                <div className="absolute bottom-4 left-4 p-3 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 space-y-1">
                                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Confidence Score</h4>
                                    <div className="flex items-end gap-2">
                                        <span className="text-4xl font-light text-green-400">98.4</span>
                                        <span className="text-sm font-bold text-green-500/50 mb-1">%</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-slate-500">Risk Assessment</span>
                                        <span className={data.tissue_analysis.risk_level === 'High' ? 'text-red-400' : 'text-green-400'}>
                                            {data.tissue_analysis.risk_level} Risk
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            aria-label="Share Analysis"
                                            className="flex-1 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center transition-all group"
                                        >
                                            <Share2 className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" />
                                        </button>
                                        <button
                                            aria-label="Download PDF Report"
                                            className="flex-[2] py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center gap-3 transition-all group"
                                        >
                                            <FileText className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" />
                                            <span className="text-xs font-bold text-slate-400 group-hover:text-white uppercase tracking-widest">Generate PDF</span>
                                        </button>
                                    </div>
                                </div>
                                <p className="text-[10px] text-center text-slate-500 uppercase tracking-[0.2em] italic font-medium leading-relaxed">
                                    AI generated analysis. Confirmed by WoundSense v4.2.0
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
