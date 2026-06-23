import { useParams, Link } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import {
    MapPin,
    Mail,
    Phone,
    Star,
    ArrowLeft,
    Package,
    Loader2,
    TrendingUp,
    TrendingDown,
    Minus,
    Send,
    PlusCircle,
    Sparkles, // Added to match Hero's style accents
} from "lucide-react"
import { getProvinces } from "../services/api"
import type { Province } from "../services/api"

// Custom WhatsApp Icon
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement> & { size?: number }) => (
    <svg
        width={props.size || 24}
        height={props.size || 24}
        {...props}
        viewBox="0 0 24 24"
        fill="currentColor"
    >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.41a9.86 9.86 0 001-1.353c0-2.174.806-4.206 2.063-5.731 1.326-1.598 3.076-2.635 4.986-2.635 1.647 0 3.163.646 4.306 1.812 1.143 1.166 1.897 2.838 1.897 4.647 0 2.272-.784 4.253-2.063 5.574-1.21 1.252-2.703 2.015-4.414 2.015m-5.399-5.349c-1.066 0-2.108-.321-3.016-.928-1.271-.847-1.987-2.042-1.987-3.397 0-2.075 1.683-3.759 3.76-3.759 1.914 0 3.534 1.214 3.758 3.759.034.383.034.783 0 1.167-.034.384-.1.617-.167.771-.267.615-.771 1.095-1.439 1.095m-.501-1.674c.267 0 .512-.065.768-.196.256-.13.468-.323.639-.579.171-.255.307-.578.429-.965.122-.388.184-.786.184-1.193 0-.858-.696-1.562-1.553-1.562-.858 0-1.553.704-1.553 1.562 0 .193.067.385.199.577.132.191.322.377.571.556.249.179.566.362.937.454.372.092.756.14 1.141.14" />
    </svg>
)

// Types
type Trend = "up" | "down" | "stable"

interface Store {
    id: number
    name: string
    description: string
    province: string
    city: string
    address: string
    rating: number
    review_count: number
    image: string
    cover_image?: string | null
    phone: string
    whatsapp: string
    email: string
    instagram: string
    facebook: string
    tiktok: string
    store_type: {
        name: string
    }
}

interface StoreItem {
    id: number
    name: string
    price: number
    unit: string
    status: Trend
    stock: string
    stock_quantity: number
    item_category: {
        name: string
    }
}

interface StoreEditForm {
    name: string
    description: string
    province: string
    city: string
    address: string
    phone: string
    whatsapp: string
    email: string
    instagram: string
    facebook: string
    tiktok: string
}

interface Review {
    id: number
    rating: number
    review_text: string | null
    created_at: string
    username: string | null
    email: string
}

interface ItemCategory {
    _id: number
    name: string
    slug: string
}

interface MyStore {
    id: number
    slug: string
}

// Status Icon Component
function StatusIcon({ status }: { status: Trend }) {
    if (status === "up") return <TrendingUp size={16} className="text-emerald-500" />
    if (status === "down") return <TrendingDown size={16} className="text-rose-500" />
    return <Minus size={16} className="text-slate-400" />
}

export default function AffiliateStoreDetail() {
    const { slug } = useParams<{ slug: string }>()
    const [store, setStore] = useState<Store | null>(null)
    const [items, setItems] = useState<StoreItem[]>([])
    const [reviews, setReviews] = useState<Review[]>([])
    const [itemCategories, setItemCategories] = useState<ItemCategory[]>([])
    const [myStore, setMyStore] = useState<MyStore | null>(null)
    const [storeEditForm, setStoreEditForm] = useState<StoreEditForm>({
        name: '', description: '', province: '', city: '', address: '',
        phone: '', whatsapp: '', email: '', instagram: '', facebook: '', tiktok: ''
    })
    const [provinces, setProvinces] = useState<Province[]>([])
    const [storeImageFile, setStoreImageFile] = useState<File | null>(null)
    const [storeImagePreview, setStoreImagePreview] = useState<string | null>(null)
    const [itemImageFile, setItemImageFile] = useState<File | null>(null)
    const [itemImagePreview, setItemImagePreview] = useState<string | null>(null)
    const itemImageInputRef = useRef<HTMLInputElement>(null)
    const [storeFormError, setStoreFormError] = useState<string | null>(null)
    const [isSubmittingStore, setIsSubmittingStore] = useState(false)
    const [stockInputs, setStockInputs] = useState<Record<number, string>>({})
    const [stockUpdating, setStockUpdating] = useState<number | null>(null)
    const [stockInputErrors, setStockInputErrors] = useState<Record<number, string>>({})
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isSubmittingItem, setIsSubmittingItem] = useState(false)
    const [isSubmittingReview, setIsSubmittingReview] = useState(false)
    const [itemForm, setItemForm] = useState({
        item_category_id: 0, name: '', description: '', price: '', unit: '/kg'
    })
    const [reviewText, setReviewText] = useState('')
    const [selectedRating, setSelectedRating] = useState(0)
    const [itemFormError, setItemFormError] = useState<string | null>(null)
    const [reviewError, setReviewError] = useState<string | null>(null)

    const API_URL = import.meta.env.VITE_API_URL || "https://kdn.infinitelearningstudent.id"
    const token = localStorage.getItem('token')
    const isOwner = myStore?.slug === slug

    const getImageUrl = (imagePath: string | null | undefined) => {
        if (!imagePath) return "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=600&fit=crop"
        if (imagePath.startsWith("http")) return imagePath
        return `${API_URL}${imagePath}`
    }

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            setError(null)
            try {
                if (!slug) throw new Error('Store tidak ditemukan')

                const [storeRes, itemsRes, reviewsRes, categoriesRes, myStoreRes] = await Promise.all([
                    fetch(`${API_URL}/api/affiliate/stores/${slug}`),
                    fetch(`${API_URL}/api/affiliate/stores/${slug}/items`),
                    fetch(`${API_URL}/api/affiliate/stores/${slug}/reviews`),
                    fetch(`${API_URL}/api/affiliate/item-categories`),
                    token ? fetch(`${API_URL}/api/affiliate/my-store`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }) : Promise.resolve({ ok: false, json: async () => ({}) } as Response)
                ])

                if (!storeRes.ok) throw new Error('Store tidak ditemukan')

                const storeJson = await storeRes.json()
                const storeData = storeJson.data || storeJson
                setStore(storeData)
                setStoreEditForm({
                    name: storeData.name || '', description: storeData.description || '',
                    province: storeData.province || '', city: storeData.city || '',
                    address: storeData.address || '', phone: storeData.phone || '',
                    whatsapp: storeData.whatsapp || '', email: storeData.email || '',
                    instagram: storeData.instagram || '', facebook: storeData.facebook || '',
                    tiktok: storeData.tiktok || ''
                })

                if (itemsRes.ok) {
                    const itemsJson = await itemsRes.json()
                    const itemsData = itemsJson.data || itemsJson
                    setItems(itemsData)
                    const initialStockInputs: Record<number, string> = {}
                    itemsData.forEach((item: StoreItem) => {
                        initialStockInputs[item.id] = String(item.stock_quantity ?? 0)
                    })
                    setStockInputs(initialStockInputs)
                }

                if (reviewsRes.ok) {
                    const reviewsJson = await reviewsRes.json()
                    setReviews(reviewsJson.data || reviewsJson)
                }

                if (categoriesRes.ok) {
                    const categoriesJson = await categoriesRes.json()
                    setItemCategories(categoriesJson.data || categoriesJson)
                }

                const provincesData = await getProvinces()
                setProvinces(provincesData)

                if (token && myStoreRes.ok) {
                    const myStoreJson = await myStoreRes.json()
                    setMyStore(myStoreJson.data)
                }
            } catch (err: any) {
                console.error('Fetch store details error:', err)
                setError(err.message || 'Terjadi kesalahan saat memuat store')
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [slug, token])

    const handleItemFormChange = (field: string, value: string) => {
        if (field === 'item_category_id') {
            setItemForm((prev) => ({ ...prev, [field]: Number(value) }))
        } else {
            setItemForm((prev) => ({ ...prev, [field]: value }))
        }
    }

    const handleStoreFormChange = (field: keyof StoreEditForm, value: string) => {
        setStoreEditForm((prev) => ({ ...prev, [field]: value }))
    }

    const handleStoreImageChange = (file: File | null) => {
        if (storeImagePreview) URL.revokeObjectURL(storeImagePreview)
        setStoreImageFile(file)
        if (file) {
            setStoreImagePreview(URL.createObjectURL(file))
        } else {
            setStoreImagePreview(null)
        }
    }

    const handleItemImageChange = (file: File | null) => {
        if (itemImagePreview) URL.revokeObjectURL(itemImagePreview)
        setItemImageFile(file)
        if (file) {
            setItemImagePreview(URL.createObjectURL(file))
        } else {
            setItemImagePreview(null)
        }
    }

    const handleUpdateStore = async () => {
        if (!store) return
        setStoreFormError(null)
        setIsSubmittingStore(true)
        try {
            const formData = new FormData()
            Object.entries(storeEditForm).forEach(([key, val]) => formData.append(key, val))
            if (storeImageFile) formData.append('image', storeImageFile)

            const res = await fetch(`${API_URL}/api/affiliate/stores/${store.id}`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            })

            const data = await res.json()
            if (!res.ok || !data.success) {
                setStoreFormError(data.error || 'Gagal memperbarui toko.')
                return
            }

            const storeRes = await fetch(`${API_URL}/api/affiliate/stores/${slug}`)
            if (storeRes.ok) {
                const storeJson = await storeRes.json()
                setStore(storeJson.data || storeJson)
            }
        } catch (err) {
            setStoreFormError('Terjadi kesalahan saat memperbarui toko.')
        } finally {
            setIsSubmittingStore(false)
        }
    }

    const handleStockInputChange = (itemId: number, value: string) => {
        setStockInputs((prev) => ({ ...prev, [itemId]: value }))
    }

    const handleUpdateStock = async (itemId: number) => {
        if (!store) return
        const stockValue = stockInputs[itemId]
        if (stockValue === undefined || stockValue === '') {
            setStockInputErrors((prev) => ({ ...prev, [itemId]: 'Jumlah stok wajib diisi.' }))
            return
        }

        const quantity = Number(stockValue)
        if (Number.isNaN(quantity) || quantity < 0) {
            setStockInputErrors((prev) => ({ ...prev, [itemId]: 'Jumlah stok harus berupa angka nol atau lebih.' }))
            return
        }

        setStockUpdating(itemId)
        setStockInputErrors((prev) => ({ ...prev, [itemId]: '' }))

        try {
            const res = await fetch(`${API_URL}/api/affiliate/stores/${store.id}/items/${itemId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ stock_quantity: quantity })
            })

            const data = await res.json()
            if (!res.ok || !data.success) {
                setStockInputErrors((prev) => ({ ...prev, [itemId]: data.error || 'Gagal memperbarui stok.' }))
                return
            }

            const itemsRes = await fetch(`${API_URL}/api/affiliate/stores/${slug}/items`)
            if (itemsRes.ok) {
                const itemsJson = await itemsRes.json()
                const itemsData = itemsJson.data || itemsJson
                setItems(itemsData)
            }
        } catch (err) {
            setStockInputErrors((prev) => ({ ...prev, [itemId]: 'Terjadi kesalahan saat memperbarui stok.' }))
        } finally {
            setStockUpdating(null)
        }
    }

    const handleAddItem = async () => {
        if (!store) return
        setItemFormError(null)
        if (!itemForm.item_category_id || itemForm.item_category_id === 0 || !itemForm.name || !itemForm.price) {
            setItemFormError('Kategori, nama produk, dan harga harus diisi.')
            return
        }
        setIsSubmittingItem(true)
        try {
            const formData = new FormData()
            formData.append('item_category_id', String(itemForm.item_category_id))
            formData.append('name', itemForm.name)
            formData.append('description', itemForm.description)
            formData.append('price', String(itemForm.price))
            formData.append('unit', itemForm.unit)
            if (itemImageFile) formData.append('image', itemImageFile)

            const res = await fetch(`${API_URL}/api/affiliate/stores/${store.id}/items`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            })

            const data = await res.json()
            if (!res.ok || !data.success) {
                setItemFormError(data.error || 'Gagal menambahkan item.')
                return
            }

            setItemForm({ item_category_id: 0, name: '', description: '', price: '', unit: '/kg' })
            setItemImageFile(null)
            if (itemImageInputRef.current) itemImageInputRef.current.value = ''
            setItemImagePreview(null)

            const itemsRes = await fetch(`${API_URL}/api/affiliate/stores/${slug}/items`)
            if (itemsRes.ok) {
                const itemsJson = await itemsRes.json()
                setItems(itemsJson.data || itemsJson)
            }
        } catch (err) {
            setItemFormError('Terjadi kesalahan saat menambahkan item.')
        } finally {
            setIsSubmittingItem(false)
        }
    }

    const handleReviewSubmit = async () => {
        if (isOwner) {
            setReviewError('Anda tidak dapat memberi rating pada toko Anda sendiri.')
            return
        }
        if (!selectedRating) {
            setReviewError('Pilih rating terlebih dahulu.')
            return
        }
        setReviewError(null)
        setIsSubmittingReview(true)
        try {
            const res = await fetch(`${API_URL}/api/affiliate/stores/${slug}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ rating: selectedRating, review_text: reviewText })
            })

            const data = await res.json()
            if (!res.ok || !data.success) {
                setReviewError(data.error || 'Gagal mengirim review.')
                return
            }

            setReviewText('')
            setSelectedRating(0)

            const [storeRes, reviewsRes] = await Promise.all([
                fetch(`${API_URL}/api/affiliate/stores/${slug}`),
                fetch(`${API_URL}/api/affiliate/stores/${slug}/reviews`)
            ])

            if (storeRes.ok) setStore((await storeRes.json()).data)
            if (reviewsRes.ok) setReviews((await reviewsRes.json()).data)
        } catch (err) {
            setReviewError('Terjadi kesalahan saat mengirim review.')
        } finally {
            setIsSubmittingReview(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-16 flex items-center justify-center">
                <Loader2 className="animate-spin text-emerald-600" size={40} />
            </div>
        )
    }

    if (error || !store) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-4">
                        Toko tidak ditemukan
                    </h1>
                    <Link
                        to="/affiliate"
                        className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all shadow-md shadow-emerald-600/10"
                    >
                        <ArrowLeft size={18} className="mr-2" />
                        Kembali ke Affiliate
                    </Link>
                </div>
            </div>
        )
    }

    const whatsappLink = store.whatsapp
        ? `https://wa.me/${store.whatsapp}?text=Halo%20${encodeURIComponent(store.name)}%2C%20saya%20tertarik%20dengan%20produk%20Anda.`
        : '#'

    return (
        <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-16 transition-colors duration-300">
            {/* Ambient Background Gradients borrowed from Hero */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-[400px] h-[400px] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[100px]" />
                <div className="absolute top-1/3 -left-20 w-[300px] h-[300px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[90px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Back Button */}
                <Link
                    to="/affiliate"
                    className="inline-flex items-center text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 mb-6 font-medium transition-colors"
                >
                    <ArrowLeft size={18} className="mr-2" />
                    Kembali ke Affiliate
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Left Column - Store Detail & Management */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Store Main View Block */}
                        <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200/80 dark:border-slate-800/80 shadow-xl overflow-hidden p-6">
                            <div className="aspect-[21/9] rounded-2xl overflow-hidden mb-6 relative group">
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent z-10" />
                                <img
                                    src={getImageUrl(store.image)}
                                    alt={store.name}
                                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-102"
                                />
                            </div>

                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 rounded-full text-emerald-700 dark:text-emerald-400 text-xs font-semibold tracking-wide mb-3">
                                <MapPin size={12} />
                                <span>{store.city || store.province}</span>
                                <span className="text-slate-300 dark:text-slate-700">•</span>
                                <span>{store.store_type?.name}</span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
                                {store.name}
                            </h1>

                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                                {store.description}
                            </p>

                            <div className="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                                <div className="flex items-center text-amber-400">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            size={18}
                                            className={star <= Math.round(store.rating) ? "fill-current" : "text-slate-200 dark:text-slate-700"}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    {store.rating} <span className="text-slate-400 font-normal">({store.review_count} ulasan)</span>
                                </span>
                            </div>
                        </div>

                        {/* Owner Management Block: Edit Store */}
                        {isOwner && (
                            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200/80 dark:border-slate-800/80 shadow-xl p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Edit Toko Anda</h2>
                                        <p className="text-sm text-slate-500">Perbarui informasi toko dan kontak.</p>
                                    </div>
                                    <Send size={20} className="text-emerald-600" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Nama Toko</label>
                                        <input
                                            type="text"
                                            value={storeEditForm.name}
                                            onChange={(e) => handleStoreFormChange('name', e.target.value)}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Provinsi</label>
                                        <select
                                            value={storeEditForm.province}
                                            onChange={(e) => handleStoreFormChange('province', e.target.value)}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                                        >
                                            <option value="">Pilih Provinsi</option>
                                            {provinces.map((province) => (
                                                <option key={province.id} value={province.name}>{province.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Kota</label>
                                        <input
                                            type="text"
                                            value={storeEditForm.city}
                                            onChange={(e) => handleStoreFormChange('city', e.target.value)}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Alamat</label>
                                        <input
                                            type="text"
                                            value={storeEditForm.address}
                                            onChange={(e) => handleStoreFormChange('address', e.target.value)}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Gambar Toko</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleStoreImageChange(e.target.files?.[0] ?? null)}
                                        className="w-full text-sm text-slate-600 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 dark:file:bg-emerald-950/40 dark:file:text-emerald-400 hover:file:bg-emerald-100"
                                    />
                                    {storeImagePreview ? (
                                        <img src={storeImagePreview} alt="Preview" className="mt-3 h-40 w-full object-cover rounded-xl border border-slate-200 dark:border-slate-800" />
                                    ) : store.image ? (
                                        <img src={getImageUrl(store.image)} alt="Store" className="mt-3 h-40 w-full object-cover rounded-xl border border-slate-200 dark:border-slate-800" />
                                    ) : null}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">No. Telepon</label>
                                        <input
                                            type="text"
                                            value={storeEditForm.phone}
                                            onChange={(e) => handleStoreFormChange('phone', e.target.value)}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">WhatsApp</label>
                                        <input
                                            type="text"
                                            value={storeEditForm.whatsapp}
                                            onChange={(e) => handleStoreFormChange('whatsapp', e.target.value)}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={storeEditForm.email}
                                            onChange={(e) => handleStoreFormChange('email', e.target.value)}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Instagram</label>
                                        <input
                                            type="text"
                                            value={storeEditForm.instagram}
                                            onChange={(e) => handleStoreFormChange('instagram', e.target.value)}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">TikTok</label>
                                        <input
                                            type="text"
                                            value={storeEditForm.tiktok}
                                            onChange={(e) => handleStoreFormChange('tiktok', e.target.value)}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Deskripsi Toko</label>
                                    <textarea
                                        rows={3}
                                        value={storeEditForm.description}
                                        onChange={(e) => handleStoreFormChange('description', e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                                    />
                                </div>

                                {storeFormError && <p className="text-xs text-rose-500 mt-4">{storeFormError}</p>}

                                <button
                                    type="button"
                                    disabled={isSubmittingStore}
                                    onClick={handleUpdateStore}
                                    className="mt-6 w-full inline-flex items-center justify-center px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-600/10 hover:shadow-emerald-500/20 transition-all disabled:opacity-60"
                                >
                                    {isSubmittingStore ? 'Menyimpan...' : 'Simpan Perubahan Toko'}
                                </button>
                            </div>
                        )}

                        {/* Owner Management Block: Add Product */}
                        {isOwner && (
                            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200/80 dark:border-slate-800/80 shadow-xl p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Tambah Produk Baru</h2>
                                        <p className="text-sm text-slate-500">Kelola item di etalase toko Anda.</p>
                                    </div>
                                    <PlusCircle size={20} className="text-emerald-600" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Kategori</label>
                                        <select
                                            value={itemForm.item_category_id}
                                            onChange={(e) => handleItemFormChange('item_category_id', e.target.value)}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                                        >
                                            <option value={0}>Pilih kategori</option>
                                            {itemCategories.map((category) => (
                                                <option key={category._id} value={category._id}>{category.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Nama Produk</label>
                                        <input
                                            type="text"
                                            value={itemForm.name}
                                            onChange={(e) => handleItemFormChange('name', e.target.value)}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                                            placeholder="Contoh: Beras Premium"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Harga</label>
                                        <input
                                            type="number"
                                            value={itemForm.price}
                                            onChange={(e) => handleItemFormChange('price', e.target.value)}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                                            placeholder="Rp"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Satuan</label>
                                        <select
                                            value={itemForm.unit}
                                            onChange={(e) => handleItemFormChange('unit', e.target.value)}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                                        >
                                            <option value="/kg">/kg</option>
                                            <option value="/ikat">/ikat</option>
                                            <option value="/pcs">/pcs</option>
                                            <option value="/liter">/liter</option>
                                            <option value="/pack">/pack</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Gambar Produk</label>
                                        <input
                                            ref={itemImageInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleItemImageChange(e.target.files?.[0] ?? null)}
                                            className="w-full text-sm text-slate-600 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 dark:file:bg-emerald-950/40 dark:file:text-emerald-400 hover:file:bg-emerald-100"
                                        />
                                    </div>
                                </div>

                                {itemImagePreview && (
                                    <img src={itemImagePreview} alt="Preview Produk" className="mt-3 h-40 w-full object-cover rounded-xl border border-slate-200 dark:border-slate-800" />
                                )}

                                <div className="mt-4">
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Deskripsi Produk</label>
                                    <textarea
                                        rows={3}
                                        value={itemForm.description}
                                        onChange={(e) => handleItemFormChange('description', e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                                        placeholder="Tambahkan detail produk..."
                                    />
                                </div>

                                {itemFormError && <p className="text-xs text-rose-500 mt-4">{itemFormError}</p>}

                                <button
                                    type="button"
                                    disabled={isSubmittingItem}
                                    onClick={handleAddItem}
                                    className="mt-6 w-full inline-flex items-center justify-center px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-600/10 hover:shadow-emerald-500/20 transition-all disabled:opacity-60"
                                >
                                    {isSubmittingItem ? 'Menyimpan...' : 'Tambah Produk'}
                                </button>
                            </div>
                        )}

                        {/* Product Grid / Stock List */}
                        <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200/80 dark:border-slate-800/80 shadow-xl p-6">
                            <div className="flex items-center mb-6">
                                <Package size={22} className="text-emerald-600 mr-3" />
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                    Produk yang Tersedia ({items.length})
                                </h2>
                            </div>

                            {items.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4">
                                    {items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800/40 gap-4"
                                        >
                                            <div className="flex-1">
                                                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                                                    {item.item_category?.name}
                                                </p>
                                                <h4 className="font-bold text-slate-900 dark:text-white text-base mt-0.5">
                                                    {item.name}
                                                </h4>
                                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1">
                                                    Rp {item.price.toLocaleString("id-ID")}{item.unit}
                                                </p>
                                                <p className="text-xs text-slate-400 mt-1">
                                                    Sisa Stok: <span className="font-bold text-slate-600 dark:text-slate-300">{item.stock_quantity}</span>
                                                </p>

                                                {isOwner && (
                                                    <div className="mt-3 max-w-xs">
                                                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Atur Sisa Stok</label>
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="number"
                                                                min={0}
                                                                value={stockInputs[item.id] ?? String(item.stock_quantity ?? 0)}
                                                                onChange={(e) => handleStockInputChange(item.id, e.target.value)}
                                                                className="w-24 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm outline-none"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => handleUpdateStock(item.id)}
                                                                disabled={stockUpdating === item.id}
                                                                className="px-4 py-1.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-medium rounded-xl text-xs transition-all"
                                                            >
                                                                {stockUpdating === item.id ? '...' : 'Simpan'}
                                                            </button>
                                                        </div>
                                                        {stockInputErrors[item.id] && (
                                                            <p className="text-[11px] text-rose-500 mt-1">{stockInputErrors[item.id]}</p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
                                                        item.stock === "Tersedia"
                                                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                                                            : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                                                    }`}
                                                >
                                                    {item.stock}
                                                </span>
                                                <StatusIcon status={item.status} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-slate-400 dark:text-slate-500 text-center py-6 text-sm">
                                    Tidak ada produk tersedia di toko ini.
                                </p>
                            )}
                        </div>

                        {/* Write Reviews Section */}
                        <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200/80 dark:border-slate-800/80 shadow-xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Beri Rating</h2>
                                    <p className="text-sm text-slate-500">Bagikan ulasan & pengalaman belanja Anda.</p>
                                </div>
                                <Sparkles size={20} className="text-emerald-500" />
                            </div>

                            {isOwner ? (
                                <div className="rounded-xl bg-slate-50 dark:bg-slate-950 p-4 text-xs font-medium text-slate-500 text-center border border-slate-100 dark:border-slate-800">
                                    Anda tidak dapat memberi rating pada toko Anda sendiri.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-1.5">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                type="button"
                                                key={star}
                                                onClick={() => setSelectedRating(star)}
                                                className={`transition-colors ${star <= selectedRating ? 'text-amber-400' : 'text-slate-200 dark:text-slate-700 hover:text-amber-300'}`}
                                            >
                                                <Star size={24} className={star <= selectedRating ? "fill-current" : ""} />
                                            </button>
                                        ))}
                                    </div>

                                    <textarea
                                        rows={4}
                                        value={reviewText}
                                        onChange={(e) => setReviewText(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                        placeholder="Tulis ulasan Anda di sini..."
                                    />

                                    {reviewError && <p className="text-xs text-rose-500">{reviewError}</p>}

                                    <button
                                        type="button"
                                        disabled={isSubmittingReview}
                                        onClick={handleReviewSubmit}
                                        className="w-full inline-flex items-center justify-center px-5 py-3 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-60"
                                    >
                                        {isSubmittingReview ? 'Mengirim...' : 'Kirim Ulasan'}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Customer Reviews Output Container */}
                        <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200/80 dark:border-slate-800/80 shadow-xl p-6">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Ulasan Pengguna</h2>
                            {reviews.length > 0 ? (
                                <div className="space-y-4">
                                    {reviews.map((review) => (
                                        <div key={review.id} className="rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/40 p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-sm font-bold text-slate-800 dark:text-white">{review.username || review.email}</p>
                                                <div className="flex items-center gap-0.5 text-amber-400">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star
                                                            key={star}
                                                            size={14}
                                                            className={star <= review.rating ? 'fill-current' : 'text-slate-200 dark:text-slate-700'}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 leading-relaxed">
                                                {review.review_text || 'Tidak ada komentar tambahan.'}
                                            </p>
                                            <p className="text-[11px] font-medium text-slate-400">
                                                {new Date(review.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-slate-400 dark:text-slate-500 text-center py-6 text-sm">Belum ada ulasan untuk toko ini.</p>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Contact & Connect Info Dashboard Sidebar */}
                    <div className="lg:col-span-1 sticky top-24">
                        <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200/80 dark:border-slate-800/80 shadow-xl p-6 space-y-6">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                Informasi Kontak
                            </h3>

                            <div className="space-y-4">
                                {store.address && (
                                    <div className="flex items-start">
                                        <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-emerald-600 mr-3 flex-shrink-0 mt-0.5">
                                            <MapPin size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Alamat</p>
                                            <p className="text-sm font-medium text-slate-800 dark:text-white mt-0.5">{store.address}</p>
                                        </div>
                                    </div>
                                )}

                                {store.email && (
                                    <div className="flex items-start">
                                        <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-emerald-600 mr-3 flex-shrink-0 mt-0.5">
                                            <Mail size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Email</p>
                                            <p className="text-sm font-medium text-slate-800 dark:text-white mt-0.5">{store.email}</p>
                                        </div>
                                    </div>
                                )}

                                {store.phone && (
                                    <div className="flex items-start">
                                        <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-emerald-600 mr-3 flex-shrink-0 mt-0.5">
                                            <Phone size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Telepon</p>
                                            <p className="text-sm font-medium text-slate-800 dark:text-white mt-0.5">{store.phone}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {store.whatsapp && (
                                <div className="pt-2">
                                    <a
                                        href={whatsappLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full inline-flex items-center justify-center px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-600/10 hover:shadow-emerald-500/20 transition-all text-sm"
                                    >
                                        <WhatsAppIcon size={20} className="mr-2" />
                                        Hubungi via WhatsApp
                                    </a>
                                    <p className="text-center text-[11px] text-slate-400 mt-2.5">
                                        Klik untuk memulai chat obrolan langsung
                                    </p>
                                </div>
                            )}

                            {(store.instagram || store.facebook || store.tiktok) && (
                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60">
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">Sosial Media</p>
                                    <div className="flex flex-wrap gap-3">
                                        {store.instagram && (
                                            <a href={`https://instagram.com/${store.instagram}`} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold px-3 py-1.5 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 rounded-lg border border-slate-200/60 dark:border-slate-800 hover:text-emerald-500 transition-colors">
                                                Instagram
                                            </a>
                                        )}
                                        {store.facebook && (
                                            <a href={`https://facebook.com/${store.facebook}`} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold px-3 py-1.5 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 rounded-lg border border-slate-200/60 dark:border-slate-800 hover:text-emerald-500 transition-colors">
                                                Facebook
                                            </a>
                                        )}
                                        {store.tiktok && (
                                            <a href={`https://tiktok.com/@${store.tiktok}`} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold px-3 py-1.5 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 rounded-lg border border-slate-200/60 dark:border-slate-800 hover:text-emerald-500 transition-colors">
                                                TikTok
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}