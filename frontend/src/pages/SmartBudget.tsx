import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
    Search,
    ArrowLeft,
    Plus,
    Minus,
    ShoppingCart,
    Printer,
    Trash2,
    AlertTriangle,
    Package,
} from "lucide-react";
import { jsPDF } from "jspdf";

// Commodity interface
interface Commodity {
    id: number;
    name: string;
    price: number;
    unit: string;
    store: string;
    storeId: number;
    image: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001"

function getImageUrl(imagePath: string | null | undefined) {
    if (!imagePath) {
        return "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop"
    }

    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
        return imagePath
    }

    return `${API_URL}${imagePath}`
}

const allCommodities: Commodity[] = [
    {
        id: 1,
        name: "Beras Premium",
        price: 15000,
        unit: "/kg",
        store: "Toko Beras Maju Jaya",
        storeId: 1,
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop",
    },
    {
        id: 2,
        name: "Beras Medium",
        price: 13000,
        unit: "/kg",
        store: "Toko Beras Maju Jaya",
        storeId: 1,
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop",
    },
    {
        id: 3,
        name: "Cabai Rawit Merah",
        price: 55000,
        unit: "/kg",
        store: "Cabai Segar Indonesia",
        storeId: 2,
        image: "https://images.unsplash.com/photo-1598511757337-fe2cafc31ba0?w=400&h=300&fit=crop",
    },
    {
        id: 4,
        name: "Cabai Merah Besar",
        price: 45000,
        unit: "/kg",
        store: "Cabai Segar Indonesia",
        storeId: 2,
        image: "https://images.unsplash.com/photo-1598511757337-fe2cafc31ba0?w=400&h=300&fit=crop",
    },
    {
        id: 5,
        name: "Bawang Putih Impor",
        price: 28000,
        unit: "/kg",
        store: "Bawang Putih Murah",
        storeId: 3,
        image: "https://images.unsplash.com/photo-1553530979-7ee52a2670c4?w=400&h=300&fit=crop",
    },
    {
        id: 6,
        name: "Bawang Putih Lokal",
        price: 32000,
        unit: "/kg",
        store: "Bawang Putih Murah",
        storeId: 3,
        image: "https://images.unsplash.com/photo-1553530979-7ee52a2670c4?w=400&h=300&fit=crop",
    },
    {
        id: 7,
        name: "Ayam Broiler",
        price: 34000,
        unit: "/kg",
        store: "Daging Ayam Fresher",
        storeId: 4,
        image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400&h=300&fit=crop",
    },
    {
        id: 8,
        name: "Ayam Kampung",
        price: 52000,
        unit: "/kg",
        store: "Daging Ayam Fresher",
        storeId: 4,
        image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400&h=300&fit=crop",
    },
    {
        id: 9,
        name: "Telur Ayam Ras",
        price: 28000,
        unit: "/kg",
        store: "Telur Berkualitas",
        storeId: 5,
        image: "https://images.unsplash.com/photo-1569288050389-5a997d2eb139?w=400&h=300&fit=crop",
    },
    {
        id: 10,
        name: "Telur Ayam Kampung",
        price: 40000,
        unit: "/kg",
        store: "Telur Berkualitas",
        storeId: 5,
        image: "https://images.unsplash.com/photo-1569288050389-5a997d2eb139?w=400&h=300&fit=crop",
    },
    {
        id: 11,
        name: "Bayam",
        price: 8000,
        unit: "/ikat",
        store: "Sayuran Organik Kita",
        storeId: 6,
        image: "https://images.unsplash.com/photo-1540420773420-4f8b6c1ce2f2?w=400&h=300&fit=crop",
    },
    {
        id: 12,
        name: "Kangkung",
        price: 6000,
        unit: "/ikat",
        store: "Sayuran Organik Kita",
        storeId: 6,
        image: "https://images.unsplash.com/photo-1540420773420-4f8b6c1ce2f2?w=400&h=300&fit=crop",
    },
];

// Cart item with quantity
interface CartItem extends Commodity {
    quantity: number;
}

// PDF generation
function generatePDF(budget: number, items: CartItem[]) {
    const doc = new jsPDF();
    const totalSpend = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );
    const remaining = budget - totalSpend;

    // Title
    doc.setFontSize(20);
    doc.text("Smart Budgeting Report", 20, 20);

    // Budget info
    doc.setFontSize(12);
    doc.text(`Budget: Rp ${budget.toLocaleString("id-ID")}`, 20, 35);
    doc.text(`Total Spend: Rp ${totalSpend.toLocaleString("id-ID")}`, 20, 45);
    doc.text(`Remaining: Rp ${remaining.toLocaleString("id-ID")}`, 20, 55);

    // Items table
    let y = 70;
    doc.setFontSize(14);
    doc.text("Items:", 20, y);
    y += 10;

    doc.setFontSize(10);
    items.forEach((item, index) => {
        doc.text(`${index + 1}. ${item.name}`, 20, y);
        doc.text(`Store: ${item.store}`, 80, y);
        doc.text(`Qty: ${item.quantity}`, 130, y);
        doc.text(
            `Price: Rp ${(item.price * item.quantity).toLocaleString("id-ID")}`,
            160,
            y,
        );
        y += 8;
    });

    doc.save("smart-budget-report.pdf");
}

// Get progress bar color
function getProgressBarColor(percent: number): string {
    if (percent >= 90) return "bg-red-500";
    if (percent >= 70) return "bg-yellow-500";
    return "bg-green-500";
}

export default function SmartBudget() {
    const [searchParams] = useSearchParams();
    const budget = parseInt(searchParams.get("budget") || "0");
    const [searchQuery, setSearchQuery] = useState("");
    const [cart, setCart] = useState<CartItem[]>([]);
    const [commodities, setCommodities] = useState<Commodity[]>(allCommodities);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch(`${API_URL}/api/affiliate/items`)
                if (!response.ok) {
                    throw new Error("Failed to fetch items")
                }

                const data = await response.json()
                if (data?.success && Array.isArray(data.data)) {
                    setCommodities(
                        data.data.map((item: any) => ({
                            id: item.id,
                            name: item.name,
                            price: Number(item.price) || 0,
                            unit: item.unit || "",
                            store: item.store || "",
                            storeId: item.storeId || 0,
                            image: item.image || "",
                        })),
                    )
                }
            } catch (error) {
                console.error("Error fetching budget items:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchItems()
    }, [])

    // Filter commodities
    const filteredCommodities = useMemo(() => {
        if (!searchQuery) return commodities;
        return commodities.filter((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()),
        );
    }, [searchQuery, commodities]);

    // Total spend
    const totalSpend = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );
    const remaining = budget - totalSpend;
    const isOverBudget = totalSpend > budget;
    const percentUsed = (totalSpend / budget) * 100;

    // Progress color
    const progressColor = getProgressBarColor(percentUsed);

    // Add to cart
    const addToCart = (commodity: Commodity) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === commodity.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === commodity.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item,
                );
            }
            return [...prev, { ...commodity, quantity: 1 }];
        });
    };

    // Remove from cart
    const removeFromCart = (commodityId: number) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === commodityId);
            if (existing && existing.quantity > 1) {
                return prev.map((item) =>
                    item.id === commodityId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item,
                );
            }
            return prev.filter((item) => item.id !== commodityId);
        });
    };

    // Update quantity directly via input
    const updateQuantity = (commodityId: number, newQuantity: number) => {
        if (newQuantity <= 0) {
            setCart((prev) => prev.filter((item) => item.id !== commodityId));
        } else {
            setCart((prev) =>
                prev.map((item) =>
                    item.id === commodityId
                        ? { ...item, quantity: newQuantity }
                        : item,
                ),
            );
        }
    };

    // Get quantity in cart
    const getQuantity = (commodityId: number) => {
        const item = cart.find((item) => item.id === commodityId);
        return item?.quantity || 0;
    };

    // Remove all of one item
    const removeItem = (commodityId: number) => {
        setCart((prev) => prev.filter((item) => item.id !== commodityId));
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <Link
                    to="/smart-budgeting"
                    className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 mb-6 transition-colors"
                >
                    <ArrowLeft size={18} className="mr-2" />
                    Kembali
                </Link>

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Smart <span className="text-green-600">Budgeting</span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Budget: Rp {budget.toLocaleString("id-ID")}
                    </p>
                </div>

                {/* Progression Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Total Pengeluaran
                        </span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Rp {totalSpend.toLocaleString("id-ID")} / Rp{" "}
                            {budget.toLocaleString("id-ID")}
                        </span>
                    </div>
                    <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-300 ${progressColor}`}
                            style={{ width: `${Math.min(percentUsed, 100)}%` }}
                        />
                    </div>
                    {isOverBudget && (
                        <div className="flex items-center mt-2 text-red-500">
                            <AlertTriangle size={16} className="mr-2" />
                            <span className="text-sm font-medium">
                                Anggaran melebihi budget! (Rp{" "}
                                {Math.abs(remaining).toLocaleString("id-ID")}{" "}
                                lebih)
                            </span>
                        </div>
                    )}
                    {!isOverBudget && percentUsed >= 70 && (
                        <div className="flex items-center mt-2 text-yellow-600">
                            <AlertTriangle size={16} className="mr-2" />
                            <span className="text-sm font-medium">
                                Hati-hati! Anggaran hampir habis (
                                {Math.round(percentUsed)}% terpakai)
                            </span>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Commodities */}
                    <div className="lg:col-span-2">
                        {/* Search Filter */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 mb-6">
                            <div className="relative">
                                <Search
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    size={20}
                                />
                                <input
                                    type="text"
                                    placeholder="Cari komoditas..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Commodities Grid */}
                        {isLoading ? (
                            <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
                                Memuat komoditas dari database...
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {filteredCommodities.map((commodity) => {
                                    const quantity = getQuantity(commodity.id);

                                    return (
                                        <div
                                            key={commodity.id}
                                            className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
                                        >
                                            {/* Image */}
                                            <div className="aspect-video overflow-hidden">
                                                <img
                                                    src={getImageUrl(commodity.image)}
                                                    alt={commodity.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            {/* Content */}
                                            <div className="p-4">
                                                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                                                    {commodity.name}
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                    {commodity.store}
                                                </p>
                                                <p className="text-lg font-bold text-green-600 mb-4">
                                                    Rp{" "}
                                                    {commodity.price.toLocaleString(
                                                        "id-ID",
                                                    )}
                                                    {commodity.unit}
                                                </p>

                                                {/* Add to Cart Button / Quantity Controls */}
                                                {quantity === 0 ? (
                                                    <button
                                                        onClick={() =>
                                                            addToCart(commodity)
                                                        }
                                                        className="inline-flex items-center justify-center w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                                                    >
                                                        <Plus
                                                            size={18}
                                                            className="mr-2"
                                                        />
                                                        Tambah ke Keranjang
                                                    </button>
                                                ) : (
                                                    <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                                                        {/* Minus Button */}
                                                        <button
                                                            onClick={() =>
                                                                removeFromCart(
                                                                    commodity.id,
                                                                )
                                                            }
                                                            className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                                        >
                                                            <Minus size={18} />
                                                        </button>

                                                        {/* Number Input */}
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={quantity}
                                                            onChange={(e) => {
                                                                const value =
                                                                    parseInt(
                                                                        e.target
                                                                            .value,
                                                                    ) || 0;
                                                                updateQuantity(
                                                                    commodity.id,
                                                                    value,
                                                                );
                                                            }}
                                                            className="w-16 text-center bg-transparent text-gray-900 dark:text-white font-bold focus:outline-none"
                                                        />

                                                        {/* Plus Button */}
                                                        <button
                                                            onClick={() =>
                                                                addToCart(commodity)
                                                            }
                                                            className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                                                        >
                                                            <Plus size={18} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {filteredCommodities.length === 0 && (
                            <div className="text-center py-12">
                                <Package
                                    size={48}
                                    className="mx-auto text-gray-400 mb-4"
                                />
                                <p className="text-gray-500 dark:text-gray-400">
                                    Komoditas tidak ditemukan
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Cart */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 sticky top-24">
                            <div className="flex items-center mb-6">
                                <ShoppingCart
                                    size={24}
                                    className="text-green-600 mr-3"
                                />
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Keranjang
                                </h2>
                            </div>

                            {/* Cart Items */}
                            {cart.length === 0 ? (
                                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                                    Keranjang kosong
                                </p>
                            ) : (
                                <>
                                    <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                                        {cart.map((item) => (
                                            <div className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                                                        {item.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {item.store}
                                                    </p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        Rp{" "}
                                                        {(
                                                            item.price *
                                                            item.quantity
                                                        ).toLocaleString(
                                                            "id-ID",
                                                        )}
                                                    </p>
                                                    {/* Direct quantity input in cart */}
                                                    <div className="flex items-center mt-2">
                                                        <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">
                                                            Qty:
                                                        </span>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={
                                                                item.quantity
                                                            }
                                                            onChange={(e) => {
                                                                const value =
                                                                    parseInt(
                                                                        e.target
                                                                            .value,
                                                                    ) || 0;
                                                                updateQuantity(
                                                                    item.id,
                                                                    value,
                                                                );
                                                            }}
                                                            className="w-12 px-2 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-gray-900 dark:text-white text-center"
                                                        />
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        removeItem(item.id)
                                                    }
                                                    className="p-1 text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Total Spend */}
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-gray-600 dark:text-gray-400">
                                                Total Belanja
                                            </span>
                                            <span
                                                className={`text-xl font-bold ${isOverBudget ? "text-red-500" : "text-gray-900 dark:text-white"}`}
                                            >
                                                Rp{" "}
                                                {totalSpend.toLocaleString(
                                                    "id-ID",
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">
                                                Sisa Budget
                                            </span>
                                            <span
                                                className={`font-bold ${remaining < 0 ? "text-red-500" : "text-green-600"}`}
                                            >
                                                Rp{" "}
                                                {remaining.toLocaleString(
                                                    "id-ID",
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Over Budget Alert */}
                                    {isOverBudget && (
                                        <div className="flex items-center p-3 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-xl mb-4">
                                            <AlertTriangle
                                                size={20}
                                                className="mr-2"
                                            />
                                            <span className="text-sm font-medium">
                                                Melebihi budget!
                                            </span>
                                        </div>
                                    )}

                                    {/* Warning when near budget */}
                                    {!isOverBudget && percentUsed >= 70 && (
                                        <div className="flex items-center p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 rounded-xl mb-4">
                                            <AlertTriangle
                                                size={20}
                                                className="mr-2"
                                            />
                                            <span className="text-sm font-medium">
                                                Hampir mencapai budget!
                                            </span>
                                        </div>
                                    )}

                                    {/* Print PDF Button */}
                                    <button
                                        onClick={() =>
                                            generatePDF(budget, cart)
                                        }
                                        disabled={cart.length === 0}
                                        className="inline-flex items-center justify-center w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
                                    >
                                        <Printer size={20} className="mr-2" />
                                        Cetak PDF
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}