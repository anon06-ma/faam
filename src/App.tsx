import { BrowserRouter as Router, Routes, Route, Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Car, Menu, X, Globe, Phone, Mail, Instagram, MessageCircle, LayoutDashboard, LogOut, Plus, Settings, Users, Fuel, Gauge, Filter, ChevronRight } from 'lucide-react';
import { LanguageProvider, useLanguage } from './LanguageContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utils
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Components
const Logo = ({ className = "w-8 h-8" }) => (
  <img 
    src="https://raw.githubusercontent.com/YounesMezzane/my-website-assets/refs/heads/main/logo%20faam.jpeg" 
    alt="FAAM SIGNATURE CAR" 
    className={cn("object-contain rounded-full", className)}
    referrerPolicy="no-referrer"
  />
);

const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Logo className="w-8 h-8" />
            <span className="text-2xl font-bold tracking-tighter text-white">FAAM <span className="text-gold">SIGNATURE CAR</span></span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium text-white/70 hover:text-white transition-colors">{t.nav.home}</Link>
            <Link to="/fleet" className="text-sm font-medium text-white/70 hover:text-white transition-colors">{t.nav.fleet}</Link>
            <Link to="/about" className="text-sm font-medium text-white/70 hover:text-white transition-colors">{t.nav.about}</Link>
            <Link to="/contact" className="text-sm font-medium text-white/70 hover:text-white transition-colors">{t.nav.contact}</Link>
            
            <Link 
              to="/admin" 
              className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-gold px-4 py-2 rounded-full border border-white/10 transition-all group"
            >
              <span className="text-xs font-bold uppercase tracking-wider">{t.nav.admin}</span>
            </Link>

            <div className="flex items-center space-x-2 border-l border-white/20 pl-8">
              <button 
                onClick={() => setLanguage('en')}
                className={cn("text-xs font-bold px-2 py-1 rounded", language === 'en' ? "bg-gold text-black" : "text-white/50")}
              >EN</button>
              <button 
                onClick={() => setLanguage('fr')}
                className={cn("text-xs font-bold px-2 py-1 rounded", language === 'fr' ? "bg-gold text-black" : "text-white/50")}
              >FR</button>
            </div>
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-zinc-900 border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              <Link to="/" onClick={() => setIsOpen(false)} className="block text-lg font-medium text-white">{t.nav.home}</Link>
              <Link to="/fleet" onClick={() => setIsOpen(false)} className="block text-lg font-medium text-white">{t.nav.fleet}</Link>
              <Link to="/about" onClick={() => setIsOpen(false)} className="block text-lg font-medium text-white">{t.nav.about}</Link>
              <Link to="/contact" onClick={() => setIsOpen(false)} className="block text-lg font-medium text-white">{t.nav.contact}</Link>
              <Link to="/admin" onClick={() => setIsOpen(false)} className="flex items-center space-x-2 text-lg font-medium text-gold">
                <span>{t.nav.admin}</span>
              </Link>
              <div className="flex space-x-4 pt-4 border-t border-white/10">
                <button onClick={() => { setLanguage('en'); setIsOpen(false); }} className={cn("text-sm font-bold", language === 'en' ? "text-gold" : "text-white/50")}>ENGLISH</button>
                <button onClick={() => { setLanguage('fr'); setIsOpen(false); }} className={cn("text-sm font-bold", language === 'fr' ? "text-gold" : "text-white/50")}>FRANÇAIS</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// Pages (Stubs for now)
const Home = () => {
  const { t } = useLanguage();
  const [featuredVehicles, setFeaturedVehicles] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/vehicles')
      .then(res => res.json())
      .then(data => setFeaturedVehicles(data.slice(0, 3)));
    
    fetch('/api/reviews')
      .then(res => res.json())
      .then(data => setReviews(data));
  }, []);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover"
            alt="Luxury Car"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
              {t.hero.title}
            </h1>
            <p className="text-xl text-white/70 mb-10">
              {t.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/fleet" className="bg-gold hover:bg-gold/90 text-black font-bold py-4 px-8 rounded-full text-center transition-all transform hover:scale-105">
                {t.hero.bookNow}
              </Link>
              <Link to="/fleet" className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-full text-center backdrop-blur-md border border-white/20 transition-all">
                {t.hero.viewFleet}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search Form */}
      <section className="relative z-20 -mt-16 max-w-6xl mx-auto px-4">
        <div className="bg-zinc-900 border border-white/10 p-8 rounded-2xl shadow-2xl">
          <form className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/50 uppercase tracking-widest">{t.search.pickupLocation}</label>
              <select className="w-full bg-black border border-white/10 text-white p-3 rounded-lg focus:outline-none focus:border-gold">
                <option>Casablanca Airport (CMN)</option>
                <option>Marrakech Airport (RAK)</option>
                <option>Agadir Airport (AGA)</option>
                <option>Tangier Airport (TNG)</option>
                <option>Rabat City Center</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/50 uppercase tracking-widest">{t.search.pickupDate}</label>
              <input type="date" className="w-full bg-black border border-white/10 text-white p-3 rounded-lg focus:outline-none focus:border-gold" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/50 uppercase tracking-widest">{t.search.returnDate}</label>
              <input type="date" className="w-full bg-black border border-white/10 text-white p-3 rounded-lg focus:outline-none focus:border-gold" />
            </div>
            <div className="flex items-end">
              <button className="w-full bg-gold text-black font-bold p-3 rounded-lg hover:bg-gold/90 transition-colors">
                {t.search.search}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{t.features.title}</h2>
            <div className="w-20 h-1 bg-gold mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: <Car className="w-10 h-10 text-gold" />, title: t.features.reliable.title, desc: t.features.reliable.desc },
              { icon: <Globe className="w-10 h-10 text-gold" />, title: t.features.prices.title, desc: t.features.prices.desc },
              { icon: <Phone className="w-10 h-10 text-gold" />, title: t.features.support.title, desc: t.features.support.desc },
            ].map((feature, i) => (
              <div key={i} className="bg-zinc-900/50 p-8 rounded-2xl border border-white/5 hover:border-gold/30 transition-all text-center group">
                <div className="mb-6 flex justify-center transform group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-white/60 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Featured Cars</h2>
              <div className="w-20 h-1 bg-gold" />
            </div>
            <Link to="/fleet" className="text-gold font-bold hover:underline">View All Vehicles →</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredVehicles.map((car, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-zinc-900 rounded-3xl overflow-hidden border border-white/10 hover:border-gold/30 transition-all group flex flex-col"
              >
                <div className="h-64 overflow-hidden relative">
                  <img 
                    src={car.images[0]} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    alt={car.name} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent opacity-60" />
                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md border border-white/10 text-gold text-xs font-bold px-4 py-1.5 rounded-full tracking-wider uppercase">
                    {car.category}
                  </div>
                </div>
                
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-white leading-tight">{car.name}</h3>
                  </div>
                  
                  <div className="mb-6">
                    <span className="text-gold font-bold text-3xl">{car.pricePerDay} MAD</span>
                    <span className="text-sm text-white/40 font-medium ml-1">/ day</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-8 text-sm text-white/70 flex-1">
                    <div className="flex items-center space-x-3 bg-black/30 p-2.5 rounded-xl border border-white/5">
                      <Settings className="w-4 h-4 text-gold" />
                      <span className="font-medium">{car.transmission}</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-black/30 p-2.5 rounded-xl border border-white/5">
                      <Users className="w-4 h-4 text-gold" />
                      <span className="font-medium">{car.seats} Seats</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-black/30 p-2.5 rounded-xl border border-white/5">
                      <Fuel className="w-4 h-4 text-gold" />
                      <span className="font-medium">{car.fuelType}</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-black/30 p-2.5 rounded-xl border border-white/5">
                      <Gauge className="w-4 h-4 text-gold" />
                      <span className="font-medium">{car.specs?.engine || 'V6 Engine'}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-auto">
                    <Link 
                      to={`/car/${car.id}`} 
                      className="flex-1 text-center bg-white/5 hover:bg-white/10 text-white font-bold py-3.5 rounded-xl border border-white/10 transition-colors"
                    >
                      Details
                    </Link>
                    <Link 
                      to={`/book/${car.id}`} 
                      className="flex-1 text-center bg-gold text-black font-bold py-3.5 rounded-xl hover:bg-gold/90 transition-colors shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">What Our Clients Say</h2>
            <div className="w-20 h-1 bg-gold mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review, i) => (
              <div key={i} className="bg-zinc-900 p-8 rounded-3xl border border-white/5 italic">
                <div className="flex text-gold mb-4">
                  {[...Array(review.rating)].map((_, i) => <span key={i}>★</span>)}
                </div>
                <p className="text-white/70 mb-6 leading-relaxed">"{review.comment}"</p>
                <p className="text-white font-bold">— {review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Feed */}
      <section className="py-24 bg-zinc-950 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-12 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Follow Us @FAAMSIGNATURECAR</h2>
            <p className="text-white/40">Join our luxury community on Instagram</p>
          </div>
          <Instagram className="text-gold w-8 h-8" />
        </div>
        <div className="flex space-x-4 animate-marquee">
          {[
            "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=400"
          ].map((img, i) => (
            <div key={i} className="flex-none w-64 h-64 rounded-2xl overflow-hidden border border-white/10">
              <img src={img} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" alt="Instagram" />
            </div>
          ))}
        </div>
      </section>

      {/* Call to action banner */}
      <section className="py-20 bg-gold">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-black mb-8 uppercase italic tracking-tighter">Reserve your car today</h2>
          <Link to="/fleet" className="inline-block bg-black text-white font-bold py-5 px-16 rounded-full hover:bg-zinc-800 transition-all transform hover:scale-105 shadow-2xl">
            {t.hero.bookNow}
          </Link>
        </div>
      </section>
    </div>
  );
};

const Fleet = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const { t } = useLanguage();

  useEffect(() => {
    fetch('/api/vehicles')
      .then(res => res.json())
      .then(data => {
        setVehicles(data);
        setLoading(false);
      });
  }, []);

  const categories = ['All', ...Array.from(new Set(vehicles.map(v => v.category)))];

  const filteredVehicles = activeCategory === 'All' 
    ? vehicles 
    : vehicles.filter(v => v.category === activeCategory);

  return (
    <div className="pt-20 bg-black min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-40"
            alt="Luxury Fleet"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight"
          >
            Our <span className="text-gold">Fleet</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/70 max-w-2xl mx-auto"
          >
            Choose from our exclusive collection of premium vehicles for your next journey.
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
            <Filter className="text-gold w-5 h-5 mr-2 flex-shrink-0" />
            {categories.map(cat => (
              <button
                key={cat as string}
                onClick={() => setActiveCategory(cat as string)}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border",
                  activeCategory === cat 
                    ? "bg-gold text-black border-gold" 
                    : "bg-transparent text-white/70 border-white/10 hover:border-gold/50 hover:text-white"
                )}
              >
                {cat as string}
              </button>
            ))}
          </div>
          <div className="text-white/50 text-sm font-medium">
            Showing {filteredVehicles.length} vehicles
          </div>
        </div>
        
        {/* Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVehicles.map((vehicle, i) => (
              <motion.div 
                key={vehicle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-zinc-900 rounded-3xl overflow-hidden border border-white/10 hover:border-gold/30 transition-all group flex flex-col"
              >
                <div className="h-64 overflow-hidden relative">
                  <img 
                    src={vehicle.images[0]} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    alt={vehicle.name} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent opacity-60" />
                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md border border-white/10 text-gold text-xs font-bold px-4 py-1.5 rounded-full tracking-wider uppercase">
                    {vehicle.category}
                  </div>
                </div>
                
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-white leading-tight">{vehicle.name}</h3>
                  </div>
                  
                  <div className="mb-6">
                    <span className="text-gold font-bold text-3xl">{vehicle.pricePerDay} MAD</span>
                    <span className="text-sm text-white/40 font-medium ml-1">/ day</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-8 text-sm text-white/70 flex-1">
                    <div className="flex items-center space-x-3 bg-black/30 p-2.5 rounded-xl border border-white/5">
                      <Settings className="w-4 h-4 text-gold" />
                      <span className="font-medium">{vehicle.transmission}</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-black/30 p-2.5 rounded-xl border border-white/5">
                      <Users className="w-4 h-4 text-gold" />
                      <span className="font-medium">{vehicle.seats} Seats</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-black/30 p-2.5 rounded-xl border border-white/5">
                      <Fuel className="w-4 h-4 text-gold" />
                      <span className="font-medium">{vehicle.fuelType}</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-black/30 p-2.5 rounded-xl border border-white/5">
                      <Gauge className="w-4 h-4 text-gold" />
                      <span className="font-medium">{vehicle.specs?.engine || 'V6 Engine'}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-auto">
                    <Link 
                      to={`/car/${vehicle.id}`} 
                      className="flex-1 text-center bg-white/5 hover:bg-white/10 text-white font-bold py-3.5 rounded-xl border border-white/10 transition-colors"
                    >
                      Details
                    </Link>
                    <Link 
                      to={`/book/${vehicle.id}`} 
                      className="flex-1 text-center bg-gold text-black font-bold py-3.5 rounded-xl hover:bg-gold/90 transition-colors shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const About = () => {
  const { t } = useLanguage();
  return (
    <div className="pt-32 pb-20 bg-black min-h-screen">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold text-white mb-12">About FAAM SIGNATURE CAR</h1>
        <div className="bg-zinc-900 p-12 rounded-3xl border border-white/10">
          <p className="text-2xl text-white/80 leading-relaxed italic font-serif">
            {t.aboutText || (t.language === 'en' 
              ? "FAAM SIGNATURE CAR provides reliable and comfortable vehicles for travelers and residents looking for the best driving experience."
              : "FAAM SIGNATURE CAR propose des véhicules fiables et confortables pour les voyageurs et les résidents à la recherche de la meilleure expérience de conduite."
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    fetch('/api/vehicles')
      .then(res => res.json())
      .then(data => {
        const found = data.find((v: any) => v.id === id);
        setCar(found);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="pt-32 text-center text-white">Loading...</div>;
  if (!car) return <div className="pt-32 text-center text-white">Car not found</div>;

  return (
    <div className="pt-32 pb-20 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Gallery */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-video rounded-3xl overflow-hidden border border-white/10"
            >
              <img src={car.images[0]} className="w-full h-full object-cover" alt={car.name} />
            </motion.div>
            <div className="grid grid-cols-3 gap-4">
              {car.images.map((img: string, i: number) => (
                <div key={i} className="aspect-video rounded-xl overflow-hidden border border-white/10 cursor-pointer hover:border-gold transition-all">
                  <img src={img} className="w-full h-full object-cover" alt={`${car.name} ${i}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Info & Booking */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="bg-gold/10 text-gold text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">{car.category}</span>
              </div>
              <h1 className="text-5xl font-bold text-white mb-4">{car.name}</h1>
              <p className="text-3xl font-bold text-gold">{car.pricePerDay} MAD<span className="text-sm text-white/50 font-normal">/day</span></p>
            </div>

            <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
              <h3 className="text-white font-bold mb-4 uppercase tracking-widest text-xs">Specifications</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-black rounded flex items-center justify-center text-gold"><Gauge size={16} /></div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase font-bold tracking-tighter">Engine</p>
                    <p className="text-sm text-white font-medium">{car.specs?.engine || 'V6 Engine'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-black rounded flex items-center justify-center text-gold"><Settings size={16} /></div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase font-bold tracking-tighter">Transmission</p>
                    <p className="text-sm text-white font-medium">{car.transmission}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-black rounded flex items-center justify-center text-gold"><Users size={16} /></div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase font-bold tracking-tighter">Seats</p>
                    <p className="text-sm text-white font-medium">{car.seats} Adults</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-black rounded flex items-center justify-center text-gold"><Fuel size={16} /></div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase font-bold tracking-tighter">Fuel</p>
                    <p className="text-sm text-white font-medium">{car.fuelType}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-bold uppercase tracking-widest text-xs">Description</h3>
              <p className="text-white/60 leading-relaxed">{car.description}</p>
            </div>

            <button 
              onClick={() => navigate(`/book/${car.id}`)}
              className="w-full bg-gold text-black font-bold py-5 rounded-2xl hover:bg-gold/90 transition-all transform hover:scale-[1.02] shadow-xl shadow-gold/10"
            >
              Reserve This Vehicle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState<any>(null);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    pickupLocation: 'Casablanca Airport (CMN)',
    pickupDate: '',
    returnDate: '',
    paymentMethod: 'delivery'
  });
  const [submitting, setSubmitting] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    fetch('/api/vehicles')
      .then(res => res.json())
      .then(data => {
        const found = data.find((v: any) => v.id === id);
        setCar(found);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    const bookingData = {
      ...formData,
      vehicleId: car.id,
      vehicleName: car.name,
      totalPrice: car.pricePerDay * 3 // Mock calculation
    };

    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });

    if (res.ok) {
      alert('Reservation successful! We will contact you shortly.');
      navigate('/');
    } else {
      alert('Something went wrong. Please try again.');
    }
    setSubmitting(false);
  };

  if (!car) return <div className="pt-32 text-center text-white">Loading...</div>;

  return (
    <div className="pt-32 pb-20 bg-black min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-white mb-8">{t.booking.title}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="bg-zinc-900 p-8 rounded-3xl border border-white/10 space-y-8">
              <div className="space-y-6">
                <h3 className="text-gold font-bold uppercase tracking-widest text-xs">{t.booking.personalInfo}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    required
                    value={formData.customerName}
                    onChange={e => setFormData({...formData, customerName: e.target.value})}
                    className="w-full bg-black border border-white/10 text-white p-3 rounded-lg focus:outline-none focus:border-gold" 
                  />
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    required
                    value={formData.customerEmail}
                    onChange={e => setFormData({...formData, customerEmail: e.target.value})}
                    className="w-full bg-black border border-white/10 text-white p-3 rounded-lg focus:outline-none focus:border-gold" 
                  />
                  <input 
                    type="tel" 
                    placeholder="Phone Number" 
                    required
                    value={formData.customerPhone}
                    onChange={e => setFormData({...formData, customerPhone: e.target.value})}
                    className="w-full bg-black border border-white/10 text-white p-3 rounded-lg focus:outline-none focus:border-gold" 
                  />
                  <select 
                    value={formData.pickupLocation}
                    onChange={e => setFormData({...formData, pickupLocation: e.target.value})}
                    className="w-full bg-black border border-white/10 text-white p-3 rounded-lg focus:outline-none focus:border-gold"
                  >
                    <option>Casablanca Airport (CMN)</option>
                    <option>Marrakech Airport (RAK)</option>
                    <option>Agadir Airport (AGA)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-gold font-bold uppercase tracking-widest text-xs">Rental Period</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] text-white/40 uppercase font-bold">Pickup Date</label>
                    <input 
                      type="date" 
                      required
                      value={formData.pickupDate}
                      onChange={e => setFormData({...formData, pickupDate: e.target.value})}
                      className="w-full bg-black border border-white/10 text-white p-3 rounded-lg focus:outline-none focus:border-gold" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-white/40 uppercase font-bold">Return Date</label>
                    <input 
                      type="date" 
                      required
                      value={formData.returnDate}
                      onChange={e => setFormData({...formData, returnDate: e.target.value})}
                      className="w-full bg-black border border-white/10 text-white p-3 rounded-lg focus:outline-none focus:border-gold" 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-gold font-bold uppercase tracking-widest text-xs">{t.booking.payment}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, paymentMethod: 'delivery'})}
                    className={cn("p-4 rounded-xl border text-sm font-bold transition-all", formData.paymentMethod === 'delivery' ? "bg-gold text-black border-gold" : "bg-black text-white border-white/10")}
                  >
                    {t.booking.payOnDelivery}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, paymentMethod: 'online'})}
                    className={cn("p-4 rounded-xl border text-sm font-bold transition-all", formData.paymentMethod === 'online' ? "bg-gold text-black border-gold" : "bg-black text-white border-white/10")}
                  >
                    {t.booking.onlinePayment}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-gold text-black font-bold py-5 rounded-2xl hover:bg-gold/90 transition-all disabled:opacity-50"
              >
                {submitting ? 'Processing...' : t.booking.confirm}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-zinc-900 p-6 rounded-3xl border border-white/10">
              <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Summary</h3>
              <div className="flex items-center space-x-4 mb-6">
                <img src={car.images[0]} className="w-20 h-20 object-cover rounded-xl" alt={car.name} />
                <div>
                  <p className="text-white font-bold">{car.name}</p>
                  <p className="text-xs text-white/40">{car.category}</p>
                </div>
              </div>
              <div className="space-y-4 pt-6 border-t border-white/5">
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Price per day</span>
                  <span className="text-white font-bold">{car.pricePerDay} MAD</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Insurance</span>
                  <span className="text-green-500 font-bold">Included</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Contact = () => {
  return (
    <div className="pt-32 pb-20 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h1 className="text-5xl font-bold text-white mb-8">Get in Touch</h1>
            <p className="text-white/60 mb-12">Have questions or need a custom quote? Our team is available 24/7 to assist you with your premium car rental needs in Morocco.</p>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4 text-white">
                <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center border border-white/10"><Phone className="text-gold" /></div>
                <div>
                  <p className="text-xs text-white/40 uppercase font-bold">Phone</p>
                  <p className="text-lg">+212 600 000 000</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-white">
                <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center border border-white/10"><Mail className="text-gold" /></div>
                <div>
                  <p className="text-xs text-white/40 uppercase font-bold">Email</p>
                  <p className="text-lg">contact@faamrentcar.com</p>
                </div>
              </div>
              <div className="pt-8">
                <a href="https://wa.me/212600000000" target="_blank" className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-full transition-all">
                  <MessageCircle />
                  <span>WhatsApp Booking</span>
                </a>
              </div>
              <div className="pt-8 h-64 rounded-3xl overflow-hidden border border-white/10 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d106376.5600074123!2d-7.66939455203125!3d33.57226779999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7cd4778aa113b%3A0xb06c1d84f310fd3!2sCasablanca%2C%20Morocco!5e0!3m2!1sen!2sus!4v1710360000000!5m2!1sen!2sus" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-zinc-900 p-8 rounded-3xl border border-white/10">
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/50 uppercase">Name</label>
                  <input type="text" className="w-full bg-black border border-white/10 text-white p-3 rounded-lg focus:outline-none focus:border-gold" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/50 uppercase">Email</label>
                  <input type="email" className="w-full bg-black border border-white/10 text-white p-3 rounded-lg focus:outline-none focus:border-gold" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/50 uppercase">Message</label>
                <textarea rows={5} className="w-full bg-black border border-white/10 text-white p-3 rounded-lg focus:outline-none focus:border-gold" />
              </div>
              <button className="w-full bg-gold text-black font-bold py-4 rounded-lg hover:bg-gold/90 transition-colors">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Admin Dashboard
const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('adminToken', data.token);
      onLogin(data.user);
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative">
      <button 
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 flex items-center space-x-2 text-white/50 hover:text-white transition-colors"
      >
        <span className="text-sm font-bold uppercase tracking-wider">← Back to Home</span>
      </button>
      <div className="max-w-md w-full bg-zinc-900 p-10 rounded-3xl border border-white/10 shadow-2xl">
        <div className="text-center mb-10">
          <Logo className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white">Login</h1>
          <p className="text-white/50 text-sm">FAAM SIGNATURE CAR</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded text-sm text-center">{error}</div>}
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/50 uppercase">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-white/10 text-white p-3 rounded-lg focus:outline-none focus:border-gold" 
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/50 uppercase">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-white/10 text-white p-3 rounded-lg focus:outline-none focus:border-gold" 
              required
            />
          </div>
          <button className="w-full bg-gold text-black font-bold py-4 rounded-lg hover:bg-gold/90 transition-colors">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('vehicles');
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const [newVehicle, setNewVehicle] = useState({
    name: '',
    category: 'Luxury',
    pricePerDay: '',
    transmission: 'Automatic',
    seats: 5,
    fuelType: 'Diesel',
    description: '',
    images: [''],
    specs: { engine: '', ac: true, gps: true }
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setUser({ email: 'admin@faam.com', role: 'Super Admin' });
      fetchData(token);
    }
  }, []);

  const fetchData = async (token: string) => {
    const headers = { 'Authorization': `Bearer ${token}` };
    try {
      const [vRes, bRes] = await Promise.all([
        fetch('/api/vehicles'),
        fetch('/api/bookings', { headers })
      ]);
      
      if (vRes.ok) {
        const data = await vRes.json();
        setVehicles(data);
      }
      if (bRes.ok) {
        const data = await bRes.json();
        setBookings(data);
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  };

  const updateBookingStatus = async (id: string, status: string) => {
    const token = localStorage.getItem('adminToken');
    const res = await fetch(`/api/bookings/${id}/status`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      fetchData(token!);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setUser(null);
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const url = editingVehicle ? `/api/vehicles/${editingVehicle.id}` : '/api/vehicles';
    const method = editingVehicle ? 'PUT' : 'POST';
    
    const res = await fetch(url, {
      method,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        ...newVehicle,
        pricePerDay: Number(newVehicle.pricePerDay),
        images: [newVehicle.images[0] || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1000']
      })
    });

    if (res.ok) {
      setIsModalOpen(false);
      setEditingVehicle(null);
      fetchData(token!);
      setNewVehicle({
        name: '',
        category: 'Luxury',
        pricePerDay: '',
        transmission: 'Automatic',
        seats: 5,
        fuelType: 'Diesel',
        description: '',
        images: [''],
        specs: { engine: '', ac: true, gps: true }
      });
    }
  };

  const openEditModal = (vehicle: any) => {
    setEditingVehicle(vehicle);
    setNewVehicle({
      ...vehicle,
      pricePerDay: vehicle.pricePerDay.toString()
    });
    setIsModalOpen(true);
  };

  const deleteVehicle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;
    const token = localStorage.getItem('adminToken');
    const res = await fetch(`/api/vehicles/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) fetchData(token!);
  };

  if (!user) return <AdminLogin onLogin={setUser} />;

  return (
    <div className="min-h-screen bg-black flex relative overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div 
        initial={false}
        animate={{ 
          x: typeof window !== 'undefined' && window.innerWidth < 1024 ? (isSidebarOpen ? 0 : -256) : 0 
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={cn(
          "fixed lg:relative w-64 h-full bg-zinc-900 border-r border-white/10 flex flex-col z-[70] transition-transform lg:translate-x-0",
          !isSidebarOpen && "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Logo className="w-8 h-8" />
            <span className="text-xl font-bold text-white">FAAM SIGNATURE CAR <span className="text-gold text-xs">ADMIN</span></span>
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-white/50 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 py-6">
          <button 
            onClick={() => { setActiveTab('vehicles'); setIsSidebarOpen(false); }}
            className={cn("w-full flex items-center space-x-3 px-6 py-4 transition-colors", activeTab === 'vehicles' ? "bg-gold/10 text-gold border-r-2 border-gold" : "text-white/50 hover:text-white")}
          >
            <Car size={20} />
            <span className="font-medium">Vehicles</span>
          </button>
          <button 
            onClick={() => { setActiveTab('bookings'); setIsSidebarOpen(false); }}
            className={cn("w-full flex items-center space-x-3 px-6 py-4 transition-colors", activeTab === 'bookings' ? "bg-gold/10 text-gold border-r-2 border-gold" : "text-white/50 hover:text-white")}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Bookings</span>
          </button>
        </div>

        <div className="p-6 border-t border-white/10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center text-black font-bold">A</div>
            <div>
              <p className="text-sm font-bold text-white">{user.role}</p>
              <p className="text-xs text-white/40">{user.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-2 bg-white/5 hover:bg-red-500/20 text-white/70 hover:text-red-500 py-2 rounded-lg transition-all">
            <LogOut size={16} />
            <span className="text-sm font-bold">Logout</span>
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-10">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 bg-zinc-900 border border-white/10 rounded-lg text-white"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-2xl md:text-3xl font-bold text-white capitalize">{activeTab}</h2>
          </div>
          {activeTab === 'vehicles' && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-gold text-black font-bold px-4 py-1.5 rounded-full hover:bg-gold/90 transition-all flex items-center space-x-2 shadow-lg shadow-gold/20 hover:scale-105 active:scale-95 group border border-gold/50"
            >
              <Plus size={14} className="group-hover:rotate-90 transition-transform duration-300" />
              <span className="text-[10px] uppercase tracking-[0.15em] whitespace-nowrap">Add Vehicle</span>
            </button>
          )}
        </div>

        {activeTab === 'vehicles' ? (
          <div className="grid grid-cols-1 gap-4">
            {vehicles.map(v => (
              <div key={v.id} className="bg-zinc-900 border border-white/10 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <img src={v.images[0]} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg" alt={v.name} />
                  <div>
                    <h4 className="text-white font-bold">{v.name}</h4>
                    <p className="text-white/40 text-sm">{v.category} • {v.pricePerDay} MAD/day</p>
                  </div>
                </div>
                <div className="flex space-x-2 w-full sm:w-auto">
                  <button 
                    onClick={() => openEditModal(v)}
                    className="flex-1 sm:flex-none px-4 py-2 bg-white/5 text-white text-sm rounded hover:bg-white/10"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => deleteVehicle(v.id)}
                    className="flex-1 sm:flex-none px-4 py-2 bg-red-500/10 text-red-500 text-sm rounded hover:bg-red-500/20"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-black/50 text-white/50 text-xs uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Vehicle</th>
                  <th className="px-6 py-4">Dates</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {bookings.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-10 text-center text-white/30 italic">No bookings found</td></tr>
                ) : (
                  bookings.map(b => (
                    <tr key={b.id} className="text-white">
                      <td className="px-6 py-4">
                        <p className="font-bold">{b.customerName}</p>
                        <p className="text-xs text-white/40">{b.customerEmail}</p>
                      </td>
                      <td className="px-6 py-4 font-medium">{b.vehicleName}</td>
                      <td className="px-6 py-4 text-sm">
                        {b.pickupDate} to {b.returnDate}
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn("text-xs font-bold px-2 py-1 rounded-full", 
                          b.status === 'pending' ? "bg-yellow-500/10 text-yellow-500" :
                          b.status === 'accepted' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                        )}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          {b.status === 'pending' && (
                            <>
                              <button 
                                onClick={() => updateBookingStatus(b.id, 'accepted')}
                                className="text-green-500 text-xs font-bold hover:underline"
                              >
                                Accept
                              </button>
                              <button 
                                onClick={() => updateBookingStatus(b.id, 'rejected')}
                                className="text-red-500 text-xs font-bold hover:underline"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          <button className="text-gold text-sm font-bold hover:underline">Manage</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Vehicle Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 p-8 rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-white">{editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
                <button 
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingVehicle(null);
                    setNewVehicle({
                      name: '',
                      category: 'Luxury',
                      pricePerDay: '',
                      transmission: 'Automatic',
                      seats: 5,
                      fuelType: 'Diesel',
                      description: '',
                      images: [''],
                      specs: { engine: '', ac: true, gps: true }
                    });
                  }} 
                  className="text-white/50 hover:text-white"
                >
                  <X />
                </button>
              </div>

              <form onSubmit={handleAddVehicle} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/50 uppercase">Vehicle Name</label>
                    <input 
                      type="text" 
                      required
                      value={newVehicle.name}
                      onChange={e => setNewVehicle({...newVehicle, name: e.target.value})}
                      className="w-full bg-black border border-white/10 p-3 rounded-lg text-white" 
                      placeholder="e.g. Range Rover Vogue"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/50 uppercase">Category</label>
                    <select 
                      value={newVehicle.category}
                      onChange={e => setNewVehicle({...newVehicle, category: e.target.value})}
                      className="w-full bg-black border border-white/10 p-3 rounded-lg text-white"
                    >
                      <option>Luxury</option>
                      <option>SUV</option>
                      <option>Economy</option>
                      <option>Convertible</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/50 uppercase">Price per Day (MAD)</label>
                    <input 
                      type="number" 
                      required
                      value={newVehicle.pricePerDay}
                      onChange={e => setNewVehicle({...newVehicle, pricePerDay: e.target.value})}
                      className="w-full bg-black border border-white/10 p-3 rounded-lg text-white" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/50 uppercase">Transmission</label>
                    <select 
                      value={newVehicle.transmission}
                      onChange={e => setNewVehicle({...newVehicle, transmission: e.target.value})}
                      className="w-full bg-black border border-white/10 p-3 rounded-lg text-white"
                    >
                      <option>Automatic</option>
                      <option>Manual</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/50 uppercase">Number of Seats</label>
                    <input 
                      type="number" 
                      required
                      value={newVehicle.seats}
                      onChange={e => setNewVehicle({...newVehicle, seats: Number(e.target.value)})}
                      className="w-full bg-black border border-white/10 p-3 rounded-lg text-white" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/50 uppercase">Fuel Type</label>
                    <select 
                      value={newVehicle.fuelType}
                      onChange={e => setNewVehicle({...newVehicle, fuelType: e.target.value})}
                      className="w-full bg-black border border-white/10 p-3 rounded-lg text-white"
                    >
                      <option>Diesel</option>
                      <option>Essence</option>
                      <option>Electric</option>
                      <option>Hybrid</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/50 uppercase">Vehicle Image</label>
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-4">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setNewVehicle({...newVehicle, images: [reader.result as string]});
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden" 
                        id="vehicle-image-upload"
                      />
                      <label 
                        htmlFor="vehicle-image-upload"
                        className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg text-sm text-white transition-colors"
                      >
                        Choose File
                      </label>
                    </div>
                    {newVehicle.images[0] && (
                      <div className="relative w-full h-40 rounded-xl overflow-hidden border border-white/10">
                        <img src={newVehicle.images[0]} className="w-full h-full object-cover" alt="Preview" />
                        <button 
                          type="button"
                          onClick={() => setNewVehicle({...newVehicle, images: ['']})}
                          className="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white hover:bg-red-500 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/50 uppercase">Description</label>
                  <textarea 
                    rows={3}
                    value={newVehicle.description}
                    onChange={e => setNewVehicle({...newVehicle, description: e.target.value})}
                    className="w-full bg-black border border-white/10 p-3 rounded-lg text-white" 
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-gold text-black font-bold py-4 rounded-xl hover:bg-gold/90 transition-all shadow-lg shadow-gold/20 hover:scale-[1.02] active:scale-[0.98] text-sm uppercase tracking-widest"
                >
                  {editingVehicle ? 'Update Vehicle' : 'Save Vehicle'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-zinc-950 border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <Logo className="w-10 h-10" />
              <span className="text-2xl font-bold tracking-tighter text-white">FAAM <span className="text-gold">SIGNATURE CAR</span></span>
            </Link>
            <p className="text-white/50 max-w-sm mb-6">{t.footer.tagline}</p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-white/50 hover:text-gold transition-colors border border-white/5"><Instagram size={20} /></a>
              <a href="#" className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-white/50 hover:text-gold transition-colors border border-white/5"><Mail size={20} /></a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Quick Links</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li><Link to="/" className="hover:text-gold transition-colors">{t.nav.home}</Link></li>
              <li><Link to="/fleet" className="hover:text-gold transition-colors">{t.nav.fleet}</Link></li>
              <li><Link to="/about" className="hover:text-gold transition-colors">{t.nav.about}</Link></li>
              <li><Link to="/contact" className="hover:text-gold transition-colors">{t.nav.contact}</Link></li>
              <li><Link to="/admin" className="hover:text-gold transition-colors font-bold text-gold/80">{t.nav.admin}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Contact Us</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li className="flex items-center space-x-2"><Phone size={14} className="text-gold" /> <span>+212 600 000 000</span></li>
              <li className="flex items-center space-x-2"><Mail size={14} className="text-gold" /> <span>contact@faamrentcar.com</span></li>
              <li className="flex items-center space-x-2"><Globe size={14} className="text-gold" /> <span>Casablanca, Morocco</span></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-white/5 text-center text-xs text-white/30">
          <p>© {new Date().getFullYear()} FAAM SIGNATURE CAR. {t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="bg-black text-white selection:bg-gold selection:text-black">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/fleet" element={<Fleet />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/car/:id" element={<CarDetails />} />
            <Route path="/book/:id" element={<BookingPage />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </LanguageProvider>
  );
}
