import style from '@/styles/landing/landing.module.css'
import logo from '@/assets/market.jpg'

import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const LandingPage = () => {
    return (
        <>
            <section className={`${style.section__hero}`}>
                <div className={`${style.hero__header}`}>
                    <div className={`${style.wrapper}`}>
                        <h2>Hero title</h2>
                        <p>Hero description</p>
                    </div>

                    <Link to={'#section__prediction'} onClick={(e) => {
                            e.preventDefault()
                            document.getElementById('section__prediction')?.scrollIntoView({ behavior: 'smooth' })
                        }
                    }>
                        <button><ArrowRight /> See more</button>
                    </Link>
                </div>

                <img src={logo} alt="hero__image" className={`${style.hero__image}`} width={900} />
            </section>

            <section className={`${style.section__map}`}>

            </section>

            <section className={`${style.section__prediction}`} id={'section__prediction'}>
                <h1>test</h1>
            </section>
        </>
    )
}

export default LandingPage