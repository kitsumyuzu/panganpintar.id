import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Store, MapPin, Phone, ArrowLeft, Loader2, CheckCircle, Image, Globe, X } from 'lucide-react'

interface StoreFormData {
    name: string
    description: string
    store_type_id: number
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

interface ImagePreview {
    image: string | null
}

interface ImageFiles {
    image: File | null
}

const AI_API = 'https://firmanfadilah-pangan-pintar-api.hf.space/api/v1'

const storeTypes = [
    { id: 1, name: 'Minimart', slug: 'minimart', icon: '🏪' },
    { id: 2, name: 'Grocer', slug: 'grocer', icon: '🛒' },
    { id: 3, name: 'Food Seller', slug: 'food-seller', icon: '🍔' },
    { id: 4, name: 'Petani', slug: 'petani', icon: '👨‍🌾' },
    { id: 5, name: 'Supplier', slug: 'supplier', icon: '📦' },
    { id: 6, name: 'Distributor', slug: 'distributor', icon: '🚚' },
    { id: 7, name: 'Online Shop', slug: 'online-shop', icon: '🛍️' }
]

const WhatsAppIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.41a9.86 9.86 0 001-1.353c0-2.174.806-4.206 2.063-5.731 1.326-1.598 3.076-2.635 4.986-2.635 1.647 0 3.163.646 4.306 1.812 1.143 1.166 1.897 2.838 1.897 4.647 0 2.272-.784 4.253-2.063 5.574-1.21 1.252-2.703 2.015-4.414 2.015m-5.399-5.349c-1.066 0-2.108-.321-3.016-.928-1.271-.847-1.987-2.042-1.987-3.397 0-2.075 1.683-3.759 3.76-3.759 1.914 0 3.534 1.214 3.758 3.759.034.383.034.783 0 1.167-.034.384-.1.617-.167.771-.267.615-.771 1.095-1.439 1.095m-.501-1.674c.267 0 .512-.065.768-.196.256-.13.468-.323.639-.579.171-.255.307-.578.429-.965.122-.388.184-.786.184-1.193 0-.858-.696-1.562-1.553-1.562-.858 0-1.553.704-1.553 1.562 0 .193.067.385.199.577.132.191.322.377.571.556.249.179.566.362.937.454.372.092.756.14 1.141.14" />
    </svg>
)

const InstagramIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.069-4.85.069-3.204 0-3.584-.012-4.849-.069-3.226-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.012-3.584.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.668.014-4.947.072-4.346.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.947.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.947.072 3.259 0 3.668-.014 4.947-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.947 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.758-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
)

const FacebookIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-2.888c-2.888 0-3.83 1.054-3.83 3.583v2.417h-1.261v-4h1.261v8.727h-4.104v-8.727h-2.385v-4h2.385v-5.333c0-1.622 1.089-2.667 2.774-2.667h2.224v4h-2.224c-.621 0-.728.083-.728.417v3.216h3.333l-.667 4z" />
    </svg>
)

export default function JoinAffiliate() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [isFetching, setIsFetching] = useState(true)
    const [provinces, setProvinces] = useState<string[]>([])
    const [imagePreviews, setImagePreviews] = useState<ImagePreview>({
        image: null
    })
    const [imageFiles, setImageFiles] = useState<ImageFiles>({
        image: null
    })
    const [formData, setFormData] = useState<StoreFormData>({
        name: '',
        description: '',
        store_type_id: 0,
        province: '',
        city: '',
        address: '',
        phone: '',
        whatsapp: '',
        email: '',
        instagram: '',
        facebook: '',
        tiktok: ''
    })

    const imageInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const user = localStorage.getItem('user')
        if (!user) {
            navigate('/login')
            return
        }

        fetchProvinces()
    }, [navigate])

    const fetchProvinces = async () => {
        setIsFetching(true)
        try {
            const res = await fetch(`${AI_API}/provinces`)
            const data = await res.json()
            
            if (data.provinces && Array.isArray(data.provinces)) {
                setProvinces(data.provinces)
            } else {
                setProvinces(['DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'Bali'])
            }
        } catch (err) {
            console.error('Failed to fetch from AI:', err)
            setProvinces(['DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'Bali'])
        } finally {
            setIsFetching(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: name === 'store_type_id' ? Number(value) : value
        }))
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const objectUrl = URL.createObjectURL(file)
            setImagePreviews({ image: objectUrl })
            setImageFiles({ image: file })
        }
    }

    const removeImage = () => {
        setImagePreviews({ image: null })
        setImageFiles({ image: null })
        if (imageInputRef.current) {
            imageInputRef.current.value = ''
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!formData.name || !formData.store_type_id || !formData.province) {
            alert('Mohon lengkapi form terlebih dahulu')
            return
        }

        setIsLoading(true)

        try {
            const token = localStorage.getItem('token')
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

            const payload = new FormData()
            payload.append('name', formData.name)
            payload.append('description', formData.description)
            payload.append('store_type_id', String(formData.store_type_id))
            payload.append('province', formData.province)
            payload.append('city', formData.city)
            payload.append('address', formData.address)
            payload.append('phone', formData.phone)
            payload.append('whatsapp', formData.whatsapp)
            payload.append('email', formData.email)
            payload.append('instagram', formData.instagram)
            payload.append('facebook', formData.facebook)
            payload.append('tiktok', formData.tiktok)
            payload.append('is_verified', 'true')

            if (imageFiles.image) {
                payload.append('image', imageFiles.image)
            }

            const res = await fetch(`${API_URL}/api/affiliate/stores`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: payload
            })

            const data = await res.json()

            if (data.success) {
                setIsSuccess(true)
                setTimeout(() => {
                    navigate('/affiliate')
                }, 2000)
            } else {
                alert(data.error || 'Gagal membuat store')
            }
        } catch (err) {
            console.error('Error:', err)
            alert('Terjadi kesalahan')
        } finally {
            setIsLoading(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-16 flex items-center justify-center">
                <div className="text-center">
                    <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Selamat! Anda sekarang adalah Affiliate
                    </h1>
                </div>
            </div>
        )
    }

    if (isFetching) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-16 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 size={48} className="animate-spin text-green-500 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Memuat data dari AI...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link to="/profile" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-green-600 mb-4">
                    <ArrowLeft size={18} className="mr-2" />
                    Kembali ke Profile
                </Link>

                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Bergabung dengan Affiliate</h1>

                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nama Toko *</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white" placeholder="Contoh: Toko Beras Maju Jaya" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipe Toko *</label>
                            <select name="store_type_id" value={formData.store_type_id} onChange={handleChange} required
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white">
                                <option value="">Pilih tipe toko</option>
                                {storeTypes.map(type => (
                                    <option key={type.id} value={type.id}>{type.icon} {type.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Province *</label>
                            <select name="province" value={formData.province} onChange={handleChange} required
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white">
                                <option value="">Pilih Province</option>
                                {provinces.map(prov => (
                                    <option key={prov} value={prov}>{prov}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Kota</label>
                            <input type="text" name="city" value={formData.city} onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white" placeholder="Contoh: Jakarta Selatan" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Alamat</label>
                            <div className="relative">
                                <MapPin size={18} className="absolute left-4 top-4 text-gray-400" />
                                <textarea name="address" value={formData.address} onChange={handleChange} rows={2}
                                className="w-full pl-12 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white" placeholder="Jl. Contoh No. 123" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">No. Telepon</label>
                                <div className="relative">
                                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input type="text" name="phone" value={formData.phone} onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white" placeholder="+6281234567890" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">WhatsApp *</label>
                                <div className="relative">
                                    <WhatsAppIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500" />
                                    <input type="text" name="whatsapp" value={formData.whatsapp} onChange={handleChange} required
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white" placeholder="6281234567890" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white" placeholder="toko@email.com" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Instagram</label>
                                <div className="relative">
                                    <InstagramIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500" />
                                    <input type="text" name="instagram" value={formData.instagram} onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white" placeholder="username" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Facebook</label>
                                <div className="relative">
                                    <FacebookIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" />
                                    <input type="text" name="facebook" value={formData.facebook} onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white" placeholder="page username" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">TikTok</label>
                                <div className="relative">
                                    <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input type="text" name="tiktok" value={formData.tiktok} onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white" placeholder="@username" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gambar Toko</label>
                                <input
                                    ref={imageInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="image-input"
                                />
                                {imagePreviews.image ? (
                                    <div className="relative inline-block">
                                        <img src={imagePreviews.image} alt="Preview" className="w-32 h-32 object-cover rounded-xl border border-gray-200 dark:border-gray-700" />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <label
                                        htmlFor="image-input"
                                        className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-green-500 transition-colors"
                                    >
                                        <div className="text-center">
                                            <Image size={24} className="mx-auto text-gray-400" />
                                            <span className="text-xs text-gray-500">Pilih</span>
                                        </div>
                                    </label>
                                )}
                            </div>
                        </div>

                        <button type="submit" disabled={isLoading}
                            className="w-full flex items-center justify-center px-6 py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-xl">
                            {isLoading ? (
                                <><Loader2 size={20} className="animate-spin mr-2" />Membuat Store...</>
                            ) : (
                                <><Store size={20} className="mr-2" />Buat Store Affiliate</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}