import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import style from '@/styles/landing/smartbudgeting.module.css'

const presets = [50000, 100000, 200000, 500000]

const SmartBudgetPage = () => {
    const navigate = useNavigate()
    const [budget, setBudget] = useState<number>(50000)

    const handleStart = () => {
        navigate('/smart-budget/session', {
            state: { budget }
        })
    }

    return (
        <section className={style.welcome}>

            <div className={style.container}>

                <h1>Smart Budgeting</h1>

                <p>
                    Plan your spending intelligently. Track your grocery expenses,
                    monitor your budget in real-time, and avoid overspending.
                </p>

                {/* BUDGET INPUT */}
                <div className={style.budgetBox}>
                    <h3>Select Your Budget</h3>

                    <input
                        type="number"
                        value={budget}
                        onChange={(e) => setBudget(Number(e.target.value))}
                        className={style.input}
                    />

                    <div className={style.presets}>
                        {presets.map((p) => (
                            <button
                                key={p}
                                onClick={() => setBudget(p)}
                                className={style.presetBtn}
                            >
                                Rp {p.toLocaleString()}
                            </button>
                        ))}
                    </div>

                    <button className={style.startBtn} onClick={handleStart}>
                        Start Budgeting
                    </button>
                </div>

            </div>

        </section>
    )
}

export default SmartBudgetPage