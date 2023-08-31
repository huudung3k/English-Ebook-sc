import AdminSideBar from "../component/admin/admin-side-bar/AdminSideBar";

export default function AdminLayout({ children, params }) {
    return (
        <section className="flex grow">
            <AdminSideBar lang={params.lang}/>
            {children}
        </section>
    )
}