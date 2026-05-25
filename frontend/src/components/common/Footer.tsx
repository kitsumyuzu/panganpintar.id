import style from '@/styles/components/common/footer.module.css'
import { Link } from 'react-router-dom'

const quickLinkItem = [
    {
        title: 'Community',
        links: [
            { key: 0, title: 'Forum', link: '/' },
            { key: 1, title: 'Discord', link: '/' },
            { key: 2, title: 'Events', link: '/' }
        ]
    },
    {
        title: 'Support',
        links: [
            { key: 3, title: 'Help Center', link: '/' },
            { key: 4, title: 'Contact', link: '/' },
            { key: 5, title: 'FAQ', link: '/' }
        ]
    },
    {
        title: 'Terms & Guide',
        links: [
            { key: 6, title: 'Privacy', link: '/' },
            { key: 7, title: 'Terms', link: '/' },
            { key: 8, title: 'Guidelines', link: '/' }
        ]
    }
]

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className={style.footer}>

            <div className={style.footer_container}>

                {/* BRAND */}
                <div className={style.footer_brand}>
                    <h3>Pangan Pintar Inc</h3>
                    <p>
                        Smart platform for food insights and market intelligence.
                    </p>
                </div>

                {/* LINKS */}
                <div className={style.footer_links}>
                    {quickLinkItem.map((section) => (
                        <div key={section.title} className={style.footer_column}>
                            <h4>{section.title}</h4>

                            <ul>
                                {section.links.map((item) => (
                                    <li key={item.key}>
                                        <Link to={item.link} className={style.footer_link}>
                                            {item.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

            </div>

            <div className={style.footer_bottom}>
                <p>© {currentYear} Pangan Pintar Inc. All rights reserved.</p>
            </div>

        </footer>
    )
}