import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import AdminSidebar from './AdminSidebar'

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdminAuthenticated())) {
    redirect('/admin/login')
  }
  return (
    <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] border-b h-16 flex items-center justify-between px-6">
          <h1 className="text-lg font-semibold text-gray-800">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">Super Admin</span>
            <div className="h-8 w-8 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center font-bold">
              SA
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
