import { useLocation } from 'react-router-dom'
import { useMemo, useState } from 'react'
import style from '@/styles/landing/smartbudgeting.module.css'

const categories = ['All', 'Food', 'Drink', 'Daily']

const items = [
    { id: 1, name: 'Rice 5kg', price: 65000, stock: 20, store: 'Fresh Mart', category: 'Food' },
    { id: 2, name: 'Milk', price: 12000, stock: 50, store: 'Fresh Mart', category: 'Drink' },
    { id: 3, name: 'Eggs', price: 28000, stock: 30, store: 'Local Farm', category: 'Food' },
    { id: 4, name: 'Soap', price: 8000, stock: 100, store: 'Daily Shop', category: 'Daily' }
]

const SmartBudgetSession = () => {
    const { state } = useLocation()
    const budget = state?.budget || 100000

    const [cart, setCart] = useState<{ id: number; qty: number }[]>([])
    const [activeCat, setActiveCat] = useState('All')

    const addItem = (id: number) => {
        setCart((prev) => {
            const found = prev.find((i) => i.id === id)
            if (found) {
                return prev.map((i) =>
                    i.id === id ? { ...i, qty: i.qty + 1 } : i
                )
            }
            return [...prev, { id, qty: 1 }]
        })
    }

    const decreaseItem = (id: number) => {
        setCart((prev) =>
            prev
                .map((i) =>
                    i.id === id ? { ...i, qty: i.qty - 1 } : i
                )
                .filter((i) => i.qty > 0)
        )
    }

    const totalSpent = useMemo(() => {
        return cart.reduce((sum, c) => {
            const item = items.find((i) => i.id === c.id)
            return sum + (item ? item.price * c.qty : 0)
        }, 0)
    }, [cart])

    const progress = (totalSpent / budget) * 100

    const progressColor =
        progress < 50 ? 'green' :
        progress < 90 ? 'orange' : 'red'

    const filteredItems =
        activeCat === 'All'
            ? items
            : items.filter((i) => i.category === activeCat)

    const remaining = budget - totalSpent

    return (
        <section className={style.session}>

            <div className={style.container}>

                {/* ================= BUDGET HEADER ================= */}
                <div className={style.budgetHeader}>

                    <h2>Budget Tracker</h2>

                    <div className={style.progressBox}>
                        <div className={style.progressInfo}>
                            <span>Budget: Rp {budget.toLocaleString()}</span>
                            <span>
                                Rp {totalSpent.toLocaleString()} / Rp {budget.toLocaleString()}
                            </span>
                        </div>

                        <div className={style.progressBar}>
                            <div
                                className={style.progressFill}
                                style={{
                                    width: `${Math.min(progress, 100)}%`,
                                    background: progressColor
                                }}
                            />
                        </div>

                        {progress >= 90 && (
                            <p className={style.warning}>
                                ⚠ You are near or over your budget!
                            </p>
                        )}
                    </div>
                </div>

                {/* ================= MAIN SECTION ================= */}
                <div className={style.mainGrid}>

                    {/* LEFT: ITEMS */}
                    <div className={style.itemsSection}>

                        <div className={style.filterBar}>
                            {categories.map((c) => (
                                <button
                                    key={c}
                                    className={`${style.filterBtn} ${
                                        activeCat === c ? style.active : ''
                                    }`}
                                    onClick={() => setActiveCat(c)}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>

                        <div className={style.itemGrid}>
                            {filteredItems.map((item) => {
                                const cartItem = cart.find((c) => c.id === item.id)

                                return (
                                    <div key={item.id} className={style.itemCard}>

                                        <h3>{item.name}</h3>
                                        <p>Rp {item.price.toLocaleString()}</p>
                                        <span>{item.store}</span>

                                        <div className={style.stock}>
                                            Stock: {item.stock}
                                        </div>

                                        <div className={style.actions}>
                                            <button onClick={() => decreaseItem(item.id)}>-</button>
                                            <span>{cartItem?.qty || 0}</span>
                                            <button onClick={() => addItem(item.id)}>+</button>
                                        </div>

                                    </div>
                                )
                            })}
                        </div>

                    </div>

                    {/* RIGHT: CART */}
                    <div className={style.cartSection}>

                        <h3>Cart</h3>

                        <div className={style.cartList}>
                            {cart.map((c) => {
                                const item = items.find((i) => i.id === c.id)
                                if (!item) return null

                                return (
                                    <div key={c.id} className={style.cartItem}>
                                        <span>{item.name}</span>
                                        <span>x{c.qty}</span>
                                    </div>
                                )
                            })}
                        </div>

                        <div className={style.summary}>
                            <p>Spent: Rp {totalSpent.toLocaleString()}</p>
                            <p>Remaining: Rp {remaining.toLocaleString()}</p>
                        </div>

                        <button className={style.printBtn}>
                            Print Budget
                        </button>

                    </div>

                </div>

            </div>

        </section>
    )
}

export default SmartBudgetSession