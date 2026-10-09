import { prisma } from '@/lib/prisma'
import RegistrationActions from './RegistrationActions'

export const dynamic = 'force-dynamic'

export default async function AdminRegistrations() {
  const registrations = await prisma.registration.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Registrations</h2>
      
      <div className="bg-white rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">Name</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">Organization</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">Category</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">Check-in</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {registrations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-gray-500">No registrations found</td>
                </tr>
              ) : (
                registrations.map((reg) => (
                  <tr key={reg.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
                    <td className="py-3 px-4 text-sm">
                      <div className="font-semibold text-gray-900">{reg.firstName} {reg.lastName}</div>
                      <div className="text-gray-500 text-xs">{reg.email} • {reg.phoneNumber}</div>
                    </td>
                    <td className="py-3 px-4 text-sm">{reg.organization || '-'}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium border border-blue-100">
                        {reg.participantCategory}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        reg.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 
                        reg.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {reg.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {reg.checkInStatus ? (
                        <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-800" title={reg.checkInTime ? new Date(reg.checkInTime).toLocaleString() : ''}>
                          Checked in
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-600">
                          Not in
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">{reg.createdAt.toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-sm">
                      <RegistrationActions id={reg.id} currentStatus={reg.status} checkInStatus={reg.checkInStatus} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
