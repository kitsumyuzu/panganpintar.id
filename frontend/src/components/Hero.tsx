import { ArrowRight, TrendingUp, Shield, Wallet, Sparkles, BarChart3, CheckCircle2 } from 'lucide-react'

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            {/* Dynamic Background Gradients */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[120px]" />
                <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[100px]" />
                <div className="absolute -bottom-40 right-1/4 w-[450px] h-[450px] bg-teal-500/10 dark:bg-teal-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left Column: Copy & CTAs */}
                    <div className="text-center lg:text-left space-y-8">

                        {/* Tagline Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-800/50 rounded-full text-emerald-700 dark:text-emerald-400 text-xs font-semibold tracking-wide uppercase shadow-sm mx-auto lg:mx-0 animate-fade-in">
                            <Sparkles size={14} className="animate-pulse" />
                            <span>Platform AI Prediksi Harga Pangan 7 - 14 Hari</span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                            Kelola Pengeluaran <br />
                            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                                Dapur & Bisnis UMKM
                            </span>{' '}
                            Anda
                        </h1>

                        {/* Description */}
                        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
                            Platform manajemen cerdas untuk memprediksi pengeluaran secara akurat, meningkatkan efisiensi operasional, dan menekan pemborosan anggaran demi pertumbuhan bisnis berkelanjutan.
                        </p>

                        {/* Interactive CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                            <a href="#prediction" className="group">
                                <button className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-600/20 hover:shadow-emerald-500/30 transition-all duration-200 transform hover:-translate-y-0.5">
                                    Mulai Sekarang
                                    <ArrowRight size={18} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                                </button>
                            </a>
                        </div>

                        {/* Trust Badges */}
                        <div className="pt-8 border-t border-slate-200 dark:border-slate-800/80 space-y-4">
                            <div className="flex items-center justify-center lg:justify-start gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                                <CheckCircle2 size={16} className="text-emerald-500" />
                                <span>Dipercaya oleh 1,000+ pelaku bisnis kuliner & UMKM</span>
                            </div>
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-1">
                                <div className="flex items-center text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 px-4 py-2 rounded-lg border border-slate-100 dark:border-slate-800/50 shadow-sm">
                                    <Shield size={18} className="text-emerald-600 dark:text-emerald-400 mr-2.5 flex-shrink-0" />
                                    <span className="text-sm font-semibold">Aman & Terenkripsi</span>
                                </div>
                                <div className="flex items-center text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 px-4 py-2 rounded-lg border border-slate-100 dark:border-slate-800/50 shadow-sm">
                                    <Wallet size={18} className="text-emerald-600 dark:text-emerald-400 mr-2.5 flex-shrink-0" />
                                    <span className="text-sm font-semibold">Budget Fleksibel</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Modern Mockup UI Visual */}
                    <div className="relative lg:ml-4 group">
                        {/* Background Glow Wrapper */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-[2.5rem] opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-300" />

                        {/* Main Interactive Dashboard Preview */}
                        <div className="relative rounded-[2rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden aspect-[4/3] sm:aspect-square lg:aspect-[4/3] p-6 flex flex-col justify-between">

                            {/* Fake Dashboard Top Bar */}
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 rounded-full bg-red-400" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                    <div className="w-3 h-3 rounded-full bg-green-400" />
                                    <span className="text-xs text-slate-400 font-mono ml-2">smart-dashboard // forecasting</span>
                                </div>
                                <div className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                    Live Sync
                                </div>
                            </div>

                            {/* Fake Chart / Graphic Centerpiece */}
                            <div className="flex-1 flex flex-col justify-center my-4 space-y-4">
                                <div className="flex items-end justify-between px-4 h-32 pt-4 border-b border-slate-100 dark:border-slate-800 relative">
                                    {/* Fake bars simulating a forecast graph */}
                                    <div className="w-8 bg-slate-200 dark:bg-slate-800 rounded-t-md h-[40%]" />
                                    <div className="w-8 bg-slate-200 dark:bg-slate-800 rounded-t-md h-[55%]" />
                                    <div className="w-8 bg-slate-200 dark:bg-slate-800 rounded-t-md h-[45%]" />
                                    <div className="w-8 bg-emerald-500/40 dark:bg-emerald-500/30 rounded-t-md h-[70%] relative">
                                        <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">H-7</span>
                                    </div>
                                    <div className="w-8 bg-emerald-500 dark:bg-emerald-400 rounded-t-md h-[90%] relative">
                                        <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Hari ini</span>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center justify-center gap-2">
                                        <BarChart3 className="text-emerald-500" size={20} /> Smart Analytics
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                        Prediksi sisa stok pangan & biaya operasional terintegrasi.
                                    </p>
                                </div>
                            </div>

                            {/* Bottom decorative stats bar */}
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
                                <div>
                                    <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Akurasi Prediksi</p>
                                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">94.2%</p>
                                </div>
                                <div>
                                    <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Efisiensi Rata-rata</p>
                                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">+30%</p>
                                </div>
                            </div>
                        </div>

                        {/* Floating Card Left: Savings */}
                        <div className="absolute -left-6 top-1/4 bg-white/90 dark:bg-slate-900/90 backdrop-blur border border-slate-200/60 dark:border-slate-800 p-4 rounded-2xl shadow-xl transform transition-transform duration-300 hover:scale-105">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-950/50 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-inner">
                                    <TrendingUp size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Penghematan</p>
                                    <p className="text-base font-bold text-slate-900 dark:text-white">+25% Bulan Ini</p>
                                </div>
                            </div>
                        </div>

                        {/* Floating Card Right: Budget Remaining */}
                        <div className="absolute -right-6 bottom-1/4 bg-white/90 dark:bg-slate-900/90 backdrop-blur border border-slate-200/60 dark:border-slate-800 p-4 rounded-2xl shadow-xl transform transition-transform duration-300 hover:scale-105">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950/50 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner">
                                    <Wallet size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Sisa Anggaran</p>
                                    <p className="text-base font-bold text-slate-900 dark:text-white">Rp 5.250.000</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}