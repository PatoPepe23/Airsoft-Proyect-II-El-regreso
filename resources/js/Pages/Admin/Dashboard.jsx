import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import UsersTable from '@/Pages/Admin/Partials/UsersTable.jsx'
import UsersCreation from "@/Pages/Admin/Partials/AdminUserCreate.jsx";

export default function Dashboard({ auth, users_list, roles_list }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Admin Dashboard</h2>}
        >
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <UsersTable
                                users_list={users_list}
                                roles_list={roles_list}
                            >
                            </UsersTable>
                        </div>
                    </div>
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mt-[25px]">
                        <div className="p-6 text-gray-900">
                            <UsersCreation
                                roles_list={roles_list}
                            >
                            </UsersCreation>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
