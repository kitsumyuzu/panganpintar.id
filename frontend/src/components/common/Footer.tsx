import { Link } from 'react-router-dom'

const quickLinkItem = [
    {
        title: 'Community',
        links: [
            { key: 0, title: '1', link: '/'},
            { key: 1, title: '2', link: '/'},
            { key: 2, title: '3', link: '/'}
        ]
    },
    {
        title: 'Support',
        links: [
            { key: 3, title: '4', link: '/'},
            { key: 4, title: '5', link: '/'},
            { key: 5, title: '6', link: '/'}
        ]
    },
    {
        title: 'Terms & Guide',
        links: [
            { key: 6, title: '7', link: '/'},
            { key: 7, title: '8', link: '/'},
            { key: 8, title: '9', link: '/'}
        ]
    }
];

export default function Footer() {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className={'footer'}>
            <div className={'footer-brand'}>
                <h3>Pangan Pintar Inc</h3>
                <p>...</p>
            </div>

            <div className={'footer-quick-links'}>
                {quickLinkItem.map((section, key) => (
                    <div key={key} className={'footer-column'}>
                        <h4>{section.title}</h4>

                        <ul>
                            {section.links.map((item) => (
                                <li key={item.key}>
                                    <Link to={item.link} className={'footer-link'}>{item.title}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className={'footer-license'}>
                <p>&copy; {currentYear} Pangan Pintar Inc. All rights reserved.</p>
            </div>
        </footer>
    )
}