

import { useLocation, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Activity, Calendar, FileText, Share2 } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

import type { AnalysisResponse } from '../services/api';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';

// Mock History Data for Graph
const MOCK_HISTORY = [
    { date: '10/01', area: 12.5 },
    { date: '10/08', area: 11.2 },
    { date: '10/15', area: 9.8 },
    { date: '10/22', area: 8.5 },
    { date: '10/29', area: 7.9 },
    { date: '11/05', area: 5.5 },
    { date: '11/12', area: 4.5 },
];

export default function Dashboard() {
    const location = useLocation();
    const state = location.state as { latestResult?: AnalysisResponse } | null;
    const latestResult = state?.latestResult;

    // Defaults if no real scan happened yet
    const patientSummary = latestResult?.patient_summary ?? "Healing trajectory indicates positive granulation. Continue current protocol.";
    const area = latestResult?.metrics.area_cm2 ?? 4.5;
    const slough = latestResult?.tissue_analysis.slough_pct ?? 15;
    const doctorNote = latestResult?.doctor_note || "**No recent clinical notes available.**";

    // Animation Variants
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <div className="min-h-screen bg-aurora-subtle text-foreground pb-12 dark relative overflow-x-hidden">

            {/* Noise Texture */}
            <div className="absolute inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none fixed"></div>

            {/* Header / Nav */}
            <div className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-glass-dark/80 backdrop-blur-xl border-b border-white/5">
                <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft size={20} />
                    <span className="text-sm font-medium tracking-wide">BACK TO HOME</span>
                </Link>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-500 font-mono hidden md:block">ID: P-9082-AX</span>
                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-blue-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
                </div>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="relative z-10 p-6 max-w-7xl mx-auto space-y-8"
            >

                {/* 1. Hero Summary Card */}
                <motion.div variants={item} className="relative overflow-hidden rounded-[2rem] bg-glass-dark p-8 border border-white/5 hover:border-white/10 transition-colors">
                    <div className="absolute top-0 right-0 h-96 w-96 bg-primary/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none"></div>

                    <div className="relative z-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3 items-center">
                        {/* Status Message */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-green-500/10 p-2 text-green-400 border border-green-500/20 shadow-[0_0_10px_rgba(74,222,128,0.2)]">
                                    <CheckCircle className="h-6 w-6" />
                                </div>
                                <h2 className="text-3xl font-light text-white tracking-wide">Optimal Recovery</h2>
                            </div>
                            <p className="text-xl text-slate-400 leading-relaxed max-w-2xl font-light">
                                "{patientSummary}"
                            </p>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-2xl bg-black/20 p-5 border border-white/5 backdrop-blur-md text-center group hover:bg-white/5 transition-colors">
                                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Surface Area</p>
                                <p className="text-4xl font-light text-white tracking-tighter">{area}<span className="text-sm font-normal text-slate-500 ml-1">cm²</span></p>
                            </div>
                            <div className="rounded-2xl bg-black/20 p-5 border border-white/5 backdrop-blur-md text-center group hover:bg-white/5 transition-colors">
                                <p className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2">Granulation</p>
                                <p className="text-4xl font-light text-white tracking-tighter">{100 - slough}<span className="text-sm font-normal text-slate-500 ml-1">%</span></p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* 2. Trajectory Graph */}
                    <motion.div variants={item} className="lg:col-span-2 rounded-[2rem] bg-glass-dark border border-white/5 p-8 shadow-2xl relative overflow-hidden">
                        {/* Decorative Grid items */}
                        <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                        <div className="relative z-10 flex items-center justify-between mb-8">
                            <div className="flex items-center gap-2">
                                <Activity className="h-5 w-5 text-primary" />
                                <h3 className="font-medium text-lg text-white">Healing Velocity</h3>
                            </div>
                            <div className="flex gap-2">
                                <span className="px-4 py-1.5 rounded-full bg-white/5 text-xs font-medium border border-white/10 text-white">Total Area</span>
                                <span className="px-4 py-1.5 rounded-full bg-transparent text-xs font-medium text-slate-500 hover:text-slate-300 cursor-pointer transition-colors">Tissue Health</span>
                            </div>
                        </div>

                        <div className="h-[300px] w-full relative z-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={MOCK_HISTORY}>
                                    <defs>
                                        <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#020617', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                                        itemStyle={{ color: '#e2e8f0' }}
                                        cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="area"
                                        stroke="#22d3ee"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorArea)"
                                        activeDot={{ r: 6, strokeWidth: 0, fill: "#fff" }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* 3. Protocol Tasks */}
                    <motion.div variants={item} className="rounded-[2rem] bg-glass-dark border border-white/5 p-8 relative">
                        <div className="flex items-center gap-2 mb-6">
                            <Calendar className="h-5 w-5 text-accent" />
                            <h3 className="font-medium text-lg text-white">Care Protocol</h3>
                        </div>
                        <div className="space-y-4">
                            {[
                                { task: 'Saline Cleanse', time: '08:00 AM', status: 'done' },
                                { task: 'Dressing Change', time: '08:30 AM', status: 'pending' },
                                { task: 'Antibiotic Ointment', time: '08:35 AM', status: 'pending' },
                                { task: 'Evening Check', time: '08:00 PM', status: 'locked' }
                            ].map((item, i) => (
                                <div key={i} className="group flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-primary/30 transition-all cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-2 w-2 rounded-full ${item.status === 'done' ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]' : item.status === 'pending' ? 'bg-primary shadow-[0_0_8px_rgba(34,211,238,0.5)]' : 'bg-slate-600'}`}></div>
                                        <span className={`text-sm font-medium ${item.status === 'locked' ? 'text-slate-500' : 'text-slate-200'}`}>{item.task}</span>
                                    </div>
                                    <span className="text-xs text-slate-500 font-mono">{item.time}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* 4. AI Clinical Note */}
                <motion.div variants={item} className="rounded-[2rem] bg-glass-dark border border-white/5 p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-24 bg-purple-500/5 blur-[80px] rounded-full pointer-events-none"></div>

                    {/* Header */}
                    <div className="flex items-center justify-between mb-6 relative z-10">
                        <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-purple-400" />
                            <h3 className="font-medium text-lg text-white">Clinical Assessment</h3>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 transition-colors border border-white/5">
                            <Share2 size={14} />
                            Share Report
                        </button>
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row gap-8">
                        {/* Main Report Content */}
                        <div className="flex-1">
                            <div className="prose prose-invert prose-sm max-w-none font-light leading-relaxed text-slate-300 bg-black/20 p-6 rounded-2xl border border-white/5">
                                <ReactMarkdown>{doctorNote}</ReactMarkdown>
                            </div>
                        </div>

                        {/* Sidebar: Model Stats */}
                        <div className="w-full md:w-72 shrink-0 flex flex-col gap-6 md:border-l border-white/10 md:pl-8">
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Model Architecture</h4>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-cyan-300">EfficientNet-B4</span>
                                    <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-purple-300">Mask-RCNN</span>
                                    <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-indigo-300">LLaMA-3-Medical</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Confidence Score</h4>
                                <div className="flex items-end gap-2">
                                    <span className="text-4xl font-light text-green-400">98.4</span>
                                    <span className="text-sm font-bold text-green-500/50 mb-1">%</span>
                                </div>
                            </div>

                            <div className="pt-6 mt-auto border-t border-white/10 flex gap-2">
                                <button
                                    aria-label="Share Analysis"
                                    className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Share2 className="h-4 w-4 text-slate-400" />
                                </button>
                                <button
                                    aria-label="Download PDF Report"
                                    className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 transition-colors"
                                >
                                    <FileText className="h-4 w-4 text-slate-400" />
                                    <span className="text-xs font-bold text-slate-400">PDF</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
