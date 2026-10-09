import { prisma } from '@/lib/prisma'
import { getAbstractFileUrl } from '@/actions/abstract'
import AbstractActions from './AbstractActions'

export const dynamic = 'force-dynamic'

export default async function AdminAbstracts() {
  const abstracts = await prisma.abstract.findMany({
    orderBy: { createdAt: 'desc' }
  })
  const fileLinks = await Promise.all(
    abstracts.map(async (abs) => ({ id: abs.id, url: await getAbstractFileUrl(abs.fileUrl) }))
  );
  const fileUrlFor = (id: string) => fileLinks.find((f) => f.id === id)?.url || null;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Abstract Submissions</h2>
        <button className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm shadow-md">
          Export CSV
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100/60 p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">ID</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">Title</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">Author</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">Theme</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">File</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {abstracts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-gray-500">No abstracts submitted yet</td>
                </tr>
              ) : (
                abstracts.map((abs) => (
                  <tr key={abs.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-3 px-4 text-sm font-medium text-gray-500">{abs.id.slice(-6).toUpperCase()}</td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 max-w-xs truncate" title={abs.title}>{abs.title}</td>
                    <td className="py-3 px-4 text-sm">{abs.authorName}</td>
                    <td className="py-3 px-4 text-sm">{abs.themeId || 'N/A'}</td>
                    <td className="py-3 px-4 text-sm">
                      {fileUrlFor(abs.id) ? (
                        <a href={fileUrlFor(abs.id) as string} target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-900 font-semibold whitespace-nowrap">
                          View file
                        </a>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        abs.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                        abs.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {abs.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <AbstractActions id={abs.id} currentStatus={abs.status} />
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
