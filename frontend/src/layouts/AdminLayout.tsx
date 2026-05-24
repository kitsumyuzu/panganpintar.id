import { Outlet } from "react-router-dom";

export default function AdminLayout() {
    return (
        <main className={'min-h-screen flex items-center justify-center bg-slate-50'}>
            <div className={'w-full max-w-md p-8 bg-white rounded-lg shadow-lg'}>
                <Outlet />
            </div>
        </main>
    )
}