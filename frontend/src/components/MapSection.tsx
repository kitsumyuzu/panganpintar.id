import { useEffect, useState } from 'react'
import { MapContainer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import type { FeatureCollection, Geometry } from 'geojson'
import {
    Info,
    Calendar,
    MapPin
} from 'lucide-react'

// Fix Leaflet icon URLs
const iconPrototype = L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: string };
delete iconPrototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// DATA LOKAL HARGA HARI INI
const SAMPLE_CURRENT_PRICES = [
    { name: 'Beras', price: 12500, unit: '/kg' },
    { name: 'Cabai Rawit', price: 48000, unit: '/kg' },
    { name: 'Cabai Merah', price: 42000, unit: '/kg' },
    { name: 'Bawang Putih', price: 30000, unit: '/kg' },
    { name: 'Bawang Merah', price: 32800, unit: '/kg' },
    { name: 'Daging Ayam', price: 32000, unit: '/kg' },
    { name: 'Telur Ayam', price: 28500, unit: '/kg' },
    { name: 'Minyak Goreng', price: 14800, unit: '/liter' },
    { name: 'Gula Pasir', price: 16500, unit: '/kg' },
    { name: 'Daging Sapi', price: 200000, unit: '/kg' },
]

interface User {
    id: number
    email: string
    username?: string
    province?: string
}

interface ProvinceProperties {
    PROVINSI?: string
    NAME_1?: string
    name?: string
}

const DEFAULT_PROVINCE = 'Bali'

function IndonesiaGeoLayer({
    geoData,
    onProvinceClick,
}: {
    geoData: FeatureCollection<Geometry, ProvinceProperties>
    onProvinceClick: (province: string) => void
}) {
    const map = useMap()

    useEffect(() => {
        if (!geoData || !map) return

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
                const props = feature?.properties;
                const provinceName = props?.PROVINSI || props?.NAME_1 || props?.name || 'Unknown'

                layer.on({
                    click: () => {
                        if (provinceName) onProvinceClick(provinceName)
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

        const timer = setTimeout(() => {
            map.dragging.disable()
            map.scrollWheelZoom.disable()
            map.doubleClickZoom.disable()
            map.touchZoom.disable()
            map.boxZoom.disable()
            map.keyboard.disable()
            map.setMaxBounds(bounds.pad(0.02))
        }, 500)

        return () => {
            clearTimeout(timer)
            layer.remove()
        }
    }, [geoData, map, onProvinceClick])

    return null
}

export default function MapSection() {
    const [selectedProvince, setSelectedProvince] = useState<string>(DEFAULT_PROVINCE)
    const [geoData, setGeoData] = useState<FeatureCollection<Geometry, ProvinceProperties> | null>(null)
    const todayString = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

    useEffect(() => {
        fetch('https://raw.githubusercontent.com/ardian28/GeoJson-Indonesia-38-Provinsi/refs/heads/main/Provinsi/38%20Provinsi%20Indonesia%20-%20Provinsi.json')
            .then((res) => res.json())
            .then((data) => setGeoData(data as FeatureCollection<Geometry, ProvinceProperties>))
            .catch((err) => console.error('GeoJSON load failed:', err))
    }, [])

    useEffect(() => {
        const checkUserAndProvince = async () => {
            const token = localStorage.getItem('token')
            if (token) {
                try {
                    const res = await fetch('http://localhost:3001/api/auth/me', {
                        headers: { 'Authorization': `Bearer ${token}` },
                    })
                    if (res.ok) {
                        const data = await res.json() as { success: boolean; data: User }
                        if (data.success && data.data?.province) {
                            setSelectedProvince(data.data.province)
                        }
                    }
                } catch (error) {
                    console.error('Error fetching user province:', error)
                }
            }
        }
        void checkUserAndProvince()
    }, [])

    const handleProvinceClick = (province: string) => {
        setSelectedProvince(province)
    }

    return (
        <section className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
                        Pemetaan Harga Pangan Berdasarkan Wilayah
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                        Klik area peta provinsi di bawah untuk memantau perkembangan harga komoditas pokok terbaru di wilayah terkait.
                    </p>
                </div>

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

                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div className="flex items-center">
                            <Info size={22} className="text-emerald-500 mr-2.5" />
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                Wilayah Informasi: <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{selectedProvince}</span>
                            </h3>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg self-start sm:self-auto">
                            <Calendar size={14} />
                            <span>Pembaruan: {todayString}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {SAMPLE_CURRENT_PRICES.map((commodity, index) => (
                            <div
                                key={index}
                                className="bg-slate-50/60 dark:bg-slate-950/40 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-xl p-4 border border-slate-200/70 dark:border-slate-800/80 flex flex-col justify-between transition-colors shadow-sm"
                            >
                                <div className="flex flex-col gap-3">
                                    <div className="flex justify-between items-start">
                                        <p className="font-bold text-slate-950 dark:text-white text-sm tracking-wide">
                                            {commodity.name}
                                        </p>
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
                                            Stabil
                                        </span>
                                    </div>

                                    <div className="border-t border-slate-100 dark:border-slate-800/60 pt-2.5">
                                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Harga Rata-Rata</p>
                                        <p className="text-lg font-extrabold text-slate-900 dark:text-white">
                                            Rp {commodity.price.toLocaleString('id-ID')}
                                            <span className="text-xs font-normal text-slate-400 ml-0.5">{commodity.unit}</span>
                                        </p>
                                    </div>

                                    <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                                        <MapPin size={12} className="text-slate-400" />
                                        <span>Lokasi Pasar Utama Wilayah</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}