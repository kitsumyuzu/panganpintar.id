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
        name: "Nayra Zanetti",
        role: "Project Manager",
        image: "",
    },
    {
        name: "Firman Fadillah",
        role: "AI Engineer",
        image: "",
    },
    {
        name: "Fransisco",
        role: "Full-stack Developer",
        image: "",
    },
    {
        name: "Jocelyn",
        role: "Data Engineer",
        image: "",
    },
    {
        name: "Stefani Kelin",
        role: "Machine Learning Ops",
        image: "",
    },
    {
        name: "Augustian G.",
        role: "Machine Learning Engineer",
        image: "",
    },
    {
        name: "Luthfi Braja M.",
        role: "Machine Learning Engineer",
        image: "",
    },
    {
        name: "Amalia Dwi A.",
        role: "Front-end Developer",
        image: "",
    },
    {
        name: "Muhammad Rezansyah",
        role: "Back-end Developer",
        image: "",
    },
    {
        name: "Muhammad Reza Jauhari P.",
        role: "Back-end Developer",
        image: "",
    }
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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-28 pb-20 selection:bg-emerald-500/20 selection:text-emerald-600">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-20">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-5 tracking-tight">
                        Tentang{" "}
                        <span className="bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                            PanganPintar
                        </span>
                    </h1>
                    <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
                        Platform pintar untuk manajemen pangan dan anggaran bisnis Anda
                    </p>
                </div>

                {/* Mission & Vision */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
                    {values.map((value, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/60 dark:border-slate-800/60 text-center shadow-sm shadow-slate-100/40 dark:shadow-none hover:shadow-md transition-shadow duration-200"
                        >
                            <div className="w-14 h-14 mx-auto mb-5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl flex items-center justify-center border border-emerald-100/50 dark:border-emerald-900/30">
                                <value.icon
                                    size={24}
                                    className="text-emerald-600 dark:text-emerald-400"
                                />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                {value.title}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">
                                {value.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Journey Section */}
                <div className="mb-24">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
                            Perjalanan Kami
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 font-medium">
                            Dari ide sederhana menjadi platform pangan terbesar di Indonesia
                        </p>
                    </div>

                    {/* Timeline */}
                    <div className="relative">
                        {/* Vertical line */}
                        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800 md:-translate-x-1/2" />

                        <div className="space-y-10">
                            {journey.map((event, index) => (
                                <div
                                    key={index}
                                    className={`relative flex flex-col md:flex-row items-start ${
                                        index % 2 === 0
                                            ? "md:flex-row"
                                            : "md:flex-row-reverse"
                                    }`}
                                >
                                    {/* Icon Placement */}
                                    <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-12 h-12 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center text-xl z-10 shadow-sm">
                                        {event.icon}
                                    </div>

                                    {/* Content Card Wrapper */}
                                    <div
                                        className={`pl-16 md:pl-0 w-full md:w-1/2 ${
                                            index % 2 === 0
                                                ? "md:pr-12"
                                                : "md:pl-12"
                                        }`}
                                    >
                                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
                                            <div className="flex items-center text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                                                <Calendar
                                                    size={14}
                                                    className="mr-2"
                                                />
                                                <span>{event.year}</span>
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                                {event.title}
                                            </h3>
                                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">
                                                {event.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Contributors Section */}
                <div className="mb-24">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
                            Tim Kami
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 font-medium">
                            Orang-orang hebat di balik platform PanganPintar
                        </p>
                    </div>

                    {/* Contributors Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {contributors.map((contributor, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800/60 text-center group shadow-sm hover:shadow-md transition-all duration-200"
                            >
                                {/* Image container */}
                                <div className="aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
                                    <img
                                        src={contributor.image}
                                        alt={contributor.name}
                                        loading="lazy"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>

                                {/* Details */}
                                <div className="p-4">
                                    <h3 className="font-bold text-slate-900 dark:text-white text-base truncate">
                                        {contributor.name}
                                    </h3>
                                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1 uppercase tracking-wider">
                                        {contributor.role}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact CTA */}
                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-8 md:p-12 text-center shadow-lg shadow-emerald-900/10 relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4 tracking-tight">
                            Ingin Bergabung dengan Tim Kami?
                        </h2>
                        <p className="text-emerald-50/90 mb-8 text-sm md:text-base font-medium leading-relaxed">
                            Kami selalu mencari talenta baru untuk bersama-sama membangun masa depan ketahanan pangan di Indonesia.
                        </p>
                        <a
                            href="mailto:hello@panganpintar.id"
                            className="inline-flex items-center px-6 py-3.5 bg-white text-emerald-700 hover:bg-emerald-50 font-bold text-sm rounded-xl shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
                        >
                            <Mail size={18} className="mr-2" />
                            Hubungi Kami
                        </a>
                    </div>
                </div>

                {/* Location */}
                <div className="mt-16 text-center">
                    <div className="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/40 rounded-full text-slate-500 dark:text-slate-400 text-sm font-semibold tracking-wide">
                        <MapPin size={16} className="mr-2 text-emerald-500" />
                        <span>Batam, Indonesia</span>
                    </div>
                </div>
            </div>
        </div>
    );
}