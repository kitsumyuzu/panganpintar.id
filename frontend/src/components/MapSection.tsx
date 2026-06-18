import { useEffect, useState } from 'react'
import { MapContainer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import {
    TrendingUp,
    TrendingDown,
    Minus,
    Info,
    Loader2,
    AlertCircle,
    CheckCircle,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react'

// Fix Leaflet icon URLs
delete (L.Icon.Default.prototype as any)._getIconUrl

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Types
type Trend = 'up' | 'down' | 'stable'

interface CommodityPrice {
    name: string
    price: number
    currentPrice: number
    unit: string
    status: Trend
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

const DEFAULT_PROVINCE = 'Bali'

// Sample current prices (actual market prices)
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

// Determine trend based on actual price comparison
const determineTrend = (predictedPrice: number, currentPrice: number): Trend => {
    const changePercent = ((predictedPrice - currentPrice) / currentPrice) * 100
    
    if (changePercent > 5) return 'up'
    if (changePercent < -5) return 'down'
    return 'stable'
}

// Indonesia map layer component
function IndonesiaGeoLayer({
    geoData,
    onProvinceClick,
}: {
    geoData: any
    onProvinceClick: (province: string) => void
}) {
    const map = useMap()

    useEffect(() => {
        if (!geoData || !map) return

        // Clean up existing layers
        map.eachLayer((layer) => {
            if (layer instanceof L.GeoJSON) {
                map.removeLayer(layer)
            }
        })

        const layer = L.geoJSON(geoData, {
            style: {
                fillColor: '#22c55e',
                fillOpacity: 0.6,
                color: '#ffffff',
                weight: 1,
            },
            onEachFeature: (feature, layer) => {
                const provinceName =
                    feature?.properties?.PROVINSI ||
                    feature?.properties?.NAME_1 ||
                    feature?.properties?.name ||
                    'Unknown'

                layer.on({
                    click: () => {
                        if (provinceName) {
                            onProvinceClick(provinceName)
                        }
                    },
                    mouseover: () => {
                        (layer as L.Path).setStyle({ fillOpacity: 0.9, weight: 2 })
                    },
                    mouseout: () => {
                        (layer as L.Path).setStyle({ fillOpacity: 0.6, weight: 1 })
                    },
                })

                layer.bindTooltip(provinceName, {
                    sticky: true,
                    direction: 'center',
                })
            },
        })

        layer.addTo(map)

        const bounds = layer.getBounds()
        if (bounds.isValid()) {
            map.fitBounds(bounds, { padding: [5, 5], animate: true })
        }

        // Disable interactions
        setTimeout(() => {
            map.dragging.disable()
            map.scrollWheelZoom.disable()
            map.doubleClickZoom.disable()
            map.touchZoom.disable()
            map.boxZoom.disable()
            map.keyboard.disable()
            map.setMaxBounds(bounds.pad(0.02))
        }, 500)

        return () => {
            layer.remove()
        }
    }, [geoData, map, onProvinceClick])

    return null
}

export default function MapSection() {
    const [selectedProvince, setSelectedProvince] = useState<string>(DEFAULT_PROVINCE)
    const [geoData, setGeoData] = useState<any>(null)
    const [commodities, setCommodities] = useState<CommodityPrice[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isApiOnline, setIsApiOnline] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Fetch prices for a province
    const fetchPrices = async (province: string) => {
        setIsLoading(true)
        setError(null)

        try {
            // Check API health
            const apiBase = import.meta.env.VITE_AI_API_URL || 'https://firmanfadilah-pangan-pintar-api.hf.space'
            const healthRes = await fetch(`${apiBase}/health`)
            
            if (!healthRes.ok) {
                setIsApiOnline(false)
                throw new Error('API tidak tersedia')
            }
            setIsApiOnline(true)

            // Fetch commodities list
            const commRes = await fetch(`${AI_API_BASE}/commodities`)
            if (!commRes.ok) throw new Error('Gagal memuat komoditas')

            const commData: any = await commRes.json()
            let commodityList: string[] = []

            // Handle various response formats
            if (Array.isArray(commData)) {
                commodityList = commData
            } else if (commData.commodities && Array.isArray(commData.commodities)) {
                commodityList = commData.commodities
            } else if (commData.data && Array.isArray(commData.data)) {
                commodityList = commData.data
            }

            // Extract commodity names
            if (commodityList.length > 0 && typeof commodityList[0] === 'object') {
                commodityList = commodityList.map((item: any) => 
                    item.name || item.commodity || item.nama || String(item)
                ).filter(Boolean)
            }

            if (commodityList.length === 0) {
                setError('Tidak ada komoditas tersedia')
                setIsLoading(false)
                return
            }

            // Target week (next 7 days)
            const targetDate = new Date()
            targetDate.setDate(targetDate.getDate() + 7)
            const targetWeek = targetDate.toISOString().split('T')[0]

            const prices: CommodityPrice[] = []

            for (const comm of commodityList) {
                const commodityName = typeof comm === 'string' ? comm : String(comm)
                
                if (!commodityName) continue

                try {
                    // Use /predict endpoint
                    const priceRes = await fetch(`${AI_API_BASE}/predict`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            commodity: commodityName,
                            province: province,
                            target_week: targetWeek,
                        }),
                    })

                    if (priceRes.ok) {
                        const data: ApiResponse = await priceRes.json()
                        
                        // Get actual current price from samples
                        let currentPrice = SAMPLE_CURRENT_PRICES[commodityName]
                        
                        // Fallback if not in samples
                        if (!currentPrice) {
                            currentPrice = Math.floor(data.predicted_price * 0.9)
                        }

                        // Determine status based on actual price comparison
                        const status = determineTrend(data.predicted_price, currentPrice)

                        prices.push({
                            name: data.commodity,
                            price: data.predicted_price,
                            currentPrice: currentPrice,
                            unit: data.commodity?.includes('Minyak') ? '/liter' : '/kg',
                            status: status,
                        })
                    }
                } catch {
                    // Skip failed commodity
                }
            }

            if (prices.length > 0) {
                setCommodities(prices)
            } else {
                setError('Tidak ada harga tersedia')
            }
        } catch (err: any) {
            console.error('Failed to fetch prices:', err)
            setError(err.message || 'Gagal memuat data harga')
        } finally {
            setIsLoading(false)
        }
    }

    // Load GeoJSON on mount
    useEffect(() => {
        fetch(
            'https://raw.githubusercontent.com/ardian28/GeoJson-Indonesia-38-Provinsi/refs/heads/main/Provinsi/38%20Provinsi%20Indonesia%20-%20Provinsi.json'
        )
            .then((res) => res.json())
            .then((data) => setGeoData(data))
            .catch((err) => console.error('GeoJSON load failed:', err))
    }, [])

    // Check user province and update selected province
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

    // Fetch prices when selectedProvince changes
    useEffect(() => {
        fetchPrices(selectedProvince)
    }, [selectedProvince])

    // Handle province click
    const handleProvinceClick = (province: string) => {
        setSelectedProvince(province)
    }

    // Get status icon (Inverted: Up is Rose/Red, Down is Emerald/Green)
    const getStatusIcon = (status: Trend) => {
        switch (status) {
            case 'up':
                return <TrendingUp size={12} className="text-rose-500" />
            case 'down':
                return <TrendingDown size={12} className="text-emerald-500" />
            default:
                return <Minus size={12} className="text-slate-400" />
        }
    }

    // Get status badge colors (Inverted for economic impact)
    const getStatusBadgeClass = (status: Trend) => {
        switch (status) {
            case 'up':
                return 'bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30'
            case 'down':
                return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30'
            default:
                return 'bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-transparent'
        }
    }

    return (
        <section className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
                        Harga Komoditas per Provinsi
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                        Klik area peta provinsi di bawah untuk memuat informasi prakiraan perbandingan laju komoditas pasar wilayah terkait.
                    </p>
                </div>

                {/* API Status */}
                <div className="flex justify-center mb-8">
                    {isApiOnline ? (
                        <span className="flex items-center px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold rounded-full text-xs border border-emerald-500/20">
                            <CheckCircle size={14} className="mr-1.5" />
                            Sistem AI Aktif
                        </span>
                    ) : (
                        <span className="flex items-center px-3 py-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold rounded-full text-xs border border-amber-500/20">
                            <AlertCircle size={14} className="mr-1.5" />
                            Mode Demonstrasi
                        </span>
                    )}
                </div>

                {/* Map Container Block (Unchanged Position/Properties) */}
                <div className="mb-8">
                    <div className="h-[500px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl">
                        <MapContainer
                            center={[-5, 115]}
                            zoom={5}
                            minZoom={5}
                            maxZoom={8}
                            zoomControl={false}
                            attributionControl={false}
                            scrollWheelZoom={false}
                            doubleClickZoom={false}
                            touchZoom={false}
                            boxZoom={false}
                            keyboard={false}
                            dragging={true}
                            style={{
                                height: '100%',
                                width: '100%',
                                background: '#0f172a',
                            }}
                        >
                            {geoData && (
                                <IndonesiaGeoLayer
                                    geoData={geoData}
                                    onProvinceClick={handleProvinceClick}
                                />
                            )}
                        </MapContainer>
                    </div>
                </div>

                {/* Price Cards Panel */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md">
                    <div className="flex items-center mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <Info size={22} className="text-emerald-500 mr-2.5" />
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                            Wilayah Informasi: <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{selectedProvince}</span>
                        </h3>
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-2">
                            <Loader2 className="animate-spin text-emerald-500" size={32} />
                            <span className="text-slate-400 text-sm font-medium">Memproses data spasial...</span>
                        </div>
                    ) : error ? (
                        <div className="text-rose-500 text-center py-6 flex items-center justify-center text-sm font-semibold gap-2">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    ) : commodities.length === 0 ? (
                        <div className="text-slate-400 text-center py-6 text-sm font-medium">Tidak ada data harga yang tersemat.</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {commodities.map((commodity, index) => {
                                const isUp = commodity.status === 'up';
                                const isDown = commodity.status === 'down';

                                return (
                                    <div
                                        key={index}
                                        className="bg-slate-50/60 dark:bg-slate-950/40 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-xl p-4 border border-slate-200/70 dark:border-slate-800/80 flex flex-col justify-between transition-colors shadow-sm"
                                    >
                                        <div className="flex justify-between items-start gap-2">
                                            <div>
                                                <p className="font-bold text-slate-950 dark:text-white text-sm tracking-wide mb-1">
                                                    {commodity.name}
                                                </p>
                                                <p className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                                                    Rp {commodity.price.toLocaleString('id-ID')}<span className="text-xs font-normal text-slate-400">{commodity.unit}</span>
                                                </p>
                                                <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                                                    Kini: Rp {commodity.currentPrice.toLocaleString('id-ID')}
                                                </p>
                                            </div>

                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadgeClass(commodity.status)}`}>
                                                {getStatusIcon(commodity.status)}
                                                {commodity.status === 'up' ? 'Naik' : commodity.status === 'down' ? 'Turun' : 'Stabil'}
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}