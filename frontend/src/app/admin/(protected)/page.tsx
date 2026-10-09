import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  // Fetch real data from Prisma
  const [
    totalRegistrations,
    totalAbstracts,
    pendingAbstracts,
    totalSpeakers,
    totalPartners,
    checkedInCount,
    recentRegistrations
  ] = await Promise.all([
    prisma.registration.count(),
    prisma.abstract.count(),
    prisma.abstract.count({ where: { status: 'SUBMITTED' } }),
    prisma.speaker.count(),
    prisma.partner.count(),
    prisma.registration.count({ where: { checkInStatus: true } }),
    prisma.registration.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    })
  ]);
  const checkInRate = totalRegistrations > 0 ? Math.round((checkedInCount / totalRegistrations) * 100) : 0;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100">
          <div className="text-sm font-medium text-gray-500 mb-1">Total Registrations</div>
          <div className="text-3xl font-bold text-gray-900">{totalRegistrations}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100">
          <div className="text-sm font-medium text-gray-500 mb-1">Abstract Submissions</div>
          <div className="text-3xl font-bold text-gray-900">{totalAbstracts}</div>
          <div className="text-sm text-yellow-600 mt-2">{pendingAbstracts} awaiting review</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100">
          <div className="text-sm font-medium text-gray-500 mb-1">Confirmed Speakers</div>
          <div className="text-3xl font-bold text-gray-900">{totalSpeakers}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100">
          <div className="text-sm font-medium text-gray-500 mb-1">Partners & Sponsors</div>
          <div className="text-3xl font-bold text-gray-900">{totalPartners}</div>
        </div>
        <div className="bg-emerald-950 p-6 rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.08)] border border-emerald-900">
          <div className="text-sm font-medium text-emerald-300 mb-1">Checked-In Participants</div>
          <div className="text-3xl font-bold text-white">{checkedInCount}</div>
          <div className="mt-3 h-2 rounded-full bg-emerald-900 overflow-hidden">
            <div className="h-full rounded-full bg-emerald-400 transition-all" style={{ width: `${checkInRate}%` }} />
          </div>
          <div className="text-xs text-emerald-300 mt-2">{checkInRate}% of all registrations</div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Registrations</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">Name</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">Email</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">Phone</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-500">No registrations yet</td>
                </tr>
              ) : (
                recentRegistrations.map((reg) => (
                  <tr key={reg.id} className="border-b border-gray-100 last:border-0">
                    <td className="py-3 px-4 text-sm">{reg.firstName} {reg.lastName}</td>
                    <td className="py-3 px-4 text-sm">{reg.email}</td>
                    <td className="py-3 px-4 text-sm">{reg.phoneNumber}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${reg.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {reg.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">{reg.createdAt.toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
