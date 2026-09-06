import React, { useState } from 'react';
import { 
  Sparkles, ArrowRight, Play, Star, CheckCircle, 
  Instagram, Heart, Shield, Award, Scissors, Truck 
} from 'lucide-react';
import { Product, CurrencyCode, ProductSize, Collection, Category } from '../../types';
import { ProductCard } from '../storefront/ProductCard';
import { formatPrice } from '../../lib/currency';

interface HomeSectionsProps {
  products: Product[];
  categories: Category[];
  collections: Collection[];
  currency: CurrencyCode;
  onSelectProduct: (slug: string) => void;
  onQuickView: (product: Product) => void;
  onQuickAddToCart: (product: Product, size: ProductSize) => void;
  isWishlisted: (id: string) => boolean;
  onToggleWishlist: (id: string) => void;
  onNavigate: (view: string, param?: string) => void;
}

export const HomeSections: React.FC<HomeSectionsProps> = ({
  products,
  categories,
  collections,
  currency,
  onSelectProduct,
  onQuickView,
  onQuickAddToCart,
  isWishlisted,
  onToggleWishlist,
  onNavigate
}) => {
  const [productTab, setProductTab] = useState<'all' | 'lawn' | 'pret' | 'festive'>('all');
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Tab filtering
  const displayProducts = products.filter(p => {
    if (productTab === 'lawn') return p.category.includes('Lawn');
    if (productTab === 'pret') return p.category.includes('Pret') || p.category.includes('Ready');
    if (productTab === 'festive') return p.category.includes('Festive') || p.category.includes('Chiffon');
    return true;
  }).slice(0, 8);

  const testimonials = [
    {
      name: 'Ayesha Malik',
      city: 'Defence, Lahore',
      comment: 'The Nur Jahan lawn fabric is breathtakingly soft. The organza embroidery borders stitched like an absolute dream for Eid!',
      rating: 5,
      date: '3 days ago'
    },
    {
      name: 'Zainab Qureshi',
      city: 'Clifton, Karachi',
      comment: 'Ordered the emerald raw silk pret for a family dinner. The cut, finishing, and pearl detailing are comparable to high-end designer ateliers.',
      rating: 5,
      date: '1 week ago'
    },
    {
      name: 'Mahnoor Khan',
      city: 'F-7, Islamabad',
      comment: 'Received my parcel in 48 hours via TCS. Cash on Delivery was seamless. Will definitely be a lifelong GulPash customer.',
      rating: 5,
      date: '2 weeks ago'
    }
  ];

  return (
    <div className="space-y-20 sm:space-y-28 font-sans pb-20">
      
      {/* 1. CURATED CATEGORIES ROW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16">
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-[10px] uppercase tracking-[0.3em] text-stone-500 font-medium block">
            TIMELESS SILHOUETTES
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-light italic text-[#1A1A1A] mt-1">
            Explore Curated Collections
          </h2>
          <div className="w-10 h-px bg-stone-300 mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-6">
          {categories.filter(c => c.isVisible).map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate('category', cat.slug)}
              className="group cursor-pointer flex flex-col items-center text-center space-y-3"
            >
              <div className="relative w-full aspect-[4/5] overflow-hidden border border-stone-200 group-hover:border-stone-500 transition-all duration-300">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                <span className="absolute bottom-3 inset-x-2 text-white text-[11px] font-medium uppercase tracking-widest line-clamp-1">
                  {cat.name}
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-stone-500 group-hover:text-black transition-colors flex items-center gap-1 border-b border-transparent group-hover:border-stone-400 pb-0.5">
                <span>View Collection</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 2. SIGNATURE BEST-SELLING PRODUCTS GRID WITH TABS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 border-b border-stone-200 pb-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-stone-500 font-medium block">
              ROYAL ATELIER
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-light italic text-[#1A1A1A] mt-0.5">
              Featured Ensembles
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={() => setProductTab('all')}
              className={`text-[10px] uppercase tracking-[0.2em] font-medium px-4 py-1.5 transition-colors cursor-pointer ${
                productTab === 'all' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-black bg-white border border-stone-200'
              }`}
            >
              All Drops
            </button>
            <button
              onClick={() => setProductTab('lawn')}
              className={`text-[10px] uppercase tracking-[0.2em] font-medium px-4 py-1.5 transition-colors cursor-pointer ${
                productTab === 'lawn' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-black bg-white border border-stone-200'
              }`}
            >
              Luxury Lawn
            </button>
            <button
              onClick={() => setProductTab('pret')}
              className={`text-[10px] uppercase tracking-[0.2em] font-medium px-4 py-1.5 transition-colors cursor-pointer ${
                productTab === 'pret' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-black bg-white border border-stone-200'
              }`}
            >
              Raw Silk Pret
            </button>
            <button
              onClick={() => setProductTab('festive')}
              className={`text-[10px] uppercase tracking-[0.2em] font-medium px-4 py-1.5 transition-colors cursor-pointer ${
                productTab === 'festive' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-black bg-white border border-stone-200'
              }`}
            >
              Festive Formals
            </button>
          </div>
        </div>

        {/* 4-column responsive grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {displayProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              currency={currency}
              onSelect={onSelectProduct}
              onQuickView={onQuickView}
              onQuickAddToCart={onQuickAddToCart}
              isWishlisted={isWishlisted(product.id)}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => onNavigate('shop')}
            className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white text-[11px] font-medium uppercase tracking-[0.25em] py-3.5 px-8 transition-colors duration-300 cursor-pointer"
          >
            <span>Explore All Pakistani Designs</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 3. EDITORIAL FASHION VIDEO / LOOKBOOK HERO BANNER */}
      <section className="relative w-full h-[60vh] sm:h-[70vh] bg-stone-900 overflow-hidden flex items-center justify-center text-center text-white">
        <img
          src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1800&q=80"
          alt="GulPash Atelier Campaign"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-35"
        />
        <div className="absolute inset-0 bg-stone-950/40 backdrop-blur-[1px]" />

        <div className="relative z-10 max-w-2xl mx-auto px-4 space-y-5">
          <button
            onClick={() => setShowVideoModal(true)}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/90 hover:bg-white text-stone-900 flex items-center justify-center mx-auto shadow-2xl transition-transform transform hover:scale-105 cursor-pointer"
            aria-label="Play Lookbook Video"
          >
            <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-current ml-1" />
          </button>

          <span className="text-[10px] uppercase tracking-[0.35em] text-stone-300 font-medium block">
            AUTUMN / SPRING CAMPAIGN
          </span>

          <h2 className="font-serif text-3xl sm:text-5xl font-light italic tracking-wide leading-tight text-white">
            The Sovereign Craft of Pakistani Embroidery
          </h2>

          <p className="text-xs sm:text-sm text-stone-200 max-w-lg mx-auto font-light leading-relaxed">
            Witness the intricate zardozi, hand-tilla motifs, and fine pure threadwork brought to life in our Lahore ateliers.
          </p>
        </div>

        {/* Video Player Modal */}
        {showVideoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85">
            <div className="relative w-full max-w-3xl bg-black overflow-hidden border border-stone-700">
              <button
                onClick={() => setShowVideoModal(false)}
                className="absolute top-3 right-3 text-white bg-black/60 p-1.5 rounded-full z-10 hover:bg-white hover:text-black cursor-pointer"
              >
                &times;
              </button>
              <video
                src="https://assets.mixkit.co/videos/preview/mixkit-girl-in-fashion-dress-posing-41793-large.mp4"
                controls
                autoPlay
                className="w-full aspect-video"
              />
            </div>
          </div>
        )}
      </section>

      {/* 4. THE GULPASH ATELIER PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-stone-200 p-8 sm:p-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 text-center">
            
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-800 flex items-center justify-center mx-auto">
                <Scissors className="w-5 h-5 stroke-[1.5]" />
              </div>
              <h3 className="font-serif text-xl font-light italic text-[#1A1A1A]">Artisanal Needlework</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Hand-cut organza scallops, pearl tassels, and zari tilla embroidery inspired by Lahore&apos;s historic courts.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-800 flex items-center justify-center mx-auto">
                <Award className="w-5 h-5 stroke-[1.5]" />
              </div>
              <h3 className="font-serif text-xl font-light italic text-[#1A1A1A]">100% Pure Luxury Fibers</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                We strictly weave with long-staple Egyptian cotton lawn, pure Katan raw silks, and feather-light chiffon.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-800 flex items-center justify-center mx-auto">
                <Truck className="w-5 h-5 stroke-[1.5]" />
              </div>
              <h3 className="font-serif text-xl font-light italic text-[#1A1A1A]">2-4 Days Express Dispatch</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Nationwide door-to-door delivery with TCS Express. Open-box inspection and 7-day hassle-free exchange.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. VERIFIED CLIENT TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-[10px] uppercase tracking-[0.3em] text-stone-500 font-medium block">
            PRAISE & AFFIRMATIONS
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-light italic text-[#1A1A1A] mt-1">
            Loved by Women Across Pakistan
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-white p-6 border border-stone-200 hover:border-stone-400 transition-colors space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex text-stone-800 mb-2">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current text-stone-800" />
                  ))}
                </div>
                <p className="text-xs text-stone-700 leading-relaxed font-serif italic">
                  &ldquo;{t.comment}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <div>
                  <strong className="text-[#1A1A1A] block font-medium">{t.name}</strong>
                  <span className="text-[10px] text-stone-400 uppercase tracking-widest">{t.city}</span>
                </div>
                <span className="text-[10px] bg-stone-100 text-stone-700 border border-stone-200 px-2 py-0.5 flex items-center gap-1 font-medium uppercase tracking-wider">
                  <CheckCircle className="w-3 h-3 text-stone-700" /> Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. INSTAGRAM SOCIAL GALLERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-stone-700 font-medium mb-1">
            <Instagram className="w-3.5 h-3.5 text-stone-600" />
            <span>@GulPash.Official</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-light italic text-[#1A1A1A]">
            Follow The Atelier On Instagram
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          {[
            'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80'
          ].map((img, i) => (
            <a
              key={i}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden border border-stone-200 block"
            >
              <img
                src={img}
                alt="Instagram Look"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Instagram className="w-5 h-5" />
              </div>
            </a>
          ))}
        </div>
      </section>

    </div>
  );
};
