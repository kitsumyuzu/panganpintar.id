import { Outlet } from "react-router-dom";

export default function AdminLayout() {
    return (
        <main className={'content'}>
            {/* <Navbar /> */}
            <div className={'wrapper'}>
                <Outlet />
            </div>
            {/* <Footer /> */}
        </main>
    )
}