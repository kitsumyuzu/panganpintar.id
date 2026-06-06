import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wallet, ArrowRight, PiggyBank, TrendingUp, Zap } from "lucide-react";

// Budget presets
const budgetPresets = [
    {
        id: 1,
        name: "Dana Seeds",
        amount: 500000,
        icon: PiggyBank,
        description: "Cocok untuk pemula",
    },
    {
        id: 2,
        name: "Dana Growing",
        amount: 1000000,
        icon: TrendingUp,
        description: "Untuk bisnis berkembang",
    },
    {
        id: 3,
        name: "Dana Enterprise",
        amount: 5000000,
        icon: Zap,
        description: "Untuk bisnis besar",
    },
];

export default function BudgetInput() {
    const navigate = useNavigate();
    const [customBudget, setCustomBudget] = useState("");
    const [selectedPreset, setSelectedPreset] = useState<number | null>(null);

    const handleContinue = () => {
        let budget = 0;

        if (customBudget) {
            budget = parseInt(customBudget.replace(/[^0-9]/g, ""));
        } else if (selectedPreset) {
            const preset = budgetPresets.find((p) => p.id === selectedPreset);
            budget = preset?.amount || 0;
        }

        if (budget > 0) {
            // Navigate to /smart-budget (not /smart-budgeting)
            navigate(`/smart-budget?budget=${budget}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Smart <span className="text-green-600">Budgeting</span>
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Atur anggaran pangan Anda dengan lebih cerdas
                    </p>
                </div>

                {/* Budget Input Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                        Masukkan Anggaran Anda
                    </h2>

                    {/* Custom Budget Input */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Anggaran Custom
                        </label>
                        <div className="relative">
                            <Wallet
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                size={20}
                            />
                            <input
                                type="text"
                                placeholder="Rp 0"
                                value={customBudget}
                                onChange={(e) => {
                                    const value = e.target.value.replace(
                                        /[^0-9]/g,
                                        "",
                                    );
                                    setCustomBudget(
                                        value
                                            ? parseInt(value).toLocaleString(
                                                  "id-ID",
                                              )
                                            : "",
                                    );
                                    setSelectedPreset(null);
                                }}
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-xl"
                            />
                        </div>
                    </div>

                    {/* OR Divider */}
                    <div className="flex items-center mb-8">
                        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                        <span className="px-4 text-gray-500 dark:text-gray-400">
                            atau pilih
                        </span>
                        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                    </div>

                    {/* Budget Presets */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {budgetPresets.map((preset) => (
                            <button
                                key={preset.id}
                                onClick={() => {
                                    setSelectedPreset(preset.id);
                                    setCustomBudget("");
                                }}
                                className={`p-6 rounded-xl border-2 transition-all text-left ${
                                    selectedPreset === preset.id
                                        ? "border-green-600 bg-green-50 dark:bg-green-900/20"
                                        : "border-gray-200 dark:border-gray-700 hover:border-green-400"
                                }`}
                            >
                                <preset.icon
                                    size={32}
                                    className={`mb-4 ${
                                        selectedPreset === preset.id
                                            ? "text-green-600"
                                            : "text-gray-400"
                                    }`}
                                />
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                    {preset.name}
                                </h3>
                                <p className="text-2xl font-bold text-green-600 mb-2">
                                    Rp {preset.amount.toLocaleString("id-ID")}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {preset.description}
                                </p>
                            </button>
                        ))}
                    </div>

                    {/* Continue Button */}
                    <button
                        onClick={handleContinue}
                        disabled={!customBudget && !selectedPreset}
                        className="inline-flex items-center justify-center w-full px-8 py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
                    >
                        Lanjutkan
                        <ArrowRight size={20} className="ml-2" />
                    </button>
                </div>
            </div>
        </div>
    );
}