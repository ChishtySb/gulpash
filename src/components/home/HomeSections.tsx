import React, { useState, useMemo } from 'react';
import { 
  Sparkles, ArrowRight, Star, CheckCircle, 
  Instagram, Heart, Shield, Award, Scissors, Truck,
  ChevronDown, ChevronUp, HelpCircle, Mail, Send, Check
} from 'lucide-react';
import { Product, CurrencyCode, ProductSize, Collection, Category } from '../../types';
import { ProductCard } from '../storefront/ProductCard';
import { CategoryCard } from './CategoryCard';
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
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('all');
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  // Filter products by selected category (using authentic categories)
  const displayProducts = products.filter(p => {
    if (selectedCategoryTab === 'all') return true;
    return p.category === selectedCategoryTab;
  }).slice(0, 8);

  // Customer-facing TRENDING products (from BEST SELLING collection)
  const trendingProducts = useMemo(() => {
    const list = products.filter(p => 
      p.isBestSeller || 
      p.collectionNames?.includes('BEST SELLING') || 
      p.collection === 'BEST SELLING' ||
      p.collectionIds?.includes('4ca893b6-3d59-4256-86b9-81b25057c513')
    );
    return list.length >= 4 ? list.slice(0, 8) : products.slice(0, 8);
  }, [products]);

  // NEW ARRIVALS products (from NEW ARRIVALS collection)
  const newArrivalsProducts = useMemo(() => {
    const list = products.filter(p => 
      p.isNewArrival || 
      p.collectionNames?.includes('NEW ARRIVALS') || 
      p.collection === 'NEW ARRIVALS' ||
      p.collectionIds?.includes('4ab60e51-dddb-433c-880c-d30909bcbcb3')
    );
    return list.length >= 4 ? list.slice(0, 8) : products.slice(8, 16);
  }, [products]);

  const testimonials = [
    {
      name: 'Ayesha Malik',
      city: 'Defence, Lahore',
      comment: 'The Plum 3Piece embroidered fabric is breathtakingly soft. The stitching and finishing arrived like an absolute dream!',
      rating: 5,
      date: '3 days ago'
    },
    {
      name: 'Zainab Qureshi',
      city: 'Clifton, Karachi',
      comment: 'Ordered the Azmeen 3 Piece ensemble. The cut, finishing, and detailing are comparable to high-end designer ateliers.',
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

  const faqs = [
    {
      q: 'How long does nationwide shipping take?',
      a: 'All orders are processed within 24 to 48 hours. Delivery across Pakistan typically takes 2 to 4 working days via our premier logistics partners TCS and Leopards Courier. Tracking details are provided upon dispatch.'
    },
    {
      q: 'How can I track my order?',
      a: 'You can track your parcel in real-time by clicking "Track My Order" in the navigation bar using your Order ID or phone number. You can also message our 24/7 WhatsApp concierge.'
    },
    {
      q: 'What is your replacement and exchange policy?',
      a: 'GulPash offers a 7-day hassle-free exchange policy. If you have any concerns regarding sizing, color, or stitching, contact our support team and we will assist with an immediate swap.'
    },
    {
      q: 'Do you offer Cash on Delivery (COD)?',
      a: 'Yes, Cash on Delivery is available across all cities and towns in Pakistan with open-box verification support. We also accept direct Meezan and HBL bank transfers.'
    }
  ];

  // Authentic product photography for the editorial banner & social gallery
  const editorialBannerImage = products[0]?.images[0] || '';
  const socialGalleryProducts = products.slice(0, 6);

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
            <CategoryCard
              key={cat.id}
              category={cat}
              products={products}
              onNavigate={onNavigate}
            />
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
              onClick={() => setSelectedCategoryTab('all')}
              className={`text-[10px] uppercase tracking-[0.2em] font-medium px-4 py-1.5 transition-colors cursor-pointer ${
                selectedCategoryTab === 'all' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-black bg-white border border-stone-200'
              }`}
            >
              All Drops
            </button>
            {categories.filter(c => c.isVisible).map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryTab(cat.name)}
                className={`text-[10px] uppercase tracking-[0.2em] font-medium px-4 py-1.5 transition-colors cursor-pointer ${
                  selectedCategoryTab === cat.name ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-black bg-white border border-stone-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
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

      {/* 3. TRENDING SECTION (BEST SELLING COLLECTION) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-stone-200 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-stone-500 font-medium mb-1">
              <Sparkles className="w-3.5 h-3.5 text-stone-700" />
              <span>MOST COVETED</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-light italic text-[#1A1A1A]">
              Trending
            </h2>
            <p className="text-xs text-stone-500 mt-1 max-w-md font-light">
              Viral and top-selling embroidered 3-piece silhouettes favored across Pakistan.
            </p>
          </div>
          <button
            onClick={() => onNavigate('collection', 'best-selling')}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest font-medium text-stone-800 hover:text-black border-b border-stone-800 pb-0.5 cursor-pointer transition-colors"
          >
            <span>View All Trending</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {trendingProducts.map((product) => (
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
      </section>

      {/* 4. NEW ARRIVALS SECTION (NEW ARRIVALS COLLECTION) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-stone-200 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-stone-500 font-medium mb-1">
              <Sparkles className="w-3.5 h-3.5 text-stone-700" />
              <span>FRESH OFF THE LOOM</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-light italic text-[#1A1A1A]">
              New Arrivals
            </h2>
            <p className="text-xs text-stone-500 mt-1 max-w-md font-light">
              The latest festive unstitched drops and ready-to-wear seasonal cuts.
            </p>
          </div>
          <button
            onClick={() => onNavigate('collection', 'new-arrivals')}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest font-medium text-stone-800 hover:text-black border-b border-stone-800 pb-0.5 cursor-pointer transition-colors"
          >
            <span>View All New Arrivals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {newArrivalsProducts.map((product) => (
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
      </section>

      {/* 5. EDITORIAL ATELIER CAMPAIGN BANNER (AUTHENTIC PRODUCT ASSET) */}
      <section className="relative w-full h-[60vh] sm:h-[70vh] bg-stone-900 overflow-hidden flex items-center justify-center text-center text-white">
        {editorialBannerImage ? (
          <img
            src={editorialBannerImage}
            alt="GulPash Atelier Campaign"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-35"
          />
        ) : null}
        <div className="absolute inset-0 bg-stone-950/50 backdrop-blur-[1px]" />

        <div className="relative z-10 max-w-2xl mx-auto px-4 space-y-5">
          <span className="text-[10px] uppercase tracking-[0.35em] text-stone-300 font-medium block">
            ROYAL COUTURE CAMPAIGN
          </span>

          <h2 className="font-serif text-3xl sm:text-5xl font-light italic tracking-wide leading-tight text-white">
            The Sovereign Craft of Pakistani Embroidery
          </h2>

          <p className="text-xs sm:text-sm text-stone-200 max-w-lg mx-auto font-light leading-relaxed">
            Witness the intricate zardozi, hand-tilla motifs, and fine pure threadwork brought to life in our Lahore ateliers.
          </p>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('collection', 'best-selling')}
              className="inline-flex items-center gap-2 bg-white text-stone-900 hover:bg-stone-100 text-[11px] font-medium uppercase tracking-[0.25em] py-3.5 px-8 transition-colors duration-300 cursor-pointer shadow-lg"
            >
              <span>Explore Trending Ensembles</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
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

      {/* 6. FREQUENTLY ASKED QUESTIONS (TAWAKAL CLOSET HOMEPAGE REPLICATION) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-[10px] uppercase tracking-[0.3em] text-stone-500 font-medium block">
            CUSTOMER ASSISTANCE
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-light italic text-[#1A1A1A] mt-1">
            Frequently Asked Questions
          </h2>
          <div className="w-10 h-px bg-stone-300 mx-auto mt-3" />
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div key={idx} className="bg-white border border-stone-200 overflow-hidden">
                <button
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between text-xs sm:text-sm font-medium text-stone-900 hover:text-black cursor-pointer transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-stone-400 shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-stone-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs text-stone-600 leading-relaxed font-light border-t border-stone-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. INSTAGRAM SOCIAL GALLERY (AUTHENTIC CATALOG PRODUCT ASSETS) */}
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
          {socialGalleryProducts.map((p, i) => (
            <div
              key={p.id || i}
              onClick={() => onSelectProduct(p.slug)}
              className="group relative aspect-square overflow-hidden border border-stone-200 block cursor-pointer bg-stone-100"
            >
              <img
                src={p.images[0]}
                alt={p.title}
                loading="lazy"
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-2 text-center">
                <Instagram className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-medium uppercase tracking-wider line-clamp-1">
                  {p.title}
                </span>
                <span className="text-[9px] text-stone-300 uppercase tracking-widest mt-0.5">Shop The Look &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. NEWSLETTER VIP ATELIER SIGNUP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1A1A1A] text-white p-8 sm:p-14 border border-stone-800 text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <span className="text-[10px] uppercase tracking-[0.35em] text-stone-400 font-medium block">
              GULPASH ATELIER PRIVILEGE
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-light italic tracking-wide text-stone-100">
              Be the First to Experience New Drops
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed max-w-lg mx-auto">
              Subscribe to receive exclusive access to limited unstitched festive edits, private seasonal previews, and member-only styling announcements.
            </p>

            {newsletterSuccess ? (
              <div className="p-4 bg-stone-900 border border-emerald-600/50 text-emerald-300 text-xs flex items-center justify-center gap-2 max-w-md mx-auto">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Welcome to the GulPash Atelier Circle. Check your inbox shortly.</span>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newsletterEmail.trim()) {
                    setNewsletterSuccess(true);
                    setNewsletterEmail('');
                  }
                }}
                className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto pt-2"
              >
                <div className="relative w-full">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full bg-stone-900/90 border border-stone-700 text-white placeholder-stone-400 text-xs py-3 pl-10 pr-4 focus:outline-hidden focus:border-stone-400"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-white hover:bg-stone-200 text-stone-900 text-[11px] font-medium uppercase tracking-widest py-3 px-6 whitespace-nowrap cursor-pointer transition-colors"
                >
                  Subscribe
                </button>
              </form>
            )}

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[10px] text-stone-400 uppercase tracking-widest">
              <span>Authentic Pakistani Craft</span>
              <span className="hidden sm:inline">•</span>
              <span>No Spam Guarantee</span>
              <span className="hidden sm:inline">•</span>
              <span>Instant Dispatch</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
