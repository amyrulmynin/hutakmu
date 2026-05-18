import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FFF5E6]">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#FFF5E6]/80 border-b border-[#FAD4C0]/50 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#111827]">Hutakmu</h1>
        <div className="flex gap-2">
          <Link to="/login"><Button variant="ghost" size="sm" className="text-[#111827]">Log Masuk</Button></Link>
          <Link to="/register"><Button size="sm" className="bg-[#111827] text-white hover:bg-[#111827]/90 rounded-full px-4">Daftar</Button></Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="px-4 pt-12 pb-8 text-center max-w-lg mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/60 border border-[#FAD4C0] rounded-full px-3 py-1 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-medium text-[#111827]">Free & Open Source</span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-[#111827] leading-tight">
            Track Hutang<br />
            <span className="text-[#80A1C1]">Dengan Mudah</span>
          </h2>
          <p className="text-[#111827]/60 mt-4 text-base leading-relaxed">
            Catat hutang, auto-kira bayaran bulanan, share link bayar ke kawan. Semua dalam satu tempat.
          </p>
          <div className="flex gap-3 justify-center mt-8">
            <Link to="/register">
              <Button size="lg" className="bg-[#111827] text-white hover:bg-[#111827]/90 rounded-full px-8 h-12 text-base font-medium shadow-lg shadow-[#111827]/20">
                Mula Sekarang
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="rounded-full px-8 h-12 text-base font-medium border-[#111827]/20">
                Log Masuk
              </Button>
            </Link>
          </div>
        </section>

        {/* Bento Grid Features */}
        <section className="px-4 pb-12 max-w-lg mx-auto">
          <div className="grid grid-cols-2 gap-3">
            {/* Large card - spans 2 cols */}
            <div className="col-span-2 bg-white rounded-2xl p-6 border border-[#FAD4C0]/30 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#FAD4C0]/30 flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <h3 className="font-semibold text-[#111827] text-lg">Auto-Kira Bulanan</h3>
              <p className="text-sm text-[#111827]/60 mt-1">Set jumlah + fee + tempoh. System auto-generate jadual bayaran bulanan.</p>
            </div>

            {/* Small card */}
            <div className="bg-white rounded-2xl p-5 border border-[#FAD4C0]/30 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#80A1C1]/20 flex items-center justify-center mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#80A1C1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
                </svg>
              </div>
              <h3 className="font-semibold text-[#111827] text-sm">Share Link</h3>
              <p className="text-xs text-[#111827]/60 mt-1">Hantar link bayar ke WhatsApp</p>
            </div>

            {/* Small card */}
            <div className="bg-white rounded-2xl p-5 border border-[#FAD4C0]/30 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h3 className="font-semibold text-[#111827] text-sm">Approve Bukti</h3>
              <p className="text-xs text-[#111827]/60 mt-1">Review & approve bayaran</p>
            </div>

            {/* Medium card */}
            <div className="col-span-2 bg-[#111827] rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white text-base">SMS Reminder</h3>
                  <p className="text-sm text-white/60 mt-0.5">Auto-hantar reminder sebelum due date via Custom API</p>
                </div>
              </div>
            </div>

            {/* Stats card */}
            <div className="col-span-2 bg-gradient-to-br from-[#80A1C1]/10 to-[#FAD4C0]/20 rounded-2xl p-6 border border-[#FAD4C0]/30">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-[#111827]">100%</p>
                  <p className="text-xs text-[#111827]/60 mt-1">Free</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#111827]">∞</p>
                  <p className="text-xs text-[#111827]/60 mt-1">Peminjam</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#111827]">24/7</p>
                  <p className="text-xs text-[#111827]/60 mt-1">Access</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="px-4 pb-12 max-w-lg mx-auto">
          <h3 className="text-lg font-bold text-[#111827] mb-4 text-center">Macam Mana Guna?</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-white rounded-xl p-4 border border-[#FAD4C0]/30">
              <div className="w-8 h-8 rounded-full bg-[#111827] text-white flex items-center justify-center text-sm font-bold shrink-0">1</div>
              <div>
                <p className="font-medium text-sm text-[#111827]">Daftar & tambah peminjam</p>
                <p className="text-xs text-[#111827]/60">Buat akaun, masukkan nama & no. telefon kawan</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white rounded-xl p-4 border border-[#FAD4C0]/30">
              <div className="w-8 h-8 rounded-full bg-[#111827] text-white flex items-center justify-center text-sm font-bold shrink-0">2</div>
              <div>
                <p className="font-medium text-sm text-[#111827]">Catat hutang & set fee</p>
                <p className="text-xs text-[#111827]/60">Masukkan jumlah, flat fee, dan tempoh bayaran</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white rounded-xl p-4 border border-[#FAD4C0]/30">
              <div className="w-8 h-8 rounded-full bg-[#111827] text-white flex items-center justify-center text-sm font-bold shrink-0">3</div>
              <div>
                <p className="font-medium text-sm text-[#111827]">Share link & collect</p>
                <p className="text-xs text-[#111827]/60">Hantar link bayar, kawan upload bukti, anda approve</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 pb-16 max-w-lg mx-auto text-center">
          <div className="bg-[#111827] rounded-2xl p-8">
            <h3 className="text-xl font-bold text-white">Ready?</h3>
            <p className="text-white/60 text-sm mt-2">Mula track hutang sekarang. Free forever.</p>
            <Link to="/register">
              <Button size="lg" className="mt-6 bg-white text-[#111827] hover:bg-white/90 rounded-full px-8 h-12 font-medium">
                Daftar Sekarang
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#FAD4C0]/30 px-4 py-6 text-center">
        <p className="text-xs text-[#111827]/40">Hutakmu © 2026 • Free & Open Source</p>
      </footer>
    </div>
  )
}
