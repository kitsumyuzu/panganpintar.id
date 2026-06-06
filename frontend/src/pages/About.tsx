import {
    MapPin,
    Calendar,
    Target,
    Heart,
    Lightbulb,
    Award,
    Mail,
} from "lucide-react";

// Timeline event interface
interface TimelineEvent {
    year: string;
    title: string;
    description: string;
    icon: string;
}

// Contributor interface
interface Contributor {
    name: string;
    role: string;
    image: string;
    social?: string;
}

// Journey timeline
const journey: TimelineEvent[] = [
    {
        year: "Januari 2024",
        title: "Ideation & Planning",
        description:
            "Tim panganpintar.id-v2 memulai riset pasar untuk memahami kebutuhan pelaku bisnis pangan di Indonesia. Setelah analisis mendalam, kami melihat peluang besar dalam digitalisasi manajemen pangan.",
        icon: "💡",
    },
    {
        year: "Maret 2024",
        title: "Team Formation",
        description:
            "Tim inti terbentuk dengan berkumpulnya para pengembang, desainer, dan ahli pangan. Kami memulai pembuatan prototype dan user flow.",
        icon: "👥",
    },
    {
        year: "Juni 2024",
        title: "MVP Development",
        description:
            "Pengembangan fitur inti dimulai: sistem harga komoditas, affiliate program, dan smart budgeting. Pembelajaran mesin mulai diintegrasikan untuk prediksi harga.",
        icon: "⚙️",
    },
    {
        year: "Agustus 2024",
        title: "Beta Testing",
        description:
            "Launch versi beta kepada 50 pengguna terpilih. Feedback positif mengalir dan banyak perbaikan dilakukan berdasarkan kebutuhan pengguna nyata.",
        icon: "🧪",
    },
    {
        year: "Oktober 2024",
        title: "Public Launch",
        description:
            "Launch resmi panganpintar.id-v2 kepada publik. Lebih dari 1000 pengguna terdaftar dalam minggu pertama.",
        icon: "🚀",
    },
    {
        year: "Desember 2024",
        title: "Expansion",
        description:
            "Fitur baru: prediksi harga berbasis AI, lebih banyak provinsi, dan program affiliate. Target 2025: menjangkau 10.000+ pengguna.",
        icon: "📈",
    },
];

// Contributors
const contributors: Contributor[] = [
    {
        name: "Ahmad Pratama",
        role: "Project Lead & Founder",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        social: "https://twitter.com",
    },
    {
        name: "Siti Nurhaliza",
        role: "Head of Product",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    },
    {
        name: "Budi Santoso",
        role: "Lead Developer",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    },
    {
        name: "Dewi Lestari",
        role: "UI/UX Designer",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d84?w=400&h=400&fit=crop",
    },
    {
        name: "Rudi Hermawan",
        role: "Backend Developer",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    },
    {
        name: "Maya Putri",
        role: "Data Analyst",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
    },
    {
        name: "Doni Kusuma",
        role: "Marketing Lead",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
    },
    {
        name: "Lisa Amalia",
        role: "Customer Success",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
    },
];

// Values section
const values = [
    {
        icon: Target,
        title: "Misi Kami",
        description:
            "Membantu pelaku bisnis pangan Indonesia untuk mengelola keuangan dan supply chain dengan lebih cerdas dan efisien.",
    },
    {
        icon: Heart,
        title: "Komitmen",
        description:
            "Kami berkomitmen memberikan informasi harga yang akurat dan transparan untuk membantu pengambilan keputusan.",
    },
    {
        icon: Lightbulb,
        title: "Inovasi",
        description:
            "Terus inovasi dengan teknologi terbaru untuk memberikan solusi terbaik bagi pengguna.",
    },
    {
        icon: Award,
        title: "Kualitas",
        description:
            "Mengutamakan kualitas data dan layanan untuk kepuasan pengguna.",
    },
];

export default function About() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Tentang{" "}
                        <span className="text-green-600">PanganPintar</span>
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Platform pintar untuk manajemen pangan dan anggaran
                        bisnis Anda
                    </p>
                </div>

                {/* Mission & Vision */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {values.map((value, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 text-center"
                        >
                            <div className="w-14 h-14 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                <value.icon
                                    size={28}
                                    className="text-green-600"
                                />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                {value.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                {value.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Journey Section */}
                <div className="mb-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Perjalanan Kami
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Dari ide sederhana menjadi platform pangan terbesar
                            di Indonesia
                        </p>
                    </div>

                    {/* Timeline */}
                    <div className="relative">
                        {/* Vertical line */}
                        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-green-200 dark:bg-green-900" />

                        {journey.map((event, index) => (
                            <div
                                key={index}
                                className={`relative flex items-center mb-8 ${
                                    index % 2 === 0
                                        ? "md:flex-row"
                                        : "md:flex-row-reverse"
                                }`}
                            >
                                {/* Icon */}
                                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-2xl z-10">
                                    {event.icon}
                                </div>

                                {/* Content */}
                                <div
                                    className={`ml-16 md:ml-0 md:w-1/2 ${
                                        index % 2 === 0
                                            ? "md:mr-12"
                                            : "md:ml-12"
                                    }`}
                                >
                                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center text-sm text-green-600 mb-2">
                                            <Calendar
                                                size={14}
                                                className="mr-2"
                                            />
                                            <span>{event.year}</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                            {event.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                                            {event.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contributors Section */}
                <div>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Tim Kami
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Orang-orang di balik PanganPintar
                        </p>
                    </div>

                    {/* Contributors Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {contributors.map((contributor, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 text-center group"
                            >
                                {/* Image */}
                                <div className="aspect-square overflow-hidden">
                                    <img
                                        src={contributor.image}
                                        alt={contributor.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>

                                {/* Info */}
                                <div className="p-4">
                                    <h3 className="font-bold text-gray-900 dark:text-white">
                                        {contributor.name}
                                    </h3>
                                    <p className="text-sm text-green-600">
                                        {contributor.role}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact CTA */}
                <div className="mt-16 bg-green-600 rounded-2xl p-8 text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">
                        Ingin Bergabung dengan Tim Kami?
                    </h2>
                    <p className="text-green-100 mb-6">
                        Kami selalu mencari talenta baru untuk membangun masa
                        depan pangan Indonesia
                    </p>
                    <a
                        href="mailto:hello@panganpintar.id"
                        className="inline-flex items-center px-6 py-3 bg-white text-green-600 hover:bg-green-50 font-semibold rounded-xl transition-colors"
                    >
                        <Mail size={20} className="mr-2" />
                        Hubungi Kami
                    </a>
                </div>

                {/* Location */}
                <div className="mt-12 text-center">
                    <div className="flex items-center justify-center text-gray-500 dark:text-gray-400">
                        <MapPin size={18} className="mr-2" />
                        <span>Jakarta, Indonesia</span>
                    </div>
                </div>
            </div>
        </div>
    );
}