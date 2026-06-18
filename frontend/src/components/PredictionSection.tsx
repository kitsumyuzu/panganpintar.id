import { useState, useMemo, useEffect } from 'react'
import { Search, TrendingUp, TrendingDown, Minus, Filter, RefreshCw, AlertCircle, CheckCircle2, ArrowUpRight, ArrowDownRight } from 'lucide-react'

type Trend = 'up' | 'down' | 'stable'

interface CommodityPrediction {
    name: string
    predictedPrice: number
    currentPrice: number
    unit: string
    trend: Trend
    prediction: 'Naik' | 'Turun' | 'Stabil'
}

interface ApiResponse {
    commodity: string
    province: string
    target_week: string
    predicted_price: number
    predicted_at: string
    model: string
    currency: string
}

interface User {
    id: number
    email: string
    username?: string
    province?: string
}

const AI_API_BASE = `${import.meta.env.VITE_AI_API_URL || 'https://firmanfadilah-pangan-pintar-api.hf.space'}/api/v1`
const ALL_PROVINCES = 'Semua Provinsi'

const SAMPLE_CURRENT_PRICES: Record<string, number> = {
    'Beras': 12500,
    'Cabai Rawit': 48000,
    'Cabai Merah': 42000,
    'Bawang Putih': 30000,
    'Bawang Merah': 32800,
    'Daging Ayam': 32000,
    'Telur Ayam': 28500,
    'Minyak Goreng': 14800,
    'Gula Pasir': 16500,
    'Daging Sapi': 200000,
}

const BADGE_COLORS: Record<string, string> = {
    'Naik': 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30',
    'Turun': 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30',
    'Stabil': 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-transparent',
}

const determineTrend = (predictedPrice: number, currentPrice: number): Trend => {
    const changePercent = ((predictedPrice - currentPrice) / currentPrice) * 100
    if (changePercent > 5) return 'up'
    if (changePercent < -5) return 'down'
    return 'stable'
}

const getPredictionFromTrend = (trendValue: Trend): 'Naik' | 'Turun' | 'Stabil' => {
    return trendValue === 'up' ? 'Naik' : trendValue === 'down' ? 'Turun' : 'Stabil'
}

export default function PredictionSection() {
    const [searchQuery, setSearchQuery] = useState('')
    const [provinces, setProvinces] = useState<string[]>([])
    const [selectedProvince, setSelectedProvince] = useState(ALL_PROVINCES)
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isApiOnline, setIsApiOnline] = useState(false)
    const [predictions, setPredictions] = useState<CommodityPrediction[]>([])
    const [userProvince, setUserProvince] = useState<string | null>(null)

    useEffect(() => {
        const checkUserAndProvince = async () => {
            const token = localStorage.getItem('token')
            if (token) {
                try {
                    const res = await fetch('http://localhost:3001/api/auth/me', {
                        headers: { 'Authorization': `Bearer ${token}` },
                    })
                    if (res.ok) {
                        const data: { success: boolean; data: User } = await res.json()
                        if (data.success && data.data?.province) {
                            setUserProvince(data.data.province)
                            setSelectedProvince(data.data.province)
                        }
                    }
                } catch (error) {
                    console.error('Error fetching user province:', error)
                }
            }
        }
        checkUserAndProvince()
    }, [])

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const res = await fetch(`${AI_API_BASE}/provinces`)
                if (res.ok) {
                    const data = await res.json()
                    setProvinces([ALL_PROVINCES, ...(data.provinces || data)])
                } else {
                    setProvinces([ALL_PROVINCES])
                }
            } catch {
                setProvinces([ALL_PROVINCES])
            }
        }
        fetchProvinces()
    }, [])

    useEffect(() => {
        const fetchPredictions = async () => {
            setIsLoading(true)
            setPredictions([])
            const apiBase = import.meta.env.VITE_AI_API_URL || 'https://firmanfadilah-pangan-pintar-api.hf.space'

            try {
                const healthRes = await fetch(`${apiBase}/health`)
                if (healthRes.ok) {
                    setIsApiOnline(true)

                    const commRes = await fetch(`${AI_API_BASE}/commodities`)
                    let commodities: string[] = []
                    if (commRes.ok) {
                        const commData = await commRes.json()
                        commodities = commData.commodities || commData
                    }

                    if (commodities.length === 0) {
                        setIsLoading(false)
                        return
                    }

                    const targetDate = new Date()
                    targetDate.setDate(targetDate.getDate() + 7)
                    const targetWeek = targetDate.toISOString().split('T')[0]

                    const province = selectedProvince === ALL_PROVINCES
                        ? userProvince || 'DKI Jakarta'
                        : selectedProvince

                    const results: CommodityPrediction[] = []

                    for (const comm of commodities) {
                        try {
                            const res = await fetch(`${AI_API_BASE}/predict`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    commodity: comm,
                                    province: province,
                                    target_week: targetWeek,
                                }),
                            })

                            if (res.ok) {
                                const data: ApiResponse = await res.json()
                                let currentPrice = SAMPLE_CURRENT_PRICES[comm] || 
                                    SAMPLE_CURRENT_PRICES[comm.replace('Minyak Goreng', 'Minyak')] ||
                                    Math.floor(data.predicted_price * 0.9)

                                const trend = determineTrend(data.predicted_price, currentPrice)
                                const prediction = getPredictionFromTrend(trend)

                                results.push({
                                    name: data.commodity,
                                    predictedPrice: data.predicted_price,
                                    currentPrice: currentPrice,
                                    unit: data.commodity?.includes('Minyak') ? '/liter' : '/kg',
                                    trend: trend,
                                    prediction: prediction,
                                })
                            }
                        } catch (error) {
                            console.error('Error fetching', comm, ':', error)
                        }
                    }

                    if (results.length > 0) setPredictions(results)
                } else {
                    setIsApiOnline(false)
                }
            } catch (error) {
                console.error('Fetch error:', error)
                setIsApiOnline(false)
            } finally {
                setIsLoading(false)
            }
        }

        fetchPredictions()
    }, [selectedProvince, userProvince])

    const filteredCommodities = useMemo((): CommodityPrediction[] => {
        if (!searchQuery) return predictions
        return predictions.filter((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [searchQuery, predictions])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement
            if (!target.closest('.relative')) {
                setIsFilterOpen(false)
            }
        }
        if (isFilterOpen) document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
    }, [isFilterOpen])

    return (
        <section className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300" id="prediction">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header Row */}
                <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-12 gap-4">
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
                            Prediksi Harga Komoditas Berkala
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-xl">
                            Analisis estimasi harga bahan baku pokok berbasis kecerdasan buatan untuk optimalisasi perencanaan anggaran logistik Anda.
                        </p>
                    </div>

                    <div>
                        {isApiOnline ? (
                            <span className="inline-flex items-center px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-bold border border-emerald-500/20 shadow-sm">
                                <CheckCircle2 size={14} className="mr-1.5 animate-pulse" />
                                Sistem Prakiraan Aktif
                            </span>
                        ) : (
                            <span className="inline-flex items-center px-3 py-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-xs font-bold border border-amber-500/20 shadow-sm">
                                <AlertCircle size={14} className="mr-1.5" />
                                Mode Demonstrasi Lokal
                            </span>
                        )}
                    </div>
                </div>

                {/* Filter and Search Controls */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 mb-8 border border-slate-200/60 dark:border-slate-800 shadow-md">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Cari nama komoditas pangan..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/80 text-sm transition-all"
                            />
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className="flex items-center justify-between w-full sm:w-64 px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 text-sm font-medium transition-colors"
                            >
                                <div className="flex items-center truncate">
                                    <Filter className="mr-2.5 text-slate-400 flex-shrink-0" size={16} />
                                    <span className="truncate">{selectedProvince}</span>
                                </div>
                            </button>

                            {isFilterOpen && provinces.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto custom-scrollbar">
                                    {provinces.map((prov) => (
                                        <button
                                            key={prov}
                                            onClick={() => {
                                                setSelectedProvince(prov)
                                                setIsFilterOpen(false)
                                            }}
                                            className={`w-full text-left px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-950 text-sm transition-colors ${
                                                selectedProvince === prov
                                                    ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 font-semibold'
                                                    : 'text-slate-700 dark:text-slate-300'
                                            }`}
                                        >
                                            {prov}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Presenter Block */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-3">
                        <RefreshCw className="animate-spin text-emerald-500" size={36} />
                        <span className="text-sm font-medium text-slate-400">Sinkronisasi model pasar...</span>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-lg">
                        
                        {/* Desktop Table Headers */}
                        <div className="hidden md:grid grid-cols-4 gap-4 px-6 py-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800">
                            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Komoditas</div>
                            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Prediksi Pasar Berikutan</div>
                            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Evaluasi Selisih</div>
                            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Status Tren</div>
                        </div>

                        {/* Interactive Prediction Items */}
                        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {filteredCommodities.length > 0 ? (
                                filteredCommodities.map((item) => {
                                    const isUp = item.trend === 'up';
                                    const isDown = item.trend === 'down';

                                    return (
                                        <div
                                            key={item.name}
                                            className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 px-6 py-4 hover:bg-slate-50/60 dark:hover:bg-slate-950/40 transition-colors items-center"
                                        >
                                            {/* Column 1: Component Label */}
                                            <div className="flex items-center">
                                                <span className="font-bold text-slate-900 dark:text-white text-base md:text-sm">
                                                    {item.name}
                                                </span>
                                            </div>

                                            {/* Column 2: Predicted Price Display */}
                                            <div className="flex flex-col justify-center">
                                                <span className="font-semibold text-slate-900 dark:text-slate-100">
                                                    Rp {item.predictedPrice.toLocaleString('id-ID')}{item.unit}
                                                </span>
                                                <span className="text-[11px] text-slate-400 font-medium md:mt-0.5">
                                                    Kini: Rp {item.currentPrice.toLocaleString('id-ID')}
                                                </span>
                                            </div>

                                            {/* Column 3: Change Vector Indicators */}
                                            <div className="flex items-center">
                                                <div className={`inline-flex items-center text-sm font-medium ${
                                                    isUp ? 'text-rose-500' : isDown ? 'text-emerald-500' : 'text-slate-400'
                                                }`}>
                                                    {isUp && <TrendingUp size={16} className="mr-1.5" />}
                                                    {isDown && <TrendingDown size={16} className="mr-1.5" />}
                                                    {!isUp && !isDown && <Minus size={14} className="mr-1.5" />}
                                                    <span className="capitalize text-xs font-semibold">
                                                        {item.trend === 'up' ? 'Meningkat' : item.trend === 'down' ? 'Menurun' : 'Stabil'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Column 4: Semantic Context Badges */}
                                            <div className="flex items-center mt-1 md:mt-0">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase ${BADGE_COLORS[item.prediction]}`}>
                                                    {isUp && <ArrowUpRight size={12} />}
                                                    {isDown && <ArrowDownRight size={12} />}
                                                    {item.prediction}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <div className="px-6 py-16 text-center text-slate-400 dark:text-slate-500 text-sm font-medium">
                                    Tidak menemukan komoditas baku dengan kriteria pencarian tersebut.
                                </div>
                            )}
                        </div>

                    </div>
                )}
            </div>
        </section>
    )
}