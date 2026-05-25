import style from '@/styles/landing/landing.module.css'
import logo from '@/assets/market.jpg'

import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type React from 'react'

const LandingPage = () => {
    const scrollToPrediction = (e: React.MouseEvent) => {
        e.preventDefault()

        document.getElementById('section__prediction')?.scrollIntoView({
            behavior: 'smooth'
        })
    }

    const scrollToMap = (e: React.MouseEvent) => {
        e.preventDefault()

        document.getElementById('section__map')?.scrollIntoView({
            behavior: 'smooth'
        })
    }

    return (
        <>
            {/* ================= HERO ================= */}
            <section className={style.section__hero}>
                <div className={style.hero__content}>
                    <div className={style.hero__text}>
                        <h1>
                            Smarter Decisions with <span>Real-Time Insights</span>
                        </h1>

                        <p>
                            Track trends, analyze predictions, and make better financial decisions
                            with a modern data-driven platform.
                        </p>

                        <div className={style.hero__actions}>
                            <Link to={'#section__prediction'} onClick={scrollToPrediction}>
                                <button className={style.primary__btn}>
                                    See Prediction <ArrowRight size={18} />
                                </button>
                            </Link>

                            <Link to={'#section__map'} onClick={scrollToMap}>
                                <button className={style.secondary__btn}>
                                    Explore Map
                                </button>
                            </Link>
                        </div>
                    </div>

                    <div className={style.hero__imageWrapper}>
                        <img
                            src={logo}
                            alt="market visualization"
                            className={style.hero__image}
                        />
                    </div>
                </div>
            </section>

            {/* ================= MAP ================= */}
            <section className={style.section__map} id="section__map">
                <div className={style.container}>
                    <h2>Market Map Overview</h2>
                    <p>
                        Visualize market movements and regional trends in a clean interactive layout.
                    </p>

                    <div className={style.map__placeholder}>
                        Map will be integrated here
                    </div>
                </div>
            </section>

            {/* ================= PREDICTION ================= */}
            <section className={style.section__prediction} id="section__prediction">
                <div className={style.container}>
                    <h2>Prediction Engine</h2>
                    <p>
                        AI-powered forecasting to help you understand future market behavior.
                    </p>

                    <div className={style.prediction__cardGrid}>
                        <div className={style.card}>Trend Analysis</div>
                        <div className={style.card}>Price Forecast</div>
                        <div className={style.card}>Risk Detection</div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default LandingPage