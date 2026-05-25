import style from '@/styles/landing/about.module.css'

const team = [
    {
        name: 'Nayra Zanetti Windy Rahmantya',
        role: 'Project Manager',
        image: ''
    },
    {
        name: 'Firman Fadilah',
        role: 'Full-stack AI Engineer',
        image: ''
    },
    {
        name: 'Fransisco Fu',
        role: 'Full-stack Web Developer',
        image: ''
    },
    {
        name: 'Jocelyn',
        role: 'Data Engineer',
        image: ''
    },
    {
        name: 'Stefani Kelin Martha Ampak',
        role: 'Machine Learning Operations',
        image: ''
    },
    {
        name: 'Augustian Gautama',
        role: 'Machine Learning Engineer',
        image: ''
    },
    {
        name: 'Lutfi Braja Munirozaman',
        role: 'Machine Learning Engineer',
        image: ''
    },
    {
        name: 'Amalia Dwi Aprilliati',
        role: 'Frontend Engineer',
        image: ''
    },
    {
        name: 'Muhammad Reza Jauhari Pratama',
        role: 'Backend Engineer',
        image: ''
    },
    {
        name: 'Muhammad Rezansyah',
        role: 'Backend Engineer',
        image: ''
    }
]

/*
    ⚠ FIX:
    Empty string image URLs cause delayed rendering / broken marquee spacing.
    NEVER leave src="".
*/

const partners = [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0uFsWacveQKq8HvQ-evhIGuHyTX-igqXCQQ&s',
    '',
    '',
    ''
]

const AboutPage = () => {

    // seamless infinite marquee
    const marqueeItems = [...partners, ...partners]

    return (
        <section className={style.about}>
            <div className={style.container}>

                {/* HEADER */}
                <div className={style.header}>
                    <h1>About This Platform</h1>

                    <p>
                        A collaborative system built to improve food intelligence,
                        pricing insights, and MSME empowerment through
                        data and machine learning.
                    </p>
                </div>

                {/* JOURNEY */}
                <div className={style.section}>
                    <h2>Development Journey</h2>

                    <p>
                        Built by a multidisciplinary engineering team focused on AI,
                        data systems, and real-world MSME impact.
                    </p>
                </div>

                {/* TEAM */}
                <div className={style.section}>
                    <h2>Our Team</h2>

                    <div className={style.teamGrid}>
                        {team.map((member) => (
                            <div
                                key={member.name}
                                className={style.teamCard}
                            >

                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className={style.avatar}
                                />

                                <h3>{member.name}</h3>
                                <p>{member.role}</p>

                            </div>
                        ))}
                    </div>
                </div>

                {/* PARTNERS */}
                <div className={style.section}>
                    <h2>Support & Partners</h2>

                    <div className={style.logoSlider}>

                        <div className={style.logoTrack}>

                            {marqueeItems.map((logo, i) => (
                                <div
                                    key={i}
                                    className={style.logoItem}
                                >
                                    <img
                                        src={logo}
                                        alt="partner logo"
                                        className={style.partnerLogo}
                                    />
                                </div>
                            ))}

                        </div>

                    </div>
                </div>

            </div>
        </section>
    )
}

export default AboutPage