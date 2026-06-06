import { useState, useMemo, useEffect } from 'react'
import { Search, TrendingUp, TrendingDown, Minus, Filter, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react'

// Types
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

// API URL from env
const AI_API_BASE = `${import.meta.env.VITE_AI_API_URL || 'https://firmanfadilah-pangan-pintar-api.hf.space'}/api/v1`

// Sample current prices
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

const ALL_PROVINCES = 'Semua Provinces'

// Badge colors
const BADGE_COLORS: Record<string, string> = {
    'Naik': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'Turun': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    'Stabil': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
}

const TREND_COLORS: Record<Trend, string> = {
    'up': 'text-green-500',
    'down': 'text-red-500',
    'stable': 'text-gray-500',
}

// Determine trend - 5% threshold
const determineTrend = (predictedPrice: number, currentPrice: number): Trend => {
    const changePercent = ((predictedPrice - currentPrice) / currentPrice) * 100
    
    if (changePercent > 5) return 'up'
    if (changePercent < -5) return 'down'
    return 'stable'
}

// Convert trend to prediction text
const getPredictionFromTrend = (trendValue: Trend): 'Naik' | 'Turun' | 'Stabil' => {
    return trendValue === 'up' ? 'Naik' : trendValue === 'down' ? 'Turun' : 'Stabil'
}

// Get trend icon component
const getTrendIcon = (trend: Trend) => {
    switch (trend) {
        case 'up': return <TrendingUp size={16} className="text-green-500" />
        case 'down': return <TrendingDown size={16} className="text-red-500" />
        case 'stable': return <Minus size={16} className="text-gray-500" />
    }
}

// Get prediction badge
const getPredictionBadge = (prediction: string) => {
    const colorClass = BADGE_COLORS[prediction] || BADGE_COLORS['Stabil']
    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
            {prediction}
        </span>
    )
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

    // Check if user is logged in and get their province
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

    // Fetch provinces from API
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

    // Fetch predictions - runs whenever province changes
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

                                // Get current price
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

                    if (results.length > 0) {
                        setPredictions(results)
                    }
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

    // Filter commodities
    const filteredCommodities = useMemo((): CommodityPrediction[] => {
        if (!searchQuery) return predictions
        return predictions.filter((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [searchQuery, predictions])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement
            if (!target.closest('.relative')) {
                setIsFilterOpen(false)
            }
        }

        if (isFilterOpen) {
            document.addEventListener('click', handleClickOutside)
        }

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [isFilterOpen])

    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-8">
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                            Prediksi Harga Komoditas
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Prediksi harga komoditas berbasis AI untuk帮助 perencanaan budget Anda
                        </p>
                    </div>

                    {/* API Status */}
                    <div className="flex items-center mt-4 md:mt-0">
                        {isApiOnline ? (
                            <span className="flex items-center px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full text-sm">
                                <CheckCircle size={14} className="mr-1" />
                                AI Online
                            </span>
                        ) : (
                            <span className="flex items-center px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 rounded-full text-sm">
                                <AlertCircle size={14} className="mr-1" />
                                Demo Mode
                            </span>
                        )}
                    </div>
                </div>

                {/* Filter Controls */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 border border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search Input */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Cari komoditas..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#259d84]"
                            />
                        </div>

                        {/* Province Select */}
                        <div className="relative">
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className="flex items-center justify-between w-full md:w-64 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                <div className="flex items-center">
                                    <Filter className="mr-3 text-gray-400" size={20} />
                                    <span className="truncate">{selectedProvince}</span>
                                </div>
                            </button>

                            {isFilterOpen && provinces.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                                    {provinces.map((province) => (
                                        <button
                                            key={province}
                                            onClick={() => {
                                                setSelectedProvince(province)
                                                setIsFilterOpen(false)
                                            }}
                                            className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                                                selectedProvince === province
                                                    ? 'bg-green-50 dark:bg-green-900/20 text-green-600'
                                                    : 'text-gray-900 dark:text-white'
                                            }`}
                                        >
                                            {province}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Loading */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <RefreshCw className="animate-spin text-[#259d84]" size={40} />
                    </div>
                ) : (
                    /* Table */
                    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                        {/* Table Header */}
                        <div className="hidden md:grid grid-cols-4 gap-4 px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                            <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">Komoditas</div>
                            <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">Prediksi Harga</div>
                            <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">Trend</div>
                            <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">Status</div>
                        </div>

                        {/* Table Body */}
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredCommodities.length > 0 ? (
                                filteredCommodities.map((item) => (
                                    <div
                                        key={item.name}
                                        className="grid grid-cols-1 md:grid-cols-4 gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                    >
                                        <div className="flex items-center">
                                            <span className="font-semibold text-gray-900 dark:text-white">{item.name}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="text-gray-900 dark:text-white">
                                                Rp {item.predictedPrice.toLocaleString('id-ID')}{item.unit}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className={`flex items-center ${TREND_COLORS[item.trend]}`}>
                                                {getTrendIcon(item.trend)}
                                                <span className="ml-2 capitalize text-sm">{item.trend}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            {getPredictionBadge(item.prediction)}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="px-6 py-12 text-center">
                                    <p className="text-gray-500 dark:text-gray-400">Tidak ada hasil yang cocok</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}