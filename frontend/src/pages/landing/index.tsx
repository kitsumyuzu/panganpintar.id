import style from '@/styles/landing/landing.module.css'

const LandingPage = () => {
    return (
        <>
            <section className={`${style.section_hero}`}><h1>Section Hero</h1></section>
            <section className={`${style.section_map}`}><h1>Section Map</h1></section>
            <section className={`${style.section_prediction}`}><h1>Section Prediction</h1></section>
        </>
    )
}

export default LandingPage