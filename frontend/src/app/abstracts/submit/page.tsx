'use client'

import { useState } from 'react'
import { submitAbstract } from '@/actions/abstract'

export default function SubmitAbstract() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');
    const formData = new FormData(e.currentTarget);
    const result = await submitAbstract(formData);
    if (result.success) {
      setStatus('success');
    } else {
      setStatus('error');
      setErrorMessage(result.error || 'Submission failed.');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-milk py-24 min-h-screen flex items-center justify-center">
        <div className="bg-white p-12 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 text-center max-w-lg">
          <div className="text-red-600 mb-6">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">Submission Received</h2>
          <p className="text-gray-500 font-medium">Your abstract has been successfully submitted to the scientific committee.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-milk py-16 min-h-screen">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 overflow-hidden p-8 md:p-12">
          <h1 className="text-3xl font-black text-gray-900 mb-2">Submit Your Abstract</h1>
          <p className="text-gray-500 mb-8 font-medium">Contribute to the Gombe State 2026 TB-HIV scientific program.</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Abstract Title</label>
              <input type="text" name="title" required className="w-full rounded-xl border-gray-300 border p-3 bg-gray-50 transition-all duration-300" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Lead Author</label>
                <input type="text" name="authorName" required className="w-full rounded-xl border-gray-300 border p-3 bg-gray-50 transition-all duration-300" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                <input type="email" name="email" required className="w-full rounded-xl border-gray-300 border p-3 bg-gray-50 transition-all duration-300" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Organization / Institution</label>
              <input type="text" name="organization" required className="w-full rounded-xl border-gray-300 border p-3 bg-gray-50 transition-all duration-300" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Submission Theme</label>
              <select name="themeId" required className="w-full rounded-xl border-gray-300 border p-3 bg-gray-50 transition-all duration-300">
                <option value="">Select Theme</option>
                <option value="resource">Resource Mobilization</option>
                <option value="integrate">Integrate, Innovate, Fund</option>
                <option value="resilient">Resilient Responses</option>
                <option value="science">Program Science</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Co-Authors (optional)</label>
                <input type="text" name="coAuthors" placeholder="Separate names with commas" className="w-full rounded-xl border-gray-300 border p-3 bg-gray-50 transition-all duration-300" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Phone (optional)</label>
                <input type="tel" name="phone" className="w-full rounded-xl border-gray-300 border p-3 bg-gray-50 transition-all duration-300" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Presentation Type</label>
                <select name="presentationType" className="w-full rounded-xl border-gray-300 border p-3 bg-gray-50 transition-all duration-300">
                  <option value="">Select type</option>
                  <option>Oral Presentation</option>
                  <option>Poster Presentation</option>
                  <option>Either</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Keywords (optional)</label>
                <input type="text" name="keywords" placeholder="e.g. TB, HIV, Gombe" className="w-full rounded-xl border-gray-300 border p-3 bg-gray-50 transition-all duration-300" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Abstract Text (Max 500 words)</label>
              <textarea name="text" required rows={8} className="w-full rounded-xl border-gray-300 border p-3 bg-gray-50 transition-all duration-300"></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Supporting Document (PDF/DOC, max 10 MB, optional)</label>
              <input type="file" name="file" accept=".pdf,.doc,.docx" className="w-full rounded-xl border-gray-300 border p-3 bg-gray-50 text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-950 file:text-white file:text-sm file:font-bold hover:file:bg-emerald-900 transition-all duration-300" />
            </div>
            <label className="flex items-start gap-3 bg-milk border border-emerald-950/10 rounded-xl p-4">
              <input type="checkbox" name="declaration" required className="mt-1 rounded text-emerald-700 focus:ring-emerald-600" />
              <span className="text-sm text-gray-700 font-medium">I declare this work is original and approve its consideration for the summit scientific programme.</span>
            </label>
            {status === 'error' && (
              <div className="bg-red-50 text-red-700 p-3 rounded-xl text-sm font-semibold text-center">{errorMessage}</div>
            )}
            <div className="pt-4">
              <button type="submit" disabled={status === 'submitting'} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-full transition-all shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
                {status === 'submitting' ? 'Submitting...' : 'Submit Abstract'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
