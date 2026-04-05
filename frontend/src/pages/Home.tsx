import { useNavigate } from 'react-router-dom';
import { Camera, Activity, TrendingUp, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

// Mock Data for Graphs
const TREND_DATA = [
    { day: 'M', val: 45 },
    { day: 'T', val: 52 },
    { day: 'W', val: 48 },
    { day: 'T', val: 61 },
    { day: 'F', val: 55 },
    { day: 'S', val: 67 },
    { day: 'S', val: 72 },
];

const TISSUE_DATA = [
    { id: 1, val: 30, type: 'necrotic' },
    { id: 2, val: 50, type: 'granulation' },
    { id: 3, val: 45, type: 'slough' },
    { id: 4, val: 60, type: 'epithelial' },
    { id: 5, val: 75, type: 'granulation' },
    { id: 6, val: 50, type: 'epithelial' },
    { id: 7, val: 40, type: 'slough' },
    { id: 8, val: 80, type: 'granulation' },
    { id: 9, val: 70, type: 'epithelial' },
    { id: 10, val: 65, type: 'granulation' },
];

export default function Home() {
    const navigate = useNavigate();

    const variants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.5,
                ease: "easeOut"
            }
        })
    };

    return (
        <div className="min-h-screen bg-aurora-deep text-foreground p-4 md:p-8 font-sans overflow-hidden relative">
            {/* Background Texture & Gradients */}
            <div className="absolute inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 filter brightness-100 contrast-150 mix-blend-overlay fixed"></div>
            <div className="absolute inset-0 z-0 bg-mesh pointer-events-none"></div>

            <div className="relative z-10 max-w-7xl mx-auto space-y-6 h-full flex flex-col">

                {/* Top Section: Greeting + Metrics Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:h-[450px]">

                    {/* 1. Large Greeting Card (Top Left) */}
                    <motion.div
                        custom={0}
                        initial="hidden"
                        animate="visible"
                        variants={variants as any}
                        className="lg:col-span-1 rounded-[2.5rem] bg-glass-dark relative overflow-hidden p-10 flex flex-col justify-end border border-white/5 hover:border-primary/30 transition-all duration-500 shadow-2xl group"
                    >
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        
                        {/* Background Abstract Shapes */}
                        <div className="absolute top-[-50px] left-[-50px] w-64 h-64 bg-secondary/20 rounded-full filter blur-[80px] animate-blob"></div>
                        <div className="absolute top-[20%] right-[-20%] w-72 h-72 bg-primary/20 rounded-full filter blur-[80px] animate-blob animation-delay-2000"></div>

                        {/* 3D Visual Placeholder - Holographic Heart/Pulse */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[60%] w-48 h-48">
                            <motion.div 
                                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
                                transition={{ repeat: Infinity, duration: 4 }}
                                className="w-full h-full rounded-full bg-gradient-to-tr from-accent/30 via-primary/30 to-cyan-300/30 blur-2xl opacity-60"
                            ></motion.div>
                            <div className="absolute inset-4 rounded-full bg-glass backdrop-blur-3xl shadow-inner border border-white/10 flex items-center justify-center">
                                <Activity className="h-16 w-16 text-primary animate-pulse" />
                            </div>
                        </div>

                        <div className="relative z-10 space-y-2 mt-auto">
                            <h1 className="text-5xl font-extralight text-white/90 tracking-tight">
                                Hi, <span className="font-bold text-gradient">Alex!</span>
                            </h1>
                            <h2 className="text-2xl font-light text-slate-400 leading-tight">
                                Your healing trajectory is <span className="text-primary font-medium">positive</span>.
                            </h2>
                        </div>
                    </motion.div>

                    {/* 2. Metrics Grid (Top Right) */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Card A: New Scan (Action) */}
                        <motion.div
                            custom={1}
                            initial="hidden"
                            animate="visible"
                            variants={variants as any}
                            onClick={() => navigate('/capture')}
                            className="group rounded-[2.5rem] bg-glass-dark p-8 relative overflow-hidden cursor-pointer hover:bg-white/5 transition-all duration-300 border border-white/5 hover:border-primary/50"
                        >
                            <div className="absolute top-6 right-6 p-3 bg-primary/10 rounded-2xl text-primary border border-primary/20 group-hover:bg-primary group-hover:text-black transition-colors">
                                <Camera size={28} />
                            </div>
                            <div className="flex flex-col h-full justify-between">
                                <span className="text-slate-400 text-lg font-medium">New Analysis</span>
                                <div>
                                    <div className="text-5xl font-bold mb-2 text-white group-hover:text-primary transition-colors">Start</div>
                                    <div className="flex items-center gap-2 text-sm text-primary/80 font-mono tracking-wider">
                                        <Zap size={14} className="fill-current" />
                                        <span>AI READY</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Card B: Healing Score */}
                        <motion.div
                            custom={2}
                            initial="hidden"
                            animate="visible"
                            variants={variants as any}
                            className="rounded-[2.5rem] bg-glass-dark p-8 relative overflow-hidden border border-white/5 hover:border-white/10 transition-colors"
                        >
                            <div className="absolute top-6 right-6 p-3 bg-accent/20 rounded-2xl text-accent-foreground border border-accent/20">
                                <Activity size={24} />
                            </div>
                            <div className="flex flex-col h-full justify-between">
                                <span className="text-slate-400 text-lg font-medium mr-8">Recovery Score</span>
                                <div className="flex items-end justify-between">
                                    <span className="text-6xl font-light tracking-tighter text-white">82</span>
                                    <span className="text-green-400 text-sm mb-2 font-bold px-2 py-1 bg-green-900/30 rounded-lg border border-green-500/30">Good</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Card C: Area Metric */}
                        <motion.div
                            custom={3}
                            initial="hidden"
                            animate="visible"
                            variants={variants as any}
                            className="rounded-[2.5rem] bg-glass-dark p-8 relative overflow-hidden border border-white/5 hover:border-white/10 transition-colors"
                        >
                            <div className="flex flex-col h-full justify-between">
                                <span className="text-slate-400 text-lg font-medium">Wound Area</span>
                                <div className="flex items-end gap-6 mt-auto">
                                    <div>
                                        <span className="text-4xl font-light text-white">12.5</span>
                                        <span className="text-sm text-slate-500 ml-1">cm²</span>
                                    </div>

                                    {/* Abstract mini bar chart */}
                                    <div className="flex gap-1 h-12 items-end mb-1 opacity-80">
                                        <div className="w-2 h-[40%] bg-slate-700 rounded-full"></div>
                                        <div className="w-2 h-[60%] bg-slate-600 rounded-full"></div>
                                        <div className="w-2 h-[50%] bg-slate-500 rounded-full"></div>
                                        <div className="w-2 h-[80%] bg-primary/70 rounded-full box-shadow shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Card D: Variation */}
                        <motion.div
                            custom={4}
                            initial="hidden"
                            animate="visible"
                            variants={variants as any}
                            className="rounded-[2.5rem] bg-glass-dark p-8 relative overflow-hidden border border-white/5 hover:border-white/10 transition-colors"
                        >
                            <span className="text-slate-400 text-lg font-medium block mb-4">Baseline Var.</span>
                            <div className="text-5xl font-light text-white">4.2 <span className="text-xl text-slate-500 font-normal">mm</span></div>
                            <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full w-[70%] bg-gradient-to-r from-primary to-accent rounded-full"></div>
                            </div>
                        </motion.div>

                    </div>
                </div>

                {/* Bottom Section: Graphs */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[300px]">

                    {/* Graph Left: Line Chart */}
                    <motion.div
                        custom={5}
                        initial="hidden"
                        animate="visible"
                        variants={variants as any}
                        className="rounded-[2.5rem] bg-glass-dark p-8 border border-white/5 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-32 bg-primary/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-primary/10 transition-colors"></div>
                        <h3 className="text-white text-lg font-medium mb-6 flex items-center gap-2">
                            <TrendingUp size={20} className="text-primary" />
                            Velocity Recording
                        </h3>
                        <div className="h-[200px] w-full relative z-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={TREND_DATA}>
                                    <defs>
                                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)' }}
                                        itemStyle={{ color: '#fff' }}
                                        cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1, strokeDasharray: '5 5' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="val"
                                        stroke="hsl(var(--primary))"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorVal)"
                                        activeDot={{ r: 6, strokeWidth: 0, fill: "hsl(var(--primary))" }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        {/* Decorative Lines simulating the ECG BG lines */}
                        <div className="absolute inset-0 pointer-events-none opacity-10"
                            style={{ backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '8%' }}>
                        </div>
                    </motion.div>

                    {/* Graph Right: Bubble/Bar Chart */}
                    <motion.div
                        custom={6}
                        initial="hidden"
                        animate="visible"
                        variants={variants as any}
                        className="rounded-[2.5rem] bg-glass-dark p-8 border border-white/5 relative overflow-hidden"
                    >
                        <div className="flex justify-between items-center mb-6 relative z-10">
                            <h3 className="text-white text-lg font-medium">Tissue Viability</h3>
                            <span className="text-3xl text-primary font-light">96<span className="text-sm font-bold text-primary/50 ml-1">%</span></span>
                        </div>

                        <div className="h-[200px] w-full flex items-end justify-between px-2 gap-2 relative z-10">
                            {TISSUE_DATA.map((d, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: `${d.val}%`, opacity: 1 }}
                                    transition={{ delay: 0.5 + (i * 0.05), duration: 0.5, type: "spring", stiffness: 100 }}
                                    className={`w-full rounded-full relative group hover:opacity-100 transition-opacity cursor-pointer ${d.type === 'necrotic' ? 'bg-purple-500/20' :
                                        d.type === 'slough' ? 'bg-indigo-500/20' : 'bg-cyan-500/30'
                                        }`}
                                >
                                    {/* Core Bar */}
                                    {/* Dot at top */}
                                    <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] ${d.type === 'necrotic' ? 'bg-purple-500 shadow-purple-500/50' :
                                        d.type === 'slough' ? 'bg-indigo-400 shadow-indigo-400/50' : 'bg-cyan-400 shadow-cyan-400/50'
                                        }`}></div>
                                </motion.div>
                            ))}
                        </div>
                        {/* Background Glow */}
                        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
                    </motion.div>

                </div>

            </div>
        </div>
    );
}
