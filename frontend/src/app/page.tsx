import Link from "next/link";
import Countdown from "@/components/Countdown";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getShowcaseSpeakers() {
  try {
    return await prisma.speaker.findMany({
      where: { published: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      take: 4,
    });
  } catch {
    return [];
  }
}

async function getProgrammePreview() {
  try {
    return await prisma.session.findMany({
      where: { published: true },
      orderBy: [{ startTime: "asc" }],
      take: 3,
      include: { speakers: { include: { speaker: true } } },
    });
  } catch {
    return [];
  }
}

function formatTime(value: Date | null) {
  if (!value) return "TBA";
  return new Date(value).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" });
}

export default async function Home() {
  const speakers = await getShowcaseSpeakers();
  const sessions = await getProgrammePreview();
  return (
    <div className="flex flex-col w-full bg-milk selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* GRAND CENTER-ALIGNED HERO SECTION */}
      <section className="relative min-h-[95vh] flex flex-col justify-center items-center bg-emerald-950 overflow-hidden text-center">
        {/* Abstract Glow & Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#064e3b_1px,transparent_1px),linear-gradient(to_bottom,#064e3b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[600px] bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="container relative z-20 mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl pt-32 sm:pt-36 pb-40">
          
          <div className="inline-flex items-center mb-8 bg-emerald-900/50 border border-emerald-700/50 rounded-full px-5 py-2 backdrop-blur-md shadow-lg">
            <span className="text-emerald-100 font-bold tracking-[0.2em] text-[10px] sm:text-xs uppercase">
              1st December 2026 • World AIDS Day
            </span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-2 leading-[0.95]">
            GOMBE STATE 2026 <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-emerald-400 bg-[length:200%_auto] animate-pulse">
              HIV-TB SUMMIT
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-emerald-200 italic mb-6 font-light">
            in commemoration with World AIDS Day
          </p>
          
          <p className="text-2xl md:text-3xl font-medium text-white mb-6 leading-snug max-w-4xl mx-auto drop-shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
            &ldquo;Stronger Partnerships for a Healthier, HIV &amp; TB Free Gombe State&rdquo;
          </p>

          <p className="text-lg md:text-xl text-emerald-200/90 font-light mb-12 max-w-2xl mx-auto border-t border-emerald-800/50 pt-6">
            <span className="font-bold text-emerald-100 uppercase tracking-widest text-sm mr-2">Theme:</span> 
            Integrate, fund, sustain and own TB-HIV Response
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/register" className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white px-12 py-5 rounded-full font-bold text-center transition-all transform hover:-translate-y-1 text-sm uppercase tracking-widest shadow-[0_8px_30px_rgba(225,29,72,0.4)]">
              Register as Delegate
            </Link>
            <Link href="/register" className="w-full sm:w-auto bg-emerald-900/60 hover:bg-emerald-800 text-emerald-50 border border-emerald-700/60 px-12 py-5 rounded-full font-bold text-center transition-colors text-sm uppercase tracking-widest backdrop-blur-sm">
              Exhibition & Vendors
            </Link>
          </div>
        </div>

        {/* Soft fade into the next section */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-50 to-transparent z-10 pointer-events-none"></div>
      </section>

      {/* FLOATING QUICK INFO (WHITE CARD, EMERALD TEXT, MIXED ICONS) */}
      <section className="relative z-30 -mt-24 mx-4 md:mx-auto max-w-6xl">
        <div className="bg-white rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-slate-100/60 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="p-8 flex items-center justify-center md:justify-start gap-4 hover:bg-slate-50 transition-colors">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <div className="text-left">
                <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-1">Date</div>
                <div className="text-lg font-black text-emerald-950">01 Dec 2026</div>
              </div>
            </div>
            <div className="p-8 flex items-center justify-center md:justify-start gap-4 hover:bg-slate-50 transition-colors">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <div className="text-left">
                <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-1">Location</div>
                <div className="text-lg font-black text-emerald-950">TBA, Gombe</div>
              </div>
            </div>
            <div className="p-8 flex items-center justify-center md:justify-start gap-4 hover:bg-slate-50 transition-colors md:col-span-2">
              <div className="w-12 h-12 bg-emerald-950 text-white rounded-full flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div className="w-full text-left">
                <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-1 flex justify-between">
                  <span>Countdown</span>
                  <span className="text-rose-600 hidden sm:inline">Registration Open</span>
                </div>
                <Countdown />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HEALTH OVERVIEW */}
      <section className="pt-32 pb-24 bg-milk">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="w-16 h-1 bg-emerald-500 mb-8"></div>
              <h2 className="text-4xl md:text-5xl font-black text-emerald-950 mb-8 leading-tight tracking-tight">
                A Global Mandate:<br/>World AIDS Day.
              </h2>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                The Gombe State 2026 AIDS Summit officially aligns with World AIDS Day, uniting program experts, health professionals, and government responders to decisively strengthen the TB-HIV program innovation and state response.
              </p>
              <Link href="/about" className="inline-flex items-center text-emerald-950 font-bold text-lg hover:text-emerald-700 transition-colors group uppercase tracking-widest text-sm">
                Read our vision
                <svg className="w-5 h-5 ml-3 transform group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: "Program Innovation", desc: "Sharing program breakthroughs and science." },
                { title: "Resource Mobilization", desc: "Securing sustainable funding for health facilities." },
                { title: "Frontline Partnership", desc: "Building resilient stakeholder networks." },
                { title: "State Response", desc: "Aligning government action with community needs." }
              ].map((item, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100/60 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-shadow hover:border-emerald-100">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                  <h4 className="text-xl font-bold text-emerald-950 mb-3">{item.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PILLARS / SUBTHEMES */}
      <section className="py-24 bg-milk">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div className="max-w-2xl">
              <span className="text-emerald-600 font-bold tracking-widest text-sm uppercase mb-3 block">Sub-Themes</span>
              <h2 className="text-4xl md:text-5xl font-black text-emerald-950 tracking-tight">Pillars of the Health Response</h2>
            </div>
            <Link href="/programme" className="bg-emerald-950 text-white hover:bg-emerald-900 px-8 py-4 font-bold text-sm transition-colors rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] uppercase tracking-widest">
              View Programme
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Strengthening resource mobilization in the face of decline external funding.",
              "Integrate, innovate and fund.",
              "Building a Resilient, People-Centred TB-HIV Response for Gombe State.",
              "TB/HIV program science in Gombe state: where we are and what next.",
              "One plan, coordinated action and shared responsibility."
            ].map((theme, i) => (
              <div key={i} className="group relative bg-white p-10 hover:bg-emerald-950 transition-colors duration-300 rounded-2xl overflow-hidden border border-emerald-950/5 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                <div className="text-5xl font-black text-emerald-950/10 group-hover:text-white/15 transition-colors mb-6 font-serif">
                  {i + 1 < 10 ? `0${i + 1}` : i + 1}
                </div>
                <h3 className="text-xl font-bold text-emerald-950 group-hover:text-white transition-colors leading-snug">
                  {theme}
                </h3>
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-teal-400 transition-all duration-500 group-hover:w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUMMIT THEME */}
      <section className="py-24 bg-emerald-950 text-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center">
          <span className="text-emerald-400 font-bold tracking-widest text-sm uppercase mb-6 block">Summit Theme</span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-8">
            &ldquo;Stronger Partnerships for a Healthier,
            <br className="hidden md:block" /> HIV &amp; TB Free Gombe State&rdquo;
          </h2>
          <p className="text-xl text-emerald-200/90 font-light max-w-3xl mx-auto">
            Integrate, fund, sustain and own the TB-HIV response — one plan,
            coordinated action and shared responsibility.
          </p>
        </div>
      </section>

      {/* FEATURED SPEAKERS */}
      <section className="py-24 bg-milk">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div className="max-w-2xl">
              <span className="text-rose-600 font-bold tracking-widest text-sm uppercase mb-3 block">Delegation</span>
              <h2 className="text-4xl md:text-5xl font-black text-emerald-950 tracking-tight">Featured Speakers</h2>
            </div>
            <Link href="/speakers" className="bg-emerald-950 text-white hover:bg-emerald-900 px-8 py-4 font-bold text-sm transition-colors rounded-xl uppercase tracking-widest">
              All Speakers
            </Link>
          </div>

          {speakers.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100/60 p-12 text-center">
              <p className="text-lg text-slate-500 font-medium mb-6">Speaker announcements coming soon.</p>
              <Link href="/speakers" className="inline-block bg-rose-600 hover:bg-rose-700 text-white px-10 py-4 font-bold text-sm uppercase tracking-widest rounded-xl transition-colors">
                Meet the Delegation
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {speakers.map((speaker) => (
                <div key={speaker.id} className="group">
                  <div className="aspect-[3/4] bg-slate-100 relative overflow-hidden mb-6 rounded-2xl">
                    <img
                      src={speaker.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(speaker.name)}&background=0A2518&color=fff&size=512`}
                      alt={speaker.name}
                      className="object-cover w-full h-full transition-all duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    {speaker.category && (
                      <div className="absolute top-4 left-4 bg-rose-600 text-white text-[10px] font-black px-3 py-1 uppercase tracking-widest rounded-full">
                        {speaker.category}
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-extrabold text-emerald-950 mb-1">{speaker.name}</h3>
                  {speaker.title && <p className="text-sm text-slate-500 font-medium mb-2">{speaker.title}</p>}
                  <div className="h-px w-8 bg-rose-600 mb-2 transition-all duration-300 group-hover:w-full"></div>
                  {speaker.organization && (
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">{speaker.organization}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* PROGRAMME OF EVENTS PREVIEW */}
      <section className="py-24 bg-white border-y border-emerald-950/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-emerald-600 font-bold tracking-widest text-sm uppercase mb-3 block">Schedule</span>
              <h2 className="text-4xl md:text-5xl font-black text-emerald-950 tracking-tight">Programme of Events</h2>
            </div>
            <Link href="/programme" className="bg-emerald-950 text-white hover:bg-emerald-900 px-8 py-4 font-bold text-sm transition-colors rounded-xl uppercase tracking-widest w-fit">
              Full Programme
            </Link>
          </div>

          {sessions.length === 0 ? (
            <div className="bg-milk rounded-2xl border border-emerald-950/5 p-12 text-center">
              <p className="text-lg text-slate-500 font-medium mb-6">The official schedule is being finalised.</p>
              <Link href="/programme" className="inline-block bg-emerald-950 hover:bg-emerald-900 text-white px-10 py-4 font-bold text-sm uppercase tracking-widest rounded-xl transition-colors">
                View Programme
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div key={session.id} className="bg-milk p-6 md:p-8 rounded-2xl border border-emerald-950/5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-shadow flex flex-col md:flex-row gap-4 md:gap-8">
                  <div className="md:w-32 shrink-0">
                    <span className="text-2xl font-black text-emerald-950 tracking-tight block">{formatTime(session.startTime)}</span>
                    {session.room && (
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{session.room}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    {session.sessionType && (
                      <span className="inline-block px-3 py-1 bg-emerald-950 text-white text-[10px] font-black uppercase tracking-widest mb-3 rounded-full">
                        {session.sessionType}
                      </span>
                    )}
                    <h3 className="text-xl font-bold text-emerald-950 mb-2 leading-snug">{session.title}</h3>
                    {session.speakers.length > 0 && (
                      <p className="text-sm text-slate-500 font-medium">
                        {session.speakers.map((s) => s.speaker.name).join(" • ")}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ABSTRACTS CTA (ROSE RED) */}
      <section className="relative py-32 bg-rose-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute right-0 top-0 w-1/3 h-full bg-rose-700 transform skew-x-[-20deg] origin-top opacity-50 pointer-events-none"></div>
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/20">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tight">Call for Abstracts</h2>
          <p className="text-xl text-rose-100 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
            Share your clinical research, medical innovations, and epidemiological evidence contributing to a stronger TB-HIV response. Help shape the scientific dialogue.
          </p>
          <Link href="/abstracts" className="inline-block bg-emerald-950 hover:bg-emerald-900 text-white px-12 py-5 rounded-xl font-bold text-sm uppercase tracking-widest transition-transform transform hover:-translate-y-1 shadow-[0_10px_20px_rgba(2,44,34,0.3)]">
            Submit Your Research
          </Link>
        </div>
      </section>

      {/* PARTNERSHIPS */}
      <section className="py-24 bg-milk border-b border-emerald-950/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center">
          <h2 className="text-3xl md:text-4xl font-black text-emerald-950 mb-6 tracking-tight">
            Institutional Partnerships
          </h2>
          <p className="text-lg text-slate-500 mb-10 max-w-2xl mx-auto font-medium">
            Join hands with the Gombe State Government and other clinical stakeholders to support the TB-HIV response. Discover partnership and sponsorship opportunities.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/partners" className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 font-bold text-center transition-colors text-sm uppercase tracking-widest rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
              Explore Partnerships
            </Link>
            <Link href="/contact" className="bg-white hover:bg-slate-50 text-emerald-950 border border-slate-300 px-10 py-4 font-bold text-center transition-colors text-sm uppercase tracking-widest rounded-xl">
              Contact Secretariat
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
