import { useState, useMemo, useEffect } from "react"
import { Link } from "react-router-dom"
import { Search, MapPin, Star, ArrowRight, Filter, Loader2 } from "lucide-react"

const AI_API = 'https://firmanfadilah-pangan-pintar-api.hf.space/api/v1'
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001"

interface Store {
    id: number
    name: string
    slug: string
    description: string
    province: string
    city: string
    rating: number
    review_count: number
    image: string
    store_type: {
        name: string
    }
}

function StarRating({ rating, reviewCount }: { rating: number; reviewCount: number }) {
    return (
        <div className="flex items-center">
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                        key={star} 
                        size={16} 
                        className={star <= Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
                    />
                ))}
            </div>
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{rating} ({reviewCount} reviews)</span>
        </div>
    )
}

const getImageUrl = (imagePath: string | null | undefined) => {
    if (!imagePath) return "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=600&fit=crop"
    if (imagePath.startsWith("http")) return imagePath
    return `${API_URL}${imagePath}`
}

function StoreCard({ store }: { store: Store }) {
    return (
        <Link to={`/affiliate/${store.slug}`} className="block group">
            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all h-full flex flex-col">
                <div className="aspect-video overflow-hidden bg-gray-100 dark:bg-gray-900">
                    <img 
                        src={getImageUrl(store.image)} 
                        alt={store.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        loading="lazy"
                    />
                </div>
                <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center text-sm text-green-600 dark:text-green-400 mb-2 font-medium">
                        <MapPin size={14} className="mr-1 shrink-0" />
                        <span className="truncate">{store.city || store.province}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">{store.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-1">{store.description}</p>
                    <div className="mb-4"><StarRating rating={store.rating} reviewCount={store.review_count} /></div>
                    <div className="inline-flex items-center justify-center w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors mt-auto">
                        Lihat Detail <ArrowRight size={18} className="ml-2" />
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default function Affiliate() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedProvince, setSelectedProvince] = useState("Semua Provinsi")
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [stores, setStores] = useState<Store[]>([])
    const [provinces, setProvinces] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let isMounted = true

        const loadData = async () => {
            setIsLoading(true)
            const token = localStorage.getItem('token')
            const user = localStorage.getItem('user')

            try {
                // Fetch basic structural payloads concurrently
                const [provResponse, storesResponse] = await Promise.allSettled([
                    fetch(`${AI_API}/provinces`),
                    fetch(`${API_URL}/api/affiliate/stores`)
                ])

                let fetchedProvinces: string[] = []
                if (provResponse.status === 'fulfilled' && provResponse.value.ok) {
                    const provData = await provResponse.value.json()
                    fetchedProvinces = provData.provinces || []
                }

                let fetchedStores: Store[] = []
                if (storesResponse.status === 'fulfilled' && storesResponse.value.ok) {
                    const storesData = await storesResponse.value.json()
                    fetchedStores = storesData.data || storesData
                }

                let userProvince: string | null = null
                if (token && user) {
                    try {
                        const authRes = await fetch(`${API_URL}/api/auth/me`, {
                            headers: { 'Authorization': `Bearer ${token}` }
                        })
                        if (authRes.ok) {
                            const authData = await authRes.json()
                            userProvince = authData.province || authData.data?.province || null
                        }
                    } catch (e) {
                        console.warn('Context auth profile profile unavailable.')
                    }
                }

                if (!isMounted) return

                setProvinces(fetchedProvinces)
                setStores(fetchedStores)

                if (userProvince && fetchedProvinces.includes(userProvince)) {
                    setSelectedProvince(userProvince)
                }

            } catch (err) {
                console.error('Error loading initial view collections:', err)
                if (isMounted) setError('Gagal memuat data')
            } finally {
                if (isMounted) setIsLoading(false)
            }
        }

        loadData()
        return () => { isMounted = false }
    }, [])

    const filteredStores = useMemo(() => {
        let result = stores
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            result = result.filter((store) => store.name.toLowerCase().includes(query))
        }
        if (selectedProvince !== "Semua Provinsi") {
            result = result.filter((store) => store.province === selectedProvince)
        }
        return result
    }, [searchQuery, selectedProvince, stores])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement
            if (!target.closest(".filter-container")) {
                setIsFilterOpen(false)
            }
        }
        if (isFilterOpen) document.addEventListener("click", handleClickOutside)
        return () => document.removeEventListener("click", handleClickOutside)
    }, [isFilterOpen])

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-16 flex items-center justify-center">
                <Loader2 className="animate-spin text-green-600" size={40} />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Program Affiliate <span className="text-green-600">PanganPintar</span>
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Bergabung dengan jaringan affiliate kami untuk mendapatkan passive income dengan mempromosikan produk pangan berkualitas dari seluruh Indonesia.
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 border border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input 
                                type="text" 
                                placeholder="Cari nama store..." 
                                value={searchQuery} 
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500" 
                            />
                        </div>

                        <div className="relative filter-container">
                            <button 
                                type="button"
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className="flex items-center justify-between w-full md:w-64 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <div className="flex items-center">
                                    <Filter className="mr-3 text-gray-400" size={20} />
                                    <span className="truncate">{selectedProvince}</span>
                                </div>
                            </button>

                            {isFilterOpen && (
                                <ul className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto list-none m-0 p-0">
                                    {["Semua Provinsi", ...provinces].map((province) => (
                                        <li key={province}>
                                            <button 
                                                type="button" 
                                                onClick={() => { setSelectedProvince(province); setIsFilterOpen(false) }}
                                                className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                                                    selectedProvince === province ? "bg-green-50 dark:bg-green-900/20 text-green-600 font-medium" : "text-gray-900 dark:text-white"
                                                }`}
                                            >
                                                {province}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                {error ? (
                    <div className="text-center py-12"><p className="text-red-500 text-lg font-medium">{error}</p></div>
                ) : (
                    <>
                        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                            Menampilkan {filteredStores.length} store {selectedProvince !== "Semua Provinsi" && <span className="text-green-600 dark:text-green-400 font-medium">di {selectedProvince}</span>}
                        </p>
                        
                        {filteredStores.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredStores.map((store) => <StoreCard key={store.id} store={store} />)}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl">
                                <p className="text-gray-500 dark:text-gray-400 text-lg">Tidak ada store yang cocok dengan pencarian Anda</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}