'use client';

import { SALON_CONFIG } from '@/config/salon.config';
import { useStore } from '@/store/useStore';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Scissors,
  Star,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  Sparkles,
  ChevronRight,
  Calendar,
  Building2,
  Play,
  Instagram,
  ArrowUpRight,
  Menu,
  X,
} from 'lucide-react';

export default function SalonPublicStorefront() {
  const { services, staff } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check if salon is currently open
  const isOpenNow = useMemo(() => {
    const now = new Date();
    const day = now.getDay(); // 0 is Sunday, 1 is Monday
    // Closed on Monday
    if (day === 1) return false;
    const hour = now.getHours();
    return hour >= SALON_CONFIG.hours.startHour && hour < SALON_CONFIG.hours.endHour;
  }, []);

  // Filter services by category if any (or show all)
  const categories = useMemo(() => {
    return [
      { id: 'all', label: 'All Services' },
      { id: 'hair', label: 'Hair & Styling' },
      { id: 'beard', label: 'Beard & Grooming' },
      { id: 'color', label: 'Color & Treatments' },
      { id: 'spa', label: 'Skin & Spa' },
    ];
  }, []);

  const filteredServices = useMemo(() => {
    if (selectedCategory === 'all') return services;
    if (selectedCategory === 'hair') {
      return services.filter(
        (s) =>
          s.name.toLowerCase().includes('cut') ||
          s.name.toLowerCase().includes('style') ||
          s.name.toLowerCase().includes('wash')
      );
    }
    if (selectedCategory === 'beard') {
      return services.filter(
        (s) =>
          s.name.toLowerCase().includes('beard') ||
          s.name.toLowerCase().includes('shave') ||
          s.name.toLowerCase().includes('groom')
      );
    }
    if (selectedCategory === 'color') {
      return services.filter(
        (s) =>
          s.name.toLowerCase().includes('color') ||
          s.name.toLowerCase().includes('highlight') ||
          s.name.toLowerCase().includes('balayage')
      );
    }
    if (selectedCategory === 'spa') {
      return services.filter(
        (s) =>
          s.name.toLowerCase().includes('facial') ||
          s.name.toLowerCase().includes('massage') ||
          s.name.toLowerCase().includes('spa')
      );
    }
    return services;
  }, [services, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* ── TOP ANNOUNCEMENT BAR ── */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-slate-950 text-xs font-bold py-2 px-4 text-center tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Book online today & get a complimentary Kerastase hair ritual consultation</span>
        <Link href="/book" className="underline underline-offset-2 ml-1 hover:text-white transition-colors">
          Claim Slot &rarr;
        </Link>
      </div>

      {/* ── LUXURY STICKY NAVBAR ── */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Scissors className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white block leading-tight">
                {SALON_CONFIG.name}
              </span>
              <span className="text-[11px] text-amber-400 font-medium tracking-widest uppercase">
                {SALON_CONFIG.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#services" className="hover:text-amber-400 transition-colors">
              Services & Prices
            </a>
            <a href="#ambiance" className="hover:text-amber-400 transition-colors">
              Salon Ambiance
            </a>
            <a href="#stylists" className="hover:text-amber-400 transition-colors">
              Master Stylists
            </a>
            <a href="#lookbook" className="hover:text-amber-400 transition-colors">
              Lookbook
            </a>
            <a href="#reviews" className="hover:text-amber-400 transition-colors">
              Reviews
            </a>
            <a href="#location" className="hover:text-amber-400 transition-colors">
              Location & Hours
            </a>
          </nav>

          {/* Actions: Book Now + Staff Portal + Mobile Toggle */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/dashboard"
              className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-2 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Staff Portal</span>
            </Link>
            <Link
              href="/book"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center gap-1.5 sm:gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Book Appointment</span>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-b border-slate-800 bg-slate-950/98 backdrop-blur-2xl px-5 py-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <a
              href="#services"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-medium text-slate-200 hover:text-amber-400 py-1"
            >
              Services & Prices
            </a>
            <a
              href="#ambiance"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-medium text-slate-200 hover:text-amber-400 py-1"
            >
              Salon Ambiance
            </a>
            <a
              href="#stylists"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-medium text-slate-200 hover:text-amber-400 py-1"
            >
              Master Stylists
            </a>
            <a
              href="#lookbook"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-medium text-slate-200 hover:text-amber-400 py-1"
            >
              Lookbook
            </a>
            <a
              href="#reviews"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-medium text-slate-200 hover:text-amber-400 py-1"
            >
              Reviews
            </a>
            <a
              href="#location"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-medium text-slate-200 hover:text-amber-400 py-1"
            >
              Location & Hours
            </a>
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <Link
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5"
              >
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Staff Portal</span>
              </Link>
              <a
                href={`https://wa.me/${SALON_CONFIG.contact.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-emerald-400 flex items-center gap-1"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* ── HERO SECTION ── */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Luxury Vignette Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 scale-105 transition-transform duration-1000"
          style={{ backgroundImage: `url(${SALON_CONFIG.media.heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/60 z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent z-10" />

        {/* Content */}
        <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-6 shadow-inner backdrop-blur-sm">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>4.9 Star Google Rating (520+ Verified Reviews in Indiranagar)</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
            Where Style Meets <br />
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">
              Precision & Luxury
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 mb-10 leading-relaxed font-light">
            {SALON_CONFIG.description}
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/book"
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-8 py-4 rounded-xl text-base transition-all shadow-xl shadow-amber-500/30 flex items-center justify-center gap-3 group"
            >
              <span>Book Your Appointment Online</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href={`https://wa.me/${SALON_CONFIG.contact.whatsappNumber}?text=${encodeURIComponent(
                'Hello! I would like to inquire about services and book an appointment.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-slate-900/90 hover:bg-slate-800 text-white font-semibold px-6 py-4 rounded-xl text-base transition-all border border-slate-700 flex items-center justify-center gap-2.5"
            >
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          {/* Quick Stats Pills */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
            <div className="bg-slate-900/70 backdrop-blur-md border border-slate-800/80 p-4 rounded-xl">
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-400">{SALON_CONFIG.stats.happyClients}</p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Clients Styled</p>
            </div>
            <div className="bg-slate-900/70 backdrop-blur-md border border-slate-800/80 p-4 rounded-xl">
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-400">{SALON_CONFIG.stats.rating} ★</p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Google Rating</p>
            </div>
            <div className="bg-slate-900/70 backdrop-blur-md border border-slate-800/80 p-4 rounded-xl">
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-400">{SALON_CONFIG.stats.stylistsCount} Masters</p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Expert Stylists</p>
            </div>
            <div className="bg-slate-900/70 backdrop-blur-md border border-slate-800/80 p-4 rounded-xl">
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-400">Zero Wait</p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Instant Reserved Slot</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 1: INTERACTIVE SERVICES & PRICING MENU ── */}
      <section id="services" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-900">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full mb-3">
            <Scissors className="w-3.5 h-3.5" />
            <span>Curated Service Menu</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Exceptional Hair, Beard & Wellness
          </h2>
          <p className="text-slate-400 mt-3 text-sm sm:text-base">
            Transparent pricing, zero hidden charges. Every haircut and beard session includes a consultation and hair wash.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-slate-900/60 border border-slate-800/90 hover:border-amber-500/40 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/5 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                    {service.name}
                  </h3>
                  <span className="text-xl font-extrabold text-amber-400">
                    ₹{service.price}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
                  <span className="flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded text-amber-400/90 font-mono">
                    <Clock className="w-3 h-3" />
                    {service.duration} mins
                  </span>
                  <span>•</span>
                  <span>Includes wash & styling</span>
                </div>

                <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                  Tailored to your facial structure and hair type using premium organic tonics and heat protection.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-500">Instant Online Slot</span>
                <Link
                  href={`/book?service=${service.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 px-3.5 py-1.5 rounded-lg transition-colors shadow-sm"
                >
                  <span>Book Now</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 2: SALON AMBIANCE & VIDEO TOUR ── */}
      <section id="ambiance" className="py-20 bg-slate-900/40 border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Atmosphere</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                An Urban Sanctuary Designed for Relaxation
              </h2>
            </div>
            <p className="text-slate-400 text-sm max-w-md mt-4 md:mt-0">
              Immerse yourself in acoustic comfort, bespoke Italian leather stations, and artisanal espresso while our masters craft your transformation.
            </p>
          </div>

          {/* Interior Photos Gallery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SALON_CONFIG.media.interiorPhotos.map((photo, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 aspect-[4/5]"
              >
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />
                <div className="absolute bottom-0 inset-x-0 p-5">
                  <h4 className="text-base font-bold text-white">{photo.title}</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-snug">{photo.caption}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Video Experience Banner */}
          <div className="mt-10 relative rounded-3xl overflow-hidden border border-slate-800 aspect-[21/9] max-h-[360px] group">
            <img
              src={SALON_CONFIG.media.ambianceVideoThumb}
              alt="Salon Tour Preview"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(true)}
                className="w-16 h-16 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-2xl shadow-amber-500/50 hover:scale-110 transition-all mb-4"
                aria-label="Play video tour"
              >
                <Play className="w-7 h-7 fill-slate-950 translate-x-0.5" />
              </button>
              <h3 className="text-xl sm:text-2xl font-bold text-white">Experience Zenyme Studio Tour</h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">Take a 60-second virtual walk through our styling suites</p>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div
          onClick={() => setIsVideoModalOpen(false)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden max-w-3xl w-full relative cursor-default shadow-2xl"
          >
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-3 right-3 bg-slate-800/80 hover:bg-slate-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold z-10 transition-colors"
              aria-label="Close video tour"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="aspect-video w-full">
              <iframe
                src={`${SALON_CONFIG.media.ambianceVideoUrl}?autoplay=1`}
                title="Salon Tour"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── SECTION 3: MEET OUR MASTER STYLISTS ── */}
      <section id="stylists" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Master Artists</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-1">
            Meet Your Personal Stylists
          </h2>
          <p className="text-slate-400 mt-3 text-sm sm:text-base">
            Trained internationally. Passionate about detail. Choose your stylist when you book your appointment.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {staff.map((member) => (
            <div
              key={member.id}
              className="bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-extrabold text-xl flex items-center justify-center shadow-md">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white group-hover:text-amber-300 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-xs text-amber-400 font-medium">{member.role}</p>
                    <div className="flex items-center gap-1 text-xs text-slate-300 mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-semibold">{member.rating || 4.9}</span>
                      <span className="text-slate-500">• (120+ reviews)</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-4 leading-relaxed line-clamp-2">
                  {member.bio || 'Specialist in custom haircut designs, razor tapers, and client consultations.'}
                </p>

                {member.specialties && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {member.specialties.map((spec) => (
                      <span
                        key={spec}
                        className="text-[10px] font-semibold bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700/60"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80">
                <Link
                  href={`/book?staff=${member.id}`}
                  className="w-full bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-white font-bold py-2.5 rounded-xl transition-all text-xs flex items-center justify-center gap-2"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book with {member.name.split(' ')[0]}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 4: LOOKBOOK & TRANSFORMATIONS ── */}
      <section id="lookbook" className="py-20 bg-slate-900/30 border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Portfolio</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                Recent Transformations
              </h2>
            </div>
            <a
              href={SALON_CONFIG.contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors mt-4 md:mt-0"
            >
              <Instagram className="w-4 h-4" />
              <span>Follow @zenymestudio on Instagram</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {SALON_CONFIG.media.lookbook.map((item, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl border border-slate-800 aspect-square"
              >
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                  <p className="text-[10px] text-amber-400 font-bold uppercase">{item.category}</p>
                  <p className="text-xs font-bold text-white truncate">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: VERIFIED REVIEWS & SOCIAL PROOF ── */}
      <section id="reviews" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Client Love</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-1">
            Over 500+ Five-Star Reviews
          </h2>
          <p className="text-slate-400 mt-3 text-sm">
            Read what our clients say about their experience, punctuality, and stylist consultations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SALON_CONFIG.testimonials.map((testi, i) => (
            <div
              key={i}
              className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {Array.from({ length: testi.rating }).map((_, r) => (
                    <Star key={r} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 italic leading-relaxed">
                  &ldquo;{testi.review}&rdquo;
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-extrabold text-xs flex items-center justify-center border border-amber-400/40 shadow-sm">
                    {testi.initials}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{testi.name}</h4>
                    <p className="text-[11px] text-amber-400/90">{testi.serviceTaken}</p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500">{testi.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 6: LOCATION, HOURS & INTERACTIVE GOOGLE MAP ── */}
      <section id="location" className="py-20 bg-slate-900/40 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Contact Info & Hours */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 mb-3">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isOpenNow ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                    }`}
                  />
                  <span
                    className={`text-xs font-bold uppercase tracking-wider ${
                      isOpenNow ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isOpenNow ? 'Open Now For Bookings & Visits' : 'Currently Closed • Open Tomorrow 10 AM'}
                  </span>
                </div>
                <h2 className="text-3xl font-extrabold text-white">Visit Our Indiranagar Studio</h2>
                <p className="text-slate-400 text-sm mt-2">
                  Conveniently situated on 100 Feet Road with dedicated valet parking for all salon patrons.
                </p>
              </div>

              {/* Address Box */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-white">{SALON_CONFIG.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {SALON_CONFIG.address.street}, {SALON_CONFIG.address.area}, {SALON_CONFIG.address.city} - {SALON_CONFIG.address.pincode}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Valet Parking:</span>
                  <span className="text-emerald-400 font-semibold">Available complimentary</span>
                </div>
              </div>

              {/* Operating Hours Table */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-white mb-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Operating Schedule</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Tuesday – Friday:</span>
                  <span className="font-semibold text-slate-200">{SALON_CONFIG.hours.weekdays}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Saturday – Sunday:</span>
                  <span className="font-semibold text-slate-200">{SALON_CONFIG.hours.weekends}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Monday:</span>
                  <span className="font-semibold text-rose-400">{SALON_CONFIG.hours.closedOn}</span>
                </div>
              </div>

              {/* Direct Buttons */}
              <div className="flex gap-3">
                <a
                  href={`tel:${SALON_CONFIG.contact.phoneRaw}`}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
                >
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>Call Reception</span>
                </a>
                <a
                  href={`https://wa.me/${SALON_CONFIG.contact.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-900/30"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Concierge</span>
                </a>
              </div>
            </div>

            {/* Right: Embedded Google Map */}
            <div className="lg:col-span-7 h-[380px] sm:h-[450px] rounded-3xl overflow-hidden border border-slate-800 relative shadow-2xl">
              <iframe
                src={SALON_CONFIG.address.googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Salon Location Map"
              />
              <div className="absolute bottom-4 right-4 z-10">
                <a
                  href={SALON_CONFIG.address.googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-900/90 hover:bg-slate-900 text-white border border-amber-500/40 text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 backdrop-blur-md"
                >
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>Open in Google Maps</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 7: FAQS ── */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Common Questions</span>
          <h2 className="text-3xl font-extrabold text-white mt-1">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {SALON_CONFIG.faqs.map((faq, i) => (
            <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="text-amber-400 font-mono">Q.</span>
                {faq.question}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 pl-5 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CALL TO ACTION ── */}
      <section className="py-16 bg-gradient-to-b from-slate-900/80 to-slate-950 border-t border-slate-900 text-center px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
            <Scissors className="w-7 h-7" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to Elevate Your Everyday Look?
          </h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Choose your signature service, pick your favorite stylist, and lock your slot in under 60 seconds.
          </p>
          <Link
            href="/book"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-8 py-4 rounded-xl text-base transition-all shadow-xl shadow-amber-500/30"
          >
            <span>Book Your Appointment Now</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Scissors className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">{SALON_CONFIG.name}</p>
              <p className="text-[11px] text-slate-500">© 2026 All Rights Reserved.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <a href="#services" className="hover:text-white transition-colors">Services</a>
            <a href="#stylists" className="hover:text-white transition-colors">Stylists</a>
            <a href="#location" className="hover:text-white transition-colors">Location</a>
            <a href={`https://wa.me/${SALON_CONFIG.contact.whatsappNumber}`} className="hover:text-white transition-colors">WhatsApp</a>
            <Link
              href="/login"
              className="text-amber-400 hover:text-amber-300 font-semibold border-b border-amber-400/40 pb-0.5"
            >
              Salon Staff Portal &rarr;
            </Link>
          </div>
        </div>
      </footer>

      {/* ── MOBILE FLOATING STICKY BOOKING BAR ── */}
      <div className="md:hidden fixed bottom-4 inset-x-4 z-40">
        <div className="bg-slate-900/95 backdrop-blur-xl border border-amber-500/40 rounded-2xl p-2.5 shadow-2xl shadow-black/90 flex items-center justify-between">
          <div className="flex items-center gap-2 pl-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <span className="text-xs font-bold text-white block leading-tight">{SALON_CONFIG.shortName}</span>
              <span className="text-[10px] text-amber-400 font-medium">Slots available today</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/${SALON_CONFIG.contact.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30"
              aria-label="WhatsApp"
            >
              <MessageSquare className="w-4 h-4" />
            </a>
            <Link
              href="/book"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1"
            >
              <span>Book Slot</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
