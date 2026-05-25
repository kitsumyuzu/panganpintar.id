import { useState } from 'react'
import style from '@/styles/landing/affiliate.module.css'
import { Link } from 'react-router-dom'

const stores = [
    {
        id: 1,
        title: 'Fresh Mart',
        description: 'Fresh groceries and daily essentials at the best prices.',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e',
        badge: 'Best Price',
        category: 'Grocery'
    },
    {
        id: 2,
        title: 'Green Farm Store',
        description: 'Organic vegetables and local farm products.',
        image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc',
        badge: 'Discount',
        category: 'Organic'
    },
    {
        id: 3,
        title: 'Seafood Hub',
        description: 'Fresh seafood directly from local fishermen.',
        image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e',
        badge: 'Best Price',
        category: 'Seafood'
    },
    {
        id: 1,
        title: 'Fresh Mart',
        description: 'Fresh groceries and daily essentials at the best prices.',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e',
        badge: 'Best Price',
        category: 'Grocery'
    },
    {
        id: 2,
        title: 'Green Farm Store',
        description: 'Organic vegetables and local farm products.',
        image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc',
        badge: 'Discount',
        category: 'Organic'
    },
    {
        id: 3,
        title: 'Seafood Hub',
        description: 'Fresh seafood directly from local fishermen.',
        image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e',
        badge: 'Best Price',
        category: 'Seafood'
    }
]

const categories = ['All', 'Grocery', 'Organic', 'Seafood']

const AffiliatePage = () => {
    const [activeCategory, setActiveCategory] = useState('All')

    const filteredStores =
        activeCategory === 'All'
            ? stores
            : stores.filter((store) => store.category === activeCategory)

    return (
        <section className={style.affiliate}>
            <div className={style.container}>

                {/* HEADER */}
                <div className={style.header}>
                    <h1>Affiliate MSME Marketplace</h1>
                    <p>Support local businesses and explore MSME stores near you.</p>
                </div>

                {/* FILTER BUTTONS */}
                <div className={style.filterBar}>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            className={`${style.filterBtn} ${
                                activeCategory === cat ? style.active : ''
                            }`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* GRID */}
                <div className={style.grid}>
                    {filteredStores.map((store) => (
                        <div key={store.id} className={style.card}>

                            <div className={style.card_header}>
                                <img src={store.image} alt={store.title} />

                                <span className={style.badge}>
                                    {store.badge}
                                </span>
                            </div>

                            <div className={style.card_body}>
                                <h3>{store.title}</h3>
                                <p>{store.description}</p>

                                <Link to={`/affiliate/${store.id}`}>
                                    <button className={style.button}>
                                        Visit Store
                                    </button>
                                </Link>
                            </div>

                        </div>
                    ))}
                </div>

            </div>
        </section>
    )
}

export default AffiliatePage